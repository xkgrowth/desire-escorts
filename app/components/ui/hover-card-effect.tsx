"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type HoverCardEffectProps = {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
  hoverY?: number;
  glowOnHover?: boolean;
};

export function HoverCardEffect({
  children,
  className,
  hoverScale = 1.02,
  hoverY = -4,
  glowOnHover = true,
}: HoverCardEffectProps) {
  return (
    <motion.div
      className={cn(
        "rounded-luxury transition-shadow duration-300",
        glowOnHover && "hover:shadow-glow",
        className
      )}
      whileHover={{
        scale: hoverScale,
        y: hoverY,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      style={{
        willChange: "transform",
      }}
    >
      {children}
    </motion.div>
  );
}
