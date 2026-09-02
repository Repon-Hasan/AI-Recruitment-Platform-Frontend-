
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  BriefcaseBusiness,
  Check,
  CheckCheck,
  Clock,
  UserRound,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  notificationApi,
  type Notification,
} from "@/services/notification.api";

const getNotificationIcon = (
  type: Notification["type"],
) => {
  switch (type) {
    case "NEW_CANDIDATE_APPLICATION":
    case "APPLICATION_SUBMITTED":
      return <BriefcaseBusiness className="h-4 w-4" />;

    case "APPLICATION_SHORTLISTED":
      return <Check className="h-4 w-4" />;

    case "INTERVIEW_SCHEDULED":
      return <Clock className="h-4 w-4" />;

    default:
      return <UserRound className="h-4 w-4" />;
  }
};

const getTimeAgo = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();

  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d ago`;
  }

  return new Date(date).toLocaleDateString("en-BD", {
    month: "short",
    day: "numeric",
  });
};

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);

  const [unreadCount, setUnreadCount] = useState(0);

  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      const result = await notificationApi.getAll(1, 20);

      setNotifications(result.notifications);

      setUnreadCount(result.meta.unreadCount);
    } catch (error) {
      console.error(
        "Failed to load notifications:",
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadNotifications();

    const interval = setInterval(() => {
      loadNotifications();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleMarkAsRead = async (
    notification: Notification,
  ) => {
    if (notification.status === "READ") {
      return;
    }

    try {
      await notificationApi.markAsRead(notification.id);

      setNotifications((current) =>
        current.map((item) =>
          item.id === notification.id
            ? {
                ...item,
                status: "READ",
                readAt: new Date().toISOString(),
              }
            : item,
        ),
      );

      setUnreadCount((count) =>
        Math.max(0, count - 1),
      );
    } catch (error) {
      console.error(
        "Failed to mark notification:",
        error,
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) {
      return;
    }

    try {
      await notificationApi.markAllAsRead();

      const readAt = new Date().toISOString();

      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          status: "READ",
          readAt,
        })),
      );

      setUnreadCount(0);
    } catch (error) {
      console.error(
        "Failed to mark all notifications:",
        error,
      );
    }
  };

  return (
    <DropdownMenu>
      {/* 
        IMPORTANT:
        DropdownMenuTrigger itself renders a <button>.
        Therefore DO NOT put a <Button> inside it.
      */}
      <DropdownMenuTrigger
        className="
          relative
          inline-flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-xl
          border
          border-border
          bg-background
          transition-colors
          hover:bg-accent
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-ring
        "
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />

        {/* Unread dot */}
        {unreadCount > 0 && (
          <span
            className="
              absolute
              right-2
              top-2
              h-2
              w-2
              animate-pulse
              rounded-full
              bg-destructive
              ring-2
              ring-background
            "
          />
        )}

        {/* Unread count */}
        {unreadCount > 0 && (
          <span
            className="
              absolute
              -right-2
              -top-2
              flex
              h-5
              min-w-5
              items-center
              justify-center
              rounded-full
              bg-indigo-600
              px-1
              text-[10px]
              font-bold
              text-white
              shadow-sm
            "
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>

      {/* ONE DropdownMenuContent ONLY */}
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="
          w-[380px]
          max-w-[calc(100vw-1rem)]
          overflow-hidden
          rounded-2xl
          border-slate-200
          p-0
          shadow-2xl
        "
      >
        {/* ================================
            HEADER
        ================================= */}
        <div
          className="
            flex
            items-center
            justify-between
            bg-gradient-to-br
            from-indigo-50
            via-white
            to-violet-50
            px-4
            py-4
          "
        >
          <div>
            <DropdownMenuLabel
              className="
                p-0
                text-base
                font-semibold
                text-slate-900
              "
            >
              Notifications
            </DropdownMenuLabel>

            <p className="mt-1 text-xs text-slate-500">
              Recruitment activity and updates
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                handleMarkAllAsRead();
              }}
              className="
                flex
                items-center
                gap-1.5
                rounded-lg
                px-2
                py-1.5
                text-xs
                font-semibold
                text-indigo-600
                transition
                hover:bg-indigo-100
              "
            >
              <CheckCheck className="h-3.5 w-3.5" />

              <span>Mark all read</span>
            </button>
          )}
        </div>

        <DropdownMenuSeparator className="m-0" />

        {/* ================================
            NOTIFICATION LIST
        ================================= */}
        <div className="max-h-[420px] overflow-y-auto">
          {/* Loading */}
          {loading ? (
            <div className="space-y-3 p-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex animate-pulse gap-3"
                >
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-200" />

                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-3/4 rounded bg-slate-200" />

                    <div className="h-3 w-full rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            /* Empty state */
            <div
              className="
                flex
                flex-col
                items-center
                justify-center
                px-6
                py-12
                text-center
              "
            >
              <div
                className="
                  mb-4
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-2xl
                  bg-slate-100
                "
              >
                <Bell className="h-6 w-6 text-slate-400" />
              </div>

              <h3 className="text-sm font-semibold text-slate-900">
                You&apos;re all caught up
              </h3>

              <p
                className="
                  mt-1
                  max-w-[240px]
                  text-xs
                  leading-5
                  text-slate-500
                "
              >
                New candidate applications and
                recruitment updates will appear here.
              </p>
            </div>
          ) : (
            /* Notification items */
            notifications.map((notification) => {
              const isUnread =
                notification.status !== "READ";

              const href = notification.referenceId
                ? `/recruiter/applications?application=${notification.referenceId}`
                : "/recruiter/applications";

              return (
                <DropdownMenuItem
                  key={notification.id}
                  className={`
                    p-0
                    focus:bg-slate-50
                    ${
                      isUnread
                        ? "bg-indigo-50/40"
                        : "bg-white"
                    }
                  `}
                  onSelect={() => {
                    handleMarkAsRead(notification);
                  }}
                >
                  <Link
                    href={href}
                    className="
                      flex
                      w-full
                      gap-3
                      px-4
                      py-3.5
                    "
                  >
                    {/* Icon */}
                    <div
                      className={`
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        ${
                          isUnread
                            ? "bg-indigo-100 text-indigo-600"
                            : "bg-slate-100 text-slate-500"
                        }
                      `}
                    >
                      {getNotificationIcon(
                        notification.type,
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`
                            text-sm
                            ${
                              isUnread
                                ? "font-semibold text-slate-900"
                                : "font-medium text-slate-700"
                            }
                          `}
                        >
                          {notification.title}
                        </p>

                        {isUnread && (
                          <span
                            className="
                              mt-1.5
                              h-2
                              w-2
                              shrink-0
                              rounded-full
                              bg-indigo-600
                            "
                          />
                        )}
                      </div>

                      <p
                        className="
                          mt-1
                          line-clamp-2
                          text-xs
                          leading-5
                          text-slate-600
                        "
                      >
                        {notification.message}
                      </p>

                      <p
                        className="
                          mt-1.5
                          text-[10px]
                          font-medium
                          text-slate-400
                        "
                      >
                        {getTimeAgo(
                          notification.createdAt,
                        )}
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              );
            })
          )}
        </div>

        {/* ================================
            FOOTER
        ================================= */}
        <DropdownMenuSeparator className="m-0" />

        <div className="p-2">
          <Link
            href="/recruiter/notifications"
            className="
              flex
              h-9
              items-center
              justify-center
              rounded-lg
              text-xs
              font-semibold
              text-indigo-600
              transition
              hover:bg-indigo-50
            "
          >
            View all notifications
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
