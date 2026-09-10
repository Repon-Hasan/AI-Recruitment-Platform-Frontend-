
import { NextRequest, NextResponse } from "next/server";

import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
  UserRole,
} from "./lib/authUtils";

import { jwtUtils } from "./lib/jwtUtils";
import { isTokenExpiringSoon } from "./lib/tokenUtils";

import {
  getNewTokensWithRefreshToken,
  getUserInfo,
} from "./services/auth.services";

/**
 * Refresh access token using refresh token
 */
async function refreshTokenMiddleware(
  refreshToken: string
): Promise<boolean> {
  try {
    const refreshed = await getNewTokensWithRefreshToken(refreshToken);

    return !!refreshed;
  } catch (error) {
    console.error("Error refreshing token in middleware:", error);
    return false;
  }
}

export async function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    const pathWithQuery = `${pathname}${request.nextUrl.search}`;

    // ============================================================
    // Read current cookies
    // ============================================================

    let accessToken = request.cookies.get("accessToken")?.value;
    let refreshToken = request.cookies.get("refreshToken")?.value;

    // ============================================================
    // Get route information
    // ============================================================

    const routerOwner = getRouteOwner(pathname);
    const isAuth = isAuthRoute(pathname);

    // ============================================================
    // Validate current access token
    // ============================================================

    let decodedAccessToken:
      | {
          role?: UserRole;
          [key: string]: unknown;
        }
      | null = null;

    let isValidAccessToken = false;

    if (accessToken) {
      const verifiedToken = jwtUtils.verifyToken(
        accessToken,
        process.env.JWT_ACCESS_SECRET as string
      );

      isValidAccessToken = verifiedToken.success;

      if (verifiedToken.success && verifiedToken.data) {
        decodedAccessToken = verifiedToken.data;
      }
    }

    // ============================================================
    // Get user role
    // ============================================================

    let userRole: UserRole | null = null;

    if (decodedAccessToken?.role) {
      userRole = decodedAccessToken.role as UserRole;
    }

    // ============================================================
    // Proactively refresh token
    //
    // Refresh when:
    // - access token is valid
    // - refresh token exists
    // - access token is close to expiration
    // ============================================================

    if (
      isValidAccessToken &&
      accessToken &&
      refreshToken &&
      (await isTokenExpiringSoon(accessToken))
    ) {
      const refreshed = await refreshTokenMiddleware(refreshToken);

      if (refreshed) {
        /**
         * The refresh function updates the server cookies.
         *
         * Read the cookies again so the rest of this middleware
         * does not continue using the old token information.
         */
        const cookieStore = request.cookies;

        accessToken = cookieStore.get("accessToken")?.value ?? accessToken;

        refreshToken =
          cookieStore.get("refreshToken")?.value ?? refreshToken;

        /**
         * Re-verify the current token after refresh.
         *
         * If setTokenInCookies() updates the response cookie but
         * request.cookies still contains the old value, we keep the
         * previous valid token state for this request.
         *
         * The refreshed cookies will be available on the next request.
         */
        if (accessToken) {
          const refreshedVerification = jwtUtils.verifyToken(
            accessToken,
            process.env.JWT_ACCESS_SECRET as string
          );

          if (refreshedVerification.success) {
            isValidAccessToken = true;

            if (refreshedVerification.data) {
              decodedAccessToken = refreshedVerification.data;

              if (refreshedVerification.data.role) {
                userRole =
                  refreshedVerification.data.role as UserRole;
              }
            }
          }
        }
      }
    }

    // ============================================================
    // Rule 1
    //
    // Logged-in users should not access auth pages,
    // except mandatory account-state pages.
    // ============================================================

    if (
      isAuth &&
      isValidAccessToken &&
      pathname !== "/verify-email" &&
      pathname !== "/reset-password"
    ) {
      if (userRole) {
        return NextResponse.redirect(
          new URL(
            getDefaultDashboardRoute(userRole),
            request.url
          )
        );
      }
    }

    // ============================================================
    // Rule 2
    //
    // Reset password page
    // ============================================================

    if (pathname === "/reset-password") {
      const email = request.nextUrl.searchParams.get("email");

      // ----------------------------------------------------------
      // Case 1:
      // Logged-in user needs password change
      // ----------------------------------------------------------

      if (accessToken && email && isValidAccessToken) {
        const userInfo = await getUserInfo();

        if (userInfo?.needPasswordChange) {
          return NextResponse.next();
        }

        if (userRole) {
          return NextResponse.redirect(
            new URL(
              getDefaultDashboardRoute(userRole),
              request.url
            )
          );
        }

        return NextResponse.next();
      }

      // ----------------------------------------------------------
      // Case 2:
      // User is coming from forgot password
      // ----------------------------------------------------------

      if (email) {
        return NextResponse.next();
      }

      const loginUrl = new URL("/login", request.url);

      loginUrl.searchParams.set("redirect", pathWithQuery);

      return NextResponse.redirect(loginUrl);
    }

    // ============================================================
    // Rule 3
    //
    // Public route -> allow
    // ============================================================

    if (routerOwner === null) {
      return NextResponse.next();
    }

    // ============================================================
    // Rule 4
    //
    // User is NOT logged in but trying to access protected route
    // ============================================================

    if (!accessToken || !isValidAccessToken) {
      const loginUrl = new URL("/login", request.url);

      loginUrl.searchParams.set("redirect", pathWithQuery);

      return NextResponse.redirect(loginUrl);
    }

    // ============================================================
    // Rule 5
    //
    // Enforce email verification / password change
    // ============================================================

    const userInfo = await getUserInfo();

    if (userInfo) {
      // ----------------------------------------------------------
      // Email verification
      // ----------------------------------------------------------

      if (userInfo.emailVerified === false) {
        if (pathname !== "/verify-email") {
          const verifyEmailUrl = new URL(
            "/verify-email",
            request.url
          );

          verifyEmailUrl.searchParams.set(
            "email",
            userInfo.email
          );

          return NextResponse.redirect(verifyEmailUrl);
        }

        return NextResponse.next();
      }

      // ----------------------------------------------------------
      // Already verified user should not stay on verify-email
      // ----------------------------------------------------------

      if (
        userInfo.emailVerified &&
        pathname === "/verify-email"
      ) {
        if (userRole) {
          return NextResponse.redirect(
            new URL(
              getDefaultDashboardRoute(userRole),
              request.url
            )
          );
        }

        return NextResponse.next();
      }

      // ----------------------------------------------------------
      // Password change
      // ----------------------------------------------------------

      if (userInfo.needPasswordChange) {
        if (pathname !== "/reset-password") {
          const resetPasswordUrl = new URL(
            "/reset-password",
            request.url
          );

          resetPasswordUrl.searchParams.set(
            "email",
            userInfo.email
          );

          return NextResponse.redirect(resetPasswordUrl);
        }

        return NextResponse.next();
      }

      // ----------------------------------------------------------
      // User does not need password change but is on reset page
      // ----------------------------------------------------------

      if (
        !userInfo.needPasswordChange &&
        pathname === "/reset-password"
      ) {
        if (userRole) {
          return NextResponse.redirect(
            new URL(
              getDefaultDashboardRoute(userRole),
              request.url
            )
          );
        }

        return NextResponse.next();
      }
    }

    // ============================================================
    // Rule 6
    //
    // Common protected routes -> allow
    // ============================================================

    if (routerOwner === "COMMON") {
      return NextResponse.next();
    }

    // ============================================================
    // Rule 7
    //
    // AI Recruitment Platform role-based routes
    //
    // ADMIN
    // RECRUITER
    // CANDIDATE
    // ============================================================

    if (
      routerOwner === "ADMIN" ||
      routerOwner === "RECRUITER" ||
      routerOwner === "CANDIDATE"
    ) {
      /**
       * If for some reason the token does not contain a role,
       * do not allow access to a role-specific route.
       */
      if (!userRole) {
        const loginUrl = new URL("/login", request.url);

        loginUrl.searchParams.set("redirect", pathWithQuery);

        return NextResponse.redirect(loginUrl);
      }

      // ----------------------------------------------------------
      // Wrong role
      // ----------------------------------------------------------

      if (routerOwner !== userRole) {
        return NextResponse.redirect(
          new URL(
            getDefaultDashboardRoute(userRole),
            request.url
          )
        );
      }
    }

    // ============================================================
    // Everything is allowed
    // ============================================================

    return NextResponse.next();
  } catch (error) {
    console.error("Error in proxy middleware:", error);

    // ============================================================
    // Fail safely by redirecting to login
    // ============================================================

    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }
}

export const config = {
  matcher: [
    /**
     * Match all request paths except:
     *
     * - api
     * - _next/static
     * - _next/image
     * - favicon.ico
     * - sitemap.xml
     * - robots.txt
     * - .well-known
     */

    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).* )",
  ],
};





