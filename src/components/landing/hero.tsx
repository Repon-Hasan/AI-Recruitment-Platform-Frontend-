"use client";
import { HeroContent } from "./heroContent";

export function Hero() {
  return (
    <section className="relative min-h-180 overflow-hidden bg-slate-950">

      {/* Gradient overlay */}
      <div className="absolute inset-0 z-1 bg-linear-to-b from-slate-950/20 via-slate-950/60 to-slate-950" />
      <HeroContent></HeroContent>
    </section>
  );
}