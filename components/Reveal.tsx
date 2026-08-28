"use client";

import { useEffect } from "react";

/**
 * Reveals `[data-reveal]` elements once as they enter the viewport.
 * Mounted once, globally — cheaper than a wrapper per element, and it keeps
 * every section a server component.
 *
 * Content starts hidden, so every path that could withhold the reveal has to
 * fail open: while a document is hidden the renderer suspends frames, and
 * IntersectionObserver callbacks are never delivered.
 */
export function Reveal() {
  useEffect(() => {
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    if (targets.length === 0) return;

    /* Switches the whole reveal system off rather than transitioning each
       element: a transition needs frames, and the paths that land here are
       exactly the ones where frames may never come. */
    const revealAll = () => {
      document.documentElement.setAttribute("data-reveal-off", "");
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      revealAll();
      return;
    }

    // Nobody is watching a hidden document, and no frames means no callbacks.
    if (document.visibilityState === "hidden") {
      revealAll();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.01 },
    );

    for (const el of targets) observer.observe(el);

    const onHidden = () => {
      if (document.visibilityState !== "hidden") return;
      revealAll();
      observer.disconnect();
    };
    document.addEventListener("visibilitychange", onHidden);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onHidden);
    };
  }, []);

  return null;
}
