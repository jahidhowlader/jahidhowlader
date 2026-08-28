import { ImageResponse } from "next/og";

/**
 * Replaces the Create Next App default favicon with a monogram in the
 * site's own palette (see :root in globals.css) — no image asset needed.
 */
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#171614",
          color: "#f97316",
          fontFamily: "monospace",
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: -1,
        }}
      >
        JH
      </div>
    ),
    { ...size },
  );
}
