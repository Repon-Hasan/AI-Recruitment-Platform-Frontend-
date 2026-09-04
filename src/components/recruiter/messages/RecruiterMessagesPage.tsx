"use client";

import type { ComponentType, ReactNode } from "react";

import Link from "next/link";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  BriefcaseBusiness,
  Check,
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

import ParticleWave from "@/components/ui/particle-wave";

import {
  recruiterMessageApi,
  type RecruiterConversation,
  type RecruiterMessage,
} from "@/lib/api/message.recruiter.api";

import { FaGithub, FaLinkedin } from "react-icons/fa";

/* =========================================================
   TYPES
========================================================= */

type Props = {
  initialApplicationId?: string;
};

/* =========================================================
   ANIMATIONS
========================================================= */

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.06,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const messageVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
    scale: 0.98,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

/* =========================================================
   SAFE HELPERS
========================================================= */

type DynamicObject = Record<string, unknown>;

function asObject(value: unknown): DynamicObject | null {
  if (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  ) {
    return value as DynamicObject;
  }

  return null;
}

function getString(
  value: unknown,
): string {
  return typeof value === "string"
    ? value
    : "";
}

function getCandidateProfileData(
  conversation: RecruiterConversation,
): DynamicObject {
  return (
    asObject(
      conversation.jobApplication
        ?.candidateProfile,
    ) ?? {}
  );
}

function getCandidateUserData(
  conversation: RecruiterConversation,
): DynamicObject {
  const profile =
    getCandidateProfileData(
      conversation,
    );

  return asObject(profile.user) ?? {};
}

/* =========================================================
   DATE HELPERS
========================================================= */

function formatDate(
  value?: string | null,
) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  ).format(date);
}

function formatTime(
  value?: string | null,
) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      hour: "numeric",
      minute: "2-digit",
    },
  ).format(date);
}

function formatConversationTime(
  value?: string | null,
) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const now = new Date();

  const sameDay =
    date.toDateString() ===
    now.toDateString();

  if (sameDay) {
    return formatTime(value);
  }

  const diff =
    now.getTime() -
    date.getTime();

  const days = Math.floor(
    diff / 86400000,
  );

  if (days < 7) {
    return new Intl.DateTimeFormat(
      "en-US",
      {
        weekday: "short",
      },
    ).format(date);
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
    },
  ).format(date);
}

/* =========================================================
   CONVERSATION HELPERS
========================================================= */

function getCandidateName(
  conversation: RecruiterConversation,
) {
  const user =
    getCandidateUserData(
      conversation,
    );

  const profile =
    conversation.jobApplication
      ?.candidateProfile;

  const profileUser =
    asObject(profile?.user);

  const profileUserName =
    getString(
      profileUser?.name,
    );

  if (profileUserName) {
    return profileUserName;
  }

  const userName =
    getString(user.name);

  if (userName) {
    return userName;
  }

  const participant =
    conversation.participants?.find(
      (item) =>
        Boolean(item.user?.name),
    );

  return (
    participant?.user?.name ||
    "Candidate"
  );
}

function getCandidateEmail(
  conversation: RecruiterConversation,
) {
  const user =
    getCandidateUserData(
      conversation,
    );

  const profile =
    conversation.jobApplication
      ?.candidateProfile;

  const profileUser =
    asObject(profile?.user);

  const profileEmail =
    getString(
      profileUser?.email,
    );

  if (profileEmail) {
    return profileEmail;
  }

  const userEmail =
    getString(user.email);

  if (userEmail) {
    return userEmail;
  }

  const participant =
    conversation.participants?.find(
      (item) =>
        Boolean(item.user?.email),
    );

  return (
    participant?.user?.email ||
    ""
  );
}

function getCandidateImage(
  conversation: RecruiterConversation,
) {
  const user =
    getCandidateUserData(
      conversation,
    );

  const profile =
    conversation.jobApplication
      ?.candidateProfile;

  const profileUser =
    asObject(profile?.user);

  const profileImage =
    getString(
      profileUser?.image,
    );

  if (profileImage) {
    return profileImage;
  }

  const userImage =
    getString(user.image);

  if (userImage) {
    return userImage;
  }

  const participant =
    conversation.participants?.find(
      (item) =>
        Boolean(item.user?.image),
    );

  return (
    participant?.user?.image ||
    null
  );
}

