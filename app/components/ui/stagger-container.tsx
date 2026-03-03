"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

type StaggerContainerProps = {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
  amount?: number;
};

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
  once = true,
  amount = 0.2,
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

type StaggerItemProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "fade" | "slideUp" | "scale";
};

const itemVariants: Record<string, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } 
    },
  },
  slideUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } 
    },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } 
    },
  },
};

export function StaggerItem({
  children,
  className,
  variant = "slideUp",
}: StaggerItemProps) {
  return (
    <motion.div variants={itemVariants[variant]} className={cn(className)}>
      {children}
    </motion.div>
  );
}
