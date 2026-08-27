import RegisterForm from "@/components/modules/authServices/RegisterForm";


type RegisterPageProps = {
  searchParams: Promise<{
    redirect?: string;
  }>;
};

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const params = await searchParams;

  const redirectPath = params.redirect || "/dashboard";

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-slate-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        {/* Top glow */}
        <div className="absolute left-1/2 top-[-180px] h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />

        {/* Left glow */}
        <div className="absolute bottom-[-150px] left-[-150px] h-[350px] w-[350px] rounded-full bg-cyan-500/10 blur-3xl" />

        {/* Right glow */}
        <div className="absolute right-[-150px] top-1/3 h-[350px] w-[350px] rounded-full bg-violet-500/10 blur-3xl" />

        {/* Grid */}
        <div
          className="
            absolute
            inset-0
            opacity-[0.035]
            [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)]
            [background-size:50px_50px]
          "
        />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
        <RegisterForm redirectPath={redirectPath} />
      </div>
    </main>
  );
}