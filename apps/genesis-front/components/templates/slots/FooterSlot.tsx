import type { FooterBlock } from "../../../src/lib/templates/types"

export default function FooterSlot({ block }: { block: FooterBlock }) {
  const { left, right } = block.payload

  return (
    <footer style={{ paddingTop: "var(--space-10)", paddingBottom: "var(--space-10)" }}>
      <div className="g-container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "var(--space-6)",
            alignItems: "center",
            borderTop: "var(--border-1)",
            paddingTop: "var(--space-6)",
          }}
        >
          <p className="g-muted" style={{ margin: 0, fontSize: "var(--text-sm)" }}>
            {left.value}
          </p>
          <p className="g-muted" style={{ margin: 0, fontSize: "var(--text-sm)" }}>
            {right.value}
          </p>
        </div>
      </div>
    </footer>
  )
}
