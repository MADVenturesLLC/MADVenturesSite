"use client";

import { useCallback, useEffect, useRef, type PointerEvent, type ReactNode } from "react";
import { useMotionPermission } from "./motion-permission";

/**
 * A spatial panel (DESIGN.md, section 6).
 *
 * Four planes on the Z axis: the content at zero, so text stays sharp, with
 * corner ticks, an etched grid, and a frosted-glass backing receding behind it. With a mouse, the panel tilts
 * toward the pointer and a soft spotlight follows it.
 *
 * The panel is fully readable with no JavaScript: the planes are plain CSS and
 * the tilt is an enhancement. Tilt and spotlight follow the site's motion
 * permission, so they are off when motion is paused or reduced, and they never
 * run for touch input.
 */
export function Tilt({
  children,
  className,
  contentClassName,
  max = 5,
}: {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  /** Largest tilt in degrees. Use a smaller value for wide panels. */
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { allowed } = useMotionPermission();

  const reset = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.removeProperty("--rx");
    el.style.removeProperty("--ry");
    el.style.removeProperty("--mx");
    el.style.removeProperty("--my");
    delete el.dataset.lit;
  }, []);

  useEffect(() => {
    if (!allowed) reset();
  }, [allowed, reset]);

  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !allowed || event.pointerType !== "mouse") return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    el.style.setProperty("--ry", `${((x - 0.5) * 2 * max).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${((0.5 - y) * 2 * max).toFixed(2)}deg`);
    el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
    el.dataset.lit = "true";
  };

  return (
    <div
      ref={ref}
      className={className ? `spatial ${className}` : "spatial"}
      onPointerMove={handleMove}
      onPointerLeave={reset}
    >
      <div className="spatial__body">
        <span className="spatial__glass" aria-hidden="true" />
        <span className="spatial__grid" aria-hidden="true" />
        <span className="spatial__glare" aria-hidden="true" />
        <span className="spatial__ticks" aria-hidden="true" />
        <div className={contentClassName ? `spatial__content ${contentClassName}` : "spatial__content"}>
          {children}
        </div>
      </div>
    </div>
  );
}
