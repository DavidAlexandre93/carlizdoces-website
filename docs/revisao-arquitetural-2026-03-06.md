# Revisão completa da aplicação Carliz Doces (2026-03-06)

## Escopo e método

- Revisão estática do código-fonte (`src/`, `api/`, `scripts/`, `webpack.config.js`, workflows e README).
- Execução de checks locais disponíveis (`npm run lint`, `npm run build`) para validar esteiras básicas.
- Não foram encontrados testes automatizados no repositório.

---

## 1) Arquitetura & Design

### Pontos positivos

- Existe uma organização razoável por áreas (`app`, `components`, `features`, `hooks`, `data`, `api`) e documentação de arquitetura no README.
- Há separação parcial entre front-end (SPA) e backend serverless (pasta `api`).

### Problemas encontrados

- **Média**: coexistem dois entrypoints (`src/index.js` e `src/main.jsx`) e dois `App` (`src/App.js` e `src/App.jsx`), criando ambiguidade arquitetural e risco de regressão por código “paralelo”.
- **Média**: `HomePage` concentra responsabilidades de orquestração, UI, estado, regras de likes/ratings, efeitos e integrações externas no mesmo arquivo (com alta chance de acoplamento e baixa coesão).
- **Baixa**: há adaptação local de bibliotecas (`src/react-router-dom.js`, `src/motion/react.js`, `src/mui-*`) que pode dificultar manutenção futura se não houver justificativa técnica documentada.

### Recomendações

- Consolidar para um único entrypoint e uma única implementação de `App`.
- Extrair “use cases”/serviços de likes, ratings e contato para camada de aplicação (hooks finos + serviços puros).
- Dividir `HomePage` em composição de containers por seção e hooks especializados.

---

## 2) Clean Code & Qualidade

### Pontos positivos

- Nomes de domínio são, em geral, compreensíveis para o contexto de negócio (produtos, vitrine, pedidos, avaliações).

### Problemas encontrados

- **Alta**: dead code potencial (`src/App.js`) com comportamento diferente da app principal, aumentando custo cognitivo.
- **Média**: presença de funções e efeitos longos na HomePage; responsabilidades misturadas (estado de modal, carrinho, likes, ratings, contato e animações).
- **Média**: inconsistência entre estilos/idiomas de mensagens (português/inglês) e convenções de código entre arquivos.
- **Média**: lint não executa no ambiente atual sem instalação bem-sucedida de dependências; lockfile parece fora de sincronia com `package.json`.

### Recomendações

- Eliminar arquivos obsoletos e manter apenas fluxos usados em produção.
- Aplicar refatoração orientada por coesão (hooks menores e componentes de domínio).
- Normalizar padrão de nomenclatura e idioma de mensagens de erro/resposta.
- Corrigir lockfile e garantir que `npm ci` passe localmente e no CI.

---

## 3) Boas práticas de API

### Pontos positivos

- Endpoints usam métodos HTTP apropriados e retornam status code básicos (200/400/405/500/502).
- Há validação mínima de payload no endpoint de contato e ratings.

### Problemas encontrados

- **Alta**: shape de erro não padronizado entre endpoints (`error`, `details`, mensagens pt/en misturadas).
- **Média**: APIs de likes/ratings usam armazenamento em memória global; não há garantias de durabilidade em ambiente serverless.
- **Média**: ausência de paginação/filtros/limites para crescimento de dados (quando migrar para persistência real).
- **Baixa**: sem versionamento de API (aceitável no estágio atual, mas recomendável quando contratos estabilizarem).

### Recomendações

- Definir contrato único de erro, ex.: `{ code, message, details?, requestId? }`.
- Padronizar i18n de mensagens e validar schema de entrada com biblioteca (zod/yup/joi).
- Planejar `/api/v1` para evolução segura de contrato.

---

## 4) Segurança (Obrigatório)

### Pontos positivos

- Uso de variáveis de ambiente para segredos sensíveis (Resend/Firebase).
- Sanitização básica de texto no endpoint de contato.

### Problemas encontrados

