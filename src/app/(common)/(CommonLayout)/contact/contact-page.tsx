"use client";

import ParticleWave from "@/components/ui/particle-wave";
import { ContactHero } from "./contact-hero";
import { ContactOptions } from "./contact-options";
import { ContactForm } from "./contact-form";
import { ContactFaq } from "./contact-faq";
import { ContactCta } from "./contact-cta";



export function ContactPage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-slate-950">
      {/* =====================================================
          GLOBAL PARTICLE BACKGROUND
          ONE PARTICLE WAVE FOR THE WHOLE PAGE
      ====================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
      >
        <div className="absolute inset-0 opacity-40 sm:opacity-100">
          <ParticleWave />
        </div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-slate-950/65" />

        {/* Indigo glow */}
        <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-3xl" />

        {/* Violet glow */}
        <div className="absolute right-[-180px] top-[35%] h-[420px] w-[420px] rounded-full bg-violet-600/10 blur-3xl" />

        {/* Cyan glow */}
        <div className="absolute bottom-[-150px] left-[-150px] h-[400px] w-[400px] rounded-full bg-cyan-500/10 blur-3xl" />

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
          CONTENT
      ====================================================== */}

      <div className="relative">
        <ContactHero />

        <ContactOptions />

        <ContactForm />

        <ContactFaq />

        <ContactCta />
      </div>
    </main>
  );
}