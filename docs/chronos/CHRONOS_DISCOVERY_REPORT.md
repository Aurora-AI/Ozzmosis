# Chronos Discovery Report (WP0) — OS-OZZMOSIS-CHRONOS-INTEGRATION-AND-LOCAL-CHAT-001

**Fonte (somente leitura):** `Aurora-AI/Elysian-Lex-Front` (clone local temporário em `.__source__/elysian-lex-front`)  
**Recorte autorizado:** `apps/chronos-backoffice` + `libs/trustware`  

## 1) Existência do recorte (gate WP0)
- `apps/chronos-backoffice`: encontrado
- `libs/trustware`: encontrado

## 2) Árvore (até 2 níveis)

### `apps/chronos-backoffice`
```
Dockerfile
jest.config.cjs
next.config.js
package.json
postcss.config.cjs
tailwind.config.ts
tsconfig.json
vercel.json
src/
src/app/
src/components/
src/hooks/
src/lib/
```

### `libs/trustware`
```
package.json
tsconfig.json
src/
src/index.ts
src/schemas/
```

## 3) package.json (fonte)

### `apps/chronos-backoffice/package.json`
```json
{
  "name": "@aurora/chronos-backoffice",
  "version": "1.0.0-genesis",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start -p 3000",
    "lint": "next lint",
    "test:survival": "jest --config jest.config.cjs"
  },
  "dependencies": {
    "@aurora/trustware": "*",
    "@tanstack/react-query": "^5.0.0",
    "framer-motion": "^11.0.0",
    "next": "14.1.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/jest": "^29.5.0",
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "autoprefixer": "^10.4.0",
    "jest": "^29.7.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "ts-jest": "^29.2.0",
    "typescript": "^5.3.0"
  }
}
```

### `libs/trustware/package.json`
```json
{
  "name": "@aurora/trustware",
  "version": "1.0.0",
  "private": true,
  "main": "src/index.ts",
  "dependencies": {
    "zod": "^3.22.0"
  }
}
```

## 4) Varredura de riscos (WP0)

### Imports para fora do recorte
- Observado apenas uso de `@aurora/trustware` (o próprio recorte).

### Uso de `process.env` (sem validação forte)
- Encontrado: `apps/chronos-backoffice/src/lib/api.ts` usa `NEXT_PUBLIC_CHRONOS_MODE`, `NEXT_PUBLIC_SHIELD_URL`/`SHIELD_URL` e `SHIELD_TOKEN`.

### Side-effects de install/runtime
- Não encontrado `postinstall` no `package.json` do recorte.
- Não encontrados padrões de escrita em disco (`fs.writeFile*`, `appendFile*`) no recorte (busca por string).

### Provider cloud hardcoded (OpenAI/Anthropic/etc.)
- Não encontrado no recorte (busca por string).

## 5) Decisão WP0
- Prosseguir para WP1 (importação bruta do recorte autorizado).

