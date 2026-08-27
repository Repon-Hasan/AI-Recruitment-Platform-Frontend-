import { redirect } from "next/navigation";
import ProfileView from "@/components/modules/authServices/ProfileView";
import { getProfileAction } from "@/app/(common)/(authServices)/profile/_action";

export default async function ProfilePage() {
  const result = await getProfileAction();

  if (!result.success || !result.user) {
    redirect("/login?redirect=/profile");
  }

  return (
    <main className="relative flex min-h-[calc(100vh-1rem)] items-center justify-center px-3 py-8 sm:px-6 sm:py-12">
      <ProfileView user={result.user} candidateProfile={result.candidateProfile} />
    </main>
  );
}
