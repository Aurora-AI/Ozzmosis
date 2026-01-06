# pdf2md - Rodobens Wealth (Hardware-Agnostic)

Conversor deterministico de PDFs para Markdown com:
- preservacao de tabelas (quando possivel)
- metadados e hashes (auditoria)
- pipeline idempotente
- selecao de backend (OpenVINO/CUDA/CoreML/CPU) quando OCR for habilitado

## Uso (Windows / PowerShell)
```powershell
python scripts/rodobens/pdf2md/pdf2md.py `
  --input "C:\Users\rodri\OneDrive\Rodobens" `
  --vault "apps/ozzmosis/data/vault/rodobens-wealth" `
  --mode auto
```

## Modos
- `text` : apenas extracao texto/tabelas (pdfplumber). Mais deterministico.
- `ocr`  : forca OCR (para scans). Requer deps opcionais.
- `auto` : tenta text; se falhar (pouco texto), cai para OCR (se disponivel).

## Saidas
- sources/: copia do PDF + manifest
- knowledge/_generated/: .md gerados
- knowledge/_index/: index.json para busca/rastreamento
- evidence/: logs, hashes e relatorios
