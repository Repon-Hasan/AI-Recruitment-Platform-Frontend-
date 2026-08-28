import React from 'react'

import { Hero } from './hero'
import JourneySection from './journey-section';
import WorkflowSection from './workflow-section';
import IntelligenceSection from './intelligence-section';
import StatsSection from './stats-section';
import TestimonialsSection from './testimonials-section';
import HomeCTA from './home-cta';


function Home() {
 return (
    <main className="relative isolate min-h-screen overflow-hidden bg-slate-950 text-white">
      
      {/* HERO */}

      <Hero></Hero>

      {/* CANDIDATE / RECRUITER */}

      <JourneySection />

      {/* WORKFLOW */}

      <WorkflowSection />

      {/* AI INTELLIGENCE */}

      <IntelligenceSection />

      {/* STATS */}

      <StatsSection />

      {/* TESTIMONIALS */}

      <TestimonialsSection />

      {/* CTA + FOOTER */}

      <HomeCTA />
    </main>
  );
}

export default Home
