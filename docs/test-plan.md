# Plano de testes

## Matriz de risco

| Superficie                             | Tipo de teste                  | Evidencia atual                                                                     | Proximo marco                                 |
| -------------------------------------- | ------------------------------ | ----------------------------------------------------------------------------------- | --------------------------------------------- |
| Contratos, envelopes e validacao       | Unidade e contrato             | `tests/api-http.vitest.test.js`, `tests/api-http.test.cjs`, `npm run openapi:check` | Cobrir cada schema e erro enumerado           |
| Rate limit, idempotencia e resiliencia | Integracao Node                | `tests/api-http.test.cjs`                                                           | Adicionar replay, conflito e timeout          |
| Concierge IA e fallback                | Unidade, endpoint e componente | `api/ai/recommend.js`, `AiConciergeSection.jsx`                                     | Mockar provider, moderacao e estados de retry |
| Navegacao e catalogo                   | Componente e jornada           | Auditoria responsiva estatica e build                                               | Playwright desktop/mobile                     |
| Seguranca e privacidade                | Auditoria automatizada         | `npm run audit:claude`, lint, logs redigidos                                        | `npm audit --audit-level=high` sem excecoes   |

## Regra de cobertura

Codigo novo ou alterado deve atingir 100% de statements, branches, functions e lines antes de ser marcado como concluido. O baseline legado permanece medido por `npm run test:coverage`; o relatorio atual registra a distancia ate 100% sem esconder modulos nao exercitados.

## Gates

- `npm run lint`
- `npm run format:check`
- `npm run typecheck`
- `npm run test:api`
- `npm run test:coverage`
- `npm run openapi:check`
- `npm run openspec:check`
- `npm run audit:claude`
- `npm run build`
- `npm run audit:high`
