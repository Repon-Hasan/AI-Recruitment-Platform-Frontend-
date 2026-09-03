"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  motion,
  AnimatePresence,
} from "motion/react";

import {
  FaArrowLeft,
  FaArrowRight,
  FaBriefcase,
  FaCheck,
  FaChevronRight,
  FaClock,
  FaEnvelope,
  FaMagnifyingGlass,
  FaMessage,
  FaRotate,
  FaUsers,
  FaXmark,
} from "react-icons/fa6";

import {
  recruiterMessageApi,
  type RecruiterConversation,
  type RecruiterMessage,
} from "@/lib/api/message.recruiter.api";

/* =========================================================
   Helpers
========================================================= */

function getCandidate(
  conversation: RecruiterConversation,
) {
  return (
    conversation.jobApplication
      ?.candidateProfile?.user ?? null
  );
}

function getCandidateName(
  conversation: RecruiterConversation,
) {
  const candidate = getCandidate(conversation);

  return (
    candidate?.name ||
    candidate?.email ||
    "Candidate"
  );
}

function getCandidateEmail(
  conversation: RecruiterConversation,
) {
  return (
    getCandidate(conversation)?.email ||
    "No email available"
  );
}

function getCandidateImage(
  conversation: RecruiterConversation,
) {
  return (
    getCandidate(conversation)?.image ||
    null
  );
}

function getJobTitle(
  conversation: RecruiterConversation,
) {
  return (
    conversation.jobApplication?.job?.title ||
    "Job application"
  );
}

function getCompanyName(
  conversation: RecruiterConversation,
) {
  return (
    conversation.jobApplication?.job?.company?.name ||
    "Your company"
  );
}

function getApplicationId(
  conversation: RecruiterConversation,
) {
  return (
    conversation.jobApplication?.id ||
    conversation.jobApplicationId ||
    ""
  );
}

function getLastMessage(
  conversation: RecruiterConversation,
) {
  return (
    conversation.messages?.[0] ?? null
  );
}

function getInitials(
  name?: string | null,
) {
  if (!name) {
    return "C";
  }

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(
      (part) =>
        part.charAt(0).toUpperCase(),
    )
    .join("");

  return initials || "C";
}

function formatMessageTime(
  date?: string | null,
) {
  if (!date) {
    return "";
  }

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  return value.toLocaleTimeString(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
    },
  );
}

function formatMessageDate(
  date?: string | null,
) {
  if (!date) {
    return "";
  }

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  const now = new Date();

  const sameDay =
    value.getDate() === now.getDate() &&
    value.getMonth() === now.getMonth() &&
    value.getFullYear() ===
      now.getFullYear();

  if (sameDay) {
    return formatMessageTime(date);
  }

  return value.toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
    },
  );
}

/* =========================================================
   Skeleton
========================================================= */

