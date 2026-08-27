"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Loader2, Save, UserRound } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { updateProfileAction } from "@/app/(common)/(authServices)/profile/_action";

interface ProfileEditFormProps {
  initialName: string;
  email: string;
  initialProfile?: {
    phone?: string | null;
    location?: string | null;
    experience?: string | null;
    linkedin?: string | null;
    github?: string | null;
    portfolio?: string | null;
  } | null;
}

export default function ProfileEditForm({ initialName, email, initialProfile }: ProfileEditFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [currentPassword, setCurrentPassword] = useState("");
  const [profile, setProfile] = useState({
    phone: initialProfile?.phone ?? "", location: initialProfile?.location ?? "",
    experience: initialProfile?.experience ?? "", linkedin: initialProfile?.linkedin ?? "",
    github: initialProfile?.github ?? "", portfolio: initialProfile?.portfolio ?? "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setBusy(true);
    const result = await updateProfileAction({ name, currentPassword, ...profile });
    setBusy(false);
    if (!result.success) {
      setError(result.message ?? "Unable to update profile.");
      return;
    }
    toast.success("Profile updated", { description: "Your account details are saved." });
    router.refresh();
    router.push("/");
  };

  return (
    <motion.form initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit} className="w-full max-w-3xl rounded-3xl border border-white/10 bg-white p-6 shadow-2xl sm:p-10">
      <div className="mb-8 flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><UserRound className="h-7 w-7" /></div>
        <div><h1 className="text-3xl font-bold tracking-tight text-slate-950">Edit your profile</h1><p className="mt-2 text-sm leading-6 text-slate-500">Confirm your current password to securely update your name.</p></div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">Email address<span className="mt-2 block h-12 rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500">{email}</span></label>
        <label className="block text-sm font-medium text-slate-700">Full name<input required minLength={2} value={name} onChange={e => setName(e.target.value)} className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /></label>
        {(["phone", "location", "experience", "linkedin", "github", "portfolio"] as const).map((field) => <label key={field} className="block text-sm font-medium capitalize text-slate-700">{field}<input value={profile[field]} onChange={e => setProfile(current => ({ ...current, [field]: e.target.value }))} placeholder={`Your ${field}`} className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" /></label>)}
        <label className="block text-sm font-medium text-slate-700">Current password<span className="relative mt-2 block"><LockKeyhole className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" /><input required type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" placeholder="Confirm your password" /></span></label>
        {error && <p role="alert" className="sm:col-span-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <button disabled={busy} className="sm:col-span-2 flex h-12 w-full items-center justify-center rounded-xl bg-slate-950 font-semibold text-white hover:bg-slate-800 disabled:opacity-70">{busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving changes...</> : <><Save className="mr-2 h-4 w-4" />Save changes</>}</button>
      </div>
    </motion.form>
  );
}
