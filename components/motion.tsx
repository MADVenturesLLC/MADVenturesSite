"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";

/**
 * Motion primitives.
 *
 * Two rules govern everything here:
 *  1. `useReducedMotion()` gates every animation. When it returns true, or when
 *     the visitor has paused motion, components render their FINAL state.
 *  2. Nothing that carries meaning lives only inside an animation. Text is in the
 *     DOM, and the exit state is the readable state.
 *
 * All movement is transform/opacity only.
 */

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const EASE_STANDARD = [0.4, 0, 0.2, 1] as const;

/** Fade and rise once on scroll into view. */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "header";
}) {
  const reduced = useReducedMotion();
  const Cmp = motion[as];

  // `useReducedMotion()` returns null before it resolves, so anything that is
  // not explicitly `false` renders the FINAL state. Hidden-on-load is never
  // the default, which means the page is readable before hydration and if the
  // observer never fires.
  if (reduced !== false) {
    return (
      <Cmp className={className} initial={false}>
        {children}
      </Cmp>
    );
  }

  return (
    <Cmp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay }}
    >
      {children}
    </Cmp>
  );
}

/**
 * Container for a staggered sequence. Children should be <RevealItem> or a
 * motion element with the item variants.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.07,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  as?: "div" | "ul" | "ol";
}) {
  const reduced = useReducedMotion();
  const Cmp = motion[as];

  if (reduced !== false) {
    return (
      <Cmp className={className} initial={false}>
        {children}
      </Cmp>
    );
  }

  return (
    <Cmp
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={{ visible: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </Cmp>
  );
}

export const revealItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.66, ease: EASE_OUT_EXPO },
  },
};

export function RevealItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const reduced = useReducedMotion();
  const Cmp = motion[as];

  if (reduced !== false) {
    return (
      <Cmp className={className} initial={false}>
        {children}
      </Cmp>
    );
  }

  return (
    <Cmp className={className} variants={revealItemVariants}>
      {children}
    </Cmp>
  );
}

/**
 * Opening-statement reveal.
 *
 * Two defects this replaced, both worth recording:
 *
 *  1. It used to move each line to `y: 108%` inside an overflow-hidden mask,
 *     which made the headline invisible until an animation ran.
 *     `useReducedMotion()` returns null before it resolves, so the animated path
 *     was taken on first paint and the statement could sit clipped and
 *     unreadable. Headline text must never depend on JavaScript.
 *
 *  2. It used to render hand-authored line breaks, which silently broke at
 *     widths the author never checked ("and operate / companies").
 *
 * The fix is to animate only what is safe: the text never moves and is never
 * translated out of its own box. A clip-path mask reveals it top-down once
 * motion is confirmed. Default state is fully visible.
 */
export function StatementReveal({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setArmed(!mq.matches);
    mq.addEventListener("change", update);

    /*
      Seed on the next frame rather than synchronously in the effect body.
      Two reasons, both real: React flags a synchronous setState here as a
      cascading render, and the browser gets to paint the readable statement
      before any animation starts. If the frame never runs, the statement is
      simply already visible.
    */
    const frame = requestAnimationFrame(update);

    return () => {
      mq.removeEventListener("change", update);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <span
      className={className}
      data-armed={armed && reduced === false ? "true" : undefined}
    >
      {text}
    </span>
  );
}

/** A hairline that draws in from the left when scrolled into view. */
export function DrawRule({ className }: { className?: string }) {
  const reduced = useReducedMotion();

  if (reduced !== false) return <hr className={className ?? "rule"} />;

  return (
    <motion.hr
      className={className ?? "rule"}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      style={{ transformOrigin: "left" }}
      transition={{ duration: 1.1, ease: EASE_OUT_EXPO }}
    />
  );
}

/**
 * Ambient light travelling a vertical spine.
 *
 * Perpetual but nonessential, and therefore pausable and reduced-motion aware.
 */
export function SpinePulse({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  if (reduced !== false) return null;

  return (
    <motion.span
      className={className}
      aria-hidden="true"
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
      transition={{
        duration: 4.2,
        ease: EASE_STANDARD,
        repeat: Infinity,
        repeatDelay: 0.6,
      }}
    />
  );
}

export { EASE_OUT_EXPO, EASE_STANDARD };
