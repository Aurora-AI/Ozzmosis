# Elysian Brain - Taxonomia (Produto vs Toolbelt)

## Objetivo
Separar claramente o produto `elysian-brain` do subproduto `toolbelt`,
evitando confusao em auditoria e evidencias.

## Produto
- Nome: `elysian-brain`
- Escopo: biblioteca principal do dominio Elysian
- SSOT: `libs/elysian-brain`

## Subproduto (Toolbelt)
- Nome: `elysian_brain.toolbelt`
- Escopo: utilitarios de ingestao e operacao (ex.: transcribe, pdf2md)
- SSOT: `libs/elysian-brain/src/elysian_brain/toolbelt`

## Nota para auditoria
O toolbelt e um subproduto do `elysian-brain`, mas deve ser rastreado
como output distinto em evidencias e playbooks.
