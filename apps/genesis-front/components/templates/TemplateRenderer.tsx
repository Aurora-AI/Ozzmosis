import type { GenesisTemplate } from "../../src/lib/templates/types"
import HeroSlot from "./slots/HeroSlot"
import ProofSlot from "./slots/ProofSlot"
import IntentionsSlot from "./slots/IntentionsSlot"
import GovernSlot from "./slots/GovernSlot"
import FooterSlot from "./slots/FooterSlot"

export default function TemplateRenderer({
  template,
}: {
  template: GenesisTemplate
}) {
  return (
    <main>
      {template.blocks.map((b) => {
        switch (b.id) {
          case "hero":
            return <HeroSlot key={b.id} block={b} />
          case "proof":
            return <ProofSlot key={b.id} block={b} />
          case "intentions":
            return <IntentionsSlot key={b.id} block={b} />
          case "govern":
            return <GovernSlot key={b.id} block={b} />
          case "footer":
            return <FooterSlot key={b.id} block={b} />
          default:
            return null
        }
      })}
    </main>
  )
}
