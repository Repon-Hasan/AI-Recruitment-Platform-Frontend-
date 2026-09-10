
import { redirect } from "next/navigation";

import { getProfileAction } from "@/app/(common)/(authServices)/profile/_action";
import CandidateProfile from "@/components/modules/profiles/candidateProfile";

export default async function ProfilePage() {
  const result = await getProfileAction();

  if (!result.success || !result.user) {
    redirect("/login?redirect=/profile");
  }

  const user = result.user;

  // Only candidates can access this profile page
  if (user.role?.toUpperCase() !== "CANDIDATE") {
    redirect("/");
  }

  return (
    <CandidateProfile
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      }}
      candidateProfile={result.candidateProfile}
    />
  );
}

