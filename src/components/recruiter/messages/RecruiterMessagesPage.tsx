"use client";

import Link from "next/link";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type {
  KeyboardEvent,
  ReactNode,
} from "react";

import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCheck,
  ChevronRight,
  Clock3,
  ExternalLink,
  FileText,
  Globe2,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  UserRound,
  Users,
  X,
} from "lucide-react";

import { motion, type Variants } from "motion/react";

import { FaGithub, FaLinkedin } from "react-icons/fa";

import ParticleWave from "@/components/ui/particle-wave";

import {
  recruiterMessageApi,
  type RecruiterConversation,
  type RecruiterMessage,
} from "@/lib/api/message.recruiter.api";

/* =========================================================
   PROPS
========================================================= */

interface Props {
  initialApplicationId?: string;
}

/* =========================================================
   HELPERS
========================================================= */

function getCandidateProfile(
  conversation: RecruiterConversation | null,
) {
  return (
    conversation?.jobApplication?.candidateProfile ??
    null
  );
}

function getCandidateName(
  conversation: RecruiterConversation | null,
): string {
  const profile = getCandidateProfile(conversation);

  if (!profile) {
    return "Candidate";
  }

  const fullName =
    profile.name ??
    [profile.firstName, profile.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

  if (fullName) {
    return fullName;
  }

  const participant = conversation?.participants?.find(
    (item) =>
      item.user?.name ||
      item.user?.email,
  );

  return (
    participant?.user?.name ??
    participant?.user?.email ??
    "Candidate"
  );
}

function getCandidateEmail(
  conversation: RecruiterConversation | null,
): string {
  const profile = getCandidateProfile(conversation);

  if (profile?.email) {
    return profile.email;
  }

  const participant = conversation?.participants?.find(
    (item) => item.user?.email,
  );

  return participant?.user?.email ?? "";
}

function getCandidateImage(
  conversation: RecruiterConversation | null,
): string | null {
  const profile = getCandidateProfile(conversation);

  return (
    profile?.profileImage ??
    profile?.image ??
    profile?.avatar ??
    null
  );
}

function getCandidatePhone(
  conversation: RecruiterConversation | null,
): string {
  return getCandidateProfile(conversation)?.phone ?? "";
}

function getCandidateLocation(
  conversation: RecruiterConversation | null,
): string {
  return (
    getCandidateProfile(conversation)?.location ??
    conversation?.jobApplication?.job?.location ??
    ""
  );
}

function getCandidateSkills(
  conversation: RecruiterConversation | null,
): string[] {
  const skills =
    getCandidateProfile(conversation)?.skills;

  if (!Array.isArray(skills)) {
    return [];
  }

  return skills.filter(
    (skill): skill is string =>
      typeof skill === "string" &&
      skill.trim().length > 0,
  );
}

function getCandidateGithub(
  conversation: RecruiterConversation | null,
): string {
  const profile = getCandidateProfile(conversation);

  return (
    profile?.githubUrl ??
    profile?.github ??
    ""
  );
}

function getCandidateLinkedin(
  conversation: RecruiterConversation | null,
): string {
  const profile = getCandidateProfile(conversation);

  return (
    profile?.linkedinUrl ??
    profile?.linkedin ??
    ""
  );
}

function getCandidatePortfolio(
  conversation: RecruiterConversation | null,
): string {
  const profile = getCandidateProfile(conversation);

  return (
    profile?.portfolioUrl ??
    profile?.portfolio ??
    ""
  );
}

function getJobTitle(
  conversation: RecruiterConversation | null,
): string {
  return (
    conversation?.jobApplication?.job?.title ??
    "Job Application"
  );
}

function getJobCompany(
  conversation: RecruiterConversation | null,
): string {
  return (
    conversation?.jobApplication?.job?.company?.name ??
    "Company"
  );
}

function getLastMessage(
  conversation: RecruiterConversation,
): RecruiterMessage | null {
  const messages = conversation.messages ?? [];

  if (!messages.length) {
    return null;
  }

  return [...messages].sort(
    (a, b) =>
      new Date(a.createdAt).getTime() -
      new Date(b.createdAt).getTime(),
  )[messages.length - 1];
}

function getUnreadCount(
  conversation: RecruiterConversation,
): number {
  return (conversation.messages ?? []).filter(
    (message) => !message.readAt,
  ).length;
}

function getInitials(
  name: string,
): string {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!words.length) {
    return "C";
  }

  if (words.length === 1) {
    return words[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    words[0][0] +
    words[words.length - 1][0]
  ).toUpperCase();
}

function formatTime(
  value?: string | null,
): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatConversationTime(
  value?: string | null,
): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const now = new Date();

  const isToday =
    date.toDateString() === now.toDateString();

  if (isToday) {
    return formatTime(value);
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

function formatDate(
  value?: string | null,
): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* =========================================================
   INFO ROW
========================================================= */

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-400">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          {label}
        </p>

        <div className="mt-1 break-words text-sm text-slate-200">
          {children}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ANIMATION
========================================================= */

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
      staggerChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

/* =========================================================
   MAIN PAGE
========================================================= */

export default function RecruiterMessagesPage({
  initialApplicationId,
}: Props) {
  /* -------------------------------------------------------
     STATE
  ------------------------------------------------------- */

  const [conversations, setConversations] =
    useState<RecruiterConversation[]>([]);

  const [
    selectedConversation,
    setSelectedConversation,
  ] = useState<RecruiterConversation | null>(
    null,
  );

  const [selectedApplicationId, setSelectedApplicationId] =
    useState<string | null>(
      initialApplicationId ?? null,
    );

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [conversationLoading, setConversationLoading] =
    useState(false);

  const [sendingMessage, setSendingMessage] =
    useState(false);

  const [messageText, setMessageText] =
    useState("");

  const [error, setError] =
    useState<string | null>(null);

  const [sendError, setSendError] =
    useState<string | null>(null);

  const [mobileConversationOpen, setMobileConversationOpen] =
    useState(Boolean(initialApplicationId));

  const messagesEndRef =
    useRef<HTMLDivElement | null>(null);

  /* -------------------------------------------------------
     SCROLL
  ------------------------------------------------------- */

  const scrollToBottom =
    useCallback(() => {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      });
    }, []);

  /* -------------------------------------------------------
     LOAD CONVERSATIONS
  ------------------------------------------------------- */

  const loadConversations =
    useCallback(
      async (
        isRefresh = false,
      ) => {
        try {
          if (isRefresh) {
            setRefreshing(true);
          } else {
            setLoading(true);
          }

          setError(null);

          const data =
            await recruiterMessageApi.getConversations();

          const sorted = [...data].sort(
            (a, b) =>
              new Date(
                b.updatedAt,
              ).getTime() -
              new Date(
                a.updatedAt,
              ).getTime(),
          );

          setConversations(sorted);

          setSelectedConversation(
            (current) => {
              if (current) {
                return (
                  sorted.find(
                    (item) =>
                      item.id === current.id,
                  ) ?? current
                );
              }

              if (initialApplicationId) {
                return (
                  sorted.find(
                    (item) =>
                      item.jobApplicationId ===
                      initialApplicationId,
                  ) ?? null
                );
              }

              return sorted[0] ?? null;
            },
          );

          setSelectedApplicationId(
            (current) => {
              if (current) {
                return current;
              }

              if (initialApplicationId) {
                return initialApplicationId;
              }

              return (
                sorted[0]?.jobApplicationId ??
                null
              );
            },
          );
        } catch (err) {
          const message =
            err instanceof Error
              ? err.message
              : "Failed to load conversations.";

          setError(message);
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      [initialApplicationId],
    );

  /* -------------------------------------------------------
     INITIAL LOAD
  ------------------------------------------------------- */

  useEffect(() => {
    void loadConversations();
  }, [loadConversations]);

  /* -------------------------------------------------------
     LOAD FULL CONVERSATION
  ------------------------------------------------------- */

  const loadFullConversation =
    useCallback(
      async (
        conversation: RecruiterConversation,
      ) => {
        try {
          setConversationLoading(true);
          setSendError(null);

          let latest: RecruiterConversation | null =
            null;

          try {
            latest =
              await recruiterMessageApi.getConversationByApplication(
                conversation.jobApplicationId,
              );
          } catch {
            latest =
              await recruiterMessageApi.getConversation(
                conversation.id,
              );
          }

          if (!latest) {
            latest = conversation;
          }

          let messages =
            latest.messages ?? [];

          /*
           * If the single-conversation response does not
           * contain messages, explicitly fetch them.
           */
          if (
            messages.length === 0 &&
            latest.id
          ) {
            try {
              messages =
                await recruiterMessageApi.getMessages(
                  latest.id,
                );
            } catch {
              messages = [];
            }
          }

          messages = [...messages].sort(
            (a, b) =>
              new Date(
                a.createdAt,
              ).getTime() -
              new Date(
                b.createdAt,
              ).getTime(),
          );

          const completeConversation: RecruiterConversation =
            {
              ...latest,
              messages,
            };

          setSelectedConversation(
            completeConversation,
          );

          setSelectedApplicationId(
            completeConversation.jobApplicationId,
          );

          setConversations(
            (current) =>
              current.map((item) =>
                item.id ===
                completeConversation.id
                  ? completeConversation
                  : item,
              ),
          );

          setMobileConversationOpen(true);

          /*
           * Mark as read.
           * This does not block displaying the conversation.
           */
          try {
            await recruiterMessageApi.markAsRead(
              completeConversation.id,
            );

            setConversations(
              (current) =>
                current.map((item) => {
                  if (
                    item.id !==
                    completeConversation.id
                  ) {
                    return item;
                  }

                  return {
                    ...item,
                    messages:
                      item.messages?.map(
                        (message) =>
                          message.readAt
                            ? message
                            : {
                                ...message,
                                readAt:
                                  new Date().toISOString(),
                              },
                      ) ?? [],
                  };
                }),
            );
          } catch {
            /*
             * Reading failure should not prevent
             * the conversation from being displayed.
             */
          }

          scrollToBottom();
        } catch (err) {
          const message =
            err instanceof Error
              ? err.message
              : "Failed to load conversation.";

          setSendError(message);
        } finally {
          setConversationLoading(false);
        }
      },
      [scrollToBottom],
    );

  /* -------------------------------------------------------
     SELECT CONVERSATION
  ------------------------------------------------------- */

  const handleSelectConversation =
    useCallback(
      async (
        conversation: RecruiterConversation,
      ) => {
        setSelectedConversation(
          conversation,
        );

        setSelectedApplicationId(
          conversation.jobApplicationId,
        );

        setMessageText("");
        setSendError(null);

        setMobileConversationOpen(true);

        await loadFullConversation(
          conversation,
        );
      },
      [loadFullConversation],
    );

  /* -------------------------------------------------------
     CLOSE MOBILE CONVERSATION
  ------------------------------------------------------- */

  const handleCloseConversation =
    useCallback(() => {
      setMobileConversationOpen(false);
      setSelectedConversation(null);
      setSelectedApplicationId(null);
      setMessageText("");
      setSendError(null);
    }, []);

  /* -------------------------------------------------------
     REFRESH
  ------------------------------------------------------- */

  const handleRefresh =
    useCallback(async () => {
      await loadConversations(true);

      if (selectedConversation) {
        await loadFullConversation(
          selectedConversation,
        );
      }
    }, [
      loadConversations,
      loadFullConversation,
      selectedConversation,
    ]);

  /* -------------------------------------------------------
     SEND MESSAGE
  ------------------------------------------------------- */

  const handleSendMessage =
    useCallback(async () => {
      const content =
        messageText.trim();

      if (
        !content ||
        !selectedConversation ||
        sendingMessage
      ) {
        return;
      }

      try {
        setSendingMessage(true);
        setSendError(null);

        const newMessage =
          await recruiterMessageApi.sendMessage(
            selectedConversation.id,
            content,
          );

        setMessageText("");

        setSelectedConversation(
          (current) => {
            if (!current) {
              return current;
            }

            const exists =
              current.messages?.some(
                (message) =>
                  message.id ===
                  newMessage.id,
              );

            if (exists) {
              return current;
            }

            return {
              ...current,
              updatedAt:
                newMessage.createdAt ??
                new Date().toISOString(),
              messages: [
                ...(current.messages ?? []),
                newMessage,
              ],
            };
          },
        );

        setConversations(
          (current) =>
            current.map((conversation) => {
              if (
                conversation.id !==
                selectedConversation.id
              ) {
                return conversation;
              }

              const exists =
                conversation.messages?.some(
                  (message) =>
                    message.id ===
                    newMessage.id,
                );

              return {
                ...conversation,
                updatedAt:
                  newMessage.createdAt ??
                  new Date().toISOString(),
                messages: exists
                  ? conversation.messages
                  : [
                      ...(conversation.messages ??
                        []),
                      newMessage,
                    ],
              };
            }),
        );

        scrollToBottom();
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to send message.";

        setSendError(message);
      } finally {
        setSendingMessage(false);
      }
    }, [
      messageText,
      selectedConversation,
      sendingMessage,
      scrollToBottom,
    ]);

  /* -------------------------------------------------------
     KEYBOARD
  ------------------------------------------------------- */

  const handleMessageKeyDown =
    useCallback(
      (
        event: KeyboardEvent<HTMLTextAreaElement>,
      ) => {
        if (
          event.key === "Enter" &&
          !event.shiftKey
        ) {
          event.preventDefault();

          void handleSendMessage();
        }
      },
      [handleSendMessage],
    );

  /* -------------------------------------------------------
     FILTER CONVERSATIONS
  ------------------------------------------------------- */

  const filteredConversations =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      if (!query) {
        return conversations;
      }

      return conversations.filter(
        (conversation) => {
          const name =
            getCandidateName(
              conversation,
            ).toLowerCase();

          const email =
            getCandidateEmail(
              conversation,
            ).toLowerCase();

          const job =
            getJobTitle(
              conversation,
            ).toLowerCase();

          const lastMessage =
            getLastMessage(
              conversation,
            )?.content?.toLowerCase() ??
            "";

          return (
            name.includes(query) ||
            email.includes(query) ||
            job.includes(query) ||
            lastMessage.includes(query)
          );
        },
      );
    }, [conversations, search]);

  /* -------------------------------------------------------
     SELECTED DATA
  ------------------------------------------------------- */

  const candidateName =
    getCandidateName(
      selectedConversation,
    );

  const candidateEmail =
    getCandidateEmail(
      selectedConversation,
    );

  const candidateImage =
    getCandidateImage(
      selectedConversation,
    );

  const candidatePhone =
    getCandidatePhone(
      selectedConversation,
    );

  const candidateLocation =
    getCandidateLocation(
      selectedConversation,
    );

  const candidateSkills =
    getCandidateSkills(
      selectedConversation,
    );

  const candidateGithub =
    getCandidateGithub(
      selectedConversation,
    );

  const candidateLinkedin =
    getCandidateLinkedin(
      selectedConversation,
    );

  const candidatePortfolio =
    getCandidatePortfolio(
      selectedConversation,
    );

  const jobTitle =
    getJobTitle(
      selectedConversation,
    );

  const jobCompany =
    getJobCompany(
      selectedConversation,
    );

  const selectedMessages =
    selectedConversation?.messages ?? [];

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      {/* ===================================================
          BACKGROUND
      =================================================== */}

      <div className="pointer-events-none absolute inset-0">
        <ParticleWave />

        <div className="absolute inset-0 bg-[#050816]/70" />

        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[140px]" />

        <div className="absolute bottom-0 left-0 h-[400px] w-[500px] rounded-full bg-cyan-500/[0.06] blur-[130px]" />
      </div>

      {/* ===================================================
          CONTENT
      =================================================== */}

      <div className="relative z-10 mx-auto max-w-[1700px] px-4 py-5 sm:px-6 lg:px-8">
        {/* =================================================
            BREADCRUMB
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: -10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mb-5 flex items-center justify-between gap-4"
        >
          <div className="flex min-w-0 items-center gap-2 text-sm">
            <Link
              href="/recruiter"
              className="text-slate-400 transition-colors hover:text-white"
            >
              Dashboard
            </Link>

            <ChevronRight className="h-4 w-4 shrink-0 text-slate-600" />

            <span className="truncate font-medium text-white">
              Messages
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              void handleRefresh();
            }}
            disabled={
              refreshing ||
              loading
            }
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 text-sm font-medium text-slate-200 transition-all hover:border-white/20 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                refreshing
                  ? "animate-spin"
                  : ""
              }`}
            />

            <span className="hidden sm:inline">
              Refresh
            </span>
          </button>
        </motion.div>

        {/* =================================================
            HEADER
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.4,
          }}
          className="mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10">
              <MessageCircle className="h-6 w-6 text-violet-300" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Messages
              </h1>

              <p className="mt-1 text-sm text-slate-400">
                Communicate with candidates about their applications.
              </p>
            </div>
          </div>
        </motion.div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <motion.div
            initial={{
              opacity: 0,
              y: -8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-5 flex items-center justify-between gap-4 rounded-2xl border border-red-400/20 bg-red-500/[0.08] px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-red-400" />

              <p className="text-sm text-red-200">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setError(null);
                void loadConversations();
              }}
              className="text-xs font-semibold text-red-300 hover:text-white"
            >
              Retry
            </button>
          </motion.div>
        )}

        {/* =================================================
            WORKSPACE
        ================================================= */}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#080c1d]/90 shadow-2xl shadow-black/30 backdrop-blur-2xl"
        >
          <div className="grid min-h-[calc(100vh-230px)] grid-cols-1 xl:grid-cols-[350px_minmax(0,1fr)_310px]">
            {/* =============================================
                CONVERSATION SIDEBAR
            ============================================= */}

            <motion.aside
              variants={itemVariants}
              className={`border-white/[0.07] xl:border-r ${
                mobileConversationOpen
                  ? "hidden xl:block"
                  : "block"
              }`}
            >
              <div className="flex h-full min-h-[700px] flex-col">
                {/* Sidebar header */}

                <div className="border-b border-white/[0.07] p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="font-semibold text-white">
                        Conversations
                      </h2>

                      <p className="mt-1 text-xs text-slate-500">
                        {conversations.length}{" "}
                        conversation
                        {conversations.length !== 1
                          ? "s"
                          : ""}
                      </p>
                    </div>

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04]">
                      <Users className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  {/* Search */}

                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                    <input
                      type="text"
                      value={search}
                      onChange={(event) =>
                        setSearch(
                          event.target.value,
                        )
                      }
                      placeholder="Search conversations..."
                      className="h-11 w-full rounded-xl border border-white/[0.08] bg-white/[0.035] pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 transition-all focus:border-violet-400/30 focus:bg-white/[0.05]"
                    />
                  </div>
                </div>

                {/* Conversations */}

                <div className="flex-1 overflow-y-auto p-3">
                  {loading ? (
                    <div className="space-y-2">
                      {Array.from({
                        length: 6,
                      }).map((_, index) => (
                        <div
                          key={index}
                          className="animate-pulse rounded-2xl border border-white/[0.05] p-4"
                        >
                          <div className="flex gap-3">
                            <div className="h-11 w-11 rounded-full bg-white/[0.07]" />

                            <div className="flex-1">
                              <div className="h-3 w-28 rounded bg-white/[0.07]" />

                              <div className="mt-2 h-2.5 w-40 rounded bg-white/[0.05]" />

                              <div className="mt-3 h-2.5 w-full rounded bg-white/[0.04]" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : filteredConversations.length ===
                    0 ? (
                    <div className="flex h-full min-h-[400px] flex-col items-center justify-center px-6 text-center">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.04]">
                        <MessageCircle className="h-6 w-6 text-slate-500" />
                      </div>

                      <h3 className="font-medium text-slate-300">
                        No conversations
                      </h3>

                      <p className="mt-2 max-w-[230px] text-xs leading-5 text-slate-600">
                        {search
                          ? "No conversations match your search."
                          : "There are no candidate conversations available yet."}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {filteredConversations.map(
                        (conversation) => {
                          const name =
                            getCandidateName(
                              conversation,
                            );

                          const lastMessage =
                            getLastMessage(
                              conversation,
                            );

                          const unread =
                            getUnreadCount(
                              conversation,
                            );

                          const isSelected =
                            selectedConversation?.id ===
                            conversation.id;

                          return (
                            <motion.button
                              key={
                                conversation.id
                              }
                              type="button"
                              variants={itemVariants}
                              onClick={() => {
                                void handleSelectConversation(
                                  conversation,
                                );
                              }}
                              className={`group relative w-full rounded-2xl border p-3 text-left transition-all ${
                                isSelected
                                  ? "border-violet-400/20 bg-violet-500/[0.09]"
                                  : "border-transparent hover:border-white/[0.07] hover:bg-white/[0.035]"
                              }`}
                            >
                              {isSelected && (
                                <motion.div
                                  layoutId="selected-conversation"
                                  className="absolute bottom-3 left-0 top-3 w-0.5 rounded-full bg-violet-400"
                                />
                              )}

                              <div className="flex gap-3">
                                {/* Avatar */}

                                <div className="relative shrink-0">
                                  {getCandidateImage(
                                    conversation,
                                  ) ? (
                                    <img
                                      src={getCandidateImage(
                                        conversation,
                                      ) ?? ""}
                                      alt={name}
                                      className="h-11 w-11 rounded-full object-cover ring-1 ring-white/10"
                                    />
                                  ) : (
                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/30 to-cyan-500/20 text-xs font-bold text-violet-200 ring-1 ring-white/10">
                                      {getInitials(
                                        name,
                                      )}
                                    </div>
                                  )}

                                  {unread > 0 && (
                                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-[#080c1d] bg-violet-500 px-1 text-[8px] font-bold text-white">
                                      {unread >
                                      9
                                        ? "9+"
                                        : unread}
                                    </span>
                                  )}
                                </div>

                                {/* Content */}

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-start justify-between gap-2">
                                    <h3
                                      className={`truncate text-sm font-semibold ${
                                        isSelected
                                          ? "text-white"
                                          : "text-slate-200"
                                      }`}
                                    >
                                      {name}
                                    </h3>

                                    <span className="shrink-0 text-[10px] text-slate-600">
                                      {formatConversationTime(
                                        lastMessage?.createdAt ??
                                          conversation.updatedAt,
                                      )}
                                    </span>
                                  </div>

                                  <p className="mt-0.5 truncate text-[11px] font-medium text-violet-300/70">
                                    {getJobTitle(
                                      conversation,
                                    )}
                                  </p>

                                  <p
                                    className={`mt-1.5 truncate text-xs ${
                                      unread >
                                      0
                                        ? "font-medium text-slate-300"
                                        : "text-slate-500"
                                    }`}
                                  >
                                    {lastMessage?.content ??
                                      "No messages yet"}
                                  </p>
                                </div>
                              </div>
                            </motion.button>
                          );
                        },
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.aside>

            {/* =============================================
                CHAT
            ============================================= */}

            <motion.section
              variants={itemVariants}
              className={`min-w-0 ${
                mobileConversationOpen
                  ? "block"
                  : "hidden xl:block"
              }`}
            >
              {!selectedConversation ? (
                <div className="flex h-full min-h-[700px] flex-col items-center justify-center px-6 text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 rounded-3xl bg-violet-500/20 blur-2xl" />

                    <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-white/[0.08] bg-white/[0.04]">
                      <MessageCircle className="h-9 w-9 text-violet-300" />
                    </div>
                  </div>

                  <h2 className="text-xl font-semibold text-white">
                    Select a conversation
                  </h2>

                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Select a candidate conversation from
                    the left to view the message history.
                  </p>
                </div>
              ) : (
                <div className="flex h-full min-h-[700px] flex-col">
                  {/* Chat header */}

                  <div className="flex min-h-[76px] items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-3 sm:px-5">
                    <div className="flex min-w-0 items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setMobileConversationOpen(
                            false,
                          )
                        }
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:bg-white/[0.07] hover:text-white xl:hidden"
                        aria-label="Back to conversations"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </button>

                      {candidateImage ? (
                        <img
                          src={candidateImage}
                          alt={candidateName}
                          className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-white/10"
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/30 to-cyan-500/20 text-xs font-bold text-violet-200 ring-1 ring-white/10">
                          {getInitials(
                            candidateName,
                          )}
                        </div>
                      )}

                      <div className="min-w-0">
                        <h2 className="truncate text-sm font-semibold text-white">
                          {candidateName}
                        </h2>

                        <div className="mt-0.5 flex min-w-0 items-center gap-1.5 text-[11px] text-slate-500">
                          <span className="truncate">
                            {jobTitle}
                          </span>

                          <span>•</span>

                          <span className="shrink-0">
                            Candidate
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={
                        handleCloseConversation
                      }
                      className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-500 transition-colors hover:bg-white/[0.07] hover:text-white sm:flex xl:hidden"
                      aria-label="Close conversation"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Job context */}

                  <div className="border-b border-white/[0.06] bg-white/[0.015] px-4 py-3 sm:px-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
                          <BriefcaseBusiness className="h-4 w-4 text-violet-300" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium text-slate-300">
                            {jobTitle}
                          </p>

                          <p className="truncate text-[10px] text-slate-600">
                            {jobCompany}
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/recruiter/applications/${selectedConversation.jobApplicationId}`}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-1.5 text-[10px] font-semibold text-slate-400 transition-all hover:border-violet-400/20 hover:bg-violet-500/[0.06] hover:text-violet-200"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        View Application
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>

                  {/* Messages */}

                  <div className="relative flex-1 overflow-y-auto px-4 py-5 sm:px-6">
                    {conversationLoading ? (
                      <div className="flex min-h-[400px] items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-400/10 bg-violet-500/[0.07]">
                            <Loader2 className="h-5 w-5 animate-spin text-violet-300" />
                          </div>

                          <p className="text-xs text-slate-500">
                            Loading conversation...
                          </p>
                        </div>
                      </div>
                    ) : selectedMessages.length ===
                      0 ? (
                      <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03]">
                          <Sparkles className="h-6 w-6 text-violet-300" />
                        </div>

                        <h3 className="font-medium text-slate-300">
                          Start the conversation
                        </h3>

                        <p className="mt-2 max-w-sm text-xs leading-5 text-slate-600">
                          Send a message to communicate
                          with {candidateName}.
                        </p>
                      </div>
                    ) : (
                      <div className="mx-auto max-w-3xl space-y-5">
                        {selectedMessages.map(
                          (
                            message,
                            index,
                          ) => {
                            const senderEmail =
                              message.sender?.email ??
                              "";

                            const isCandidate =
                              Boolean(
                                candidateEmail &&
                                  senderEmail &&
                                  senderEmail.toLowerCase() ===
                                    candidateEmail.toLowerCase(),
                              );

                            const isAutomatic =
                              Boolean(
                                message.isAutomatic,
                              );

                            return (
                              <motion.div
                                key={
                                  message.id
                                }
                                initial={{
                                  opacity: 0,
                                  y: 8,
                                }}
                                animate={{
                                  opacity: 1,
                                  y: 0,
                                }}
                                transition={{
                                  duration: 0.25,
                                  delay:
                                    index *
                                    0.015,
                                }}
                                className={`flex ${
                                  isCandidate
                                    ? "justify-start"
                                    : "justify-end"
                                }`}
                              >
                                <div
                                  className={`max-w-[88%] sm:max-w-[75%] ${
                                    isCandidate
                                      ? "items-start"
                                      : "items-end"
                                  } flex flex-col`}
                                >
                                  {/* Automatic */}

                                  {isAutomatic && (
                                    <div className="mb-1.5 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-violet-300/70">
                                      <Sparkles className="h-3 w-3" />
                                      Automated
                                    </div>
                                  )}

                                  {/* Bubble */}

                                  <div
                                    className={`rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                                      isAutomatic
                                        ? "border border-violet-400/15 bg-violet-500/[0.07] text-violet-100"
                                        : isCandidate
                                          ? "rounded-tl-md border border-white/[0.07] bg-white/[0.045] text-slate-200"
                                          : "rounded-tr-md bg-violet-500/90 text-white shadow-violet-950/20"
                                    }`}
                                  >
                                    <p className="whitespace-pre-wrap break-words">
                                      {
                                        message.content
                                      }
                                    </p>
                                  </div>

                                  {/* Meta */}

                                  <div
                                    className={`mt-1.5 flex items-center gap-1.5 px-1 text-[9px] text-slate-600 ${
                                      isCandidate
                                        ? ""
                                        : "justify-end"
                                    }`}
                                  >
                                    <span>
                                      {formatTime(
                                        message.createdAt,
                                      )}
                                    </span>

                                    {!isCandidate &&
                                      !isAutomatic && (
                                        <CheckCheck className="h-3 w-3 text-violet-400/70" />
                                      )}
                                  </div>
                                </div>
                              </motion.div>
                            );
                          },
                        )}

                        <div
                          ref={
                            messagesEndRef
                          }
                        />
                      </div>
                    )}
                  </div>

                  {/* Send error */}

                  {sendError && (
                    <div className="border-t border-red-400/10 bg-red-500/[0.04] px-4 py-2">
                      <p className="text-xs text-red-300">
                        {sendError}
                      </p>
                    </div>
                  )}

                  {/* Composer */}

                  <div className="border-t border-white/[0.07] bg-white/[0.015] p-3 sm:p-4">
                    <div className="mx-auto max-w-3xl">
                      <div className="rounded-2xl border border-white/[0.08] bg-[#0b1022] transition-all focus-within:border-violet-400/25 focus-within:ring-1 focus-within:ring-violet-400/10">
                        <textarea
                          value={
                            messageText
                          }
                          onChange={(
                            event,
                          ) =>
                            setMessageText(
                              event.target.value,
                            )
                          }
                          onKeyDown={
                            handleMessageKeyDown
                          }
                          disabled={
                            sendingMessage
                          }
                          rows={3}
                          placeholder={`Message ${candidateName}...`}
                          className="max-h-32 min-h-[76px] w-full resize-none bg-transparent px-4 pt-3 text-sm leading-6 text-white outline-none placeholder:text-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
                        />

                        <div className="flex items-center justify-between gap-3 px-3 pb-3">
                          <p className="hidden text-[10px] text-slate-600 sm:block">
                            Press Enter to send · Shift
                            + Enter for a new line
                          </p>

                          <button
                            type="button"
                            onClick={() => {
                              void handleSendMessage();
                            }}
                            disabled={
                              !messageText.trim() ||
                              sendingMessage
                            }
                            className="ml-auto inline-flex h-9 items-center gap-2 rounded-xl bg-violet-500 px-4 text-xs font-semibold text-white shadow-lg shadow-violet-950/30 transition-all hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {sendingMessage ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Send className="h-3.5 w-3.5" />
                            )}

                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.section>

            {/* =============================================
                CANDIDATE DETAILS
            ============================================= */}

            <motion.aside
              variants={itemVariants}
              className="hidden border-l border-white/[0.07] xl:block"
            >
              {selectedConversation ? (
                <div className="flex h-full min-h-[700px] flex-col">
                  {/* Candidate header */}

                  <div className="border-b border-white/[0.07] p-5">
                    <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                      Candidate
                    </p>

                    <div className="flex flex-col items-center text-center">
                      {candidateImage ? (
                        <img
                          src={candidateImage}
                          alt={candidateName}
                          className="h-20 w-20 rounded-3xl object-cover ring-1 ring-white/10"
                        />
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500/30 to-cyan-500/20 text-xl font-bold text-violet-200 ring-1 ring-white/10">
                          {getInitials(
                            candidateName,
                          )}
                        </div>
                      )}

                      <h3 className="mt-4 text-base font-semibold text-white">
                        {candidateName}
                      </h3>

                      {candidateEmail && (
                        <p className="mt-1 max-w-full truncate px-4 text-xs text-slate-500">
                          {candidateEmail}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Details */}

                  <div className="flex-1 overflow-y-auto p-5">
                    <div className="space-y-5">
                      {candidateLocation && (
                        <InfoRow
                          icon={
                            <MapPin className="h-4 w-4" />
                          }
                          label="Location"
                        >
                          {candidateLocation}
                        </InfoRow>
                      )}

                      {candidatePhone && (
                        <InfoRow
                          icon={
                            <Clock3 className="h-4 w-4" />
                          }
                          label="Phone"
                        >
                          {candidatePhone}
                        </InfoRow>
                      )}

                      {candidateEmail && (
                        <InfoRow
                          icon={
                            <Mail className="h-4 w-4" />
                          }
                          label="Email"
                        >
                          <a
                            href={`mailto:${candidateEmail}`}
                            className="transition-colors hover:text-violet-300"
                          >
                            {candidateEmail}
                          </a>
                        </InfoRow>
                      )}

                      {/* Social links */}

                      {(candidateGithub ||
                        candidateLinkedin ||
                        candidatePortfolio) && (
                        <div>
                          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                            Links
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {candidateGithub && (
                              <a
                                href={
                                  candidateGithub
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] text-slate-400 transition-all hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                                aria-label="GitHub"
                              >
                                <FaGithub className="h-4 w-4" />
                              </a>
                            )}

                            {candidateLinkedin && (
                              <a
                                href={
                                  candidateLinkedin
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] text-slate-400 transition-all hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                                aria-label="LinkedIn"
                              >
                                <FaLinkedin className="h-4 w-4" />
                              </a>
                            )}

                            {candidatePortfolio && (
                              <a
                                href={
                                  candidatePortfolio
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] text-slate-400 transition-all hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                                aria-label="Portfolio"
                              >
                                <Globe2 className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Skills */}

                      {candidateSkills.length >
                        0 && (
                        <div>
                          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                            Skills
                          </p>

                          <div className="flex flex-wrap gap-1.5">
                            {candidateSkills.map(
                              (skill) => (
                                <span
                                  key={
                                    skill
                                  }
                                  className="rounded-lg border border-violet-400/10 bg-violet-500/[0.06] px-2.5 py-1.5 text-[10px] font-medium text-violet-200"
                                >
                                  {skill}
                                </span>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                      {/* Job */}

                      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                        <div className="mb-3 flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
                            <BriefcaseBusiness className="h-4 w-4 text-violet-300" />
                          </div>

                          <div className="min-w-0">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
                              Applied for
                            </p>

                            <p className="mt-0.5 truncate text-xs font-semibold text-slate-200">
                              {jobTitle}
                            </p>
                          </div>
                        </div>

                        <p className="text-[11px] leading-5 text-slate-500">
                          {jobCompany}
                        </p>

                        {selectedConversation.createdAt && (
                          <p className="mt-2 text-[10px] text-slate-600">
                            Application started{" "}
                            {formatDate(
                              selectedConversation.createdAt,
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Application */}

                  <div className="border-t border-white/[0.07] p-4">
                    <Link
                      href={`/recruiter/applications/${selectedConversation.jobApplicationId}`}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-violet-400/15 bg-violet-500/[0.07] px-4 py-2.5 text-xs font-semibold text-violet-200 transition-all hover:border-violet-400/25 hover:bg-violet-500/[0.12]"
                    >
                      <UserRound className="h-3.5 w-3.5" />
                      Open Application
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex h-full min-h-[700px] items-center justify-center p-8 text-center">
                  <div>
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.03]">
                      <UserRound className="h-5 w-5 text-slate-600" />
                    </div>

                    <p className="text-xs text-slate-600">
                      Select a conversation to view
                      candidate details.
                    </p>
                  </div>
                </div>
              )}
            </motion.aside>
          </div>
        </motion.div>
      </div>
    </main>
  );
}