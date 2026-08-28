import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { CaseStudyNav } from "@/components/case-study/CaseStudyNav";
import {
  BulletList,
  CaseStudyHeader,
  NextCase,
  Prose,
  Subsections,
  TestTable,
} from "@/components/case-study/parts";
import { CartEngineProvider } from "@/components/cart-engine/CartEngineContext";
import { CartLiveArea } from "@/components/cart-engine/CartLiveArea";
import { HostileCssZone } from "@/components/cart-engine/HostileCssZone";
import {
  cartEngineMeta,
  decisions,
  learned,
  performance,
  testScenarios,
  whatItHandles,
  why,
} from "@/content/cart-engine";

export const metadata: Metadata = {
  title: cartEngineMeta.title,
  description: cartEngineMeta.metaDescription,
  alternates: { canonical: "/work/cart-engine" },
  openGraph: {
    type: "article",
    title: cartEngineMeta.title,
    description: cartEngineMeta.metaDescription,
    url: "/work/cart-engine",
  },
  twitter: {
    card: "summary_large_image",
    title: cartEngineMeta.title,
    description: cartEngineMeta.metaDescription,
  },
};

export default function CartEnginePage() {
  return (
    <article>
      <CaseStudyNav title={cartEngineMeta.title} />

      <CaseStudyHeader
        title={cartEngineMeta.title}
        lead={cartEngineMeta.lead}
        meta={cartEngineMeta.meta}
      />

      <CartEngineProvider>
        <Section id="demo" index="00" name="Live demo">
          <CartLiveArea />
        </Section>

        <Section id="why" index="01" name="Why">
          <Prose paragraphs={why} />
        </Section>

        <Section id="handles" index="02" name="What it handles">
          <BulletList items={whatItHandles} />
        </Section>

        <Section id="decisions" index="03" name="Decisions">
          <Subsections items={decisions} />
        </Section>

        <Section id="isolation" index="04" name="Style isolation">
          <Prose
            paragraphs={[
              "The claim that a component survives an unfamiliar host page is only useful if it can be checked. Below, the same cart items list and summary rendered in the drawer above are rendered again, this time inside a container with deliberately hostile CSS.",
            ]}
          />
          <HostileCssZone />
        </Section>

        <Section id="tests" index="05" name="Tests">
          <Prose
            paragraphs={[
              "The domain layer — the reducer and the reward calculations — has no dependency on React and is tested directly with Node's built-in test runner. The tests exercise the reducer's state transitions and the reward math, not component rendering.",
            ]}
          />
          <TestTable rows={testScenarios} />
        </Section>

        <Section id="performance" index="06" name="Performance">
          <Prose paragraphs={performance} />
        </Section>

        <Section id="learned" index="07" name="What I learned">
          <Prose paragraphs={learned} />
        </Section>
      </CartEngineProvider>

      <NextCase label="More work" title="Selected work" href="/#work" />
    </article>
  );
}
