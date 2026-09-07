"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCheck,
  ChevronRight,
  CircleAlert,
  Loader2,
  MessageCircle,
  MoreVertical,
  Search,
  Send,
  Sparkles,
  UserRound,
} from "lucide-react";

import ParticleWave from "@/components/ui/particle-wave";


/* =========================================================
   TYPES
========================================================= */

interface User {
  id: string;
  name: string | null;
  email?: string | null;
  image?: string | null;
}

interface Company {
  id: string;
  name: string;
  description?: string | null;
  website?: string | null;
}

interface Job {
  id: string;
  title: string;
  company?: Company | null;
}

interface JobApplication {
  id: string;
  status?: string;
  job?: Job | null;
}

interface ConversationParticipant {
  id: string;
  conversationId: string;
  userId: string;
  user: User;
  joinedAt: string;
}

interface LastMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isAutomatic: boolean;
  createdAt: string;
  updatedAt: string;
  sender: User;
}

interface Conversation {
  id: string;
  jobApplicationId: string | null;
  createdAt: string;
  updatedAt: string;
  jobApplication: JobApplication | null;
  participants: ConversationParticipant[];
  messages: LastMessage[];
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isAutomatic: boolean;
  createdAt: string;
  updatedAt: string;
  sender: User;
}

interface ConversationDetails extends Conversation {
  messages: Message[];
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}


/* =========================================================
   API
========================================================= */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000/api/v1";

async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers ?? {}),
      },
    },
  );

  const result =
    (await response.json()) as ApiResponse<T>;

  if (!response.ok || !result.success) {
    throw new Error(
      result.message ??
        "Something went wrong",
    );
  }

  return result.data;
}


/* =========================================================
   HELPERS
========================================================= */

function getInitials(
  name?: string | null,
): string {
  if (!name) {
    return "U";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function formatMessageTime(
  date: string,
): string {
  const messageDate = new Date(date);

  return messageDate.toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );
}

function formatConversationTime(
  date: string,
): string {
  const messageDate = new Date(date);
  const now = new Date();

  const sameDay =
    messageDate.toDateString() ===
    now.toDateString();

  if (sameDay) {
    return messageDate.toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      },
    );
  }

  return messageDate.toLocaleDateString(
    [],
    {
      month: "short",
      day: "numeric",
    },
  );
}


/* =========================================================
   PAGE
========================================================= */

