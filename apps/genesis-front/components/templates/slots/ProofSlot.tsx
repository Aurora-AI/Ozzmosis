import type { ProofBlock } from "../../../src/lib/templates/types"
import { motionClass } from "../../../src/lib/motion"

export default function ProofSlot({ block }: { block: ProofBlock }) {
  const { title, bullets } = block.payload

  return (
    <section
      aria-label="Prova de diferença"
      style={{ paddingTop: "var(--space-16)", paddingBottom: "var(--space-16)" }}
    >
      <div className="g-container">
        <div className={motionClass("revealStagger")}>
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
            {bullets.map((b, i) => (
              <div
                key={b.title.value}
                className="g-card"
                data-stagger={String(i + 1)}
                style={{ padding: "var(--space-8)" }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: "var(--text-lg)",
                    fontWeight: "var(--fw-semibold)",
                  }}
                >
                  {b.title.value}
                </h3>
                <p
                  className="g-muted"
                  style={{
                    marginTop: "var(--space-3)",
                    marginBottom: 0,
                    lineHeight: "var(--lh-relaxed)",
                  }}
                >
                  {b.body.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
