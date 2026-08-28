import type { Product } from "@/domain/cart-engine/cart/types";

/**
 * Prices are rounded on purpose: two tees ($25 each) land exactly on the
 * $50 free-shipping threshold, a couple of mugs on top clears the $75
 * discount threshold, and adding the hoodie clears the $100 gift threshold —
 * so the reward math is checkable at a glance rather than something you
 * have to trust.
 */
export const demoProducts: Product[] = [
  {
    id: "classic-tee",
    name: "Classic Cotton Tee",
    price: 25,
    image: "tee",
    variantGroups: [
      { name: "Size", options: ["S", "M", "L", "XL"] },
      { name: "Color", options: ["Black", "White", "Sage"] },
    ],
  },
  {
    id: "zip-hoodie",
    name: "Relaxed Zip Hoodie",
    price: 60,
    image: "hoodie",
    variantGroups: [
      { name: "Size", options: ["S", "M", "L", "XL"] },
      { name: "Color", options: ["Black", "Oatmeal"] },
    ],
  },
  {
    id: "canvas-tote",
    name: "Canvas Tote",
    price: 18,
    image: "tote",
  },
  {
    id: "ceramic-mug",
    name: "Ceramic Mug",
    price: 16,
    image: "mug",
    variantGroups: [{ name: "Style", options: ["Matte", "Glossy"] }],
  },
];

export const cartEngineMeta = {
  title: "Cart Engine",
  lead: "The cart drawer I built as part of the Shopify cart & upsell app — the states most cart implementations skip made explicit, visible and testable.",
  metaDescription:
    "The Cart Engine I built as part of a production Shopify cart & upsell app, focused on optimistic updates, rollback, variant-aware line items, tiered promotions, and a real free-gift line.",
  meta: [
    { label: "Role", value: "Built as part of the Shopify cart & upsell app" },
    { label: "Stack", value: "React · TypeScript · Redux · Shopify" },
    { label: "Status", value: "Feature walkthrough — this page is an interactive rebuild for demonstration" },
  ] as { label: string; value: string }[],
};

export const why = [
  "Cart interfaces fail in predictable places: asynchronous updates, rapid input, empty states, errors, and reward thresholds. Most of the time those states are hidden behind a happy-path demo, so as part of the Shopify cart & upsell app I built a cart engine where they are explicit instead.",
  "This page walks through that feature in isolation, with an interactive rebuild of the same logic — real products, real variants, and real promotion math — so the decisions behind it are inspectable outside of the merchant-facing app it ships in.",
];

export const whatItHandles = [
  "Optimistic quantity updates, applied immediately rather than after a round trip",
  "Rollback to the last confirmed quantity when a simulated update fails",
  "Rapid, repeated quantity changes without the UI settling on the wrong value",
  "Product variants (size, color, style) tracked as distinct cart lines, each with its own quantity and rollback target",
  "A tiered promotion ladder — free shipping, a percentage discount, and a free gift — unlocked from the actual subtotal",
  "A free gift added and removed as a real, zero-price cart line as the subtotal crosses and re-crosses its threshold",
  "Subtotal, discount, shipping and total computed in integer cents so nothing drifts by a fraction of a cent",
  "Loading, empty, error and success states, each rendered rather than assumed away",
  "Keyboard operation, focus management and accessible status messages",
  "Visual stability when the same component is embedded next to deliberately hostile CSS",
];

