import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Variants } from "framer-motion";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Global smooth stagger container
 */
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.24,
      delayChildren: 0.08,
    },
  },
};

/**
 * Global smooth item animation
 */
export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      mass: 1.1,
    },
  },
};
