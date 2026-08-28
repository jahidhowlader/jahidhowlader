"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Contact.module.css";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked or unavailable — the mailto link beside this
      // button still works, so there is nothing useful to recover here.
    }
  }

  return (
    <>
      <button type="button" onClick={copy} className={`label ${styles.copy}`}>
        {copied ? "Copied" : "Copy"}
      </button>
      <span aria-live="polite" className={styles.srOnly}>
        {copied ? `${email} copied to clipboard` : ""}
      </span>
    </>
  );
}
