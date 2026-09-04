"use client";

import ParticleWave from "@/components/ui/particle-wave";
import { ReviewsHero } from "./reviews-hero";
import { ReviewStats } from "./review-stats";
import { ReviewsGrid } from "./reviews-grid";
import { FinalReviewCTA } from "./final-review-cta";



export function ReviewsPage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-slate-950">
      {/* =====================================================
          GLOBAL PARTICLE BACKGROUND
          Only ONE ParticleWave for the entire reviews page
      ====================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
      >
        {/* Particle animation */}
        <div className="absolute inset-0 opacity-50 sm:opacity-150">
          <ParticleWave />
        </div>

        {/* Dark readability overlay */}
        <div className="absolute inset-0 bg-slate-950/65" />

        {/* Indigo glow */}
        <div className="absolute left-1/2 top-0 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-3xl" />

        {/* Violet glow */}
        <div className="absolute right-[-150px] top-[30%] h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-3xl" />

        {/* Cyan glow */}
        <div className="absolute bottom-[-150px] left-[-100px] h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-3xl" />

        {/* Subtle grid */}
        <div
          className="
            absolute inset-0
            opacity-[0.035]
            [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)]
            [background-size:50px_50px]
          "
        />
      </div>

      {/* =====================================================
          PAGE CONTENT
      ====================================================== */}

      <div className="relative">
        <ReviewsHero />

        <ReviewStats />

        <ReviewsGrid />

        <FinalReviewCTA />
      </div>
    </main>
  );
}