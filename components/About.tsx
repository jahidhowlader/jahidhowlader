import Image from "next/image";
import { about } from "@/content/about";
import { Section } from "./Section";
import styles from "./About.module.css";

export function About() {
  const hasPhoto = about.photo.src.length > 0;

  return (
    <Section id="about" index="04" name="About">
      <div className={`${styles.layout} ${hasPhoto ? styles.withPhoto : ""}`} data-reveal>
        {hasPhoto ? (
          <div className={styles.frame}>
            <Image
              src={about.photo.src}
              alt={about.photo.alt}
              width={about.photo.width}
              height={about.photo.height}
              sizes="(min-width: 900px) 220px, 45vw"
              priority={false}
              className={styles.photo}
            />
          </div>
        ) : null}

        <div className={styles.prose}>
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className={styles.paragraph}>
              {paragraph}
            </p>
          ))}

          <dl className={styles.meta}>
            {about.meta.map((entry) => (
              <div key={entry.label} className={styles.metaRow}>
                <dt className="label">{entry.label}</dt>
                <dd className={styles.metaValue}>{entry.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
