# TRUSTWARE DESIGN CONTRACT

**Versão:** 1.0.0
**Status:** CANÔNICO
**Diretriz-Mãe:** "Terminal de auditoria, não landing page."

---

## 1. PRINCÍPIOS FUNDAMENTAIS

O design do Aurora/Ozzmosis deve refletir autoridade clínica e precisão técnica.
Qualquer elemento que remeta a marketing tradicional ou manipulação psicológica é estritamente proibido.

### 1.1 PROIBIÇÕES (HARD RULES)

- **NÃO ao CTA (Call to Action) agressivo:** Botões devem ser declarações de intenção, não convites à ação.
- **NÃO à Urgência:** Proibido o uso de cores de destaque para forçar cliques ou criar senso de escassez.
- **NÃO à Gamificação:** Sem confetes, sons de sucesso, barras de progresso "viciantes" ou medalhas.
- **NÃO ao Layout "Mobile-First" genérico:** O foco é densidade de informação para análise pesada.

---

## 2. ESTADOS CANÔNICOS

Todos os componentes de UI devem suportar e expressar visualmente apenas estes quatro estados:

| Estado | Significado | Tratamento Visual |
| :--- | :--- | :--- |
| `pass` | Verificado e validado | Verde clínico (#22c55e), peso normal. |
| `warn` | Atenção necessária, sem bloqueio | Âmbar (#f59e0b), bordas suaves. |
| `blocked` | Erro crítico ou violação de contrato | Vermelho técnico (#ef4444), alto contraste. |
| `insufficient_data` | Aguardando telemetria/entrada | Cinza neutro (#71717a), itálico ou placeholder. |

---

## 3. INTENSIDADE VISUAL

- **Linguagem Clínica:** Uso predominante de fontes sans-serif de alta legibilidade (Inter/Roboto Mono).
- **Contraste:** Preto Piano (#050505) e Branco Absoluto (#FFFFFF).
- **Micro-animações:** Apenas para feedback de sistema (ex: "Carregando telemetria"), com duração < 200ms e easing linear ou `power3.out`.

---

## 4. DICIONÁRIO DE FALLBACKS (Strings Exatas)

Em caso de incerteza ou falha de sistema, use estritamente:

- **Erro genérico:** "Falha na integridade do contrato."
- **Aguardando:** "Sincronizando telemetria técnica..."
- **Sem dados:** "Dados insuficientes para decisão."

---

## 5. CHECKLIST DE REVISÃO (DESIGN AUDIT)

Antes de aprovar uma UI, responda:

1. Isso parece um terminal de auditoria ou um panfleto? (Deve parecer terminal)
2. Existe algum elemento tentando "vender" algo ao usuário? (Remova se houver)
3. O contraste respeita os estados `pass | warn | blocked`?
4. A densidade de informação está otimizada para transparência radical?

---
## ASSINATURA

*Assinado: Antigravity Governance Protocol*
