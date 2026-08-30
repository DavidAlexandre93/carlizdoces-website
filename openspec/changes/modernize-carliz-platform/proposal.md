## Why

O site possui uma boa base visual e comercial, mas a linha de base atual não compila, o lint não inicia, apenas um utilitário de API é testado e há dependências vulneráveis e contratos implícitos. A mudança eleva a experiência da marca e estabelece uma plataforma segura, observável e evolutiva, sem transformar uma landing page em um sistema desnecessariamente complexo.

## What Changes

- Unificar a cadeia de desenvolvimento e produção em Vite, corrigir os quality gates e remover dependências redundantes/vulneráveis do Webpack.
- Refinar a identidade visual com tokens consistentes, hierarquia editorial, responsividade, acessibilidade, estados de interação e uma experiência de erro elegante.
- Introduzir um concierge de IA opcional para recomendar doces e planejar quantidades, com resposta estruturada, moderação, privacidade, fallback determinístico e chave somente no servidor.
- Formalizar os limites das APIs com DTOs validados, envelope de resposta, códigos enumerados, idempotência, rate limiting e documentação OpenAPI/Swagger.
- Instrumentar requisições e dependências com OpenTelemetry e logs JSON correlacionados, redigindo PII e mantendo stack trace completo apenas nos logs do servidor.
- Fortalecer persistência com uma migração Supabase transacional e constraints para operações atômicas; manter degradação explícita quando a infraestrutura externa não estiver configurada.
- Expandir testes de unidade, integração, contrato e frontend, com plano de cobertura total e thresholds incrementais executáveis no CI.
- Adotar Conventional Commits/Commitlint e padronizar lint, formatação, typecheck, cobertura, build, OpenSpec e auditoria no pipeline.
- Remover qualquer estrutura de Claude Code do projeto; a varredura atual não encontrou artefatos `.claude`, portanto o gate passa ao garantir que eles permaneçam ausentes.

### Objetivos mensuráveis

- `lint`, `format:check`, `typecheck`, testes, coverage e build devem concluir com sucesso.
- Toda API pública deve aparecer no contrato OpenAPI e retornar envelopes tipados e validados.
- Logs de erro devem conter `requestId`, `traceId`, classe/nome, origem e stack sem incluir e-mail, telefone, IP bruto, tokens ou corpo completo.
- O frontend deve oferecer estados acessíveis de carregamento, indisponibilidade e recuperação para ações remotas.
- O bundle inicial deve deixar recursos pesados e a experiência de IA fora do caminho crítico sempre que possível.

### Não objetivos

- Criar autenticação, backoffice, checkout financeiro ou substituir o WhatsApp como canal de fechamento.
- Prometer ACID em stores de memória; essa garantia pertence ao adaptador persistente Supabase e às suas transações.
- Acoplar a disponibilidade do site à OpenAI, Resend, Supabase ou qualquer outro serviço externo.
- Adicionar padrões, bibliotecas ou camadas apenas para satisfazer terminologia arquitetural.

## Capabilities

### New Capabilities

- `storefront-experience`: experiência comercial moderna, responsiva, acessível e resiliente, incluindo feedback e recuperação de falhas.
- `ai-concierge`: recomendações e planejamento de doces assistidos por IA com segurança, privacidade, contratos estruturados e fallback.
- `api-platform`: contratos DTO/OpenAPI, idempotência, validação, tratamento de erros, health checks e persistência transacional.
- `observability`: logs JSON redigidos, correlação de requisições e traces OpenTelemetry para APIs e dependências externas.
- `quality-engineering`: gates estáticos, estratégia de testes e cobertura, segurança de dependências e convenções de contribuição.

### Modified Capabilities

Nenhuma. Este é o primeiro baseline de especificações do repositório.

## Impact

- Frontend React, estilos globais, roteamento, componentes de interação e fluxo de pedido.
- Vercel Functions em `api/`, migrações Supabase e integrações OpenAI/Resend.
- Manifesto de dependências, configuração Vite/TypeScript/ESLint/Prettier, scripts e workflows GitHub Actions.
- Novos artefatos OpenSpec, contrato OpenAPI, runbook de observabilidade e plano de testes.
- Dependências externas: OpenAI, coletor OTLP, Supabase e Resend, todas configuradas por ambiente e opcionais para navegação básica.
- Limitação operacional: rate limit, idempotência e métricas em memória são best-effort em instâncias serverless; garantias distribuídas exigem o adaptador persistente documentado.
