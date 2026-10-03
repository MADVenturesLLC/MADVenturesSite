"use client";

import { useEffect, useState } from "react";

/**
 * Global motion state.
 *
 * `useMotionPermission()` resolves once, after mount, whether animation should
 * run. Reduced-motion is the default-deny: unless the visitor has not asked for
 * reduced motion AND has not paused, nothing animates.
 *
 * Every consumer treats `allowed === false` as "render the final state". No
 * content is ever gated behind an animation completing, so a false here is
 * always safe.
 */
export function useMotionPermission() {
  const [allowed, setAllowed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const resolve = () => {
      const reduced = prefersReducedMotion();
      const stored = readStored();
      setAllowed(reduced ? false : stored !== "paused");
      setReady(true);
    };

    resolve();
    // The OS preference and the in-page control can both change under us.
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", resolve);
    window.addEventListener("mad-motion-change", resolve);
    return () => {
      mq.removeEventListener("change", resolve);
      window.removeEventListener("mad-motion-change", resolve);
    };
  }, []);

  return { allowed, ready };
}

const KEY = "mad-motion";

function readStored(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function setMotionPaused(paused: boolean) {
  try {
    window.localStorage.setItem(KEY, paused ? "paused" : "on");
  } catch {
    // Storage unavailable. The in-session state still applies.
  }
  window.dispatchEvent(new CustomEvent("mad-motion-change", { detail: !paused }));
}

/**
 * Persistent nonessential motion control.
 *
 * Present so a visitor can always stop ambient movement. It is deliberately a
 * small footer affordance rather than a floating overlay.
 */
export function MotionToggle() {
  const { allowed, ready } = useMotionPermission();
  // Derived, so the control can never drift from what is actually running.
  const paused = ready && !allowed;

  const toggle = () => setMotionPaused(!paused);

  if (!ready) {
    // Render the neutral state rather than a control that is about to change.
    return (
      <button className="motion-toggle" type="button" aria-pressed="true" disabled>
        <span className="motion-toggle__label">Motion</span>
      </button>
    );
  }

  return (
    <button
      className="motion-toggle"
      type="button"
      onClick={toggle}
      aria-pressed={!paused}
    >
      <span className="motion-toggle__dot" aria-hidden="true" />
      <span className="motion-toggle__label">
        {paused ? "Play motion" : "Pause motion"}
      </span>
    </button>
  );
}
