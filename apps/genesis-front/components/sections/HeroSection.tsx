import { motionClass } from "../../src/lib/motion"

export default function HeroSection() {
  return (
    <section
      aria-label="Proposição de valor"
      style={{
        paddingTop: "var(--space-20)",
        paddingBottom: "var(--space-16)",
        borderBottom: "var(--border-1) solid var(--color-border)",
      }}
    >
      <div className="g-container">
        <div className={motionClass("fadeInUp")}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-6)",
              alignItems: "flex-start",
            }}
          >
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
              Rodobens • Wealth • Genesis
            </p>

            <h1
              style={{
                margin: 0,
                fontSize: "var(--text-2xl)",
                lineHeight: "var(--lh-tight)",
                letterSpacing: "var(--ls-tight)",
                fontWeight: "var(--fw-bold)",
                maxWidth: "38ch",
              }}
            >
              O usuário não preenche formulários. Ele constrói decisões — e nós
              registramos a verdade.
            </h1>

            <p
              className="g-muted"
              style={{
                margin: 0,
                fontSize: "var(--text-md)",
                lineHeight: "var(--lh-relaxed)",
                maxWidth: "64ch",
              }}
            >
              Skeleton canônico para o frontend Genesis (Wealth). Tokens-first,
              motion governado e composição por seções semânticas — pronto para
              evoluir para plataforma.
            </p>

            <div style={{ display: "flex", gap: "var(--space-3)" }}>
              <button className="g-btn g-btn-primary" type="button">
                Simular cenário
              </button>
              <button className="g-btn" type="button">
                Ver como funciona
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
