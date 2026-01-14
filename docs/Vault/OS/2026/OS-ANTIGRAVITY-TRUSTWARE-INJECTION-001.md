# 🧬 OS-ANTIGRAVITY-TRUSTWARE-INJECTION-001

**Tipo:** Integração de Produto (Frontend)
**Foco:** Conectar a Shell (Marketing) ao Núcleo (Audit)
**Executor:** Antigravity (Aurora)

#### 1. OBJETIVO TÁTICO

Criar a rota de destino do Terminal e montar os componentes clínicos existentes dentro da nova estrutura de pastas, garantindo que o "Modo Escuro" do terminal não quebre o "Modo Claro" da Home.

#### 2. INSTRUÇÕES DE EXECUÇÃO (PAYLOAD)

O Executor deve realizar as seguintes ações em `apps/genesis-front`:

**Passo A: Criar a Rota do Terminal (`app/terminal/page.tsx`)**

* **Vibe:** Isolamento acústico e visual.
* **Código Base:**
```tsx
import { TrustwareAuditTerminal } from '@/components/terminal/TrustwareAuditTerminal';

export default function TerminalPage() {
  return (
    // Força o tema escuro (Black Piano) apenas nesta rota, ignorando o layout branco
    <div className="min-h-screen bg-black text-gray-200 font-mono selection:bg-green-900 selection:text-white">

      {/* Header Minimalista do Terminal */}
      <header className="border-b border-white/10 p-6 flex justify-between items-center bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
           <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse"></div>
           <span className="text-xs tracking-[0.2em] uppercase text-gray-500">Genesis <span className="text-white">Trustware</span> Protocol</span>
        </div>
        <a href="/" className="text-xs text-gray-600 hover:text-white transition-colors uppercase tracking-widest">
          Sair do Terminal
        </a>
      </header>

      {/* O Núcleo Clínico */}
      <main className="max-w-7xl mx-auto p-6 md:p-12">
         <TrustwareAuditTerminal />
      </main>

    </div>
  );
}
```

**Passo B: Conectar a Home ao Terminal**

* Editar `app/page.tsx`.
* Localizar os botões "Iniciar Auditoria" e "Acessar Genesis Black".
* Transformá-los em `<Link href="/terminal">` (usando `next/link`).

**Passo C: Ajuste de Compatibilidade (CSS)**

* Garantir que o componente `TrustwareAuditTerminal` e seus filhos (`SlotRenderer`, etc.) estejam usando classes do Tailwind que funcionem bem sobre o fundo preto (ex: `text-white` ou `text-gray-300` em vez de cores hardcoded escuras).
* *Nota:* Se os componentes antigos estiverem "sujos", o Executor deve limpá-los para usar a paleta `bg-void` e `text-mono`.
