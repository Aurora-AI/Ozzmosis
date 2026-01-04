# ELYBI FORENSICS — Elysian Brain (status factual)

Data: 2026-01-02

## Status factual
Elysian Brain existe como codigo no repo `C:\Aurora\Elysian`, em `apps/aurora-brain`.

## Evidencias (paths reais)

### Tree resumido (Elysian)
```
apps/aurora-brain/
  pyproject.toml
  src/aurora_brain/
    config.py
    agent/worker.py
    graph/master.py
    toolkits/
      file_toolkit.py
      git_toolkit.py
      shell_toolkit.py
  tests/test_toolkits.py
```

### Proto encontrado
```
shared/proto/aurora_brain.v1.proto
```

### Empacotamento (pyproject.toml)
- `apps/aurora-brain/pyproject.toml` (name = "aurora-brain", packages = aurora_brain from src)

### Comandos (WP0/WP1)
- `git -C C:\Aurora\Elysian remote -v`
- `git -C C:\Aurora\Elysian rev-parse HEAD`
- `git -C C:\Aurora\Elysian status -sb`
- `tree /f /a C:\Aurora\Elysian\apps\aurora-brain`
- `tree /f /a C:\Aurora\Elysian\shared\proto`
- `Get-ChildItem -Recurse -Filter pyproject.toml -Path C:\Aurora\Elysian`
- `Get-ChildItem -Recurse -Filter "aurora_brain.v1.proto" -Path C:\Aurora\Elysian`
- `rg -n "aurora[-_ ]brain|elysian[-_ ]brain|brain|toolbelt|transcribe|whisper|ffmpeg" -S C:\Aurora\Elysian`

## Tabela de achados
| Elemento | Repo | Path | Tipo |
| --- | --- | --- | --- |
| aurora-brain package | Elysian | apps/aurora-brain/pyproject.toml | config |
| aurora_brain code | Elysian | apps/aurora-brain/src/aurora_brain | codigo |
| toolkits | Elysian | apps/aurora-brain/src/aurora_brain/toolkits | codigo |
| tests | Elysian | apps/aurora-brain/tests/test_toolkits.py | codigo |
| proto | Elysian | shared/proto/aurora_brain.v1.proto | proto |
