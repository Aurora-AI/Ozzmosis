import type { HeroBlock } from "../../../src/lib/templates/types"
import { motionClass } from "../../../src/lib/motion"

function MediaPlaceholder() {
  return (
    <div
      className="g-card"
      style={{
        padding: "var(--space-10)",
        width: "100%",
      }}
      aria-label="Espaço reservado para vídeo ou mídia"
    >
      <p className="g-muted" style={{ margin: 0, fontSize: "var(--text-sm)" }}>
        Slot de mídia (vídeo/imagem)
      </p>
      <p
        style={{
          marginTop: "var(--space-3)",
          marginBottom: 0,
          fontSize: "var(--text-md)",
        }}
      >
        Preparado para link ou upload. Nenhuma mídia aplicada ainda.
      </p>
    </div>
  )
}

export default function HeroSlot({ block }: { block: HeroBlock }) {
  const { kicker, headline, subhead, ctas } = block.payload

  return (
    <section
      aria-label="Hero"
      style={{
        paddingTop: "var(--space-20)",
        paddingBottom: "var(--space-16)",
        borderBottom: "var(--border-1)",
      }}
    >
      <div className="g-container">
        <div className={motionClass("fadeInUp")}>
          <p
            className="g-muted"
            style={{
              margin: 0,
              fontSize: "var(--text-sm)",
              letterSpacing: "var(--ls-wide)",
              textTransform: "uppercase",
              fontWeight: "var(--fw-semibold)",
            }}
          >
            {kicker.value}
          </p>

          <div style={{ marginTop: "var(--space-10)" }}>
            <MediaPlaceholder />
          </div>

          <h1
            style={{
              marginTop: "var(--space-10)",
              marginBottom: "var(--space-6)",
              fontSize: "var(--text-2xl)",
              lineHeight: "var(--lh-tight)",
              letterSpacing: "var(--ls-tight)",
              fontWeight: "var(--fw-bold)",
              maxWidth: "44ch",
              whiteSpace: "pre-line",
            }}
          >
            {headline.value}
          </h1>

          <p
            className="g-muted"
            style={{
              margin: 0,
              fontSize: "var(--text-md)",
              lineHeight: "var(--lh-relaxed)",
              maxWidth: "72ch",
            }}
          >
            {subhead.value}
          </p>

          <div
            style={{
              display: "flex",
              gap: "var(--space-3)",
              marginTop: "var(--space-8)",
            }}
          >
            {ctas.map((c) => {
              const cls =
                c.kind === "primary"
                  ? "g-btn g-btn-primary"
                  : c.kind === "secondary"
                    ? "g-btn"
                    : "g-btn"

              return (
                <button key={c.label} className={cls} type="button">
                  {c.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
