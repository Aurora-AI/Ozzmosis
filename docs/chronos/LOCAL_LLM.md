# Chronos — Local LLM (Ollama)

## Objetivo
Habilitar um chat interno no Chronos Backoffice usando um SLM local via Ollama, sem API key externa e sem fallback cloud.

## Pré-requisitos
- Ollama instalado e rodando localmente.
- Um modelo baixado (ex.: `llama3.1`).

## Variáveis de ambiente
- `CHRONOS_LLM_PROVIDER=ollama` (default)
- `OLLAMA_BASE_URL=http://127.0.0.1:11434` (ou `http://127.0.0.1:11434/v1` para OpenAI compatibility)
- `CHRONOS_LLM_MODEL=llama3.1` (default)
- `OLLAMA_API_KEY=ollama` (opcional; placeholder para OpenAI compatibility local)

## DeepSeek (DEMO ONLY)
O provider DeepSeek é suportado apenas para demonstrações (cloud, não soberano).
- Não é usado em CI.
- Não há fallback automático.
- Nunca use dados sensíveis.

Env:
```bash
CHRONOS_LLM_PROVIDER=deepseek
DEEPSEEK_API_KEY=sk-...
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat

# UI banner
NEXT_PUBLIC_CHRONOS_PROVIDER=deepseek
```

## Setup local — `.env.local`

1. Copie `apps/chronos-backoffice/.env.example` → `apps/chronos-backoffice/.env.local`
2. Preencha com seus valores:

   **Ollama (soberano, recomendado):**
   ```env
   CHRONOS_LLM_PROVIDER=ollama
   OLLAMA_BASE_URL=http://127.0.0.1:11434/v1
   CHRONOS_LLM_MODEL=llama3.1
   OLLAMA_API_KEY=ollama
   NEXT_PUBLIC_CHRONOS_PROVIDER=ollama
   ```

   **DeepSeek (DEMO apenas):**
   ```env
   CHRONOS_LLM_PROVIDER=deepseek
   DEEPSEEK_API_KEY=sk-SUA_CHAVE_AQUI
   DEEPSEEK_BASE_URL=https://api.deepseek.com
   DEEPSEEK_MODEL=deepseek-chat
   NEXT_PUBLIC_CHRONOS_PROVIDER=deepseek
   ```

**Importante:** `.env.local` **nunca é commitado** (coberto por `.gitignore`).

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
