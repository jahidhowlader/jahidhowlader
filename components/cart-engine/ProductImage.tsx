import type { ProductImageKey } from "@/domain/cart-engine/cart/types";
import styles from "./ProductImage.module.css";

const VIEWBOX = "0 0 48 48";
const STROKE_PROPS = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function TeeIcon() {
  return (
    <path d="M16 6 10 10 6 16 11 20 14 17 14 40 34 40 34 17 37 20 42 16 38 10 32 6 28 9C26 10.5 22 10.5 20 9Z" />
  );
}

function HoodieIcon() {
  return (
    <>
      <path d="M16 8C16 4 32 4 32 8L38 12 42 18 37 21 34 18 34 40 14 40 14 18 11 21 6 18 10 12Z" />
      <path d="M19 8C22 12 26 12 29 8" />
      <rect x="19" y="27" width="10" height="8" rx="1" />
    </>
  );
}

function ToteIcon() {
  return (
    <>
      <path d="M12 16 36 16 34 40 14 40Z" />
      <path d="M18 16C18 9 30 9 30 16" />
    </>
  );
}

function MugIcon() {
  return (
    <>
      <rect x="9" y="14" width="21" height="22" rx="2" />
      <path d="M30 18C38 18 38 30 30 30" />
      <path d="M15 6C15 6 17 8 15 10" />
      <path d="M20 6C20 6 22 8 20 10" />
    </>
  );
}

const ICONS: Record<ProductImageKey, () => React.JSX.Element> = {
  tee: TeeIcon,
  hoodie: HoodieIcon,
  tote: ToteIcon,
  mug: MugIcon,
};

export function ProductImage({
  image,
  className,
  label,
  size,
}: {
  image: ProductImageKey;
  className?: string;
  label?: string;
  /** Fixed square size in px. Omit to fill the parent at a 1:1 aspect ratio. */
  size?: number;
}) {
  const Icon = ICONS[image];
  return (
    <span
      className={`${styles.thumb} ${className ?? ""}`}
      style={size ? { width: size, height: size } : undefined}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      <svg viewBox={VIEWBOX} aria-hidden="true" {...STROKE_PROPS}>
        <Icon />
      </svg>
    </span>
  );
}
