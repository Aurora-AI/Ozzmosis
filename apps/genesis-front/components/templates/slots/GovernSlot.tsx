import type { GovernBlock } from "../../../src/lib/templates/types"

export default function GovernSlot({ block }: { block: GovernBlock }) {
  const { title, body, ctas } = block.payload

  return (
    <section
      aria-label="Organizar e Governar"
      style={{
        paddingTop: "var(--space-16)",
        paddingBottom: "var(--space-20)",
        background: "var(--color-surface-alt)",
        borderTop: "var(--border-1)",
        borderBottom: "var(--border-1)",
      }}
    >
      <div className="g-container">
        <div className="g-card" style={{ padding: "var(--space-10)" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "var(--text-xl)",
              fontWeight: "var(--fw-bold)",
            }}
          >
            {title.value}
          </h2>
          <p
            className="g-muted"
            style={{
              marginTop: "var(--space-4)",
              marginBottom: 0,
              lineHeight: "var(--lh-relaxed)",
              maxWidth: "72ch",
            }}
          >
            {body.value}
          </p>

          <div
            style={{
              marginTop: "var(--space-6)",
              display: "flex",
              gap: "var(--space-3)",
            }}
          >
            {ctas.map((c) => (
              <button key={c.label} className="g-btn g-btn-primary" type="button">
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
