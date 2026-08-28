import { site } from "@/content/site";
import { TokenList } from "./TokenList";
import { CodeCard } from "./CodeCard";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    /* No reveal animation: the hero paints immediately so it can be the LCP. */
    <section className={styles.hero} aria-labelledby="hero-heading">
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <p className="label">{site.heroLabel}</p>
          <h1 id="hero-heading" className={styles.heading}>
            {site.heroHeading}
          </h1>
          <p className={`lead ${styles.support}`}>{site.heroSupport}</p>
          <TokenList items={site.stack} className={styles.stack} />
          <p className={styles.contact}>
            <a href={`mailto:${site.email}`} className={styles.email}>
              {site.email}
            </a>
          </p>
        </div>
        <CodeCard />
      </div>
    </section>
  );
}
