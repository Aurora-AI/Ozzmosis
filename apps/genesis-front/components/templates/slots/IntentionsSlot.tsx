import type { IntentionsBlock } from "../../../src/lib/templates/types"

export default function IntentionsSlot({ block }: { block: IntentionsBlock }) {
  const { title, items } = block.payload

  return (
    <section
      aria-label="Intenções"
      style={{ paddingTop: "var(--space-16)", paddingBottom: "var(--space-16)" }}
    >
      <div className="g-container">
        <h2
          style={{
            margin: 0,
            fontSize: "var(--text-xl)",
            fontWeight: "var(--fw-bold)",
            letterSpacing: "var(--ls-tight)",
          }}
        >
          {title.value}
        </h2>

        <div
          style={{
            marginTop: "var(--space-8)",
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "var(--space-6)",
          }}
        >
          {items.map((it) => (
            <div
              key={it.name.value}
              className="g-card"
              style={{ padding: "var(--space-8)" }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "var(--text-lg)",
                  fontWeight: "var(--fw-semibold)",
                }}
              >
                {it.name.value}
              </h3>
              <p
                className="g-muted"
                style={{
                  marginTop: "var(--space-3)",
                  marginBottom: 0,
                  lineHeight: "var(--lh-relaxed)",
                }}
              >
                {it.body.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
