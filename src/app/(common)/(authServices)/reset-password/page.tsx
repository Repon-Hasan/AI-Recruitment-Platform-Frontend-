import ResetPasswordForm from "@/components/modules/authServices/ResetPasswordForm";

type ResetPasswordPageProps = {
  searchParams: Promise<{ email?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;
  return (
    <main className="relative flex min-h-[calc(100vh-1rem)] items-center justify-center overflow-hidden bg-transparent px-3 py-8 sm:px-6 sm:py-12">
      <div className="relative z-10 flex w-full justify-center"><ResetPasswordForm email={params.email ?? ""} /></div>
    </main>
  );
}
