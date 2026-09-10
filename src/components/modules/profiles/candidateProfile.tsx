"use client";

import type {
  ProfileUser,
  CandidateProfile as CandidateProfileData,
} from "../authServices/ProfileView";

import ProfileView from "../authServices/ProfileView";

interface CandidateProfileProps {
  user: ProfileUser;
  candidateProfile?: CandidateProfileData | null;
}

export default function CandidateProfile({
  user,
  candidateProfile,
}: CandidateProfileProps) {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-slate-950 px-4 py-8 mt-12 text-white sm:px-6 lg:px-8">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Left Indigo Glow */}
        <div className="absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-indigo-600/20 blur-3xl" />

        {/* Right Purple Glow */}
        <div className="absolute right-[-10rem] top-1/3 h-[30rem] w-[30rem] rounded-full bg-purple-600/10 blur-3xl" />

        {/* Top Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.08),transparent_35%)]" />
      </div>

      {/* Profile Content */}
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <ProfileView
          user={user}
          candidateProfile={candidateProfile}
        />
      </div>
    </main>
  );
}