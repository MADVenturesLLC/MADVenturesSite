"use client";

import { motion, type Variants } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { useMotionPermission } from "./motion-permission";

/**
 * Motion primitives.
 *
 * Two rules govern everything here:
 *  1. `useMotionPermission()` gates every animation. When OS reduced-motion is
 *     active OR the visitor has paused motion in the footer, components render
 *     and settle in their final state immediately.
 *  2. Nothing that carries meaning is ever hidden at `opacity: 0`. Text stays
 *     visible in the DOM at every scroll position without waiting on JS.
 *
 * All movement is transform-only.
 */

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/** Settle upward gently on scroll into view without ever hiding content. */
export function Reveal({
  children,
  delay = 0,
  y = 14,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "header";
}) {
  const { allowed } = useMotionPermission();
  const Cmp = motion[as];

  if (!allowed) {
    return (
      <Cmp
        className={className}
        initial={false}
        animate={{ y: 0 }}
        transition={{ duration: 0 }}
      >
        {children}
      </Cmp>
    );
  }

  return (
    <Cmp
      className={className}
      initial={{ y }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.65, ease: EASE_OUT_EXPO, delay }}
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
  const { allowed } = useMotionPermission();
  const Cmp = motion[as];

  if (!allowed) {
    return (
      <Cmp
        className={className}
        initial={false}
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0 } } }}
        transition={{ duration: 0 }}
      >
        {children}
      </Cmp>
    );
  }

  return (
    <Cmp
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      variants={{ visible: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </Cmp>
  );
}

export const revealItemVariants: Variants = {
  hidden: { y: 12 },
  visible: {
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT_EXPO },
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
  const { allowed } = useMotionPermission();
  const Cmp = motion[as];

  if (!allowed) {
    return (
      <Cmp
        className={className}
        initial={false}
        animate={{ y: 0 }}
        transition={{ duration: 0 }}
      >
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
 * The text never moves out of its own box and default state is fully visible.
 * A clip-path mask reveals it top-down once motion permission is confirmed.
 */
export function StatementReveal({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const { allowed } = useMotionPermission();
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setArmed(allowed));
    return () => cancelAnimationFrame(frame);
  }, [allowed]);

  return (
    <span
      className={className}
      data-armed={armed && allowed ? "true" : undefined}
    >
      {text}
    </span>
  );
}

/** A hairline that draws in from the left when scrolled into view. */
export function DrawRule({ className }: { className?: string }) {
  const { allowed } = useMotionPermission();

  if (!allowed) return <hr className={className ?? "rule"} />;

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

export { EASE_OUT_EXPO };
