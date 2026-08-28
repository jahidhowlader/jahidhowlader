"use client";

import { useEffect } from "react";

/**
 * Cinematic in-page navigation: intercepts clicks on same-page hash links
 * (nav, skip-link) and eases the scroll instead of letting the browser jump.
 * Also scrollspies the sections those nav links point to, so the current
 * section's link can carry a subtle active indicator.
 *
 * One delegated click listener and one IntersectionObserver, mounted once —
 * no per-scroll-frame listener, so it can't compete with native scrolling.
 */

// Close to the site's --ease token (cubic-bezier(0.16, 1, 0.3, 1)): a fast
// start that settles gently, without pulling in a bezier solver for it.
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scrollOffset() {
  const raw = getComputedStyle(document.documentElement).scrollPaddingTop;
  const px = parseFloat(raw);
  return Number.isFinite(px) ? px : 0;
}

function focusForA11y(target: HTMLElement) {
  const hadTabIndex = target.hasAttribute("tabindex");
  if (!hadTabIndex) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
  if (!hadTabIndex) {
    target.addEventListener("blur", () => target.removeAttribute("tabindex"), {
      once: true,
    });
  }
}

function easeScrollTo(target: HTMLElement) {
  const startY = window.scrollY;
  const targetY = Math.max(
    0,
    target.getBoundingClientRect().top + startY - scrollOffset(),
  );

  if (prefersReducedMotion()) {
    window.scrollTo(0, targetY);
    focusForA11y(target);
    return;
  }

  const distance = Math.abs(targetY - startY);
  const duration = Math.min(900, Math.max(350, distance * 0.6));
  let start: number | null = null;

  function step(timestamp: number) {
    if (start === null) start = timestamp;
    const t = Math.min((timestamp - start) / duration, 1);
    window.scrollTo(0, startY + (targetY - startY) * easeOutExpo(t));
    if (t < 1) requestAnimationFrame(step);
    else focusForA11y(target);
  }
  requestAnimationFrame(step);
}

export function ScrollNav() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;

      const anchor = (event.target as HTMLElement)?.closest?.("a[href]") as
        | HTMLAnchorElement
        | null;
      if (!anchor) return;

      const url = new URL(anchor.href, window.location.href);
      if (
        url.origin !== window.location.origin ||
        url.pathname !== window.location.pathname ||
        !url.hash
      )
        return;

      const target = document.getElementById(url.hash.slice(1));
      if (!target) return;

      event.preventDefault();
      history.pushState(null, "", url.hash);
      easeScrollTo(target);
    }

    document.addEventListener("click", onClick);

    // Scrollspy: light up the nav link for whichever section is centered.
    const navLinks = Array.from(
      document.querySelectorAll<HTMLAnchorElement>('header nav a[href*="#"]'),
    );
    const linksByHash = new Map<string, HTMLAnchorElement[]>();
    for (const link of navLinks) {
      const url = new URL(link.href, window.location.href);
      if (!url.hash) continue;
      const list = linksByHash.get(url.hash) ?? [];
      list.push(link);
      linksByHash.set(url.hash, list);
    }

    let observer: IntersectionObserver | undefined;
    if (linksByHash.size > 0 && "IntersectionObserver" in window) {
      const sections = Array.from(linksByHash.keys())
        .map((hash) => document.getElementById(hash.slice(1)))
        .filter((el): el is HTMLElement => el !== null);

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const links = linksByHash.get(`#${entry.target.id}`);
            if (!links) continue;
            for (const link of links) {
              link.toggleAttribute("data-active", entry.isIntersecting);
            }
          }
        },
        { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
      );

      for (const section of sections) observer.observe(section);
    }

    return () => {
      document.removeEventListener("click", onClick);
      observer?.disconnect();
    };
  }, []);

  return null;
}