export const decisions = [
  {
    heading: "Money is calculated in integer cents, not floating-point dollars",
    body: [
      "Every price is converted to cents before it's multiplied or summed, and only converted back to dollars at the point of display. Floating-point dollars drift by fractions of a cent once enough line items and percentage discounts are involved; integer cents don't, because every intermediate value is a whole number.",
    ],
  },
  {
    heading: "The discount, shipping cost and total are derived, not stored",
    body: [
      "There's no field anywhere that holds \"the discount\" or \"the total\" as its own piece of state. A single function recomputes all of it from the current line items and the reward ladder on every render, so a quantity change, a removed line, or a rolled-back optimistic update can never leave a stale discount sitting next to a fresh subtotal.",
    ],
  },
  {
    heading: "The free gift is a real cart line, synchronized to reward state — not a message",
    body: [
      "Crossing the gift threshold dispatches the same kind of line item a real product would use, priced at $0 with the original price kept alongside it for the struck-through display. It carries an `isGift` flag that the reducer uses to block quantity changes and manual removal, and to exclude it from the subtotal a discount is computed from — so it can't accidentally become a paid line or receive its own discount. Falling back below the threshold removes the same line automatically.",
    ],
  },
  {
    heading: "Rollback targets the last confirmed quantity, not the previous click",
    body: [
      "A rollback that reverts to whatever quantity the last click set is wrong the moment two clicks happen close together — it can restore a value the server never actually confirmed. Every quantity change remembers the last quantity the cart was sure about, and a failure always returns to that value, no matter how many optimistic updates happened in between.",
    ],
  },
  {
    heading: "A stale response is not allowed to overwrite a newer one",
    body: [
      "Clicking + three times quickly starts three separate requests for the same line. Each one carries a request id, and the cart only accepts the outcome of the most recent request for that line — a slow, early response arriving after a later one is simply ignored. Without this, a slow success or failure for click #1 could land after click #3 and silently undo it.",
    ],
  },
  {
    heading: "The target quantity is computed inside the reducer, not read from the UI",
    body: [
      "Three rapid clicks fire before React has re-rendered even once, so a click handler that reads “current quantity + 1” from its own render closure reads the SAME stale quantity three times — an early, real bug in this project's first draft, caught by actually clicking the buttons rather than trusting that the code looked right. Each click now dispatches a plain +1 or −1 delta, and the reducer applies it to its own state, which React guarantees is always the result of the previous dispatch in the same batch.",
    ],
  },
  {
    heading: "A product variant is part of the line's identity, not a label on top of it",
    body: [
      "A Medium/Black tee and a Large/White tee are the same product but different cart lines: the line id folds the selected variant values in alongside the product id, so adding either one increments its own line instead of colliding with the other, and each keeps its own quantity, pending state, and rollback target.",
    ],
  },
  {
    heading: "The isolation claim is something you can check, not just read",
    body: [
      "Rather than asserting that the cart survives an unpredictable host page, the same cart UI is rendered lower on this page next to deliberately hostile CSS — generic button styles, oversized type, box-sizing changes. What holds its shape is the actual component, not a screenshot of it.",
    ],
  },
];

export const testScenarios: { scenario: string; expected: string }[] = [
  { scenario: "Add a product already in the cart", expected: "Quantity increases by one rather than adding a duplicate line" },
  { scenario: "Add the same product in a different variant", expected: "A separate line is created, with its own quantity" },
  { scenario: "Increase quantity, request succeeds", expected: "Quantity stays at the new value; no error is shown" },
  { scenario: "Increase quantity, request fails", expected: "Quantity rolls back to the last confirmed value; an error is shown" },
  { scenario: "Three rapid clicks, only the last one fails", expected: "Cart rolls back to the value before the first of the three clicks" },
  { scenario: "A slow response arrives after a newer request", expected: "The slow, stale response is ignored; the newer request's outcome stands" },
  { scenario: "Subtotal crosses the free-shipping and 10%-off thresholds in the same update", expected: "Both rewards unlock together; shipping and the discount both apply immediately" },
  { scenario: "Subtotal crosses the free-gift threshold", expected: "The gift product is added to the cart at $0.00, its normal price shown struck through" },
  { scenario: "Subtotal later drops below the free-gift threshold", expected: "The gift line is removed automatically" },
  { scenario: "Subtotal exceeds every threshold", expected: "Progress reports as complete, with no next reward" },
];

export const performance = [
  "The interactive drawer is loaded as a separate chunk from the rest of the route, rather than bundled into the initial page load — the same reasoning as the code-splitting decision described in the Dynamatic case study, applied here where it's fully inspectable.",
  "I haven't measured this against a deployed production build yet, so I'm not quoting a bundle-size or load-time number here. I'd rather leave this section short than publish a figure I can't stand behind.",
];

export const learned = [
  "Building this confirmed that the hard part of a cart is rarely the happy path — it's deciding what \"correct\" means while three requests for the same line are in flight at once, or while a promotion is unlocking and a variant is being added in the same render. Writing the reducer and the totals calculation as pure functions made that reasoning something I could actually test, rather than something I had to trust by reading the code.",
  "This walkthrough is intentionally small. It demonstrates the cart engine in isolation, not the full storefront app it's part of — there's no checkout, no persistence, and no real product catalogue behind it.",
];
