import Link from "next/link";
import type { Figure, Link as LinkType, MetaEntry, ScopeColumn, Subsection } from "@/content/types";
import { ConfigurationDiagram, SplittingDiagram, ThemesDiagram } from "./Diagrams";
import styles from "./CaseStudy.module.css";

export function CaseStudyHeader({
  title,
  lead,
  meta,
  proof,
}: {
  title: string;
  lead: string;
  meta: MetaEntry[];
  proof?: LinkType;
}) {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerInner}`}>
        <h1 className={styles.title}>{title}</h1>
        <p className={`lead ${styles.lead}`}>{lead}</p>

        <dl className={styles.meta}>
          {meta.map((entry) => (
            <div key={entry.label} className={styles.metaRow}>
              <dt className="label">{entry.label}</dt>
              <dd className={styles.metaValue}>{entry.value}</dd>
            </div>
          ))}
        </dl>

        {proof ? (
          <p className={styles.proof}>
            <a href={proof.href} target="_blank" rel="noopener noreferrer">
              {proof.label}
              <span aria-hidden="true"> ↗</span>
            </a>
          </p>
        ) : null}
      </div>
    </header>
  );
}

export function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className={styles.prose}>
      {paragraphs.map((text) => (
        <p key={text.slice(0, 32)}>{text}</p>
      ))}
    </div>
  );
}

export function Subsections({ items }: { items: Subsection[] }) {
  return (
    <div className={styles.subsections}>
      {items.map((item) => (
        <section key={item.heading} className={styles.subsection}>
          <h3 className={styles.subheading}>{item.heading}</h3>
          {item.body.map((text) => (
            <p key={text.slice(0, 32)}>{text}</p>
          ))}
        </section>
      ))}
    </div>
  );
}

export function ScopeTable({ columns }: { columns: ScopeColumn[] }) {
  return (
    <div className={styles.scope}>
      {columns.map((column) => (
        <section key={column.heading} className={styles.scopeColumn}>
          <h3 className={`label ${styles.scopeHeading}`}>{column.heading}</h3>
          <ul className={styles.scopeList}>
            {column.items.map((item) => (
              <li key={item} className={styles.scopeItem}>
                {item}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

const diagrams = {
  themes: ThemesDiagram,
  configuration: ConfigurationDiagram,
  splitting: SplittingDiagram,
} as const;

export function FigureBlock({ figure }: { figure: Figure }) {
  const Diagram = diagrams[figure.diagram];
  return (
    <figure className={styles.figure}>
      {/* Focusable so the diagram can be scrolled by keyboard at widths where
          it is wider than the column. */}
      <div
        className={styles.figureFrame}
        tabIndex={0}
        role="group"
        aria-label={`Figure ${figure.number}`}
      >
        <Diagram alt={figure.alt} />
      </div>
      <figcaption className={styles.figureCaption}>
        <p className="label">{`Fig. ${figure.number}`}</p>
        <p className={styles.figureText}>{figure.caption}</p>
        <p className={`label ${styles.figureHint}`}>
          Scroll the diagram sideways to see all of it
        </p>
      </figcaption>
    </figure>
  );
}

export function PullQuote({ children }: { children: string }) {
  return (
    <blockquote className={styles.quote}>
      <p className={styles.quoteText}>{children}</p>
    </blockquote>
  );
}

export function NoteBlock({ children }: { children: string }) {
  return (
    <div className={styles.note}>
      <p>{children}</p>
    </div>
  );
}

export function NextCase({
  label,
  title,
  href,
}: {
  label: string;
  title: string;
  href: string;
}) {
  return (
    <nav className={styles.next} aria-label="Next case study">
      <div className={`container ${styles.nextInner}`}>
        <p className="label">{label}</p>
        <Link href={href} className={styles.nextLink}>
          {title}
          <span aria-hidden="true" className={styles.nextArrow}>
            →
          </span>
        </Link>
      </div>
    </nav>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className={styles.bulletList}>
      {items.map((item) => (
        <li key={item} className={styles.bulletListItem}>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function TestTable({
  rows,
}: {
  rows: { scenario: string; expected: string }[];
}) {
  return (
    <div className={styles.tableFrame}>
      <table className={styles.table}>
        <caption className={styles.tableCaption}>
          Scenarios covered by the domain-layer tests
        </caption>
        <thead>
          <tr>
            <th scope="col">Scenario</th>
            <th scope="col">Expected behavior</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.scenario}>
              <td>{row.scenario}</td>
              <td>{row.expected}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
