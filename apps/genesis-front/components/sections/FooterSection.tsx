export default function FooterSection() {
  return (
    <footer style={{ paddingTop: "var(--space-10)", paddingBottom: "var(--space-10)" }}>
      <div className="g-container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "var(--space-6)",
            alignItems: "center",
            borderTop: "var(--border-1) solid var(--color-border)",
            paddingTop: "var(--space-6)",
          }}
        >
          <p
            className="g-muted"
            style={{
              margin: 0,
              fontSize: "var(--text-sm)",
              lineHeight: "var(--lh-normal)",
            }}
          >
            Genesis • Rodobens Wealth • Frontend Factory
          </p>

          <p
            className="g-muted"
            style={{
              margin: 0,
              fontSize: "var(--text-sm)",
              lineHeight: "var(--lh-normal)",
            }}
          >
            Tokens SSOT • Motion Governado • Seções Semânticas
          </p>
        </div>
      </div>
    </footer>
  )
}
