# SSOT — Máquina de Estados (Jornada do Consultor Ademicon)

Este documento define a máquina de estados oficial da Jornada do Consultor (Ademicon) para o MVP do edital.

Premissas:
- Estados não são “tempo fixo”. O tempo é **faixa de referência** (comparação e doutrina), nunca regra rígida.
- A transição é dirigida por **sinais de qualidade/performance** + evidências operacionais.
- O objetivo é governança e leitura executiva: poucos estados, alta clareza.

## Estados (v2 — Wealth/Consórcio)

| ID | Estado | Faixa típica (referência) | Sinal de Entrada (exemplos) | KPI de Sucesso (qualidade) | Risco (Conductor) |
|---:|---|---|---|---|---|
| E1 | EM FORMAÇÃO | 0–90 dias | Início de trilha técnica / simulações / estudo do produto | domínio mínimo (checklist), primeiras ofertas de VGV | “Desistência por fricção técnica” |
| E2 | INCUBAÇÃO | 3–6 meses | primeiras propostas e conversões no círculo quente | taxa de conversão hot, confiança consultiva, agenda de reuniões | “Ilusão de competência (falso topo)” |
| E3 | TRAVESSIA | 6–12 meses | queda de hot lead ratio + necessidade de prospecção fria | volume de reuniões frias, cadência, pipeline frio saudável | “Vale da Morte / churn por silêncio” |
| E4 | CONSOLIDAÇÃO | 12–18 meses | consistência de produção + carteira iniciando recorrência | índice de indicação crescente, previsibilidade de VGV, LTV | “Estagnação / método frágil” |
| E5 | GESTÃO DE FORTUNA | 18+ meses | carteira madura e recorrente (indicação e alavancagem) | LTV alto, upsell/alavancagem, indicação > patamar | “Saída p/ concorrência / subutilização de carteira” |

## Transições (regras conceituais, auditáveis)

- E1 → E2: evidência de domínio mínimo + início de ofertas de VGV + primeiras conversões (mesmo que pequenas).
- E2 → E3: hot circle esgota (queda de hot_lead_ratio) **e** passa a existir necessidade real de agenda fria; risco aumenta se reuniões frias não surgirem.
- E3 → E4: evidência de método de prospecção fria funcionando (reuniões/apresentações) + estabilização de produção.
- E4 → E5: carteira recorrente consolidada + indicação sustentada + eventos de alavancagem/upsell.
- Qualquer estado → EM RISCO (overlay): se sinais críticos (silêncio prolongado, queda abrupta, ausência de agenda) cruzarem thresholds definidos em Policies.

Nota:
- “EM RISCO” é overlay/flag operacional; não substitui os 5 estados principais. A banca vê o estado + o risco.

## O que NÃO entra aqui
- Login em CRM como KPI primário (não reflete o chão de fábrica)
- Gamificação, ranking agressivo, punição pública
