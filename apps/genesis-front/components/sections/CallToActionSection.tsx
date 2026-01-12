import { motionClass } from "../../src/lib/motion"

export default function CallToActionSection() {
  return (
    <section
      aria-label="Chamada para ação"
      style={{
        paddingTop: "var(--space-12)",
        paddingBottom: "var(--space-20)",
        background: "var(--color-surface-alt)",
        borderTop: "1px solid var(--color-border)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div className="g-container">
        <div className={`${motionClass("fadeIn")} g-card`} style={{ padding: "var(--space-10)" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-4)",
              alignItems: "flex-start",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "var(--text-xl)",
                lineHeight: "var(--lh-tight)",
                fontWeight: "var(--fw-bold)",
                letterSpacing: "var(--ls-tight)",
              }}
            >
              Pronto para materializar o Genesis Rodobens?
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
              Skeleton entregue. Próximo passo: conectar as decisões (inputs) aos
              componentes e evoluir o catálogo por domínio com guardrails.
            </p>

            <div style={{ display: "flex", gap: "var(--space-3)" }}>
              <button className="g-btn g-btn-primary" type="button">
                Abrir decisão
              </button>
              <button className="g-btn" type="button">
                Revisar tokens
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