function getInitials(
  name: string,
) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(
        (part) => part[0],
      )
      .join("")
      .toUpperCase() || "C"
  );
}

function getLastMessage(
  conversation: RecruiterConversation,
): RecruiterMessage | null {
  if (
    !conversation.messages?.length
  ) {
    return null;
  }

  return (
    conversation.messages[
      conversation.messages.length - 1
    ] ?? null
  );
}

function getUnreadCount(
  conversation: RecruiterConversation,
) {
  return (
    conversation.messages?.filter(
      (message) =>
        !message.readAt &&
        !message.isAutomatic,
    ).length ?? 0
  );
}

function getJobTitle(
  conversation: RecruiterConversation,
) {
  return (
    conversation.jobApplication
      ?.job?.title ||
    "Job Application"
  );
}

function getCandidateSkills(
  conversation: RecruiterConversation,
) {
  const profile =
    getCandidateProfileData(
      conversation,
    );

  const skills = profile.skills;

  if (!Array.isArray(skills)) {
    return [];
  }

  return skills
    .map((skill) => {
      if (
        typeof skill === "string"
      ) {
        return skill;
      }

      const object =
        asObject(skill);

      if (!object) {
        return null;
      }

      return getString(
        object.name,
      );
    })
    .filter(
      (
        skill,
      ): skill is string =>
        Boolean(skill),
    );
}

function getCandidatePhone(
  conversation: RecruiterConversation,
) {
  const profile =
    getCandidateProfileData(
      conversation,
    );

  return getString(
    profile.phone,
  );
}

function getCandidateLocation(
  conversation: RecruiterConversation,
) {
  const profile =
    getCandidateProfileData(
      conversation,
    );

  return getString(
    profile.location,
  );
}

function getCandidateGithub(
  conversation: RecruiterConversation,
) {
  const profile =
    getCandidateProfileData(
      conversation,
    );

  return getString(
    profile.github,
  );
}

function getCandidateLinkedin(
  conversation: RecruiterConversation,
) {
  const profile =
    getCandidateProfileData(
      conversation,
    );

  return getString(
    profile.linkedin ??
      profile.linkedIn ??
      profile.linkedinUrl,
  );
}

