# Chronos — Local LLM (Ollama)

## Objetivo
Habilitar um chat interno no Chronos Backoffice usando um SLM local via Ollama, sem API key externa e sem fallback cloud.

## Pré-requisitos
- Ollama instalado e rodando localmente.
- Um modelo baixado (ex.: `llama3.1`).

## Variáveis de ambiente
- `CHRONOS_LLM_PROVIDER=ollama` (default)
- `OLLAMA_BASE_URL=http://127.0.0.1:11434` (default)
- `CHRONOS_LLM_MODEL=llama3.1` (default)

## Rodar o Chronos Backoffice
```bash
npm ci
npm run dev:chronos
```

Abrir:
- `http://localhost:3000/ops/chat`

## Smoke manual
1. Garanta que o Ollama está rodando em `OLLAMA_BASE_URL`.
2. Abra o `/ops/chat`.
3. Envie uma mensagem simples (ex.: “Resuma o que é o Chronos Backoffice”).
4. Confirme streaming e ausência de persistência local.

