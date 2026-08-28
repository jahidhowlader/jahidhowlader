import type { Role } from "./types";
import { DYNAMATIC_APP_STORE, DYNAMATIC_NAMING_APPROVED } from "./site";

export const roles: Role[] = [
  {
    company: "DevsNest OPC",
    title: "Frontend Developer",
    period: "Jan 2024 — Present",
    location: "On-site, Shyamoli, Dhaka, Bangladesh",
    product: DYNAMATIC_NAMING_APPROVED
      ? "Dynamatic Cart & Upsell Engine — a Shopify cart and upsell app"
      : "A Shopify cart and upsell app",
    productLink: DYNAMATIC_NAMING_APPROVED
      ? { label: "View on the Shopify App Store", href: DYNAMATIC_APP_STORE, external: true }
      : undefined,
    bullets: [
      "Built and maintained the storefront cart UI, including tiered rewards, free-gift offers and promotional widgets.",
      "Kept cart behavior and styling stable across arbitrary merchant themes.",
      "Used code splitting to control how much JavaScript reached merchant storefronts.",
      "Contributed to checkout extensions and the merchant-facing admin interface.",
      "Grew from implementation-focused work into broader feature ownership — requirements, implementation, testing and iteration.",
      "Took part in code reviews and helped guide other developers.",
    ],
  },
];
