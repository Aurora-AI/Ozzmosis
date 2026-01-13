import TemplateRenderer from "../components/templates/TemplateRenderer"
import { genesisTemplateV0 } from "../src/lib/templates/genesis-v0"
import { loadTemplateForRender } from "../src/lib/templates"

const EXTERNAL_TEMPLATE: unknown = null
// Futuro: EXTERNAL_TEMPLATE virá de fetch / file / API.
// Neste WP, mantemos o adapter pronto sem dependência de rede.

export default function Page() {
  const input = EXTERNAL_TEMPLATE ?? genesisTemplateV0
  const loaded = loadTemplateForRender(input)

  if (!loaded.ok) {
    // Fail-safe: renderiza template canônico local
    return <TemplateRenderer template={genesisTemplateV0} />
  }

  return <TemplateRenderer template={loaded.template} />
}
