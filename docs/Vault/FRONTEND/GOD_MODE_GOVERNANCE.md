# GOD_MODE_GOVERNANCE.md

## Governança Canônica de Experimentação Cognitiva (God Mode)

**Projeto:** Aurora / Ozzmosis / Genesis
**Status:** 🟢 VIGENTE
**Natureza:** Constitucional (Produto & Plataforma)
**Aplicável a:** Sites, Landing Pages, Apps, Plataformas

---

## 1. Propósito do God Mode

O **God Mode** existe para permitir **experimentação cognitiva controlada** (por domínio), sem violar:

- Production-First
- Trustware (auditabilidade e previsibilidade)
- SSOT/Vault
- Consistência sistêmica
- Arquitetura biomimética (interface como estímulo ao “cérebro humano”, não como estética)

**God Mode não flexibiliza o sistema.**
Ele cria um **laboratório governado** dentro do sistema.

---

## 2. Princípio Fundamental

> **Nada experimental entra em produção sem validação mínima mensurável.**

Validação não é gosto.
Validação não é “ficou bonito”.
Validação é **pontuação atingida** + **evidência registrada**.

---

## 3. Os Três Níveis do Sistema (Imutável)

### 3.1 Nível A — CANON (DNA)

Imutável. Não negociável.

- tokens base
- tipografia base
- motion primitives base
- regras de contraste e acessibilidade
- registry de componentes
- decisões estruturais (Absolute White / Black Piano / regra 3%)

🔒 O Canon **nunca** é alterado diretamente por experimento.

### 3.2 Nível B — DOMAIN SKIN (Fisiologia por domínio)

Variações permitidas e versionadas por domínio cognitivo:

- `juridico`
- `seguros`
- `wealth`
- (outros futuros)

Pode variar **somente**:

- tokens semânticos (ex.: acento, superfícies, densidade)
- presets de tipografia (ritmo)
- intensidade de motion dentro de limites
- micro-ajustes de hierarquia (sem quebrar tokens e regras do Canon)

Não pode:

- criar componentes fora do registry
- violar contraste e acessibilidade
- criar paleta livre
- alterar Canon

### 3.3 Nível C — GOD MODE / EXPERIMENT (Laboratório)

Sandbox controlado e temporário.

- sempre identificado
- sempre auditável
- sempre reversível
- nunca default
- nunca “merge direto para produção”

---

## 4. Protocolo de Criação de Experimento (Obrigatório)

Todo experimento deve declarar:

```yaml
experiment_id: EXP-YYYYMMDD-XXX
domain: seguros | juridico | wealth | other
hypothesis: "O que se espera melhorar e por quê"
cognitive_goal: confiança | conversão | clareza | redução_de_ansiedade | autoridade | outro
mode: experiment
expiration: YYYY-MM-DD
```

Sem essas chaves: **experimento inválido**.

---

## 5. Sistema de Pontuação Cognitiva (SPC)

### 5.1 Dimensões (0 a 10)

Cada experimento é avaliado em 5 dimensões:

1. **Clareza Cognitiva**
   O usuário entende o que está acontecendo e o que fazer em seguida?

2. **Coerência Emocional**
   A UI evoca a emoção correta para o domínio (ex.: confiança/segurança em seguros; autoridade/clareza em jurídico)?

3. **Carga Cognitiva**
   O esforço mental é adequado (evita ansiedade, excesso de escolha, confusão)?

4. **Direcionalidade**
   A interface orienta claramente a próxima ação (sem “vazio decisório”)?

5. **Confiança / Autoridade**
   O sistema transmite credibilidade compatível com o risco percebido do domínio?

### 5.2 Pontuação Final

```text
Pontuação Final = Média simples das 5 dimensões
```

### 5.3 Nota de Corte (NÃO NEGOCIÁVEL)

> **Nota mínima para aprovação em produção: 8.0**

Regras:

- **< 7.0** → Rejeitado
- **7.0 a 7.9** → Iteração obrigatória (não promove)
- **≥ 8.0** → Elegível para promoção (Skin ou Canon) via OS

Sem exceções.

---

## 6. Evidências Obrigatórias (Artifacts)

Todo experimento deve gerar evidência material:

- screenshots comparativos
- relatório breve (hipótese, avaliação, notas, decisão)
- checklist de não violação do Canon
- referência explícita ao `experiment_id`

Local padrão:

```text
artifacts/frontend/experiments/<experiment_id>/
```

Sem artifacts: pontuação inválida.

---

## 7. Promoção de Experimento (Sem atalhos)

Se **Pontuação Final ≥ 8.0**, o experimento pode ser promovido:

### Opção A — Virar Domain Skin

Quando o ganho é específico do domínio.

### Opção B — Virar Canon

Quando o ganho é estrutural/universal.

Regra dura:

- Promoção **sempre** ocorre via **OS formal** (um WP = um commit).
- Nunca por merge direto.
- Nunca por decisão oral.

---

## 8. Bloqueios e Garantias

O sistema deve impedir:

- build de experimento como “production”
- vazamento de tokens experimentais para Canon
- alteração do Canon sem OS
- queda de acessibilidade

Violação: bloqueio de pipeline.

---

## 9. Princípio Biomimético (Regra de Ouro)

> Canon é DNA.
> Skins são órgãos.
> God Mode é laboratório.

Nenhum laboratório altera o DNA sem protocolo, teste e validação.

---

## 10. Mantra Final

> **Experimentar é obrigatório. Aprovar é difícil. Produção é privilégio.**