function getCandidatePortfolio(
  conversation: RecruiterConversation,
) {
  const profile =
    getCandidateProfileData(
      conversation,
    );

  return getString(
    profile.portfolio ??
      profile.portfolioUrl,
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyMessages({
  search,
}: {
  search: string;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.9,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        className="flex h-20 w-20 items-center justify-center rounded-3xl border border-indigo-400/10 bg-indigo-500/10 text-indigo-300"
      >
        {search ? (
          <Search className="h-8 w-8" />
        ) : (
          <MessageCircle className="h-8 w-8" />
        )}
      </motion.div>

      <h2 className="mt-6 text-xl font-semibold text-white">
        {search
          ? "No conversations found"
          : "No conversations yet"}
      </h2>

      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {search
          ? "Try another candidate name, email address, or job title."
          : "Your candidate conversations will appear here when a conversation is created."}
      </p>
    </div>
  );
}

/* =========================================================
   LOADING STATE
========================================================= */

function LoadingState() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816]">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <ParticleWave />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="mb-6 h-5 w-32 rounded bg-white/10" />

          <div className="mb-8 h-10 w-56 rounded-xl bg-white/10" />

          <div className="grid h-[calc(100vh-180px)] grid-cols-1 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] lg:grid-cols-[340px_1fr]">
            <div className="border-r border-white/10 p-5">
              <div className="h-11 rounded-xl bg-white/10" />

              <div className="mt-5 space-y-3">
                {Array.from({
                  length: 6,
                }).map((_, index) => (
                  <div
                    key={index}
                    className="h-20 rounded-2xl bg-white/[0.05]"
                  />
                ))}
              </div>
            </div>

            <div className="hidden p-6 lg:block">
              <div className="h-16 rounded-2xl bg-white/[0.05]" />

              <div className="mt-8 space-y-4">
                <div className="h-20 w-1/2 rounded-2xl bg-white/[0.05]" />
                <div className="ml-auto h-20 w-1/2 rounded-2xl bg-white/[0.05]" />
                <div className="h-20 w-2/5 rounded-2xl bg-white/[0.05]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   INFO ROW
========================================================= */

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: ComponentType<{
    className?: string;
  }>;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-slate-400">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wider text-slate-600">
          {label}
        </p>

        <div className="mt-1 break-words text-sm text-slate-300">
          {children}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function RecruiterMessagesPage({
  initialApplicationId,
}: Props) {
  const [
    conversations,
    setConversations,
  ] = useState<RecruiterConversation[]>(
    [],
  );

  const [
    selectedConversation,
    setSelectedConversation,
  ] =
    useState<RecruiterConversation | null>(
      null,
    );

  const [
    selectedApplicationId,
    setSelectedApplicationId,
  ] = useState(
    initialApplicationId ?? "",
  );

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    refreshing,
    setRefreshing,
  ] = useState(false);

  const [
    conversationLoading,
    setConversationLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  const [
    mobileConversationOpen,
    setMobileConversationOpen,
  ] = useState(false);

  /* =======================================================
     LOAD CONVERSATIONS
  ======================================================== */

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

          setConversations(data);

          let target:
            | RecruiterConversation
            | null = null;

          if (
            initialApplicationId
          ) {
            target =
              data.find(
                (conversation) =>
                  conversation.jobApplicationId ===
                  initialApplicationId,
              ) ?? null;
          }

          if (
            !target &&
            selectedApplicationId
          ) {
            target =
              data.find(
                (conversation) =>
                  conversation.jobApplicationId ===
                  selectedApplicationId,
              ) ?? null;
          }

          if (!target) {
            target =
              data[0] ?? null;
          }

          if (target) {
            setSelectedConversation(
              target,
            );

            setSelectedApplicationId(
              target.jobApplicationId,
            );
          } else {
            setSelectedConversation(
              null,
            );
          }
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load conversations.",
          );
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      [
        initialApplicationId,
        selectedApplicationId,
      ],
    );

  useEffect(() => {
    const timeoutId =
      window.setTimeout(() => {
        void loadConversations();
      }, 0);

    return () => {
      window.clearTimeout(
        timeoutId,
      );
    };
  }, [loadConversations]);

  /* =======================================================
     SELECT CONVERSATION
  ======================================================== */

  const handleSelectConversation =
    async (
      conversation: RecruiterConversation,
    ) => {
      setSelectedApplicationId(
        conversation.jobApplicationId,
      );

      setSelectedConversation(
        conversation,
      );

      setMobileConversationOpen(
        true,
      );

      try {
        setConversationLoading(
          true,
        );

        const latest =
          await recruiterMessageApi.getConversationByApplication(
            conversation.jobApplicationId,
          );

        if (latest) {
          setSelectedConversation(
            latest,
          );

          setConversations(
            (current) =>
              current.map(
                (item) =>
                  item.id ===
                  latest.id
                    ? latest
                    : item,
              ),
          );
        }
      } catch (err) {
        console.error(
          "Failed to refresh conversation:",
          err,
        );
      } finally {
        setConversationLoading(
          false,
        );
      }
    };

  /* =======================================================
     FILTER
  ======================================================== */

  const filteredConversations =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

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
            )
              ?.content?.toLowerCase() ??
            "";

          return (
            name.includes(query) ||
            email.includes(query) ||
            job.includes(query) ||
            lastMessage.includes(query)
          );
        },
      );
    }, [
      conversations,
      search,
    ]);

  /* =======================================================
     CURRENT CANDIDATE DATA
  ======================================================== */

  const candidateProfile =
    selectedConversation
      ?.jobApplication
      ?.candidateProfile;

  const candidateName =
    selectedConversation
      ? getCandidateName(
          selectedConversation,
        )
      : "Candidate";

  const candidateEmail =
    selectedConversation
      ? getCandidateEmail(
          selectedConversation,
        )
      : "";

  const candidateImage =
    selectedConversation
      ? getCandidateImage(
          selectedConversation,
        )
      : null;

  const candidateSkills =
    selectedConversation
      ? getCandidateSkills(
          selectedConversation,
        )
      : [];

  const candidatePhone =
    selectedConversation
      ? getCandidatePhone(
          selectedConversation,
        )
      : "";

  const candidateLocation =
    selectedConversation
      ? getCandidateLocation(
          selectedConversation,
        )
      : "";

  const candidateGithub =
    selectedConversation
      ? getCandidateGithub(
          selectedConversation,
        )
      : "";

  const candidateLinkedin =
    selectedConversation
      ? getCandidateLinkedin(
          selectedConversation,
        )
      : "";

  const candidatePortfolio =
    selectedConversation
      ? getCandidatePortfolio(
          selectedConversation,
        )
      : "";

  const currentJob =
    selectedConversation
      ?.jobApplication?.job;

  /* =======================================================
     ERROR STATE
  ======================================================== */

  if (error && !loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
        <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
          <ParticleWave />
        </div>

        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.10),transparent_30%)]" />

        <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <div className="w-full max-w-md rounded-3xl border border-rose-400/20 bg-white/[0.05] p-8 text-center shadow-2xl backdrop-blur-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-300">
              <X className="h-7 w-7" />
            </div>

            <h1 className="mt-5 text-xl font-semibold">
              Unable to load messages
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                void loadConversations()
              }
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     LOADING STATE
  ======================================================== */

  if (loading) {
    return <LoadingState />;
  }

  /* =======================================================
     PAGE
  ======================================================== */

  return (
    <motion.main
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative min-h-screen overflow-hidden bg-[#050816] text-white"
    >
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 z-0 opacity-40">
        <ParticleWave />
      </div>

      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.10),transparent_30%)]" />

      <div className="pointer-events-none absolute left-1/2 top-0 h-[450px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
        {/* =================================================
            TOP BAR
        ================================================== */}

        <motion.div
          variants={itemVariants}
          className="mb-5 flex flex-wrap items-center justify-between gap-4"
        >
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs text-slate-500">
              <Link
                href="/recruiter"
                className="transition hover:text-white"
              >
                Dashboard
              </Link>

              <ChevronRight className="h-3.5 w-3.5" />

              <span className="text-slate-300">
                Messages
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300">
                <MessageCircle className="h-5 w-5" />
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Messages
                </h1>

                <p className="mt-0.5 text-sm text-slate-500">
                  Manage conversations with your candidates
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-400 sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/40" />

              Messaging Center
            </div>

            <button
              type="button"
              disabled={refreshing}
              onClick={() =>
                void loadConversations(
                  true,
                )
              }
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm font-medium text-slate-300 backdrop-blur-xl transition hover:bg-white/[0.08] hover:text-white disabled:opacity-60"
            >
              <RefreshCw
                className={
                  refreshing
                    ? "h-4 w-4 animate-spin"
                    : "h-4 w-4"
                }
              />

              <span className="hidden sm:inline">
                Refresh
              </span>
            </button>
          </div>
        </motion.div>

        {/* =================================================
            MAIN MESSAGING WORKSPACE
        ================================================== */}

        <motion.div
          variants={itemVariants}
          className="relative grid h-[calc(100vh-155px)] min-h-[620px] overflow-hidden rounded-3xl border border-white/10 bg-[#080b18]/75 shadow-2xl backdrop-blur-2xl"
        >
          {/* =================================================
              CONVERSATION SIDEBAR
          ================================================== */}

          <aside
            className={`absolute inset-y-0 left-0 z-20 w-full border-r border-white/10 bg-[#080b18]/95 transition-transform duration-300 lg:relative lg:w-[350px] lg:translate-x-0 ${
              mobileConversationOpen
                ? "-translate-x-full"
                : "translate-x-0"
            }`}
          >
            {/* Sidebar header */}

            <div className="border-b border-white/10 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Conversations
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    {conversations.length}{" "}
                    conversation
                    {conversations.length !==
                    1
                      ? "s"
                      : ""}
                  </p>
                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-300">
                  <Users className="h-4 w-4" />
                </div>
              </div>

              {/* Search */}

              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value,
                    )
                  }
                  placeholder="Search conversations..."
                  className="w-full rounded-xl border border-white/10 bg-black/20 py-2.5 pl-10 pr-3 text-sm text-white outline-none placeholder:text-slate-600 transition focus:border-indigo-400/40 focus:bg-white/[0.04] focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </div>

            {/* Conversation list */}

            <div className="h-[calc(100%-118px)] overflow-y-auto">
              {filteredConversations.length ===
              0 ? (
                <EmptyMessages
                  search={search}
                />
              ) : (
                <div className="p-2">
                  {filteredConversations.map(
                    (
                      conversation,
                    ) => {
                      const name =
                        getCandidateName(
                          conversation,
                        );

                      const image =
                        getCandidateImage(
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
                          layout
                          whileHover={{
                            x: 2,
                          }}
                          onClick={() =>
                            void handleSelectConversation(
                              conversation,
                            )
                          }
                          className={`mb-1.5 w-full rounded-2xl p-3 text-left transition ${
                            isSelected
                              ? "border border-indigo-400/20 bg-indigo-500/[0.10]"
                              : "border border-transparent hover:border-white/5 hover:bg-white/[0.035]"
                          }`}
                        >
                          <div className="flex gap-3">
                            {/* Avatar */}

                            <div className="relative shrink-0">
                              {image ? (
                                <img
                                  src={
                                    image
                                  }
                                  alt={
                                    name
                                  }
                                  className="h-11 w-11 rounded-xl object-cover ring-1 ring-white/10"
                                />
                              ) : (
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/30 to-cyan-500/20 text-xs font-bold text-indigo-200 ring-1 ring-white/10">
                                  {getInitials(
                                    name,
                                  )}
                                </div>
                              )}

                              {unread >
                                0 && (
                                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#080b18] bg-indigo-500 px-1 text-[9px] font-bold text-white">
                                  {unread >
                                  9
                                    ? "9+"
                                    : unread}
                                </span>
                              )}
                            </div>

                            {/* Content */}

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <p
                                  className={`truncate text-sm ${
                                    unread >
                                    0
                                      ? "font-semibold text-white"
                                      : "font-medium text-slate-300"
                                  }`}
                                >
                                  {name}
                                </p>

                                <span className="shrink-0 text-[10px] text-slate-600">
                                  {formatConversationTime(
                                    lastMessage?.createdAt ||
                                      conversation.updatedAt,
                                  )}
                                </span>
                              </div>

                              <p className="mt-0.5 truncate text-[11px] text-indigo-300/70">
                                {getJobTitle(
                                  conversation,
                                )}
                              </p>

                              <p
                                className={`mt-1 truncate text-xs ${
                                  unread >
                                  0
                                    ? "text-slate-300"
                                    : "text-slate-600"
                                }`}
                              >
                                {lastMessage?.content ||
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
          </aside>

          {/* =================================================
              CHAT PANEL
          ================================================== */}

          <section
            className={`absolute inset-0 z-30 flex flex-col bg-[#070a17]/90 transition-transform duration-300 lg:relative lg:z-auto lg:translate-x-0 ${
              mobileConversationOpen
                ? "translate-x-0"
                : "translate-x-full lg:translate-x-0"
            }`}
          >
            {selectedConversation ? (
              <>
                {/* =================================================
                    CHAT HEADER
                ================================================== */}

                <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-white/[0.015] px-4 py-3 sm:px-5">
                  <div className="flex min-w-0 items-center gap-3">
                    {/* Mobile back */}

                    <button
                      type="button"
                      onClick={() =>
                        setMobileConversationOpen(
                          false,
                        )
                      }
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition hover:text-white lg:hidden"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>

                    {/* Avatar */}

                    {candidateImage ? (
                      <img
                        src={
                          candidateImage
                        }
                        alt={
                          candidateName
                        }
                        className="h-11 w-11 shrink-0 rounded-xl object-cover ring-1 ring-white/10"
                      />
                    ) : (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/30 to-cyan-500/20 text-sm font-bold text-indigo-200 ring-1 ring-white/10">
                        {getInitials(
                          candidateName,
                        )}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="truncate text-sm font-semibold text-white sm:text-base">
                          {candidateName}
                        </h2>

                        <span className="hidden items-center gap-1 rounded-full border border-emerald-400/15 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-emerald-300 sm:inline-flex">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

                          Candidate
                        </span>
                      </div>

                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {getJobTitle(
                          selectedConversation,
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {conversationLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin text-indigo-300" />
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        setMobileConversationOpen(
                          false,
                        )
                      }
                      className="hidden h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-white/[0.05] hover:text-white lg:flex"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* =================================================
                    JOB CONTEXT BAR
                ================================================== */}

                <div className="flex shrink-0 items-center gap-3 border-b border-white/5 bg-indigo-500/[0.025] px-4 py-2.5 sm:px-5">
                  <BriefcaseBusiness className="h-4 w-4 text-indigo-300" />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-slate-300">
                      {currentJob?.title ||
                        "Job Application"}
                    </p>

                    {currentJob?.location && (
                      <p className="mt-0.5 flex items-center gap-1 text-[10px] text-slate-600">
                        <MapPin className="h-3 w-3" />

                        {currentJob.location}
                      </p>
                    )}
                  </div>

                  <Link
                    href={`/recruiter/applications/${selectedConversation.jobApplicationId}`}
                    className="hidden items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-[10px] font-medium text-slate-400 transition hover:bg-white/[0.07] hover:text-white sm:inline-flex"
                  >
                    View Application

                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>

                {/* =================================================
                    MESSAGES
                ================================================== */}

                <div className="relative flex-1 overflow-y-auto">
                  <div className="pointer-events-none absolute inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.2)_1px,transparent_1px)] [background-size:40px_40px]" />

                  <div className="relative mx-auto flex min-h-full max-w-4xl flex-col justify-end px-4 py-6 sm:px-6">
                    {/* Conversation started */}

                    <div className="mb-8 flex items-center gap-3">
                      <div className="h-px flex-1 bg-white/5" />

                      <span className="flex items-center gap-1.5 rounded-full border border-white/5 bg-white/[0.025] px-3 py-1 text-[10px] text-slate-600">
                        <Clock3 className="h-3 w-3" />

                        Conversation started{" "}

                        {formatDate(
                          selectedConversation.createdAt,
                        )}
                      </span>

                      <div className="h-px flex-1 bg-white/5" />
                    </div>

                    {selectedConversation.messages
                      ?.length ? (
                      <motion.div
                        variants={
                          containerVariants
                        }
                        initial="hidden"
                        animate="visible"
                        className="space-y-4"
                      >
                        {selectedConversation.messages.map(
                          (
                            message,
                          ) => {
                            const isAutomatic =
                              Boolean(
                                message.isAutomatic,
                              );

                            const participant =
                              selectedConversation.participants?.find(
                                (
                                  item,
                                ) =>
                                  item.userId ===
                                  message.senderId,
                              );

                            const senderName =
                              message
                                .sender
                                ?.name ||
                              participant
                                ?.user
                                ?.name ||
                              "";

                            const senderEmail =
                              participant
                                ?.user
                                ?.email ||
                              "";

                            const isCandidate =
                              Boolean(
                                senderEmail &&
                                  senderEmail ===
                                    candidateEmail,
                              );

                            return (
                              <motion.div
                                key={
                                  message.id
                                }
                                variants={
                                  messageVariants
                                }
                                className={`flex ${
                                  isCandidate
                                    ? "justify-start"
                                    : "justify-end"
                                }`}
                              >
                                <div
                                  className={`max-w-[85%] sm:max-w-[70%] ${
                                    isAutomatic
                                      ? "w-full max-w-2xl sm:max-w-2xl"
                                      : ""
                                  }`}
                                >
                                  {isAutomatic ? (
                                    <div className="rounded-2xl border border-indigo-400/15 bg-indigo-500/[0.06] p-4">
                                      <div className="mb-2 flex items-center gap-2">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300">
                                          <Sparkles className="h-3.5 w-3.5" />
                                        </div>

                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-300">
                                          Automated Message
                                        </span>
                                      </div>

                                      <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">
                                        {
                                          message.content
                                        }
                                      </p>
                                    </div>
                                  ) : (
                                    <div
                                      className={`rounded-2xl border px-4 py-3 ${
                                        isCandidate
                                          ? "rounded-tl-md border-white/10 bg-white/[0.045] text-slate-200"
                                          : "rounded-tr-md border-indigo-400/15 bg-indigo-500/15 text-indigo-50"
                                      }`}
                                    >
                                      <p className="whitespace-pre-wrap text-sm leading-6">
                                        {
                                          message.content
                                        }
                                      </p>
                                    </div>
                                  )}

                                  <div
                                    className={`mt-1.5 flex items-center gap-2 text-[10px] text-slate-600 ${
                                      isCandidate
                                        ? "justify-start"
                                        : "justify-end"
                                    }`}
                                  >
                                    <span>
                                      {senderName &&
                                        `${senderName} · `}

                                      {formatTime(
                                        message.createdAt,
                                      )}
                                    </span>

                                    {!isCandidate &&
                                      !isAutomatic &&
                                      (message.readAt ? (
                                        <CheckCheck className="h-3 w-3 text-indigo-400" />
                                      ) : (
                                        <Check className="h-3 w-3" />
                                      ))}
                                  </div>
                                </div>
                              </motion.div>
                            );
                          },
                        )}
                      </motion.div>
                    ) : (
                      <div className="flex flex-1 items-center justify-center py-20">
                        <div className="text-center">
                          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04] text-slate-600">
                            <MessageCircle className="h-6 w-6" />
                          </div>

                          <p className="mt-4 text-sm font-medium text-slate-400">
                            No messages yet
                          </p>

                          <p className="mt-1 text-xs text-slate-600">
                            This conversation hasn't started yet.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* =================================================
                    MESSAGE INPUT
                ================================================== */}

                <div className="shrink-0 border-t border-white/10 bg-[#080b18]/90 p-3 sm:p-4">
                  <div className="mx-auto max-w-4xl">
                    <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/[0.025] p-2 transition focus-within:border-indigo-400/25 focus-within:bg-white/[0.04]">
                      <textarea
                        disabled
                        rows={1}
                        placeholder="Messaging is ready for your send-message endpoint..."
                        className="min-h-11 flex-1 resize-none bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600"
                      />

                      <button
                        type="button"
                        disabled
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/30 text-indigo-300 opacity-70"
                        title="Send message"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="mt-2 px-2 text-[10px] text-slate-700">
                      Message sending will connect here when your POST message endpoint is available.
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <EmptyMessages search="" />
            )}
          </section>

          {/* =================================================
              RIGHT INFORMATION PANEL
          ================================================== */}

          <aside className="hidden w-[300px] shrink-0 overflow-y-auto border-l border-white/10 bg-[#080b18]/60 xl:block">
            {selectedConversation ? (
              <div className="p-5">
                {/* Profile */}

                <div className="text-center">
                  {candidateImage ? (
                    <img
                      src={
                        candidateImage
                      }
                      alt={
                        candidateName
                      }
                      className="mx-auto h-20 w-20 rounded-3xl object-cover ring-1 ring-white/10"
                    />
                  ) : (
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500/30 to-cyan-500/20 text-xl font-bold text-indigo-200 ring-1 ring-white/10">
                      {getInitials(
                        candidateName,
                      )}
                    </div>
                  )}

                  <h3 className="mt-4 truncate text-base font-semibold text-white">
                    {candidateName}
                  </h3>

                  {candidateEmail && (
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {candidateEmail}
                    </p>
                  )}

                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    Candidate for{" "}
                    <span className="text-indigo-300">
                      {getJobTitle(
                        selectedConversation,
                      )}
                    </span>
                  </p>
                </div>

                <div className="my-5 h-px bg-white/5" />

                {/* Candidate details */}

                <div className="space-y-4">
                  {candidateLocation && (
                    <InfoRow
                      icon={MapPin}
                      label="Location"
                    >
                      {
                        candidateLocation
                      }
                    </InfoRow>
                  )}

                  {candidatePhone && (
                    <InfoRow
                      icon={MessageCircle}
                      label="Phone"
                    >
                      {
                        candidatePhone
                      }
                    </InfoRow>
                  )}

                  <InfoRow
                    icon={
                      BriefcaseBusiness
                    }
                    label="Position"
                  >
                    {getJobTitle(
                      selectedConversation,
                    )}
                  </InfoRow>
                </div>

                {/* Skills */}

                <div className="mt-7">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Skills
                    </h3>

                    <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                  </div>

                  {candidateSkills.length >
                  0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {candidateSkills
                        .slice(
                          0,
                          12,
                        )
                        .map(
                          (
                            skill,
                          ) => (
                            <span
                              key={
                                skill
                              }
                              className="rounded-lg border border-white/10 bg-white/[0.035] px-2.5 py-1.5 text-[10px] text-slate-300"
                            >
                              {
                                skill
                              }
                            </span>
                          ),
                        )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-600">
                      No skills available.
                    </p>
                  )}
                </div>

                {/* Job */}

                <div className="mt-7">
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Job
                  </h3>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
                        <BriefcaseBusiness className="h-4 w-4" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white">
                          {currentJob?.title ||
                            "Job Application"}
                        </p>

                        {currentJob
                          ?.company
                          ?.name && (
                          <p className="mt-1 text-xs text-slate-500">
                            {
                              currentJob
                                .company
                                .name
                            }
                          </p>
                        )}

                        {currentJob?.location && (
                          <p className="mt-2 flex items-center gap-1 text-[10px] text-slate-600">
                            <MapPin className="h-3 w-3" />

                            {
                              currentJob.location
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Links */}

                {(candidateEmail ||
                  candidateLinkedin ||
                  candidateGithub ||
                  candidatePortfolio) && (
                  <div className="mt-7">
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Candidate Links
                    </h3>

                    <div className="space-y-2">
                      {candidateEmail && (
                        <a
                          href={`mailto:${candidateEmail}`}
                          className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2.5 text-xs text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
                        >
                          <Mail className="h-4 w-4" />

                          Email

                          <ExternalLink className="ml-auto h-3 w-3" />
                        </a>
                      )}

                      {candidateLinkedin && (
                        <a
                          href={
                            candidateLinkedin
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2.5 text-xs text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
                        >
                          <FaLinkedin className="h-4 w-4" />

                          LinkedIn

                          <ExternalLink className="ml-auto h-3 w-3" />
                        </a>
                      )}

                      {candidateGithub && (
                        <a
                          href={
                            candidateGithub
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2.5 text-xs text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
                        >
                          <FaGithub className="h-4 w-4" />

                          GitHub

                          <ExternalLink className="ml-auto h-3 w-3" />
                        </a>
                      )}

                      {candidatePortfolio && (
                        <a
                          href={
                            candidatePortfolio
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2.5 text-xs text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
                        >
                          <Globe2 className="h-4 w-4" />

                          Portfolio

                          <ExternalLink className="ml-auto h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Application */}

                <div className="mt-7">
                  <Link
                    href={`/recruiter/applications/${selectedConversation.jobApplicationId}`}
                    className="group flex w-full items-center justify-between rounded-xl border border-indigo-400/15 bg-indigo-500/[0.06] px-4 py-3 text-xs font-medium text-indigo-300 transition hover:border-indigo-400/30 hover:bg-indigo-500/10"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />

                      View Application
                    </span>

                    <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center p-6 text-center">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] text-slate-600">
                    <UserRound className="h-5 w-5" />
                  </div>

                  <p className="mt-4 text-xs text-slate-600">
                    Select a conversation
                  </p>
                </div>
              </div>
            )}
          </aside>
        </motion.div>
      </div>
    </motion.main>
  );
}