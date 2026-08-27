"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Mail, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { requestPasswordResetAction } from "@/app/(common)/(authServices)/forgot-password/_action";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setBusy(true); setError(null);
    const result = await requestPasswordResetAction(email);
    setBusy(false);
    if (!result.success) { setError(result.message ?? "Unable to send reset code."); return; }
    toast.success("Reset code sent", { description: "Check your email for the 6-digit code." });
    router.push(`/reset-password?email=${encodeURIComponent(email)}`);
  };

  return <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-6 shadow-2xl sm:p-10">
    <div className="mb-8 text-center"><div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><ShieldCheck className="h-7 w-7" /></div><h1 className="text-3xl font-bold text-slate-950">Forgot password?</h1><p className="mt-2 text-sm leading-6 text-slate-500">Enter your verified email and we’ll send a secure reset code.</p></div>
    <form onSubmit={submit} className="space-y-5"><label className="block text-sm font-medium text-slate-700">Email address<span className="relative mt-2 block"><Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" /><input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" placeholder="you@example.com" /></span></label>{error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}<button disabled={busy} className="flex h-12 w-full items-center justify-center rounded-xl bg-slate-950 font-semibold text-white hover:bg-slate-800 disabled:opacity-70">{busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending code...</> : "Send reset code"}</button></form>
    <p className="mt-7 text-center text-sm text-slate-600"><Link href="/login" className="font-semibold text-blue-600 hover:underline">Back to sign in</Link></p>
  </motion.div>;
}
