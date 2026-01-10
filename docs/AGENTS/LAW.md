# Lei dos Agentes - Manual de Construcao Aurora

## Regra de Precedencia (Lei)
O documento **Manual de Construcao Aurora** e a lei tecnica operacional do repositorio.

**Prevalencia:**
- Em qualquer divergencia entre instrucoes, READMEs, comentarios, templates, OSs e documentos auxiliares,
  prevalece o Manual de Construcao.

## Referencia Canonica
- Caminho canonico: `docs/manual/Manual_de_Construcao_Aurora.md`
- Versao vigente: `docs/manual/Manual_de_Construcao_Aurora_v5.0.md`

## Obrigacao dos Agentes
Todo agente CLI/IDE/Executor (Codex/Copilot/Conductor/etc.) deve:
1. Ler o Manual antes de executar qualquer OS que gere ou altere codigo.
2. Aplicar o Manual como "policy layer" (regras de estrutura, gates, padroes e qualidade).
3. Em caso de duvida, assumir o comportamento mais conservador e alinhado ao Manual.

## Nao Conformidade
Se uma execucao ignorar o Manual, a entrega e invalida e deve ser refeita.

## Regra Canônica — Gates em Ambiente Linux (Container)

Em ambientes Windows, o gate `npm ci` pode falhar de forma intermitente por locks/EPERM em binários nativos do Node (`*.node`), mesmo com medidas de mitigação (kill de processos e exclusão temporária do Defender).

**Regra:**
- O gate local Windows (`scripts/agents/run-gates.ps1`) é **best-effort** quando houver falhas EPERM/locks.
- O runner canônico e determinístico para validação é o **Linux container gate**:
    - `scripts/agents/run-gates-linux.ps1`

Este runner executa `npm ci`, `repo:check` e `audit:maturity` em Linux, gerando artefatos em `artifacts/` e eliminando a classe de falhas de filesystem do Windows.
