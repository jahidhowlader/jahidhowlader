import type { CaseStudy } from "../types";
import { DYNAMATIC_APP_STORE, DYNAMATIC_NAMING_APPROVED } from "../site";

const productName = DYNAMATIC_NAMING_APPROVED
  ? "Dynamatic Cart & Upsell Engine"
  : "A Shopify cart & upsell app";

/** Used mid-sentence, where the anonymised form has to read naturally. */
const productRef = DYNAMATIC_NAMING_APPROVED
  ? "Dynamatic"
  : "a Shopify upsell app used by paying merchants";

export const dynamatic: CaseStudy = {
  slug: "dynamatic",
  title: productName,
  lead: "The cart experience of a Shopify upsell app that merchants pay for — built to stay predictable inside themes nobody on my team controls.",
  metaDescription:
    "Case study: building and maintaining the storefront cart experience of a production Shopify cart and upsell app — theme compatibility, merchant configuration, and performance-conscious frontend work.",

  meta: [
    { label: "Role", value: "Frontend Developer" },
    { label: "Scope", value: "Storefront cart ~80% · Admin ~20%" },
    { label: "Team", value: "~8" },
    { label: "Period", value: "Jan 2024 — Present" },
    { label: "Stack", value: "React · TypeScript · Redux · Shopify" },
  ],

  proof: DYNAMATIC_NAMING_APPROVED
    ? { label: "Shopify App Store listing", href: DYNAMATIC_APP_STORE, external: true }
    : undefined,

  context: [
    `I work on ${productRef}. It gives merchants a cart experience with promotional features layered into it — the surfaces a shopper passes through between deciding to buy and completing the purchase.`,
    "The product is installed by merchants onto their own Shopify stores. That single fact shapes almost every frontend decision on this case study: the code does not run in an environment my team designed, and it has to behave correctly in stores we have never seen.",
  ],

  problem: [
    "A cart that ships as a product has two problems a cart built for one store never has.",
    "First, it runs inside arbitrary themes. Every merchant store brings its own CSS, markup conventions and layout assumptions, and the cart has to remain visually predictable inside all of them.",
    "Second, merchants want different things. The same cart has to support different promotional setups and different merchant requirements without becoming a separate build for each one.",
  ],

  role: [
    "I work primarily on the storefront cart experience — roughly 80% of my time — with the remainder on the merchant-facing admin interface. Both sides are React and TypeScript, with Redux for client state.",
    "My responsibilities widened over time. I started out implementing defined requirements. Over the following period I took on more of the cycle myself: working through requirements, implementation, testing and fixing. I also review other developers’ code and help guide them.",
  ],

  scope: [
    {
      heading: "Owned",
      items: [
        "Storefront cart UI",
        "Cart-related promotional experiences",
        "Responsive and mobile behavior",
        "Theme compatibility work",
        "Code splitting and performance-conscious frontend work",
      ],
    },
    {
      heading: "Contributed",
      items: [
        "Merchant-facing admin UI",
        "Parts of checkout extension work",
        "Code review and developer guidance",
      ],
    },
    {
      heading: "Owned by others",
      items: [
        "Backend services",
        "Database",
        "Infrastructure",
        "Other teammates’ areas",
      ],
    },
  ],

  built: [
    {
      heading: "Cart UI and interactions",
      body: [
        "I built and maintained the storefront cart interface and the interactions inside it. This is the part of the product a shopper actually touches, so it carries the responsiveness and correctness requirements that the rest of the work is judged by.",
      ],
    },
    {
      heading: "Tiered reward experience",
      body: [
        "A tiered bar that communicates progress toward a reward as the cart changes. The interesting part is not the bar itself but keeping what it says true at every moment the cart is being edited — the display has to stay consistent with the cart it describes.",
      ],
    },
    {
      heading: "Advanced free-gift experience",
      body: [
        "Free-gift behavior in the cart, where eligibility depends on conditions the merchant sets. It has more states than it appears to from the outside: becoming eligible, ceasing to be eligible, and everything the interface has to do sensibly in between.",
      ],
    },
    {
      heading: "Dynamic promotional widgets",
      body: [
        "Promotional widgets that appear in the cart according to how a merchant has configured them. These had to render correctly across configurations rather than assuming one arrangement.",
      ],
    },
  ],

  engineering: [
    {
      heading: "Theme compatibility",
      body: [
        "The cart has to work inside essentially any Shopify theme. Themes are written independently of our product, so their styles can reach the cart’s markup and change how it looks in ways nobody intended.",
        "Handling this is mostly a discipline about CSS specificity rather than a single technique. The styles that carry the cart’s structure and legibility need to hold regardless of what the surrounding theme declares. Everything else is deliberately left at controlled specificity, so the cart doesn’t fight the theme harder than it needs to.",
        "The judgment is in choosing which of those two categories a given style belongs to. Defending every rule aggressively produces a cart that is brittle and hostile to customization; defending too little produces a cart that breaks in stores you cannot test in advance.",
      ],
    },
    {
      heading: "One product, many merchant configurations",
      body: [
        "Different merchants need different cart experiences, and a merchant’s requirements change. The frontend problem is that the UI cannot be written around one intended arrangement — it has to compose correctly from whatever configuration it is given.",
        "In practice this meant building the interface to be driven by configuration rather than hard-coded, and frequently adapting the implementation for individual merchant requirements.",
      ],
    },
    {
      heading: "Performance inside someone else’s storefront",
      body: [
        "The app loads inside a merchant’s storefront, where JavaScript competes with the merchant’s own theme and their other apps. Weight we add is weight the merchant’s shoppers pay for.",
        "I used code splitting so that functionality loads when it is actually needed rather than all of it upfront. I don’t have published before-and-after figures I can attribute to this work, so I’m describing the approach rather than claiming a number.",
      ],
    },
    {
      heading: "Mobile as a primary case",
      body: [
        "Most storefront traffic is on a phone, so responsive and mobile behavior was part of implementing each feature rather than a pass at the end. A cart that only works well at desktop width is not a working cart for e-commerce.",
      ],
    },
    {
      heading: "Behavior with many states",
      body: [
        "Cart promotional experiences carry more states than a static cart. Conditions become true and untrue as the cart is edited, and the interface has to stay coherent through those transitions rather than only in the settled state.",
        "This was the hardest part of the work, and it is where most of the care went.",
      ],
    },
  ],

  ux: [
    {
      heading: "The cart has to stay legible while it is changing",
      body: [
        "Most of the difficulty in this interface is not the resting state. It is what the shopper sees while something is being updated — whether the totals, the progress and the offers all agree with each other at that moment.",
      ],
    },
    {
      heading: "Merchant customization has limits worth defending",
      body: [
        "Configurability is the product’s value, but not every arrangement a configuration permits is a good shopping experience. Keeping the cart’s structure and legibility stable across configurations is a UX decision as much as a technical one.",
      ],
    },
    {
      heading: "Working from designs, then from requirements",
      body: [
        "Early on I worked from Figma handoffs. As I learned the product, more of the interface and interaction decisions became mine to make from the requirements and the existing design language.",
      ],
    },
  ],

  differently: [
    "I would set the application’s architecture more deliberately from the beginning. The promotional and cart behavior grew more complex than the interface around it, and decisions about where that complexity should live are much cheaper to make early than to unpick later.",
  ],

  resultsNote:
    "I don’t have conversion or AOV data that I can personally attribute to my frontend work, so this case study covers the engineering decisions, constraints and responsibilities rather than claiming a numerical business outcome. The product’s public Shopify App Store listing currently shows a 5.0 rating, which reflects the product as a whole rather than my individual contribution.",

  pullQuote:
    "Defending every style aggressively produces a cart that is brittle and hostile to customization. Defending too little produces a cart that breaks in stores you cannot test in advance.",

  figures: [
    {
      diagram: "themes",
      number: 1,
      caption:
        "The same cart component rendered inside three independently written themes. The compatibility work is about which styles must hold regardless of the host theme, and which should stay at controlled specificity.",
      alt: "Diagram showing one cart component placed inside three different merchant themes, with the theme styles shown reaching into the cart and the cart’s structural styles holding their shape.",
    },
    {
      diagram: "configuration",
      number: 2,
      caption:
        "One implementation, many merchant configurations. The interface composes from the configuration it is given rather than assuming one intended arrangement.",
      alt: "Diagram showing a single cart implementation branching into several different merchant configurations, each enabling a different combination of promotional features.",
    },
    {
      diagram: "splitting",
      number: 3,
      caption:
        "Code splitting keeps functionality out of the initial load until it is needed — relevant because the app’s JavaScript competes with the merchant’s own theme and apps.",
      alt: "Diagram contrasting a single large initial JavaScript load against a smaller initial load with additional functionality loaded on demand.",
    },
  ],

  next: {
    label: "Next case study",
    title: "Cart Engine",
    href: "/work/cart-engine",
  },
};