- **Alta**: não há autenticação/autorização para endpoints de likes/ratings; qualquer cliente pode acionar e manipular contadores.
- **Alta**: rate limit ausente em endpoints públicos (contato/likes/ratings), abrindo margem para abuso.
- **Média**: captura de IP no corpo de e-mail pode gerar risco de exposição de dados pessoais e obrigações LGPD adicionais.
- **Média**: ausência explícita de headers de segurança (CSP, X-Content-Type-Options, etc.) no app/hosting.
- **Média**: não há evidência de SAST/SCA ativo no pipeline além do Dependabot (sem gate de segurança).

### Recomendações

- Adicionar rate limiting por IP + proteção anti-bot (hCaptcha/reCAPTCHA) no contato.
- Adotar política de minimização de dados (evitar envio de IP bruto por e-mail, ou mascarar/hash).
- Aplicar headers de segurança em Vercel/hosting.
- Incluir `npm audit --omit=dev` (ou ferramenta dedicada) em pipeline e tratar CVEs relevantes.

---

## 5) Tratamento de erros & Confiabilidade

### Problemas encontrados

- **Média**: tratamento de erros existe, mas sem correlação (requestId/log padrão) e sem taxonomia consistente.
- **Média**: integrações externas (Resend/Supabase) não têm retry/backoff explícitos.
- **Média**: ausência de timeouts explícitos em requisições fetch no backend e cliente customizado.
- **Baixa**: sem estratégia de idempotência para operações sensíveis (não crítico no caso atual, mas desejável para escalabilidade).

### Recomendações

- Implementar helper HTTP com timeout + retry exponencial para integrações externas críticas.
- Propagar `requestId` nas respostas de erro.
- Definir matriz de erros (4xx funcionais x 5xx técnicos).

---

## 6) Performance & Escalabilidade

### Pontos positivos

- Uso de `lazy`/`Suspense` em seções secundárias.
- Geração automatizada de dados de imagens para evitar manutenção manual extensa.

### Problemas encontrados

- **Média**: componente principal (`HomePage`) muito pesado em responsabilidades; pode impactar tempo de interação e manutenção.
- **Baixa**: sem evidências de métricas de performance (LCP/CLS/INP) monitoradas.
- **Baixa**: sem estratégia explícita de cache HTTP para imagens/API.

### Recomendações

- Quebrar HomePage em módulos assíncronos por domínio.
- Adicionar medição de Web Vitals e orçamento de bundle.
- Definir cache-control para assets estáticos.

---

## 7) Banco de dados & Migrações

### Pontos positivos

- Existe SQL auxiliar em `supabase/likes_anon.sql` e integração prevista com Supabase.

### Problemas encontrados

- **Média**: não há pasta/versionamento de migrações estruturadas (ex.: `supabase/migrations`).
- **Média**: sem evidência de constraints e políticas RLS documentadas para tabelas críticas.

### Recomendações

- Versionar migrações com convenção temporal.
- Documentar constraints, índices e políticas RLS por tabela.

---

## 8) Observabilidade

### Problemas encontrados

- **Alta**: não há padrão de logs estruturados com correlação.
- **Média**: inexistência de métricas operacionais (latência, taxa de erro, throughput).
- **Média**: sem healthcheck/readiness explícitos para endpoints.

### Recomendações

- Adotar logger estruturado com `requestId`.
- Publicar endpoint `/api/health` simples e adicionar monitoramento básico.

---

## 9) Testes

### Problemas encontrados

- **Alta**: não foram encontrados testes unitários, integração, e2e ou contrato.
- **Alta**: sem meta de cobertura/gates no CI.

### Recomendações

- Iniciar com testes unitários de hooks (`useCart`, `useProductRatings`, `useWhatsAppOrderLink`).
- Adicionar integração para APIs (`contact-email`, `ratings`, `likes`).
- Implementar e2e de fluxo crítico (seleção de produto → pedido WhatsApp → envio contato).

---

## 10) Frontend

### Pontos positivos

- Aplicação rica em UI, com componentização em seções e hooks reaproveitáveis.
- Uso de lazy loading em partes não críticas.

### Problemas encontrados

- **Média**: falta cobertura automatizada de UI/fluxos.
- **Média**: ausência explícita de estratégia a11y (testes/checagens).
- **Baixa**: risco de regressão com alto volume de estado local centralizado.

