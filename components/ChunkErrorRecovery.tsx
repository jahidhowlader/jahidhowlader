"use client";

import { useEffect } from "react";

const CHUNK_ERROR_PATTERN = /ChunkLoadError|Loading chunk [\w-]+ failed|Importing a module script failed/i;

/**
 * A tab left open across a Vercel redeploy can get silently reloaded by the
 * browser (e.g. Chrome discarding an inactive background tab) while still
 * pointing at the old build's hashed JS chunk URLs, which the CDN no longer
 * serves. That leaves React unable to hydrate — a blank page with no way to
 * recover short of a manual refresh. Reload once, automatically, instead.
 */
export function ChunkErrorRecovery() {
  useEffect(() => {
    const RELOAD_FLAG = "chunk-error-reload";

    const reloadOnce = () => {
      if (sessionStorage.getItem(RELOAD_FLAG)) return;
      sessionStorage.setItem(RELOAD_FLAG, "1");
      window.location.reload();
    };

    const onError = (event: ErrorEvent) => {
      if (CHUNK_ERROR_PATTERN.test(event.message)) reloadOnce();
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message =
        typeof reason === "string" ? reason : reason?.message ?? String(reason);
      if (CHUNK_ERROR_PATTERN.test(message)) reloadOnce();
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
