"use client";

import { useEffect } from "react";
import { gsap } from "gsap";

export function PageMotion({ section }: { section: string }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      gsap.fromTo(
        "[data-motion]",
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.78,
          stagger: 0.055,
          ease: "power3.out",
          clearProps: "transform",
        },
      );
    });

    return () => context.revert();
  }, [section]);

  return null;
}
