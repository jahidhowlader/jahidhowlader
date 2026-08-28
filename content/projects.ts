import type { Project } from "./types";
import { DYNAMATIC_APP_STORE, DYNAMATIC_NAMING_APPROVED } from "./site";

export const projects: Project[] = [
  {
    slug: "dynamatic",
    category: "Production work",
    title: DYNAMATIC_NAMING_APPROVED
      ? "Dynamatic Cart & Upsell Engine"
      : "A Shopify cart & upsell app",
    summary:
      "The cart experience of a Shopify upsell app that merchants pay for — tiered rewards, free-gift offers and promotional widgets, built to hold up inside any theme.",
    stack: ["React", "TypeScript", "Redux", "Shopify"],
    links: [
      { label: "Read the case study", href: "/work/dynamatic" },
      ...(DYNAMATIC_NAMING_APPROVED
        ? [
            {
              label: "Shopify App Store",
              href: DYNAMATIC_APP_STORE,
              external: true,
            },
          ]
        : []),
    ],
    emphasis: "primary",
  },
  {
    slug: "cart-engine",
    title: "Cart Engine",
    category: "Production feature",
    summary:
      "A cart drawer I built as part of the Shopify cart & upsell app above, focused on optimistic updates, rollback on failure, rapid input, tiered rewards and rules-driven free gifts.",
    stack: ["React", "TypeScript", "Redux", "Shopify"],
    links: [{ label: "Read how it works", href: "/work/cart-engine" }],
    emphasis: "standard",
  },
  {
    slug: "wyckoff-master",
    title: "Wyckoff Master",
    category: "Personal project",
    summary:
      "A bilingual technical book system with automated translation validation and multi-format publishing — English and Bangla generated from one source.",
    stack: ["Astro", "TypeScript", "Node"],
    links: [
      {
        label: "Visit site",
        href: "https://wyckoff-master.vercel.app/",
        external: true,
      },
    ],
    emphasis: "standard",
  },
];
