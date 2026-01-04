# TRANSCRIPTION PLAYBOOK — RODOBENS

Objetivo: transformar audio em SSOT auditavel (JSON segmentado) e legendas (.srt/.vtt).

## Checks rapidos (Windows)
```
where ffmpeg
where ffprobe
where elysian-transcribe
```

## Wrapper (recomendado, Windows + Vault + logs)
Cria um outdir por rodada em `apps/ozzmosis/data/vault/rodobens/trainings/transcripts/_runs/<run_tag>` e registra `run_meta.json` + `run_summary.json` (sem paths completos por default).

```
pwsh -File .\\scripts\\elysian-transcribe.ps1 -InputPath <pasta_ou_arquivo> -Recursive -Lang pt-BR -Model medium -Device cpu -ComputeType int8 -CpuThreads 0 -Workers 1 -BatchSize 8 -Vad -MergeSegments -Normalize -ToolVerbose
```

## Performance (Intel Iris / sem CUDA)
Intel Iris nao suporta `--device cuda`. Para acelerar, use tuning de CPU:
- `-CpuThreads 0` (default do wrapper: usa `CPU-1` threads)
- `-Workers 1` (suba para 2 se o disco aguentar)
- `-BatchSize 8` (suba para 12/16 se tiver RAM; baixe para 4 se ficar lento/instavel)

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
  - Recomendado (por rodada): `apps/ozzmosis/data/vault/rodobens/trainings/transcripts/_runs/<run_tag>/`

## Indexacao (Chronos)
- Ingerir `*_transcript.json` e indexar por origem, data e tags.
