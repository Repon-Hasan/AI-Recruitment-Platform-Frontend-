
import { redirect } from "next/navigation";

;

import { getProfileAction } from "@/app/(common)/(authServices)/profile/_action";
import AdminProfile from "@/components/modules/profiles/adminProfile";
import RecruiterProfile from "@/components/modules/profiles/recruiterProfile";
import CandidateProfile from "@/components/modules/profiles/candidateProfile";

export default async function ProfilePage() {
  const result = await getProfileAction();

  if (!result.success || !result.user) {
    redirect("/login?redirect=/profile");
  }

  const user = result.user;

  const role = user.role?.toUpperCase();

  switch (role) {
    case "ADMIN":
      return (
        <AdminProfile
          user={{
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
            emailVerified: user.emailVerified,
          }}
        />
      );

    case "RECRUITER":
      return (
        <RecruiterProfile
          user={{
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
            emailVerified: user.emailVerified,
          }}
        />
      );

    case "CANDIDATE":
      return (
        <CandidateProfile
          user={{
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
            emailVerified: user.emailVerified,
          }}
          candidateProfile={result.candidateProfile}
        />
      );

    default:
      redirect("/");
  }
}