function ConversationSkeleton() {
  return (
    <div className="space-y-2 p-3">
      {Array.from({
        length: 7,
      }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 rounded-2xl p-3"
        >
          <div className="h-12 w-12 shrink-0 animate-pulse rounded-2xl bg-gray-200 dark:bg-white/10" />

          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-3 w-28 animate-pulse rounded bg-gray-200 dark:bg-white/10" />

            <div className="h-3 w-40 animate-pulse rounded bg-gray-100 dark:bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* =========================================================
   Conversation Item
========================================================= */

function ConversationItem({
  conversation,
  active,
  onClick,
}: {
  conversation: RecruiterConversation;
  active: boolean;
  onClick: () => void;
}) {
  const name =
    getCandidateName(conversation);

  const image =
    getCandidateImage(conversation);

  const lastMessage =
    getLastMessage(conversation);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{
        opacity: 0,
        x: -10,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      whileHover={{
        x: 3,
      }}
      whileTap={{
        scale: 0.99,
      }}
      className={`group relative flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-300 ${
        active
          ? "border-blue-200 bg-blue-50 shadow-sm dark:border-blue-500/20 dark:bg-blue-500/10"
          : "border-transparent hover:border-gray-200 hover:bg-gray-50 dark:hover:border-white/10 dark:hover:bg-white/[0.03]"
      }`}
    >
      {active && (
        <motion.div
          layoutId="activeConversation"
          className="absolute bottom-3 left-0 top-3 w-1 rounded-r-full bg-blue-600 dark:bg-blue-400"
        />
      )}

      <div className="relative shrink-0">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-12 w-12 rounded-2xl object-cover ring-2 ring-white dark:ring-[#111318]"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
            {getInitials(name)}
          </div>
        )}

        <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-emerald-500 dark:border-[#111318]">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3
            className={`truncate text-sm font-semibold ${
              active
                ? "text-blue-900 dark:text-blue-200"
                : "text-gray-900 dark:text-white"
            }`}
          >
            {name}
          </h3>

          {lastMessage?.createdAt && (
            <span className="shrink-0 text-[10px] text-gray-400">
              {formatMessageDate(
                lastMessage.createdAt,
              )}
            </span>
          )}
        </div>

        <p className="mt-0.5 truncate text-xs font-medium text-gray-500 dark:text-gray-400">
          {getJobTitle(conversation)}
        </p>

        <p className="mt-1 truncate text-xs text-gray-400 dark:text-gray-500">
          {lastMessage?.content ||
            "No messages yet"}
        </p>
      </div>

      <FaChevronRight
        className={`shrink-0 text-[10px] transition-all ${
          active
            ? "text-blue-500"
            : "translate-x-[-4px] text-gray-300 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 dark:text-gray-600"
        }`}
      />
    </motion.button>
  );
}

/* =========================================================
   Message Bubble
========================================================= */

function MessageBubble({
  message,
  candidateName,
  candidateImage,
  isCandidate,
  index,
}: {
  message: RecruiterMessage;
  candidateName: string;
  candidateImage: string | null;
  isCandidate: boolean;
  index: number;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12,
        scale: 0.98,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.3,
        delay: Math.min(
          index * 0.025,
          0.2,
        ),
      }}
      className={`flex ${
        isCandidate
          ? "justify-start"
          : "justify-end"
      }`}
    >
      <div
        className={`flex max-w-[88%] items-end gap-2 sm:max-w-[72%] ${
          isCandidate
            ? "flex-row"
            : "flex-row-reverse"
        }`}
      >
        <div className="hidden h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-[10px] font-bold text-white sm:flex">
          {isCandidate &&
          candidateImage ? (
            <img
              src={candidateImage}
              alt={candidateName}
              className="h-full w-full object-cover"
            />
          ) : isCandidate ? (
            getInitials(candidateName)
          ) : (
            "R"
          )}
        </div>

        <div>
          <div
            className={`rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
              isCandidate
                ? "rounded-bl-md border border-gray-200 bg-white text-gray-700 dark:border-white/10 dark:bg-[#15171c] dark:text-gray-200"
                : "rounded-br-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/10"
            }`}
          >
            {message.content ||
              "Empty message"}
          </div>

          <div
            className={`mt-1 flex items-center gap-1.5 text-[10px] text-gray-400 ${
              isCandidate
                ? "justify-start"
                : "justify-end"
            }`}
          >
            <FaClock />

            {formatMessageTime(
              message.createdAt,
            )}

            {message.readAt &&
              !isCandidate && (
                <>
                  <span>•</span>

                  <FaCheck className="text-blue-500" />

                  <span>Read</span>
                </>
              )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================
   Conversation Preview
========================================================= */

function ConversationPreview({
  conversation,
  messages,
  loading,
}: {
  conversation: RecruiterConversation;
  messages: RecruiterMessage[];
  loading: boolean;
}) {
  const candidateName =
    getCandidateName(conversation);

  const candidateImage =
    getCandidateImage(conversation);

  const applicationId =
    getApplicationId(conversation);

  const jobTitle =
    getJobTitle(conversation);

  const companyName =
    getCompanyName(conversation);

  const candidateId =
    conversation.jobApplication
      ?.candidateProfile?.user?.id;

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-gray-200 bg-white px-5 py-4 dark:border-white/10 dark:bg-[#111318] sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative shrink-0">
            {candidateImage ? (
              <img
                src={candidateImage}
                alt={candidateName}
                className="h-11 w-11 rounded-2xl object-cover"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
                {getInitials(
                  candidateName,
                )}
              </div>
            )}

            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 dark:border-[#111318]" />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-sm font-bold text-gray-900 dark:text-white sm:text-base">
              {candidateName}
            </h2>

            <div className="mt-1 flex min-w-0 items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <FaBriefcase className="shrink-0 text-blue-500" />

              <span className="truncate">
                {jobTitle}
              </span>

              <span>•</span>

              <span className="truncate">
                {companyName}
              </span>
            </div>
          </div>
        </div>

        {applicationId && (
          <Link
            href={`/recruiter/applications/${applicationId}`}
            className="group hidden shrink-0 items-center gap-2 rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-semibold text-gray-700 transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 sm:inline-flex dark:border-white/10 dark:text-gray-200 dark:hover:border-blue-500/30 dark:hover:bg-blue-500/10 dark:hover:text-blue-300"
          >
            View application

            <FaArrowRight className="text-[10px] transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>

      {/* Messages */}
      <div className="min-h-0 flex-1 overflow-y-auto bg-gray-50/80 px-4 py-6 dark:bg-[#0c0d10] sm:px-6">
        {loading ? (
          <div className="mx-auto max-w-3xl space-y-5">
            {Array.from({
              length: 6,
            }).map((_, index) => (
              <div
                key={index}
                className={`flex ${
                  index % 2 === 0
                    ? "justify-start"
                    : "justify-end"
                }`}
              >
                <div
                  className={`h-16 animate-pulse rounded-2xl ${
                    index % 2 === 0
                      ? "w-56 bg-white dark:bg-white/5"
                      : "w-64 bg-blue-100 dark:bg-blue-500/10"
                  }`}
                />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full min-h-[350px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-blue-500 shadow-sm dark:bg-white/[0.04]">
                <FaEnvelope className="text-2xl" />
              </div>

              <h3 className="mt-4 text-base font-bold text-gray-900 dark:text-white">
                No messages yet
              </h3>

              <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-gray-500 dark:text-gray-400">
                There are no messages in this
                conversation yet.
              </p>

              {applicationId && (
                <Link
                  href={`/recruiter/applications/${applicationId}`}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  Open application

                  <FaArrowRight className="text-xs" />
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-4">
            <AnimatePresence initial={false}>
              {messages.map(
                (message, index) => {
                  const isCandidate =
                    message.senderId !==
                    candidateId;

                  return (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      candidateName={
                        candidateName
                      }
                      candidateImage={
                        candidateImage
                      }
                      isCandidate={
                        isCandidate
                      }
                      index={index}
                    />
                  );
                },
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-gray-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-[#111318] sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <FaUsers />

            <span>
              Candidate communication
            </span>
          </div>

          {applicationId && (
            <Link
              href={`/recruiter/applications/${applicationId}`}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Application
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   Empty State
========================================================= */

function EmptyState() {
  return (
    <div className="flex h-full min-h-[500px] items-center justify-center p-8">
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.96,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        className="max-w-md text-center"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
          <FaMessage className="text-3xl" />
        </div>

        <h2 className="mt-6 text-xl font-bold text-gray-900 dark:text-white">
          No conversation selected
        </h2>

        <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
          Select a candidate conversation from
          the left panel to view your messages.
        </p>

        <Link
          href="/recruiter/dashboard"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-blue-600 dark:bg-white dark:text-gray-900 dark:hover:bg-blue-500 dark:hover:text-white"
        >
          <FaArrowLeft />

          Back to dashboard
        </Link>
      </motion.div>
    </div>
  );
}

/* =========================================================
   Main Page
========================================================= */

export default function RecruiterMessagesPage() {
  const [
    conversations,
    setConversations,
  ] = useState<
    RecruiterConversation[]
  >([]);

  const [
    selectedConversation,
    setSelectedConversation,
  ] =
    useState<RecruiterConversation | null>(
      null,
    );

  const [messages, setMessages] =
    useState<RecruiterMessage[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [
    messagesLoading,
    setMessagesLoading,
  ] = useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [
    messagesError,
    setMessagesError,
  ] = useState<string | null>(null);

  const [search, setSearch] =
    useState("");

  const [
    mobileConversationOpen,
    setMobileConversationOpen,
  ] = useState(false);

  /* =======================================================
     Load Conversations
  ======================================================= */

  const loadConversations =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const data =
          await recruiterMessageApi.getConversations();

        setConversations(data);

        setSelectedConversation(
          (current) => {
            if (!current) {
              return data[0] ?? null;
            }

            return (
              data.find(
                (item) =>
                  item.id === current.id,
              ) ??
              data[0] ??
              null
            );
          },
        );
      } catch (err) {
        console.error(
          "Failed to load conversations:",
          err,
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load conversations.",
        );
      } finally {
        setLoading(false);
      }
    }, []);

  /* =======================================================
     Load Messages
  ======================================================= */

  const loadMessages =
    useCallback(
      async (
        conversation: RecruiterConversation,
      ) => {
        const applicationId =
          conversation.jobApplication?.id ||
          conversation.jobApplicationId;

        if (!applicationId) {
          setMessages([]);

          setMessagesError(
            "This conversation is not connected to an application.",
          );

          return;
        }

        try {
          setMessagesLoading(true);
          setMessagesError(null);

          const data =
            await recruiterMessageApi.getMessages(
              applicationId,
            );

          setMessages(data);
        } catch (err) {
          console.error(
            "Failed to load messages:",
            err,
          );

          setMessagesError(
            err instanceof Error
              ? err.message
              : "Failed to load messages.",
          );

          setMessages([]);
        } finally {
          setMessagesLoading(false);
        }
      },
      [],
    );

  /* =======================================================
     Initial Load
  ======================================================= */

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadConversations();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadConversations]);

  /* =======================================================
     Selected Conversation Changed
  ======================================================= */

  useEffect(() => {
    if (!selectedConversation) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void loadMessages(selectedConversation);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
    selectedConversation,
    loadMessages,
  ]);

  /* =======================================================
     Search
  ======================================================= */

  const filteredConversations =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      if (!query) {
        return conversations;
      }

      return conversations.filter(
        (conversation) => {
          const candidateName =
            getCandidateName(
              conversation,
            ).toLowerCase();

          const candidateEmail =
            getCandidateEmail(
              conversation,
            ).toLowerCase();

          const jobTitle =
            getJobTitle(
              conversation,
            ).toLowerCase();

          const companyName =
            getCompanyName(
              conversation,
            ).toLowerCase();

          const lastMessage =
            getLastMessage(
              conversation,
            )?.content
              ?.toLowerCase() ?? "";

          return (
            candidateName.includes(
              query,
            ) ||
            candidateEmail.includes(
              query,
            ) ||
            jobTitle.includes(query) ||
            companyName.includes(query) ||
            lastMessage.includes(query)
          );
        },
      );
    }, [
      conversations,
      search,
    ]);

  /* =======================================================
     Error State
  ======================================================= */

  if (!loading && error) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-[#08090b]">
        <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="w-full max-w-lg rounded-3xl border border-red-200 bg-white p-8 text-center shadow-xl dark:border-red-500/20 dark:bg-[#111318]"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
              <FaXmark className="text-2xl" />
            </div>

            <h2 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
              Unable to load messages
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                void loadConversations()
              }
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 dark:bg-white dark:text-gray-900"
            >
              <FaRotate />

              Try again
            </button>
          </motion.div>
        </div>
      </main>
    );
  }

  /* =======================================================
     Main UI
  ======================================================= */

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#08090b]">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col px-4 py-5 sm:px-6 lg:px-8 lg:py-7">

        {/* =================================================
            Page Header
        ================================================= */}

        <motion.section
          initial={{
            opacity: 0,
            y: -18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111318] sm:p-7"
        >
          <motion.div
            animate={{
              x: [0, 25, 0],
              y: [0, -15, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl"
          />

          <motion.div
            animate={{
              x: [0, -20, 0],
              y: [0, 20, 0],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl"
          />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
                <FaMessage />

                Recruiter Communication
              </div>

              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Messages
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400 sm:text-base">
                Manage candidate conversations,
                review messages, and continue
                communication from one place.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03] sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    <FaUsers />
                  </div>

                  <div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {
                        conversations.length
                      }
                    </p>

                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      Conversations
                    </p>
                  </div>
                </div>
              </div>

              <motion.button
                type="button"
                whileHover={{
                  scale: 1.04,
                }}
                whileTap={{
                  scale: 0.96,
                }}
                onClick={() =>
                  void loadConversations()
                }
                disabled={loading}
                aria-label="Refresh conversations"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-50 dark:border-white/10 dark:bg-white/[0.03] dark:text-gray-300"
              >
                <FaRotate
                  className={
                    loading
                      ? "animate-spin"
                      : ""
                  }
                />
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* =================================================
            Messenger
        ================================================= */}

        <motion.section
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.15,
            duration: 0.5,
          }}
          className="relative mt-6 flex min-h-[650px] flex-1 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111318] lg:min-h-[calc(100vh-280px)]"
        >
          {/* ===============================================
              Conversations Sidebar
          =============================================== */}

          <aside
            className={`flex w-full shrink-0 flex-col border-r border-gray-200 dark:border-white/10 lg:w-[370px] ${
              mobileConversationOpen
                ? "hidden lg:flex"
                : "flex"
            }`}
          >
            <div className="shrink-0 border-b border-gray-200 p-4 dark:border-white/10 sm:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">
                    Conversations
                  </h2>

                  <p className="mt-0.5 text-xs text-gray-400">
                    {
                      conversations.length
                    }{" "}
                    total
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <FaEnvelope />
                </div>
              </div>

              {/* Search */}
              <div className="relative mt-4">
                <FaMagnifyingGlass className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value,
                    )
                  }
                  placeholder="Search conversations..."
                  className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:focus:border-blue-500/40 dark:focus:bg-white/[0.04]"
                />
              </div>
            </div>

            {/* Conversation list */}
            <div className="min-h-0 flex-1 overflow-y-auto p-3">
              {loading ? (
                <ConversationSkeleton />
              ) : filteredConversations.length ===
                0 ? (
                <div className="flex min-h-[350px] items-center justify-center p-6 text-center">
                  <div>
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-white/5 dark:text-gray-500">
                      <FaMessage />
                    </div>

                    <h3 className="mt-4 text-sm font-bold text-gray-900 dark:text-white">
                      {search
                        ? "No matches found"
                        : "No conversations"}
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-gray-400">
                      {search
                        ? "Try another candidate or job name."
                        : "Candidate conversations will appear here."}
                    </p>

                    {search && (
                      <button
                        type="button"
                        onClick={() =>
                          setSearch("")
                        }
                        className="mt-4 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <AnimatePresence initial={false}>
                    {filteredConversations.map(
                      (
                        conversation,
                      ) => (
                        <ConversationItem
                          key={
                            conversation.id
                          }
                          conversation={
                            conversation
                          }
                          active={
                            selectedConversation?.id ===
                            conversation.id
                          }
                          onClick={() => {
                            setSelectedConversation(
                              conversation,
                            );

                            setMobileConversationOpen(
                              true,
                            );
                          }}
                        />
                      ),
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </aside>

          {/* ===============================================
              Conversation Panel
          =============================================== */}

          <section
            className={`min-w-0 flex-1 ${
              mobileConversationOpen
                ? "flex"
                : "hidden lg:flex"
            }`}
          >
            {selectedConversation ? (
              <div className="relative flex min-h-0 w-full flex-col">
                {/* Mobile back */}
                <div className="flex shrink-0 items-center border-b border-gray-200 px-4 py-2 dark:border-white/10 lg:hidden">
                  <button
                    type="button"
                    onClick={() =>
                      setMobileConversationOpen(
                        false,
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
                  >
                    <FaArrowLeft />

                    All conversations
                  </button>
                </div>

                <ConversationPreview
                  conversation={
                    selectedConversation
                  }
                  messages={messages}
                  loading={
                    messagesLoading
                  }
                />

                {/* Message Error */}
                {messagesError && (
                  <div className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2">
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="flex items-center gap-3 rounded-xl border border-red-200 bg-white px-4 py-3 text-xs font-medium text-red-600 shadow-xl dark:border-red-500/20 dark:bg-[#15171c] dark:text-red-400"
                    >
                      <FaXmark />

                      <span>
                        {messagesError}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          void loadMessages(
                            selectedConversation,
                          )
                        }
                        className="font-bold underline"
                      >
                        Retry
                      </button>
                    </motion.div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden flex-1 lg:block">
                <EmptyState />
              </div>
            )}
          </section>
        </motion.section>
      </div>
    </main>
  );
}