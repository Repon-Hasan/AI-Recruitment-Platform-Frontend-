"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Send,
  MessageCircle,
  Sparkles,
} from "lucide-react";

import { motion } from "motion/react";

import {
  interviewApi,
  type Conversation,
  type Message,
} from "@/lib/api/interview";

interface Props {
  applicationId: string;
  currentUserId: string;
}

export default function ApplicationConversation({
  applicationId,
  currentUserId,
}: Props) {
  const [conversation, setConversation] =
    useState<Conversation | null>(null);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  const bottomRef =
    useRef<HTMLDivElement | null>(null);

  const loadConversation =
    useCallback(async () => {
      try {
        const data =
          await interviewApi.getConversation(
            applicationId,
          );

        setConversation(data);
      } catch (error) {
        console.error(
          "Failed to load conversation",
          error,
        );
      } finally {
        setLoading(false);
      }
    }, [applicationId]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadConversation();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadConversation]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [conversation?.messages.length]);

  async function handleSend() {
    const content =
      message.trim();

    if (!content || sending) {
      return;
    }

    setSending(true);

    try {
      const created =
        await interviewApi.sendMessage(
          applicationId,
          content,
        );

      setConversation(
        (current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,
            messages: [
              ...current.messages,
              created,
            ],
          };
        },
      );

      setMessage("");
    } catch (error) {
      console.error(
        "Failed to send message",
        error,
      );
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      void handleSend();
    }
  }

  if (loading) {
    return (
      <div className="flex h-[500px] items-center justify-center rounded-3xl border border-white/10 bg-white/[0.02]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-violet-500" />
      </div>
    );
  }

  return (
    <div className="flex h-[600px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 shadow-2xl backdrop-blur-xl">
      <div className="border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-violet-500/10 p-2">
            <MessageCircle className="h-5 w-5 text-violet-400" />
          </div>

          <div>
            <h3 className="font-semibold text-white">
              Application Conversation
            </h3>

            <p className="text-xs text-slate-500">
              Private conversation for this application
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {conversation?.messages.map(
          (
            item: Message,
          ) => {
            const mine =
              item.senderId ===
              currentUserId;

            return (
              <motion.div
                key={item.id}
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className={`flex ${
                  mine
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    mine
                      ? "rounded-br-md bg-violet-600 text-white"
                      : "rounded-bl-md bg-white/5 text-slate-200"
                  }`}
                >
                  {item.isAutomatic && (
                    <div className="mb-2 flex items-center gap-1 text-[10px] uppercase tracking-wider opacity-60">
                      <Sparkles className="h-3 w-3" />
                      System
                    </div>
                  )}

                  <p className="whitespace-pre-wrap text-sm leading-6">
                    {item.content}
                  </p>

                  <p className="mt-1 text-[10px] opacity-50">
                    {new Date(
                      item.createdAt,
                    ).toLocaleString()}
                  </p>
                </div>
              </motion.div>
            );
          },
        )}

        <div ref={bottomRef} />
      </div>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-end gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-2">
          <textarea
            value={message}
            onChange={(event) =>
              setMessage(
                event.target.value,
              )
            }
            onKeyDown={handleKeyDown}
            rows={2}
            placeholder="Write a message..."
            className="max-h-32 flex-1 resize-none bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-slate-600"
          />

          <button
            onClick={() => void handleSend()}
            disabled={
              !message.trim() ||
              sending
            }
            className="rounded-xl bg-violet-600 p-3 text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-2 text-center text-[10px] text-slate-600">
          Press Enter to send · Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}