### Recomendações

- Adicionar testes de acessibilidade (axe) e smoke tests de navegação.
- Reduzir estado global da HomePage via hooks de domínio e reducers.

---

## 11) CI/CD & Qualidade Automatizada

### Pontos positivos

- CI com lint + build e CD para preview/produção.
- Dependabot configurado para npm e GitHub Actions.

### Problemas encontrados

- **Alta**: CI usa `npm ci`, mas lockfile não está sincronizado com `package.json`, o que tende a quebrar pipeline.
- **Média**: sem etapa de testes (porque não há suíte), sem gate de cobertura.
- **Média**: sem SAST/SCA com política de falha por severidade.

### Recomendações

- Sincronizar lockfile e garantir reproducibilidade local/CI.
- Evoluir pipeline para `lint + test + build + security scan`.

---

## 12) Docker/Infra

### Situação

- Não há `Dockerfile`/`docker-compose`/IaC no repositório.

### Recomendação

- Opcional no estágio atual; se necessário para padronização de ambiente, criar `Dockerfile` multi-stage + compose de desenvolvimento.

---

## 13) Documentação

### Pontos positivos

- README está acima da média: visão geral, stack, setup, scripts, variáveis, API, deploy e troubleshooting.

### Lacunas

- **Baixa**: faltam ADRs e convenções de contribuição mais completas (branching/PR checklist/DoD).
- **Baixa**: faltam exemplos de resposta de erro padronizada e decisões de segurança.

### Recomendação

- Acrescentar seção de arquitetura decisória (ADRs) + guia de contribuição e checklist de PR.

---

## 14) Entregáveis do review

## Lista priorizada de problemas

### Alta

1. Ausência de suíte de testes e cobertura/gates.
2. Segurança de endpoints públicos sem autenticação/rate-limit.
3. Inconsistência de lockfile que compromete `npm ci` e potencialmente CI.
4. Falta de padrão de observabilidade (logs estruturados/métricas).

### Média

1. `HomePage` com muitas responsabilidades (acoplamento/cohesão baixa).
2. Contrato de erro e idioma inconsistentes nas APIs.
3. Persistência em memória para likes/ratings em ambiente serverless.
4. Ausência de timeouts/retries padronizados em integrações externas.
5. Migrações/DB governance pouco estruturadas.

### Baixa

1. Ambiguidade de entrypoints e arquivo `App.js` legado.
2. Falta de documentação de ADRs/contribuição.
3. Ausência de estratégia explícita de cache e web vitals.

## Sugestões de refatoração (antes/depois)

### Exemplo 1 — Padronização de erro API

**Antes**

```js
res.status(400).json({ error: 'productId inválido' });
```

**Depois (proposto)**

```js
res.status(400).json({
  code: 'VALIDATION_ERROR',
  message: 'Campo productId inválido.',
  details: [{ field: 'productId', reason: 'required_string' }],
  requestId,
});
```

### Exemplo 2 — Quebra de responsabilidades na HomePage

**Antes**

```jsx
// HomePage: likes + ratings + contato + modais + animações + carrinho
```

**Depois (proposto)**

```jsx
const likes = useStoreLikes(seasonalProducts);
const ratings = useCatalogRatings(seasonalProducts);
const contact = useContactForm();
```

## Plano de ação

### Quick wins (1–2 semanas)

1. Corrigir lockfile e garantir `npm ci` verde.
2. Remover arquivos/entrypoints legados não utilizados.
3. Criar wrapper de erro API padronizado e aplicar nos endpoints existentes.
4. Implementar rate limit básico em `/api/contact-email`.
5. Adicionar testes unitários iniciais para hooks críticos.

### Refactor maior (3–6 semanas)

1. Modularizar `HomePage` por domínios (likes, ratings, carrinho, contato).
2. Introduzir camada de serviços para integrações (Supabase/Resend) com timeout+retry.
3. Estruturar observabilidade (logs estruturados, requestId, healthcheck, métricas iniciais).
4. Definir governança de banco (migrações versionadas + RLS/constraints documentadas).
5. Evoluir CI/CD com testes, cobertura e segurança automatizada.