export default function CandidateMessagePage() {
  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  const [
    selectedConversation,
    setSelectedConversation,
  ] =
    useState<ConversationDetails | null>(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [conversationLoading, setConversationLoading] =
    useState(false);

  const [sending, setSending] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [showMobileChat, setShowMobileChat] =
    useState(false);


  /* =======================================================
     LOAD CONVERSATIONS
  ======================================================= */

  const loadConversations =
    useCallback(async () => {
      try {
        setLoading(true);
        setError(null);

        const data =
          await apiRequest<{
            conversations: Conversation[];
          }>("/conversations/candidate");

        setConversations(
          data.conversations ?? [],
        );
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load conversations";

        setError(message);
      } finally {
        setLoading(false);
      }
    }, []);


  /* =======================================================
     LOAD SELECTED CONVERSATION
  ======================================================= */

  const loadConversation =
    useCallback(
      async (
        conversation: Conversation,
      ) => {
        if (!conversation.jobApplicationId) {
          return;
        }

        try {
          setConversationLoading(true);
          setError(null);

          const data =
            await apiRequest<ConversationDetails>(
              `/conversations/applications/${conversation.jobApplicationId}`,
            );

          setSelectedConversation(data);
          setShowMobileChat(true);
        } catch (err) {
          const message =
            err instanceof Error
              ? err.message
              : "Failed to load conversation";

          setError(message);
        } finally {
          setConversationLoading(false);
        }
      },
      [],
    );


  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    void loadConversations();
  }, [loadConversations]);


  /* =======================================================
     FILTER
  ======================================================= */

  const filteredConversations =
    useMemo(() => {
      const normalized =
        searchTerm
          .trim()
          .toLowerCase();

      if (!normalized) {
        return conversations;
      }

      return conversations.filter(
        (conversation) => {
          const jobTitle =
            conversation.jobApplication
              ?.job?.title ?? "";

          const companyName =
            conversation.jobApplication
              ?.job?.company?.name ?? "";

          return (
            jobTitle
              .toLowerCase()
              .includes(normalized) ||
            companyName
              .toLowerCase()
              .includes(normalized)
          );
        },
      );
    }, [
      conversations,
      searchTerm,
    ]);


  /* =======================================================
     SEND MESSAGE
  ======================================================= */

  const handleSendMessage =
    async () => {
      const content =
        message.trim();

      if (
        !content ||
        !selectedConversation ||
        !selectedConversation.jobApplicationId ||
        sending
      ) {
        return;
      }

      try {
        setSending(true);
        setError(null);

        const data =
          await apiRequest<Message>(
            `/conversations/applications/${selectedConversation.jobApplicationId}/messages`,
            {
              method: "POST",
              body: JSON.stringify({
                content,
              }),
            },
          );

        setSelectedConversation(
          (previous) => {
            if (!previous) {
              return previous;
            }

            return {
              ...previous,
              messages: [
                ...previous.messages,
                data,
              ],
              updatedAt:
                data.createdAt,
            };
          },
        );

        setMessage("");

        await loadConversations();
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to send message";

        setError(message);
      } finally {
        setSending(false);
      }
    };


  /* =======================================================
     ENTER TO SEND
  ======================================================= */

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      void handleSendMessage();
    }
  };


  /* =======================================================
     CURRENT COMPANY
  ======================================================= */

  const company =
    selectedConversation
      ?.jobApplication?.job?.company;

  const job =
    selectedConversation
      ?.jobApplication?.job;


  /* =======================================================
     UI
  ======================================================= */

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* =====================================================
          PARTICLE WAVE BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 -z-10 opacity-40">
        <ParticleWave />
      </div>

      {/* =====================================================
          DARK OVERLAY
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 -z-10 bg-slate-950/70" />

      {/* =====================================================
          SOFT GLOWS
      ===================================================== */}

      <div className="pointer-events-none fixed left-[-10%] top-[-10%] -z-10 h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="pointer-events-none fixed bottom-[-10%] right-[-10%] -z-10 h-[450px] w-[450px] rounded-full bg-blue-500/10 blur-[140px]" />


      {/* =====================================================
          MAIN CONTAINER
      ===================================================== */}

      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-4 py-4 sm:px-6 lg:px-8">

        {/* ===================================================
            HEADER
        =================================================== */}

        <header className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 shadow-2xl backdrop-blur-xl">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 ring-1 ring-cyan-400/20">
              <MessageCircle
                className="h-5 w-5 text-cyan-300"
              />
            </div>

            <div>
              <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
                Messages
              </h1>

              <p className="hidden text-xs text-slate-400 sm:block">
                Communicate with recruiters about your applications
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-300 sm:flex">
            <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
            Candidate inbox
          </div>
        </header>


        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            <CircleAlert className="h-4 w-4 shrink-0" />

            <span className="flex-1">
              {error}
            </span>

            <button
              type="button"
              onClick={() => {
                setError(null);
              }}
              className="text-xs text-red-300 transition hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}


        {/* ===================================================
            MESSAGING AREA
        =================================================== */}

        <section className="grid min-h-[calc(100vh-120px)] flex-1 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 shadow-2xl backdrop-blur-2xl lg:grid-cols-[360px_minmax(0,1fr)]">

          {/* =================================================
              CONVERSATION SIDEBAR
          ================================================= */}

          <aside
            className={`${
              showMobileChat
                ? "hidden lg:flex"
                : "flex"
            } min-h-0 flex-col border-r border-white/10 bg-black/10`}
          >

            {/* Search */}

            <div className="border-b border-white/10 p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                <input
                  value={searchTerm}
                  onChange={(event) => {
                    setSearchTerm(
                      event.target.value,
                    );
                  }}
                  placeholder="Search conversations..."
                  className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-9 pr-3 text-sm text-white outline-none placeholder:text-slate-500 transition focus:border-cyan-400/40 focus:bg-white/[0.06]"
                />
              </div>
            </div>


            {/* Conversation list */}

            <div className="min-h-0 flex-1 overflow-y-auto p-2">

              {loading ? (
                <div className="flex h-full items-center justify-center">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading conversations...
                  </div>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                    <MessageCircle className="h-6 w-6 text-slate-500" />
                  </div>

                  <h3 className="text-sm font-medium text-slate-300">
                    No conversations
                  </h3>

                  <p className="mt-1 max-w-[240px] text-xs leading-5 text-slate-500">
                    Your recruiter conversations will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredConversations.map(
                    (conversation) => {
                      const conversationJob =
                        conversation.jobApplication
                          ?.job;

                      const conversationCompany =
                        conversationJob?.company;

                      const lastMessage =
                        conversation.messages[0];

                      const isSelected =
                        selectedConversation?.id ===
                        conversation.id;

                      return (
                        <button
                          key={conversation.id}
                          type="button"
                          onClick={() => {
                            void loadConversation(
                              conversation,
                            );
                          }}
                          className={`group w-full rounded-xl p-3 text-left transition ${
                            isSelected
                              ? "bg-cyan-500/10 ring-1 ring-cyan-400/20"
                              : "hover:bg-white/[0.04]"
                          }`}
                        >
                          <div className="flex gap-3">

                            {/* Company avatar */}

                            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900">
                              <Building2 className="h-5 w-5 text-cyan-300" />

                              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-900 bg-emerald-400" />
                            </div>


                            <div className="min-w-0 flex-1">

                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-medium text-slate-100">
                                    {conversationCompany?.name ??
                                      "Company"}
                                  </p>

                                  <p className="mt-0.5 truncate text-xs text-cyan-300/80">
                                    {conversationJob?.title ??
                                      "Job application"}
                                  </p>
                                </div>

                                {lastMessage && (
                                  <span className="shrink-0 text-[10px] text-slate-500">
                                    {formatConversationTime(
                                      lastMessage.createdAt,
                                    )}
                                  </span>
                                )}
                              </div>


                              <div className="mt-2 flex items-center gap-2">
                                <p className="line-clamp-1 flex-1 text-xs text-slate-500">
                                  {lastMessage?.content ??
                                    "Start a conversation"}
                                </p>

                                <ChevronRight
                                  className={`h-3.5 w-3.5 shrink-0 transition ${
                                    isSelected
                                      ? "text-cyan-300"
                                      : "text-slate-700 group-hover:text-slate-400"
                                  }`}
                                />
                              </div>

                            </div>
                          </div>
                        </button>
                      );
                    },
                  )}
                </div>
              )}
            </div>
          </aside>


          {/* =================================================
              CHAT AREA
          ================================================= */}

          <section
            className={`${
              showMobileChat
                ? "flex"
                : "hidden lg:flex"
            } min-h-0 min-w-0 flex-1 flex-col`}
          >

            {conversationLoading ? (
              <div className="flex flex-1 items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10">
                    <Loader2 className="h-5 w-5 animate-spin text-cyan-300" />
                  </div>

                  <p className="text-sm text-slate-400">
                    Loading conversation...
                  </p>
                </div>
              </div>
            ) : !selectedConversation ? (

              /* =============================================
                 EMPTY CHAT
              ============================================= */

              <div className="flex flex-1 items-center justify-center p-6">
                <div className="max-w-md text-center">

                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-cyan-400/10 bg-cyan-400/5 shadow-[0_0_80px_rgba(34,211,238,0.08)]">
                    <MessageCircle className="h-9 w-9 text-cyan-300/80" />
                  </div>

                  <h2 className="text-xl font-semibold text-white">
                    Your conversations
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Select a conversation to communicate with a recruiter about your job application.
                  </p>

                  <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-600">
                    <CheckCheck className="h-4 w-4" />
                    Secure candidate messaging
                  </div>
                </div>
              </div>

            ) : (

              /* =============================================
                 ACTIVE CHAT
              ============================================= */

              <>
                {/* =========================================
                    CHAT HEADER
                ========================================= */}

                <header className="flex shrink-0 items-center justify-between border-b border-white/10 bg-white/[0.025] px-4 py-3 sm:px-5">

                  <div className="flex min-w-0 items-center gap-3">

                    <button
                      type="button"
                      onClick={() => {
                        setShowMobileChat(false);
                      }}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-400 transition hover:bg-white/[0.08] hover:text-white lg:hidden"
                      aria-label="Back to conversations"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/10 bg-cyan-400/10">
                      <Building2 className="h-5 w-5 text-cyan-300" />
                    </div>

                    <div className="min-w-0">
                      <h2 className="truncate text-sm font-semibold text-white">
                        {company?.name ??
                          "Company"}
                      </h2>

                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="truncate text-xs text-slate-500">
                          {job?.title ??
                            "Job application"}
                        </span>

                        <span className="h-1 w-1 shrink-0 rounded-full bg-emerald-400" />

                        <span className="shrink-0 text-xs text-emerald-400">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/[0.05] hover:text-white"
                    aria-label="Conversation options"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </header>


                {/* =========================================
                    APPLICATION INFO
                ========================================= */}

                <div className="border-b border-white/[0.06] px-4 py-3 sm:px-5">
                  <div className="flex flex-wrap items-center gap-2">

                    <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-slate-400">
                      <CalendarDays className="h-3.5 w-3.5 text-cyan-300" />
                      Application conversation
                    </div>

                    {selectedConversation.jobApplication?.status && (
                      <div className="rounded-full border border-emerald-400/10 bg-emerald-400/5 px-3 py-1.5 text-[11px] text-emerald-300">
                        {selectedConversation.jobApplication.status}
                      </div>
                    )}
                  </div>
                </div>


                {/* =========================================
                    MESSAGES
                ========================================= */}

                <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">

                  {selectedConversation.messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                          <MessageCircle className="h-6 w-6 text-slate-500" />
                        </div>

                        <p className="text-sm font-medium text-slate-300">
                          No messages yet
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Send a message to start the conversation.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="mx-auto flex max-w-4xl flex-col gap-4">

                      {selectedConversation.messages.map(
                        (item) => {
                          /*
                           * We don't know the candidate userId
                           * directly on the page.
                           *
                           * Because the API returns sender data,
                           * the participant list is used to determine
                           * whether this is the candidate.
                           */

                          const candidateParticipant =
                            selectedConversation.participants.find(
                              (participant) =>
                                participant.user.email ===
                                selectedConversation
                                  .jobApplication
                                  ?.candidateProfile?.user?.email,
                            );

                          const isCandidate =
                            candidateParticipant?.userId ===
                            item.senderId;

                          return (
                            <div
                              key={item.id}
                              className={`flex items-end gap-2 ${
                                isCandidate
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >

                              {!isCandidate && (
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-slate-800">
                                  <Building2 className="h-4 w-4 text-cyan-300" />
                                </div>
                              )}

                              <div
                                className={`max-w-[82%] sm:max-w-[70%] ${
                                  isCandidate
                                    ? "items-end"
                                    : "items-start"
                                } flex flex-col`}
                              >
                                <div
                                  className={`rounded-2xl px-4 py-3 text-sm leading-6 shadow-lg ${
                                    isCandidate
                                      ? "rounded-br-md bg-cyan-500 text-slate-950"
                                      : "rounded-bl-md border border-white/10 bg-white/[0.055] text-slate-200"
                                  }`}
                                >
                                  {item.content}
                                </div>

                                <div
                                  className={`mt-1.5 flex items-center gap-1.5 text-[10px] ${
                                    isCandidate
                                      ? "text-slate-600"
                                      : "text-slate-600"
                                  }`}
                                >
                                  <span>
                                    {formatMessageTime(
                                      item.createdAt,
                                    )}
                                  </span>

                                  {isCandidate && (
                                    <CheckCheck className="h-3 w-3" />
                                  )}
                                </div>
                              </div>

                              {isCandidate && (
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/10">
                                  <UserRound className="h-4 w-4 text-cyan-300" />
                                </div>
                              )}
                            </div>
                          );
                        },
                      )}
                    </div>
                  )}
                </div>


                {/* =========================================
                    COMPOSER
                ========================================= */}

                <div className="shrink-0 border-t border-white/10 bg-black/10 p-3 sm:p-4">

                  <div className="mx-auto flex max-w-4xl items-end gap-2 rounded-2xl border border-white/10 bg-white/[0.035] p-2 shadow-xl backdrop-blur-xl">

                    <textarea
                      value={message}
                      onChange={(event) => {
                        setMessage(
                          event.target.value,
                        );
                      }}
                      onKeyDown={
                        handleKeyDown
                      }
                      disabled={sending}
                      rows={1}
                      placeholder="Write a message..."
                      className="max-h-32 min-h-[42px] flex-1 resize-none bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        void handleSendMessage();
                      }}
                      disabled={
                        sending ||
                        !message.trim()
                      }
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/10 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Send message"
                    >
                      {sending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <p className="mx-auto mt-2 max-w-4xl px-2 text-[10px] text-slate-600">
                    Press Enter to send · Shift + Enter for a new line
                  </p>
                </div>
              </>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}