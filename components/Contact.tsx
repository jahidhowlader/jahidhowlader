import { site, social } from "@/content/site";
import { Section } from "./Section";
import { CopyEmail } from "./CopyEmail";
import styles from "./Contact.module.css";

export function Contact() {
  return (
    <Section id="contact" index="05" name="Contact">
      <div className={styles.wrap} data-reveal>
        <p className={styles.availability}>{site.availability}.</p>

        <div className={styles.emailRow}>
          <a href={`mailto:${site.email}`} className={styles.email}>
            {site.email}
          </a>
          <CopyEmail email={site.email} />
        </div>

        {social.length > 0 ? (
          <ul className={styles.social}>
            {social.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                  <span aria-hidden="true"> ↗</span>
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </Section>
  );
}
