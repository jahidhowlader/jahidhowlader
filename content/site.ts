import type { Link } from "./types";

/**
 * Permission to name Dynamatic publicly is pending.
 * Flip this to `true` once DevsNest approves; copy swaps automatically
 * across the hero, project list and case study. No component changes.
 */
export const DYNAMATIC_NAMING_APPROVED = false;

/** Verified against the public App Store listing on 2026-08-18. */
export const DYNAMATIC_APP_STORE =
  "https://apps.shopify.com/navidium-cart-and-upsells";

export const site = {
  name: "Jahid Howlader",
  role: "Frontend Developer",
  /** Placeholder until the domain is registered. Used for canonicals + OG. */
  url: "https://jahidhowlader.dev",
  location: "Dhaka, Bangladesh",
  availability: "Open to frontend opportunities",
  email: "jahidhowlader.dev@gmail.com",
  heroLabel: "Frontend Developer · East Bashabo, Dhaka",
  heroHeading: "Frontend developer building the parts of a store where buying happens.",
  heroSupport: DYNAMATIC_NAMING_APPROVED
    ? "I work on the cart experience of Dynamatic, a Shopify upsell app rated 5.0 on the App Store — tiered rewards, free-gift offers and promotional widgets that have to hold up inside any merchant’s theme, on any device."
    : "I build production e-commerce interfaces with a focus on Shopify storefronts, carts, offers and responsive product experiences.",
  /**
   * Only technologies with substantial hands-on experience, explicitly confirmed.
   * Pending confirmation before adding: Liquid, theme app extensions,
   * checkout extensions, Tailwind, Vercel, Git, testing tools, Figma.
   */
  stack: ["React", "TypeScript", "JavaScript", "Redux", "Shopify"],
} as const;

export const nav: Link[] = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export const social: Link[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/jahidhowlader/",
    external: true,
  },
  { label: "GitHub", href: "https://github.com/jahidhowlader", external: true },
];
