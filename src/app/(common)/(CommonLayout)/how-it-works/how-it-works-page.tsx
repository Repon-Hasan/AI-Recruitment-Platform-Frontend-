"use client";

import ParticleWave from "@/components/ui/particle-wave";

import { HowItWorksHero } from "./how-it-works-hero";
import { PlatformOverview } from "./platform-overview";
import { CandidateWorkflow } from "./candidate-workflow";
import { RecruiterWorkflow } from "./recruiter-workflow";
import { AIMatchingFlow } from "./ai-matching-flow";
import { CommunicationFlow } from "./communication-flow";
import { ApplicationLifecycle } from "./application-lifecycle";
import { SecuritySection } from "./security-section";
import { FinalCTA } from "./final-cta";

export function HowItWorksPage() {
  return (
    <main className="relative isolate overflow-hidden bg-slate-950/90">
      {/* =====================================================
          ONE GLOBAL PARTICLE BACKGROUND
      ====================================================== */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
      >
        <div className="absolute inset-0 opacity-40 sm:opacity-100">
          <ParticleWave />
        </div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-slate-950/60" />
      </div>

      {/* =====================================================
          PAGE CONTENT
      ====================================================== */}

      <div className="relative">
        <HowItWorksHero />

        <PlatformOverview />

        <CandidateWorkflow />

        <RecruiterWorkflow />

        <AIMatchingFlow />

        <CommunicationFlow />

        <ApplicationLifecycle />

        <SecuritySection />

        <FinalCTA />
      </div>
    </main>
  );
}