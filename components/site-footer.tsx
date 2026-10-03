import Link from "next/link";
import { MotionToggle } from "./motion-permission";
import { SITE } from "@/lib/portfolio";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell site-footer__top">
        <div className="site-footer__brand">
          <div className="brand">
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
          </div>
          <p className="site-footer__line">
            Develops software that helps people understand what matters, decide
            clearly, and move work forward.
          </p>
          <MotionToggle />
        </div>

        <nav className="site-footer__cols" aria-label="Footer">
          <div>
            <p className="label">Company</p>
            <Link href="/what-we-do/">What We Do</Link>
            <Link href="/approach/">Approach</Link>
            <Link href="/#about">About</Link>
          </div>
          <div>
            <p className="label">Software</p>
            <Link href="/companies/">What we&rsquo;re building</Link>
          </div>
          <div>
            <p className="label">Connect</p>
            <Link href="/partnership/">Partnership</Link>
            <a href={`mailto:${SITE.email}`} className="break-anywhere">
              {SITE.email}
            </a>
          </div>
        </nav>
      </div>

      <div className="shell site-footer__bottom">
        <span>
          &copy; {new Date().getFullYear()} MAD Ventures Holdings LLC. All rights
          reserved.
        </span>
        <span>Understand / Decide / Move</span>
      </div>
    </footer>
  );
}
