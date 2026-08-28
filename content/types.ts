export type Link = {
  label: string;
  href: string;
  /** Renders an outbound indicator and opens in a new tab. */
  external?: boolean;
};

export type Project = {
  slug: string;
  title: string;
  /** Mono label above the title, e.g. "Production work", "Production feature". */
  category: string;
  summary: string;
  stack: string[];
  links: Link[];
  /** Controls the visual weight of the row on the homepage. */
  emphasis: "primary" | "standard";
  media?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
};

export type Role = {
  company: string;
  title: string;
  period: string;
  location: string;
  /** One line naming the product worked on. */
  product?: string;
  productLink?: Link;
  bullets: string[];
};

export type Principle = {
  heading: string;
  body: string;
};

export type MetaEntry = {
  label: string;
  value: string;
};

export type ScopeColumn = {
  heading: string;
  items: string[];
};

export type Figure = {
  /** Matches a diagram component key; keeps content free of JSX. */
  diagram: "themes" | "configuration" | "splitting";
  number: number;
  /** Describes the decision the figure illustrates, not the picture. */
  caption: string;
  /** Text alternative for the diagram. */
  alt: string;
};

export type Subsection = {
  heading: string;
  body: string[];
};

export type CaseStudy = {
  slug: string;
  title: string;
  lead: string;
  metaDescription: string;
  meta: MetaEntry[];
  proof?: Link;
  context: string[];
  problem: string[];
  role: string[];
  scope: ScopeColumn[];
  built: Subsection[];
  engineering: Subsection[];
  ux: Subsection[];
  differently: string[];
  resultsNote: string;
  pullQuote: string;
  figures: Figure[];
  next: { label: string; title: string; href: string };
};
