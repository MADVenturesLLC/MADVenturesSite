"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { SITE } from "@/lib/portfolio";

const NAV = [
  { href: "/what-we-do/", label: "What We Do" },
  { href: "/companies/", label: "Software" },
  { href: "/approach/", label: "Approach" },
  { href: "/#about", label: "About" },
  { href: "/partnership/", label: "Partnership" },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href.endsWith("#about")) return false;
  return pathname === href || pathname === href.replace(/\/$/, "");
}

export function SiteHeader() {
  const pathname = usePathname();

  /*
    Open state is DERIVED, not synced. We record which route the menu was
    opened on; the moment navigation changes the route the menu is closed. This
    closes the menu on navigation without a setState-in-effect, which React 19
    flags because it causes a cascading render.
  */
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const setOpen = useCallback(
    (next: boolean) => setOpenedOn(next ? pathname : null),
    [pathname],
  );

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, [setOpen]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        document.getElementById("mobile-nav-trigger")?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        !document.getElementById("mobile-nav")?.contains(target) &&
        !document.getElementById("mobile-nav-trigger")?.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, setOpen]);

  return (
    <header className="site-header">
      <div className="shell site-header__inner">
        <Link href="/" className="brand" aria-label={`${SITE.name} — home`}>
          {/* Monogram from the approved brand assets. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/branding/mad-monogram-titanium.svg"
            alt=""
            width={40}
            height={27}
            className="brand__mark"
          />
          <span className="brand__text">
            <span className="brand__name">MAD Ventures</span>
            <span className="brand__sub">Holdings LLC</span>
          </span>
        </Link>

        <nav className="site-header__nav" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="site-header__link"
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/partnership/" className="btn btn-primary btn-sm site-header__cta">
          Start a conversation
        </Link>

        <button
          id="mobile-nav-trigger"
          className="site-header__toggle"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          <svg viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? (
              <path d="M5 5l10 10M15 5L5 15" strokeLinecap="square" />
            ) : (
              <path d="M3 6h14M3 10h14M3 14h14" strokeLinecap="square" />
            )}
          </svg>
        </button>
      </div>

      <nav
        id="mobile-nav"
        className="mobile-nav"
        aria-label="Mobile"
        hidden={!open}
      >
        <div className="shell mobile-nav__inner">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="mobile-nav__link"
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/partnership/" className="btn btn-primary mobile-nav__cta">
            Start a conversation
          </Link>
        </div>
      </nav>
    </header>
  );
}
