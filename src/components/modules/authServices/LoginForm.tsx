"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, Loader2, LockKeyhole, Mail, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { loginAction } from "@/app/(common)/(authServices)/login/_action";

interface LoginFormProps {
  email?: string;
  redirectPath?: string;
}

export default function LoginForm({ email: initialEmail = "", redirectPath }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await loginAction({ email, password }, redirectPath);
    setIsSubmitting(false);

    if (!result.success) {
      const message = result.message ?? "Unable to sign in.";
      setError(message);
      toast.error("Sign in failed", { description: message });
      return;
    }

    toast.success("Welcome back", { description: "Taking you to your dashboard." });
    router.replace(redirectPath || result.redirectPath || "/dashboard");
    router.refresh();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-6 shadow-2xl shadow-black/30 sm:p-10"
    >
      <div className="mb-8 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/25">
          <Sparkles className="h-7 w-7" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-500">Sign in to continue your smarter hiring journey.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block text-sm font-medium text-slate-700">
          Email address
          <span className="relative mt-2 block">
            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
          </span>
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Password
          <span className="relative mt-2 block">
            <LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input required minLength={8} type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-12 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
            <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:text-slate-700">
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </span>
        </label>

        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline">Forgot password?</Link>
        </div>

        <AnimatePresence>
          {error && <motion.p role="alert" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</motion.p>}
        </AnimatePresence>

        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} disabled={isSubmitting} className="flex h-12 w-full items-center justify-center rounded-xl bg-slate-950 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70">
          {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in...</> : "Sign in"}
        </motion.button>
      </form>

      <p className="mt-7 text-center text-sm text-slate-600">New to HireAI? <Link href="/register" className="font-semibold text-blue-600 hover:underline">Create an account</Link></p>
    </motion.div>
  );
}
