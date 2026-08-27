import VerifyEmailForm from "@/components/modules/authServices/VerifyEmailForm";

type VerifyEmailPageProps = {
  searchParams: Promise<{ email?: string; redirect?: string }>;
};

export default async function VerifyEmailPage({ searchParams }: VerifyEmailPageProps) {
  const params = await searchParams;

  return (
    <main className="relative flex min-h-[calc(100vh-1rem)] items-center justify-center overflow-hidden bg-transparent px-3 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="relative z-10 flex w-full justify-center">
        <VerifyEmailForm email={params.email ?? ""} redirectPath={params.redirect} />
      </div>
    </main>
  );
}
