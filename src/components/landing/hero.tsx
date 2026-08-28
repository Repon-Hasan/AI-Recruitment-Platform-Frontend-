"use client";
import ParticleWave from "../ui/particle-wave";
import { HeroContent } from "./heroContent";

export function Hero() {
  return (
    <section className="relative min-h-180 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-40 opacity-100">
    <ParticleWave />
    </div>
      {/* Gradient overlay */}
      <div className="absolute inset-0 z-1 bg-linear-to-b from-slate-950/20 via-slate-950/60 to-slate-950" />
      <HeroContent></HeroContent>
    </section>
  );
}