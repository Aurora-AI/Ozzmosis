# 🧬 ORDEM DE SERVIÇO: OS-TRANSPLANTE-ALVARO-CORE-001

**ID:** `OS-TRANSPLANTE-ALVARO-CORE-001`
**Prioridade:** ALTA (Identidade Central)
**Executor:** CODEX / Agente Técnico
**Objetivo:** Transplantar a pasta `alvaro/` (Consciência) do repositório Campanha para `apps/alvaro-core` no Ozzmosis.

#### 1. VARIÁVEIS DE AMBIENTE

* **Origem (Doador):** `C:\Aurora\Campanha\alvaro`
* **Destino (Receptor):** `C:\Aurora\Ozzmosis\apps\alvaro-core`

#### 2. PROCEDIMENTO DE EXTRAÇÃO (Script PowerShell)

```powershell
# --- INÍCIO DO TRANSPLANTE DE CONSCIÊNCIA ---

$Source = "C:\Aurora\Campanha\alvaro"
$Dest = "C:\Aurora\Ozzmosis\apps\alvaro-core"

Write-Host "🧠 Iniciando Transplante do Álvaro: $Source -> $Dest"

# 1. Validação da Fonte
if (!(Test-Path $Source)) {
    Write-Error "⛔ ERRO: A consciência do Álvaro não está em '$Source'."
    exit 1
}

# 2. Preparação do Núcleo (Criar ou Limpar)
if (!(Test-Path $Dest)) {
    New-Item -ItemType Directory -Force -Path $Dest | Out-Null
    Write-Host "✨ Criando novo córtex em $Dest"
}

# 3. Cópia dos Arquivos (Preservando estrutura: ingest, knowledge, policies)
Write-Host "📦 Transferindo memórias e políticas..."
Copy-Item -Path "$Source\*" -Destination $Dest -Recurse -Force

# 4. Inicialização Python (Toque de Vida)
# O Álvaro precisa ser um pacote Python válido. Vamos criar a estrutura se não existir.
if (!(Test-Path "$Dest\pyproject.toml")) {
    Write-Host "🐍 Criando configuração base (pyproject.toml)..."
    $PyProject = @"
[tool.poetry]
name = "alvaro-core"
version = "0.1.0"
description = "Núcleo de Identidade e Memória do Sistema Aurora"
authors = ["Aurora AI"]

[tool.poetry.dependencies]
python = "^3.11"
fastapi = "^0.109.0"
uvicorn = "^0.27.0"

[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"
"@
    Set-Content -Path "$Dest\pyproject.toml" -Value $PyProject
}

# Criar estrutura src se não houver
if (!(Test-Path "$Dest\src")) {
    New-Item -ItemType Directory -Force -Path "$Dest\src\alvaro" | Out-Null
    New-Item -ItemType File -Force -Path "$Dest\src\alvaro\__init__.py" | Out-Null
}

Write-Host "✅ Transplante do Álvaro Concluído."

```
