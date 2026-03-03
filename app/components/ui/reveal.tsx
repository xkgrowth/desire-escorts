"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "fade" | "slideUp" | "slideLeft" | "slideRight" | "scale" | "blur";
  delay?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
};

const variants: Record<string, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  },
  blur: {
    hidden: { opacity: 0, filter: "blur(10px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
  },
};

export function Reveal({
  children,
  className,
  variant = "slideUp",
  delay = 0,
  duration = 0.5,
  once = true,
  amount = 0.3,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants[variant]}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
