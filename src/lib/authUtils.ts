export type UserRole = "ADMIN" | "RECRUITER" | "CANDIDATE";

/**
 * Public authentication routes
 *
 * These routes do not require authentication.
 */
export const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

/**
 * Check whether the current pathname is an authentication route.
 */
export const isAuthRoute = (pathname: string) => {
  return authRoutes.some((route: string) => route === pathname);
};

/**
 * Route configuration
 *
 * exact:
 *      Matches one exact pathname.
 *
 * pattern:
 *      Matches a group of routes using RegExp.
 *
 * Example:
 *
 * /^\/recruiter\/dashboard/
 *
 * Matches:
 *
 * /recruiter/dashboard
 * /recruiter/dashboard/jobs
 * /recruiter/dashboard/applicants
 * /recruiter/dashboard/settings
 */
export type RouteConfig = {
  exact: string[];
  pattern: RegExp[];
};

/**
 * ============================================================
 * COMMON PROTECTED ROUTES
 * ============================================================
 *
 * Routes that can be accessed by any authenticated user.
 */
export const commonProtectedRoutes: RouteConfig = {
  exact: [
    "/my-profile",
    "/profile",
    "/change-password",
  ],

  pattern: [],
};

/**
 * ============================================================
 * RECRUITER PROTECTED ROUTES
 * ============================================================
 *
 * Everything under:
 *
 * /recruiter/dashboard/*
 *
 * belongs to recruiters.
 */
export const recruiterProtectedRoutes: RouteConfig = {
  exact: [],

  pattern: [
    /^\/(?:recruiter|dashboard\/recruiter)(?:\/|$)/,
  ],
};

/**
 * ============================================================
 * ADMIN PROTECTED ROUTES
 * ============================================================
 *
 * Everything under:
 *
 * /admin/dashboard/*
 *
 * belongs to administrators.
 */
export const adminProtectedRoutes: RouteConfig = {
  exact: [],

  pattern: [
    /^\/admin\/dashboard/,
  ],
};

/**
 * ============================================================
 * CANDIDATE PROTECTED ROUTES
 * ============================================================
 *
 * Everything under:
 *
 * /dashboard/*
 *
 * belongs to candidates.
 *
 * Additional candidate-specific routes can be added
 * to "exact" when necessary.
 */
export const candidateProtectedRoutes: RouteConfig = {
  exact: [
    "/payment/success",
  ],

  pattern: [
    /^\/dashboard/,
  ],
};

/**
 * ============================================================
 * CHECK ROUTE MATCH
 * ============================================================
 *
 * Returns true when pathname belongs to the supplied
 * RouteConfig.
 */
export const isRouteMatches = (
  pathname: string,
  routes: RouteConfig
) => {
  /**
   * First check exact routes.
   */
  if (routes.exact.includes(pathname)) {
    return true;
  }

  /**
   * Then check RegExp patterns.
   */
  return routes.pattern.some((pattern: RegExp) =>
    pattern.test(pathname)
  );
};

/**
 * ============================================================
 * GET ROUTE OWNER
 * ============================================================
 *
 * Determines which role owns a protected route.
 *
 * Returns:
 *
 * "ADMIN"
 * "RECRUITER"
 * "CANDIDATE"
 * "COMMON"
 * null
 *
 * null means the route is public.
 */
export const getRouteOwner = (
  pathname: string
):
  | "ADMIN"
  | "RECRUITER"
  | "CANDIDATE"
  | "COMMON"
  | null => {
  /**
   * Recruiter routes
   */
  if (isRouteMatches(pathname, recruiterProtectedRoutes)) {
    return "RECRUITER";
  }

  /**
   * Admin routes
   */
  if (isRouteMatches(pathname, adminProtectedRoutes)) {
    return "ADMIN";
  }

  /**
   * Candidate routes
   */
  if (isRouteMatches(pathname, candidateProtectedRoutes)) {
    return "CANDIDATE";
  }

  /**
   * Common authenticated routes
   */
  if (isRouteMatches(pathname, commonProtectedRoutes)) {
    return "COMMON";
  }

  /**
   * Public route
   */
  return null;
};

/**
 * ============================================================
 * DEFAULT DASHBOARD ROUTE
 * ============================================================
 *
 * After login, send the user to the correct dashboard
 * according to their role.
 */
export const getDefaultDashboardRoute = (
  role: UserRole
) => {
  if (role === "ADMIN") {
    return "/admin/dashboard";
  }

  if (role === "RECRUITER") {
    return "/recruiter/dashboard";
  }

  if (role === "CANDIDATE") {
    return "/candidate/dashboard";
  }

  return "/";
};

/**
 * ============================================================
 * VALIDATE REDIRECT FOR ROLE
 * ============================================================
 *
 * Prevents users from redirecting themselves into another
 * role's protected dashboard.
 *
 * Examples:
 *
 * RECRUITER → /recruiter/dashboard/jobs    ✅
 *
 * RECRUITER → /dashboard                   ❌
 *
 * CANDIDATE → /dashboard                   ✅
 *
 * CANDIDATE → /recruiter/dashboard         ❌
 *
 * ADMIN → /admin/dashboard                 ✅
 *
 * ADMIN → /recruiter/dashboard             ❌
 */
export const isValidRedirectForRole = (
  redirectPath: string,
  role: UserRole
) => {
  const routeOwner = getRouteOwner(redirectPath);

  /**
   * Public routes are allowed.
   */
  if (routeOwner === null) {
    return true;
  }

  /**
   * Common authenticated routes are allowed
   * for every authenticated role.
   */
  if (routeOwner === "COMMON") {
    return true;
  }

  /**
   * Only the role that owns the route can access it.
   */
  if (routeOwner === role) {
    return true;
  }

  /**
   * Another role owns this route.
   */
  return false;
};