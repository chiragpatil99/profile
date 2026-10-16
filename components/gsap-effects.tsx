"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Scroll-driven effects that Motion alone doesn't do as cleanly:
 *  - hero content eases out as you scroll past (scrubbed)
 *  - section headings drift slightly for subtle depth
 * Everything is skipped for users who prefer reduced motion.
 */
export function GsapEffects() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const hero = document.querySelector<HTMLElement>("[data-hero-content]");
      if (hero) {
        gsap.to(hero, {
          yPercent: -12,
          opacity: 0.15,
          ease: "none",
          scrollTrigger: { trigger: "#home", start: "top top", end: "bottom top", scrub: true },
        });
      }

      gsap.utils.toArray<HTMLElement>("section[id] > h2, section[id] h2[id]").forEach((h) => {
        gsap.fromTo(
          h,
          { y: 20 },
          { y: -20, ease: "none", scrollTrigger: { trigger: h, start: "top bottom", end: "bottom top", scrub: 0.6 } },
        );
      });
    });

    return () => mm.revert();
  }, []);

  return null;
}
