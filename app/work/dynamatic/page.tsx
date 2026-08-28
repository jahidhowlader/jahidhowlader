import type { Metadata } from "next";
import { Section } from "@/components/Section";
import { CaseStudyNav } from "@/components/case-study/CaseStudyNav";
import {
  CaseStudyHeader,
  FigureBlock,
  NextCase,
  NoteBlock,
  Prose,
  PullQuote,
  ScopeTable,
  Subsections,
} from "@/components/case-study/parts";
import { dynamatic as cs } from "@/content/case-studies/dynamatic";

export const metadata: Metadata = {
  title: cs.title,
  description: cs.metaDescription,
  alternates: { canonical: `/work/${cs.slug}` },
  openGraph: {
    type: "article",
    title: cs.title,
    description: cs.metaDescription,
    url: `/work/${cs.slug}`,
  },
  twitter: {
    card: "summary_large_image",
    title: cs.title,
    description: cs.metaDescription,
  },
};

export default function DynamaticCaseStudy() {
  const [themes, configuration, splitting] = cs.figures;

  return (
    <article>
      <CaseStudyNav title={cs.title} />

      <CaseStudyHeader
        title={cs.title}
        lead={cs.lead}
        meta={cs.meta}
        proof={cs.proof}
      />

      <Section id="context" index="01" name="Context">
        <Prose paragraphs={cs.context} />
      </Section>

      <Section id="problem" index="02" name="The problem">
        <Prose paragraphs={cs.problem} />
        <FigureBlock figure={themes} />
      </Section>

      <Section id="role" index="03" name="My role">
        <Prose paragraphs={cs.role} />
      </Section>

      <Section id="scope" index="04" name="Scope">
        <ScopeTable columns={cs.scope} />
      </Section>

      <Section id="built" index="05" name="What I built">
        <Subsections items={cs.built} />
      </Section>

      <Section id="engineering" index="06" name="Engineering">
        <Subsections items={cs.engineering} />
        <PullQuote>{cs.pullQuote}</PullQuote>
        <FigureBlock figure={configuration} />
        <FigureBlock figure={splitting} />
      </Section>

      <Section id="ux" index="07" name="UX decisions">
        <Subsections items={cs.ux} />
      </Section>

      <Section id="differently" index="08" name="What I’d do differently">
        <Prose paragraphs={cs.differently} />
      </Section>

      <Section id="results" index="09" name="A note on results">
        <NoteBlock>{cs.resultsNote}</NoteBlock>
      </Section>

      <NextCase {...cs.next} />
    </article>
  );
}
