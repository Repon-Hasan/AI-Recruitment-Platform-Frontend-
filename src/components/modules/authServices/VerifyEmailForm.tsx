"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, CheckCircle2, Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { verifyEmailAction } from "@/app/(common)/(authServices)/verify-email/_action";

interface VerifyEmailFormProps {
  email: string;
  redirectPath?: string;
}

export default function VerifyEmailForm({ email, redirectPath }: VerifyEmailFormProps) {
  const router = useRouter();
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const updateCode = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[index] = digit;
    setCode(next);
    setError(null);
    if (digit && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !code[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const otp = code.join("");
    if (otp.length !== 6) {
      setError("Enter the complete 6-digit verification code.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    const result = await verifyEmailAction(email, otp);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.message);
      toast.error("Verification failed", { description: result.message });
      return;
    }

    setIsVerified(true);
    toast.success("Email verified", { description: "Your account is ready. Please sign in." });
    window.setTimeout(() => {
      const params = new URLSearchParams();
      if (email) params.set("email", email);
      if (redirectPath) params.set("redirect", redirectPath);
      router.replace(`/login?${params.toString()}`);
    }, 1100);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-6 text-center shadow-2xl shadow-black/30 sm:p-10">
      <motion.div animate={isVerified ? { scale: [1, 1.15, 1] } : {}} className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        {isVerified ? <CheckCircle2 className="h-9 w-9 text-emerald-500" /> : <MailCheck className="h-8 w-8" />}
      </motion.div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-950">{isVerified ? "You’re all set!" : "Verify your email"}</h1>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
        {isVerified ? "Redirecting you to sign in..." : <>We sent a 6-digit code to <strong className="text-slate-700">{email || "your email address"}</strong>.</>}
      </p>

      {!isVerified && <form onSubmit={handleSubmit} className="mt-8">
        <div className="flex justify-center gap-1.5 sm:gap-3">
          {code.map((digit, index) => <input key={index} ref={(element) => { inputRefs.current[index] = element; }} value={digit} onChange={(event) => updateCode(index, event.target.value)} onKeyDown={(event) => handleKeyDown(index, event)} inputMode="numeric" maxLength={1} aria-label={`Verification digit ${index + 1}`} className="h-11 w-9 rounded-xl border border-slate-200 bg-slate-50 text-center text-lg font-bold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:h-14 sm:w-12 sm:text-xl" />)}
        </div>
        <AnimatePresence>{error && <motion.p role="alert" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-left text-sm text-red-700">{error}</motion.p>}</AnimatePresence>
        <button disabled={isSubmitting} className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-slate-950 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-70">
          {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verifying...</> : "Verify email"}
        </button>
      </form>}

      {!isVerified && <Link href="/register" className="mt-6 inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-900"><ArrowLeft className="mr-2 h-4 w-4" />Back to registration</Link>}
    </motion.div>
  );
}
