# ELYBI INTEGRATION PLAN — Ozzmosis

Data: 2026-01-02

## Opcao escolhida
Opcao A (integracao leve).

## Justificativa
- O Elysian Brain existe como codigo em `C:\Aurora\Elysian\apps/aurora-brain`.
- O Ozzmosis hoje tem gates focados em Node; trazer Python completo adiciona risco de CI.
- O prazo e objetivo pedem integracao rapida com baixo impacto no contrato atual.

## Estrutura final (Ozzmosis)
```
libs/elysian-brain/
  pyproject.toml
  README.md
  src/elysian_brain/toolbelt/transcribe/batch_subtitles.py
  tests/test_smoke_transcribe_cli.py

apps/ozzmosis/data/vault/ozzmosis/
  ELYBI_FORENSICS.md
  ELYBI_INTEGRATION_PLAN.md
  ELYBI_EXECUTION_EVIDENCE.md

apps/ozzmosis/data/vault/rodobens/
  TRANSCRIPTION_PLAYBOOK.md
  trainings/transcripts/.gitkeep
```

## Contratos de integracao
- Proto (fonte Elysian): `shared/proto/aurora_brain.v1.proto`
- Consumo no Ozzmosis: registrar contratos e playbooks no Vault; chamadas a ferramentas via CLI.

## Como Vault e Chronos consomem outputs STT
- Saidas oficiais: `.srt`, `.vtt`, `*_transcript.json`
- Vault recebe playbook e estrutura de transcripts.
- Chronos indexa o JSON segmentado como evidencia auditavel.
