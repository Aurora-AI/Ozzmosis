# Policy — Risco Operacional (Conductor)

Objetivo:
Definir sinais e gatilhos de risco **explicáveis** para acionar alertas e recomendações.

Princípios:
- Risco deve ser acionado por evidência (dados).
- Tempo é contexto, não julgamento.
- O sistema não pune; ele recomenda ações gerenciais.

## Sinais (exemplos de baseline para MVP)
1) Silêncio operacional
- ausência de eventos relevantes (proposta, reunião, oferta) acima de uma janela configurável

2) Queda abrupta de produção
- queda percentual relevante em VGV ofertado vs média recente

3) Esgotamento do círculo quente
- hot_lead_ratio em queda persistente sem substituição por agenda fria

4) Falha de travessia
- baixa taxa de agendamento→apresentação em leads frios por janela definida

## Ações recomendadas (outputs do Conductor)
- “Protocolo de Travessia”: plano de prospecção fria e agenda
- “Protocolo de Referência Ativa”: elevar índice de indicação
- “Protocolo de Carteira”: ação imediata em eventos de contemplação/alavancagem
