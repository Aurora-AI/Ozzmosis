import TemplateRenderer from "../components/templates/TemplateRenderer"
import { genesisTemplateV0 } from "../src/lib/templates/genesis-v0"

export default function Page() {
  return <TemplateRenderer template={genesisTemplateV0} />
}
