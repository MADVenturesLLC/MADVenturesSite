"use client";

import { useEffect, useState } from "react";

/**
 * Global motion state.
 *
 * `useMotionPermission()` resolves once, after mount, whether animation should
 * run. On initial visit, OS `prefers-reduced-motion: reduce` defaults motion to
 * off; an explicit visitor choice via the footer control ("on" or "paused")
 * takes precedence so clicking "Play motion" always enables movement even when
 * the OS preference is set to reduce motion.
 *
 * Every consumer treats `allowed === false` as "render the final state". No
 * content is ever gated behind an animation completing, so a false here is
 * always safe.
 */

const KEY = "mad-motion";
type Preference = "on" | "paused";
let memoryPreference: Preference | null = null;

function readStored(): Preference | null {
  try {
    const val = window.localStorage.getItem(KEY);
    if (val === "on" || val === "paused") return val;
  } catch {
    // Storage unavailable; fall back to in-session memory preference.
  }
  return memoryPreference;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function setMotionPaused(paused: boolean) {
  const next: Preference = paused ? "paused" : "on";
  memoryPreference = next;
  try {
    window.localStorage.setItem(KEY, next);
  } catch {
    // Storage unavailable. The in-session memory state still applies.
  }
  window.dispatchEvent(new CustomEvent("mad-motion-change", { detail: !paused }));
}

export function useMotionPermission() {
  const [allowed, setAllowed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const resolve = () => {
      const stored = readStored();
      const next =
        stored === "on" ? true : stored === "paused" ? false : !prefersReducedMotion();
      setAllowed(next);
      setReady(true);
      document.documentElement.dataset.motion = next ? "on" : "paused";
    };

    resolve();
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

/**
 * Persistent nonessential motion control.
 *
 * Present so a visitor can always stop or resume ambient movement. It is
 * deliberately a small footer affordance rather than a floating overlay.
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
