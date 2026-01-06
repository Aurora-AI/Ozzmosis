# Rodobens Wealth - Vault Ingest Playbook (PDF->MD)

## Objetivo
Converter PDFs em Markdown deterministico com:
- front-matter (engine + hashes + metadata)
- index.json global
- runs auditaveis

## Padrao SSOT
- raw/: PDFs copiados (fonte bruta)
- processed/: MD gerados
- index/index.json: indice navegavel
- _runs/: metadados por execucao

## Execucao (Windows)
```powershell
scripts/rodobens/pdf2md.ps1 -SourceDir "C:\Users\rodri\OneDrive\Rodobens" -Category "regulamentos"
```

## Execucao (Linux/Mac)
```bash
scripts/rodobens/pdf2md.sh "/path/to/Rodobens" "apps/ozzmosis/data/vault/rodobens-wealth" "regulamentos"
```

## Variaveis (hardware-agnostic)
- AURORA_PDF2MD_PREFER_OPENVINO=true
- AURORA_PDF2MD_PREFER_CUDA=true
- AURORA_PDF2MD_PREFER_COREML=true

Observacao: nesta fase a selecao e documentada; OCR real entra na OS 019A.
