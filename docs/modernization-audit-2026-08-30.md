# Auditoria técnica — baseline de 30/08/2026

## Escopo

Foram inventariados 79 arquivos de código, configuração, testes, SQL e documentação, somando 10.410 linhas, além de assets públicos, workflows e variáveis de ambiente (somente nomes, nunca valores).

## Resultado antes da modernização

| Gate | Resultado | Evidência resumida |
| --- | --- | --- |
| Build | Falha | Webpack apontava para `src/index.js`, mas o entry existente é `src/index.jsx`. |
| ESLint | Falha | Config flat recebia `plugins` em formato legado por meio de uma configuração incompatível. |
| Coverage | Parcial | 3 testes; somente `api/_lib/http.js`: 78,43% lines, 58,62% branches e 84% functions. |
| Formatação | Passa, escopo insuficiente | Apenas `.github`, `package.json` e `README.md` eram verificados. |
| Dependências | Falha | 26 alertas: 2 críticos, 12 altos, 10 moderados e 2 baixos. |
| OpenAPI | Ausente | Endpoints descritos manualmente no README, sem contrato validável. |
| Tipagem | Ausente nos limites | Payloads eram objetos JavaScript validados parcialmente e sem DTO compartilhado. |
| Observabilidade | Parcial | Logs JSON e métricas locais existiam, sem OTEL, redação recursiva ou stack estruturada. |
| Idempotência/ACID | Ausente/parcial | Stores serverless em memória; operações de retry podiam repetir efeitos. |
| Claude Code | Ausente | Nenhum `.claude`, `CLAUDE.md` ou arquivo com nome Claude foi encontrado fora de dependências. |

## Achados arquiteturais

- Duas cadeias de build divergentes (Vite e Webpack) aumentavam drift, dependências e vulnerabilidades.
- `HomePage.jsx` e `App.css` concentram responsabilidades e dificultam teste/manutenção, mas uma reescrita completa seria desproporcional.
- Integrações HTTP já possuíam timeout, retry e circuit breaker; a melhoria correta é consolidar contratos, logging e idempotência em torno dessa base.
- Likes/ratings em memória são adequados apenas como fallback local. A garantia ACID exige transação no adaptador persistente.
- A identidade artesanal é forte e possui imagens reais; o refinamento deve preservar esse patrimônio visual e reduzir ruído no caminho de conversão.

## Direção aprovada no OpenSpec

Vite único, arquitetura modular por feature, portas/adaptadores nas integrações, Strategy para IA/fallback, Decorator para middleware, Circuit Breaker para dependências e DTOs validados por schema. A fonte de verdade está em `openspec/changes/modernize-carliz-platform/`.
