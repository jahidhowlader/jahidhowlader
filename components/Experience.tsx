import { roles } from "@/content/experience";
import { Section } from "./Section";
import styles from "./Experience.module.css";

export function Experience() {
  return (
    <Section id="experience" index="02" name="Experience">
      {roles.map((role) => (
        <article key={role.company} className={styles.role} data-reveal>
          <div className={styles.head}>
            <h3 className={styles.company}>{role.company}</h3>
            <p className={`label ${styles.period}`}>{role.period}</p>
          </div>

          <p className={styles.meta}>
            {role.title} · {role.location}
          </p>

          {role.product ? <p className={styles.product}>{role.product}</p> : null}

          <ul className={styles.bullets}>
            {role.bullets.map((bullet) => (
              <li key={bullet} className={styles.bullet}>
                {bullet}
              </li>
            ))}
          </ul>

          {role.productLink ? (
            <p className={styles.link}>
              <a
                href={role.productLink.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {role.productLink.label}
                <span aria-hidden="true"> ↗</span>
              </a>
            </p>
          ) : null}
        </article>
      ))}
    </Section>
  );
}
