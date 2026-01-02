# TRANSCRIPTION PLAYBOOK — RODOBENS

Objetivo: transformar audio em SSOT auditavel (JSON segmentado) e legendas (.srt/.vtt).

## CLI (CPU)
```
elysian-transcribe --input <pasta_ou_arquivo> --recursive --lang pt --model medium --vad --format all
```

## CLI (GPU)
```
elysian-transcribe --input <pasta_ou_arquivo> --recursive --lang pt --model medium --device cuda --compute-type float16 --vad --format all
```

## Padroes de nomes
- SRT: `<nome>.srt`
- VTT: `<nome>.vtt`
- JSON: `<nome>_transcript.json`

## Onde salvar outputs
- Base recomendada: `apps/ozzmosis/data/vault/rodobens/trainings/transcripts/`

## Indexacao (Chronos)
- Ingerir `*_transcript.json` e indexar por origem, data e tags.
