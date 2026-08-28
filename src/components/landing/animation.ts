import type { Variants } from "motion/react";

export const reveal: Variants = {
  hidden: {
    opacity: 0,
    y: 35,
  },

  show: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

export const stagger: Variants = {
  hidden: {},

  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export const scaleReveal: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
  },

  show: {
    opacity: 1,
    scale: 1,

    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};