## 1. Baseline e cadeia de ferramentas

- [ ] 1.1 Registrar falhas atuais de lint, build, segurança e cobertura no relatório de auditoria.
- [ ] 1.2 Consolidar desenvolvimento e produção em Vite, remover Webpack/Babel redundantes e atualizar dependências vulneráveis.
- [ ] 1.3 Configurar ESLint flat, Prettier, typecheck progressivo, aliases e scripts de quality gate reproduzíveis.
- [ ] 1.4 Validar o grupo com install limpo, lint, format check, typecheck e build.

## 2. Plataforma HTTP, contratos e observabilidade

- [ ] 2.1 Criar enums, schemas DTO, envelopes de sucesso/erro e validação centralizada para os endpoints públicos.
- [ ] 2.2 Implementar logger JSON com redação de PII/segredos e diagnóstico completo de exceções somente no servidor.
- [ ] 2.3 Instrumentar middleware e dependências com spans OpenTelemetry opcionais, correlação e rotas normalizadas.
- [ ] 2.4 Implementar idempotência com fingerprint, replay e conflito, aplicando-a aos comandos com efeitos ou custo.
- [ ] 2.5 Migrar health, metrics, contact, likes e ratings para os contratos e tratamento de erros comuns.
- [ ] 2.6 Cobrir contratos, validação, redaction, tracing no-op, resiliência, rate limit e idempotência com testes automatizados.

## 3. Persistência e documentação da API

- [ ] 3.1 Criar migração Supabase idempotente com constraints e funções transacionais para likes e avaliações.
- [ ] 3.2 Documentar a fronteira ACID versus fallback em memória e alinhar variáveis de ambiente sem segredos reais.
- [ ] 3.3 Criar documento OpenAPI completo e uma interface Swagger navegável.
- [ ] 3.4 Adicionar gate que valida o OpenAPI e o mapeamento entre paths documentados e handlers.

## 4. Concierge de IA

- [ ] 4.1 Implementar domínio de recomendação determinística baseado no catálogo e DTO compartilhado.
- [ ] 4.2 Implementar adaptador OpenAI server-side com moderação, Structured Outputs, `store: false`, timeout e validação pós-resposta.
- [ ] 4.3 Expor endpoint idempotente e rate-limited com fallback resiliente e logs sem PII.
- [ ] 4.4 Construir seção frontend acessível para briefing, loading, resultado, erro, retry e conversão para WhatsApp.
- [ ] 4.5 Cobrir domínio, adaptador, endpoint e estados do componente com testes automatizados sem chamadas reais à OpenAI.

## 5. Modernização da experiência

- [ ] 5.1 Consolidar tokens visuais e refinar tipografia, superfícies, espaçamento, contraste, foco e movimento reduzido.
- [ ] 5.2 Elevar hero, navegação e seções comerciais sem perder conteúdo real nem o caminho principal de conversão.
- [ ] 5.3 Implementar feedback remoto reutilizável, health-aware e uma tela de recuperação de erro alinhada à marca.
- [ ] 5.4 Reduzir caminho crítico com lazy loading e fallbacks leves para recursos pesados.
- [ ] 5.5 Validar acessibilidade e responsividade por testes de componente e auditoria automatizada.

## 6. Qualidade, segurança e governança

- [ ] 6.1 Criar plano de testes rastreável até 100% de statements, branches, functions e lines, com matriz por risco e requisitos.
- [ ] 6.2 Configurar Vitest/Testing Library, relatórios e thresholds para código novo/alterado, mantendo o gap legado explícito.
- [ ] 6.3 Configurar Conventional Commits/Commitlint e atualizar CI para OpenSpec, OpenAPI, typecheck, coverage, build e auditoria.
- [ ] 6.4 Confirmar e automatizar a ausência de estrutura Claude Code no projeto.
- [ ] 6.5 Atualizar README, runbook de observabilidade, integração de IA e decisões arquiteturais.

## 7. Verificação e entrega

- [ ] 7.1 Executar OpenSpec strict validation e todos os quality gates; corrigir qualquer regressão encontrada.
- [ ] 7.2 Verificar o preview local funcional e expor a primeira versão coerente no Codex.
- [ ] 7.3 Revisar diff, inventário de segredos/PII e dependências; registrar resultados finais e limitações externas.
- [ ] 7.4 Publicar a versão validada ou registrar de forma explícita o bloqueio de credencial/infraestrutura caso o deploy não seja possível.
