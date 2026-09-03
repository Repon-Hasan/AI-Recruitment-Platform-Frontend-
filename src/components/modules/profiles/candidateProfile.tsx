
"use client";

import {
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
    <ProfileView
      user={user}
      candidateProfile={candidateProfile}
    />
  );
}

