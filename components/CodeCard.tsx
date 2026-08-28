import { site } from "@/content/site";
import styles from "./CodeCard.module.css";

/**
 * Decorative editor-style panel for the hero. Purely visual — the code
 * shown is representative, not live data, so it renders as static markup
 * (no client JS) and stays out of the hero's LCP path.
 */
export function CodeCard() {
  return (
    <div className={styles.wrap} aria-hidden="true">
      <span className={styles.floatToken} style={{ ["--fx" as string]: "8%", ["--fy" as string]: "6%", ["--fd" as string]: "0s" }}>
        {"</>"}
      </span>
      <span className={styles.floatToken} style={{ ["--fx" as string]: "88%", ["--fy" as string]: "14%", ["--fd" as string]: "0.6s" }}>
        {"{ }"}
      </span>
      <span className={styles.floatToken} style={{ ["--fx" as string]: "92%", ["--fy" as string]: "78%", ["--fd" as string]: "1.1s" }}>
        git
      </span>
      <span className={styles.floatToken} style={{ ["--fx" as string]: "4%", ["--fy" as string]: "84%", ["--fd" as string]: "0.3s" }}>
        01
      </span>

      <div className={styles.card}>
        <div className={styles.titlebar}>
          <span className={styles.dots} aria-hidden="true">
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </span>
          <span className={styles.filename}>developer.ts</span>
        </div>

        <div className={styles.body}>
          <ol className={styles.lines}>
            <li>
              <span className={styles.kw}>const</span> developer{" "}
              <span className={styles.punct}>= {"{"}</span>
            </li>
            <li className={styles.indent}>
              name<span className={styles.punct}>:</span>{" "}
              <span className={styles.str}>&quot;{site.name}&quot;</span>
              <span className={styles.punct}>,</span>
            </li>
            <li className={styles.indent}>
              role<span className={styles.punct}>:</span>{" "}
              <span className={styles.str}>&quot;{site.role}&quot;</span>
              <span className={styles.punct}>,</span>
            </li>
            <li className={styles.indent}>
              passion<span className={styles.punct}>:</span>{" "}
              <span className={styles.str}>&quot;Building digital experiences&quot;</span>
              <span className={styles.punct}>,</span>
            </li>
            <li className={styles.indent}>
              stack<span className={styles.punct}>:</span>{" "}
              <span className={styles.punct}>[</span>
              {site.stack.map((tech, i) => (
                <span key={tech}>
                  <span className={styles.str}>&quot;{tech}&quot;</span>
                  {i < site.stack.length - 1 && <span className={styles.punct}>, </span>}
                </span>
              ))}
              <span className={styles.punct}>]</span>
              <span className={styles.cursor} />
            </li>
            <li>
              <span className={styles.punct}>{"}"}</span>
            </li>
          </ol>
        </div>

        <div className={styles.statusbar}>
          <span className={styles.branch}>⎇ main</span>
          <span className={styles.statusRight}>UTF-8 · TypeScript</span>
        </div>
      </div>
    </div>
  );
}
