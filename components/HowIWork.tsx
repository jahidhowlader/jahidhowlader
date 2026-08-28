import type { CSSProperties } from "react";
import { principles } from "@/content/about";
import { site } from "@/content/site";
import { Section } from "./Section";
import { TokenList } from "./TokenList";
import styles from "./HowIWork.module.css";

export function HowIWork() {
  return (
    <Section id="how-i-work" index="03" name="How I work">
      <div className={styles.list}>
        {principles.map((principle, i) => (
          <article
            key={principle.heading}
            className={styles.item}
            data-reveal
            style={{ "--reveal-delay": `${i * 60}ms` } as CSSProperties}
          >
            <h3 className={styles.heading}>{principle.heading}</h3>
            <p className={styles.body}>{principle.body}</p>
          </article>
        ))}
      </div>

      <div className={styles.stack} data-reveal>
        <p className="label">Stack</p>
        <TokenList items={site.stack} />
      </div>
    </Section>
  );
}
