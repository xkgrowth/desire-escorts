"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { GradientTitle } from "../components/ui/gradient-title";

type AnimatedSectionProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  delay?: number;
};

export function AnimatedSection({
  title,
  subtitle,
  children,
  delay = 0,
}: AnimatedSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="py-12 border-b border-white/5"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: 0.5,
            delay: delay + 0.1,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          className="mb-8"
        >
          <h3 className="text-xl font-heading font-bold text-foreground mb-1">
            {title}
          </h3>
          {subtitle && (
            <p className="text-foreground/50 text-sm">{subtitle}</p>
          )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{
            duration: 0.5,
            delay: delay + 0.2,
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          {children}
        </motion.div>
      </div>
    </motion.section>
  );
}

type AnimatedSectionDividerProps = {
  id: string;
  title: string;
  description: string;
};

export function AnimatedSectionDivider({ id, title, description }: AnimatedSectionDividerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      id={id}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="scroll-mt-8 py-12 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <GradientTitle as="h2" size="lg" className="mb-2">
            {title}
          </GradientTitle>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-foreground/60"
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  );
}

type AnimatedCardProps = {
  title: string;
  children: React.ReactNode;
  delay?: number;
};

export function AnimatedCard({ title, children, delay = 0 }: AnimatedCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.98 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="card-surface rounded-luxury overflow-hidden"
    >
      <div className="px-4 py-3 border-b border-white/10">
        <h4 className="text-sm font-medium text-foreground/80">{title}</h4>
      </div>
      {children}
    </motion.div>
  );
}

type AnimatedColorSwatchProps = {
  name: string;
  color: string;
  token: string;
  delay?: number;
};

export function AnimatedColorSwatch({ name, color, token, delay = 0 }: AnimatedColorSwatchProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
      transition={{
        duration: 0.4,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="card-surface rounded-luxury overflow-hidden"
    >
      <motion.div
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.5, delay: delay + 0.1 }}
        style={{ backgroundColor: color, transformOrigin: "left" }}
        className="h-20"
      />
      <div className="p-3">
        <p className="font-medium text-sm text-foreground">{name}</p>
        <p className="text-xs text-foreground/50 font-mono">{color}</p>
        <p className="text-xs text-foreground/40 font-mono">{token}</p>
      </div>
    </motion.div>
  );
}

type AnimatedNavPillProps = {
  href: string;
  children: React.ReactNode;
  delay?: number;
};

export function AnimatedNavPill({ href, children, delay = 0 }: AnimatedNavPillProps) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className="px-4 py-2 rounded-full bg-surface/50 border border-white/10 text-sm text-foreground/70 hover:text-foreground hover:border-primary/30 transition-colors"
    >
      {children}
    </motion.a>
  );
}

type AnimatedGridProps = {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
};

export function AnimatedGrid({ children, className, staggerDelay = 0.05 }: AnimatedGridProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedGridItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type AnimatedHeroProps = {
  children: React.ReactNode;
};

export function AnimatedHero({ children }: AnimatedHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}
