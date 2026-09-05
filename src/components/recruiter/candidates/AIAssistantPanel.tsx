
"use client";

import { useState } from "react";
import { motion } from "motion/react";
import {
  Bot,
  Loader2,
  Send,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { apiClient } from "@/lib/api/client";

import type { RecruiterAssistantResponse } from "@/lib/api/candidates";

interface AIAssistantPanelProps {
  jobId: string;
  onResults?: (
    response: RecruiterAssistantResponse,
  ) => void;
}

const suggestions = [
  "Show me the best 5 candidates",
  "Find candidates with strong React skills",
  "Who has the best overall match?",
  "Find candidates with 3+ years experience",
];

export default function AIAssistantPanel({
  jobId,
  onResults,
}: AIAssistantPanelProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");

  async function handleAsk() {
    const cleanQuery = query.trim();

    if (!cleanQuery || !jobId || loading) {
      return;
    }

    try {
      setLoading(true);
      setAnswer("");

      /*
       * =====================================================
       * AI RECRUITER ASSISTANT API
       *
       * POST /api/v1/ai-recruiter/assistant
       * =====================================================
       */

      const response =
        await apiClient<{
          success?: boolean;
          message?: string;
          data?: RecruiterAssistantResponse;
        }>(
          "/api/v1/ai-recruiter/assistant",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              jobId,
              query: cleanQuery,
              limit: 5,
            }),
          },
        );

      /*
       * =====================================================
       * UNWRAP API RESPONSE
       * =====================================================
       *
       * Expected backend response:
       *
       * {
       *   success: true,
       *   message: "...",
       *   data: {
       *     answer: "...",
       *     matches: [...]
       *   }
       * }
       */

      const data =
        response?.data ?? {};

      /*
       * =====================================================
       * AI ANSWER
       * =====================================================
       */

      const text =
        data.answer ??
        data.response ??
        data.message ??
        "The AI assistant returned results.";

      setAnswer(text);

      /*
       * =====================================================
       * SEND RESULTS BACK TO PARENT
       * =====================================================
       *
       * CandidatesPage receives this through:
       *
       * onResults={handleAssistantResults}
       *
       * This allows the candidate list to update using
       * the AI-generated candidate matches.
       */

      onResults?.(data);
    } catch (error) {
      console.error(
        "AI recruiter assistant error:",
        error,
      );

      setAnswer(
        "Unable to get an AI recommendation right now. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="
        relative
        overflow-hidden
        rounded-2xl
        border
        border-primary/20
        bg-background/85
        p-5
        shadow-sm
        backdrop-blur-xl
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          -right-20
          -top-20
          h-48
          w-48
          rounded-full
          bg-primary/15
          blur-3xl
        "
      />

      <div className="relative">
        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="flex items-start gap-3">
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-primary/10
              text-primary
            "
          >
            <Bot className="h-5 w-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold">
                AI Recruiter Assistant
              </h2>

              <span
                className="
                  rounded-full
                  bg-primary/10
                  px-2
                  py-0.5
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-wider
                  text-primary
                "
              >
                AI
              </span>
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Ask AI to find and rank candidates for
              the selected job.
            </p>
          </div>
        </div>

        {/* ===================================================
            SUGGESTIONS
        =================================================== */}

        <div className="mt-4 flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() =>
                setQuery(
                  `${suggestion} for this position`,
                )
              }
              className="
                rounded-lg
                border
                border-border/60
                bg-muted/30
                px-3
                py-1.5
                text-xs
                text-muted-foreground
                transition-colors
                hover:bg-primary/10
                hover:text-foreground
              "
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* ===================================================
            QUERY
        =================================================== */}

        <div className="mt-4">
          <Textarea
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="
              Ask something like: Show me the best 5
              candidates for this React developer position
            "
            className="
              min-h-24
              resize-none
              rounded-xl
            "
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                (event.ctrlKey ||
                  event.metaKey)
              ) {
                event.preventDefault();

                void handleAsk();
              }
            }}
          />
        </div>

        {/* ===================================================
            ASK BUTTON
        =================================================== */}

        <div className="mt-3 flex justify-end">
          <Button
            type="button"
            onClick={handleAsk}
            disabled={
              loading ||
              !query.trim() ||
              !jobId
            }
            className="rounded-xl"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Thinking...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Ask AI
              </>
            )}
          </Button>
        </div>

        {/* ===================================================
            AI ANSWER
        =================================================== */}

        {answer && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            className="
              mt-4
              rounded-xl
              border
              border-primary/10
              bg-primary/5
              p-4
            "
          >
            <div
              className="
                mb-2
                flex
                items-center
                gap-2
                text-xs
                font-semibold
                text-primary
              "
            >
              <WandSparkles className="h-3.5 w-3.5" />
              AI Recommendation
            </div>

            <p
              className="
                whitespace-pre-wrap
                text-sm
                leading-6
                text-muted-foreground
              "
            >
              {answer}
            </p>
          </motion.div>
        )}

        {/* ===================================================
            SHORTCUT
        =================================================== */}

        {!answer && (
          <p
            className="
              mt-3
              flex
              items-center
              justify-end
              gap-1
              text-[11px]
              text-muted-foreground
            "
          >
            <Sparkles className="h-3 w-3" />
            Ctrl + Enter to ask
          </p>
        )}
      </div>
    </motion.section>
  );
}
