"use client";

import { Sparkles, Target } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";

export type AboutImage = {
  src: string;
  alt: string;
  title: string;
  description: string;
};

export const aboutImages: AboutImage[] = [
  {
    src: "/images/about-recruitment.jpg",
    alt: "AI-powered recruitment platform connecting candidates and recruiters",
    title: "AI Resume Analysis",
    description:
      "Analyze resumes intelligently and identify the strongest candidates faster.",
  },
  {
    src: "/images/about-receuitment2.jpg",
    alt: "AI-powered job matching with candidate profiles",
    title: "Smart Job Matching",
    description:
      "Match candidates with opportunities based on skills, experience, and goals.",
  },
  {
    src: "/images/about-receuitment3.jpg",
    alt: "AI analyzing resumes and matching candidate skills to jobs",
    title: "Intelligent Screening",
    description:
      "Let AI scan, parse, and compare applications against each job requirement.",
  },
  {
    src: "/images/about-receuitment4.jpg",
    alt: "Recruiter reviewing shortlisted candidate profiles",
    title: "Recruiter Collaboration",
    description:
      "Review shortlists and collaborate with your hiring team in one workspace.",
  },
  {
    src: "/images/about-receuitment5.jpg",
    alt: "Recruiter using AI-assisted candidate evaluation",
    title: "Confident Hiring Decisions",
    description:
      "Use clear candidate insights and match scores to make better hiring decisions.",
  },
];

export function ImagesSt() {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((previous) => (previous + 1) % aboutImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentImage = aboutImages[activeImage];

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative"
    >
      <div className="absolute left-1/2 top-1/2 h-87.5 w-87.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-[120px]" />

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-3 shadow-2xl shadow-indigo-950/30 backdrop-blur-xl"
      >
        <div className="relative aspect-4/3 overflow-hidden rounded-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImage.src}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={currentImage.src}
                alt={currentImage.alt}
                fill
                priority={activeImage === 0}
                className="object-cover"
              />

              <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/20 to-transparent" />

              <motion.div
                animate={{ top: ["0%", "100%"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-px bg-linear-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_20px_rgba(129,140,248,0.9)]"
              />

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="absolute bottom-5 left-5 right-5"
              >
                <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4 backdrop-blur-xl">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-indigo-400">
                    AI Recruitment
                  </p>
                  <h4 className="mt-1 text-lg font-bold text-white">
                    {currentImage.title}
                  </h4>
                  <p className="mt-1 text-sm text-slate-400">
                    {currentImage.description}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-5 right-5 z-20 flex gap-1.5">
            {aboutImages.map((image, index) => (
              <button
                key={image.src}
                type="button"
                onClick={() => setActiveImage(index)}
                aria-label={`Show ${image.title}`}
                aria-current={activeImage === index ? "true" : undefined}
                className="relative h-1.5 overflow-hidden rounded-full bg-white/20"
              >
                <motion.span
                  animate={{ width: activeImage === index ? "24px" : "6px" }}
                  className="block h-full rounded-full bg-indigo-400"
                />
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-4 top-10 rounded-2xl border border-white/10 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-xl sm:-right-8"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
            <Target className="h-5 w-5 text-emerald-400" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs text-slate-400">Match Score</p>
            <p className="text-lg font-bold text-emerald-400">94%</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-6 -left-4 rounded-2xl border border-white/10 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-xl sm:-left-8"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
            <Sparkles className="h-5 w-5 text-purple-400" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs text-slate-400">AI Status</p>
            <p className="text-sm font-semibold text-white">Analyzing...</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ImagesSt;
