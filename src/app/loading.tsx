import Loader from '@/components/ui/loader'


function loading() {
return (
  <div className="flex min-h-screen items-center justify-center bg-slate-950">
    <div className="relative">
      {/* Outer animated glow */}
      <div className="absolute inset-0 animate-ping rounded-full bg-indigo-500/20" />

      {/* Loader */}
      <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl">
        <Loader />
      </div>
    </div>
  </div>
);
}

export default loading
