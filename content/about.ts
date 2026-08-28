import type { Principle } from "./types";

export const principles: Principle[] = [
  {
    heading: "Interfaces that survive environments I don’t control",
    body: "A cart that ships into merchant storefronts runs inside CSS, markup and themes written by someone else. Most of the difficulty sits outside the component, so I treat the surrounding environment as part of the problem rather than an edge case.",
  },
  {
    heading: "Mobile is the primary case",
    body: "Most storefront traffic is on a phone, so that is where I start. Desktop gets its own layout rather than a widened version of the mobile one.",
  },
  {
    heading: "Edge states are part of the interface",
    body: "Loading, empty, failure, rollback, rapid interaction and unusual configuration are where interfaces actually break. I’d rather spend the time there than on the state everything already handles.",
  },
  {
    heading: "From Figma to product decisions",
    body: "I started out working from Figma handoffs. As I learned the product, more of the UI and interaction decisions became mine to make from the requirements and the existing design language.",
  },
];

export const about = {
  paragraphs: [
    "I’m a frontend developer based in Dhaka, Bangladesh. Since early 2024 I’ve worked on the cart experience of a production Shopify app — the offers, widgets and interactions that sit between a shopper deciding to buy and actually buying.",
    "I studied finance before moving into software development, where I found my focus in frontend engineering and product interfaces. Most of what I know about e-commerce I learned by shipping into real merchant storefronts and dealing with what broke.",
  ],
  meta: [
    { label: "Location", value: "East Bashabo, Dhaka, Bangladesh" },
    { label: "Languages", value: "Bangla, English" },
    { label: "Education", value: "BBA in Finance, Government Titumir College, 2023" },
  ],
  photo: {
    src: "/jahid-howlader.jpg",
    alt: "Jahid Howlader",
    /* Intrinsic size. 460px is the largest GitHub serves for this avatar, so
       the frame is capped at 220px to stay sharp at 2x without upscaling. */
    width: 460,
    height: 460,
  },
} as const;
