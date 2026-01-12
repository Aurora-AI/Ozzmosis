import { motionClass } from "../../src/lib/motion"

function TrustCard({
  title,
  body,
  idx,
}: {
  title: string
  body: string
  idx: "1" | "2" | "3"
}) {
  return (
    <div className="g-card" data-stagger={idx} style={{ padding: "var(--space-8)" }}>
      <h3
        style={{
          margin: 0,
          fontSize: "var(--text-lg)",
          lineHeight: "var(--lh-tight)",
          fontWeight: "var(--fw-semibold)",
          letterSpacing: "var(--ls-tight)",
        }}
      >
        {title}
      </h3>
      <p
        className="g-muted"
        style={{
          marginTop: "var(--space-3)",
          marginBottom: 0,
          fontSize: "var(--text-md)",
          lineHeight: "var(--lh-relaxed)",
        }}
      >
        {body}
      </p>
    </div>
  )
}

export default function TrustSection() {
  return (
    <section
      aria-label="Pilares de confiança"
      style={{
        paddingTop: "var(--space-16)",
        paddingBottom: "var(--space-16)",
      }}
    >
      <div className="g-container">
        <div className={motionClass("revealStagger")}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-8)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: "var(--text-xl)",
                  lineHeight: "var(--lh-tight)",
                  fontWeight: "var(--fw-bold)",
                  letterSpacing: "var(--ls-tight)",
                }}
              >
                Confiança não é estética. É governança.
              </h2>
              <p
                className="g-muted"
                style={{
                  margin: 0,
                  fontSize: "var(--text-md)",
                  lineHeight: "var(--lh-relaxed)",
                  maxWidth: "72ch",
                }}
              >
                Este frontend é um compilador de intenção: tokens como SSOT visual,
                motion como primitivo governado e UI como prova operacional.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: "var(--space-6)",
              }}
            >
              <TrustCard
                idx="1"
                title="Tokens-only"
                body="Sem hardcode visual. Cor, espaçamento e tipografia são governados por tokens."
              />
              <TrustCard
                idx="2"
                title="Motion legível"
                body="Primitives nomeadas e determinísticas (DevTools-friendly). Nada de animação solta."
              />
              <TrustCard
                idx="3"
                title="Composição por seções"
                body="Páginas são composição. Seções semânticas são o bloco de construção."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
