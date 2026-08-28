import styles from "./Diagrams.module.css";

type DiagramProps = { alt: string };

/** One cart component, three independently written host themes. */
export function ThemesDiagram({ alt }: DiagramProps) {
  const panels = [0, 1, 2];
  return (
    <svg viewBox="0 0 660 220" className={styles.svg} role="img" aria-label={alt}>
      {panels.map((i) => {
        const x = 12 + i * 216;
        return (
          <g key={i}>
            <rect x={x} y={16} width={196} height={188} className={styles.frame} />
            <text x={x + 10} y={34}>{`Theme ${String.fromCharCode(65 + i)}`}</text>

            {/* Theme's own furniture differs panel to panel. */}
            <line x1={x + 10} y1={44} x2={x + 186 - i * 40} y2={44} className={styles.muted} />
            <line x1={x + 10} y1={52} x2={x + 140 + i * 15} y2={52} className={styles.muted} />

            {/* The same cart, holding its shape in every panel. */}
            <rect x={x + 28} y={70} width={140} height={116} className={styles.cartFill} />
            <line x1={x + 28} y1={92} x2={x + 168} y2={92} className={styles.cart} />
            <rect x={x + 40} y={104} width={54} height={10} className={styles.chip} />
            <rect x={x + 40} y={122} width={80} height={10} className={styles.chip} />
            <rect x={x + 40} y={150} width={116} height={6} className={styles.accentFill} />
            <text x={x + 40} y={175}>Cart</text>

            {/* Theme styles reaching toward the cart. */}
            <path
              d={`M ${x + 14} 60 C ${x + 20} 70, ${x + 22} 74, ${x + 26} 78`}
              className={styles.muted}
            />
          </g>
        );
      })}
    </svg>
  );
}

/** One implementation, many merchant configurations. */
export function ConfigurationDiagram({ alt }: DiagramProps) {
  const merchants = [
    { label: "Merchant 1", on: [true, true, false, false] },
    { label: "Merchant 2", on: [true, false, true, true] },
    { label: "Merchant 3", on: [false, true, true, false] },
  ];
  return (
    <svg viewBox="0 0 660 252" className={styles.svg} role="img" aria-label={alt}>
      <rect x={12} y={20} width={168} height={64} className={styles.cartFill} />
      <text x={26} y={46} className={styles.strong}>One implementation</text>
      <text x={26} y={64}>Cart UI</text>

      {merchants.map((m, i) => {
        const y = 20 + i * 68;
        return (
          <g key={m.label}>
            <path d={`M 180 52 C 220 52, 220 ${y + 30}, 258 ${y + 30}`} className={styles.muted} />
            <rect x={258} y={y} width={390} height={52} className={styles.frame} />
            <text x={272} y={y + 20}>{m.label}</text>
            {m.on.map((enabled, j) => (
              <rect
                key={j}
                x={272 + j * 92}
                y={y + 28}
                width={80}
                height={12}
                className={enabled ? styles.inkFill : styles.chip}
              />
            ))}
          </g>
        );
      })}

      <text x={272} y={240}>Enabled</text>
      <rect x={330} y={232} width={26} height={8} className={styles.inkFill} />
      <text x={378} y={240}>Not enabled</text>
      <rect x={456} y={232} width={26} height={8} className={styles.chip} />
    </svg>
  );
}

/** Initial load versus load-on-demand. */
export function SplittingDiagram({ alt }: DiagramProps) {
  return (
    <svg viewBox="0 0 660 190" className={styles.svg} role="img" aria-label={alt}>
      <text x={12} y={28}>Everything upfront</text>
      <rect x={12} y={38} width={520} height={24} className={styles.cartFill} />
      <text x={26} y={55}>Initial load</text>

      <line x1={12} y1={94} x2={648} y2={94} className={styles.frame} />

      <text x={12} y={124}>Split by need</text>
      <rect x={12} y={134} width={168} height={24} className={styles.cartFill} />
      <text x={26} y={151}>Initial load</text>

      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={200 + i * 116} y={134} width={104} height={24} className={styles.muted} />
          <text x={212 + i * 116} y={151}>On demand</text>
        </g>
      ))}
      <text x={12} y={182}>Smaller first paint cost inside the merchant’s storefront</text>
    </svg>
  );
}
