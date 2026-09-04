## Purpose

Definir gates reprodutíveis, estratégia de testes e convenções que mantenham o site evolutivo, seguro e verificável em cada mudança.

## ADDED Requirements

### Requirement: Quality gate reprodutível

O projeto MUST oferecer comandos não interativos para lint, formatação, typecheck, testes, cobertura, contrato OpenAPI, build, OpenSpec e auditoria de dependências.

#### Scenario: Pull request saudável

- **GIVEN** dependências instaladas pelo lockfile
- **WHEN** o pipeline de qualidade é executado
- **THEN** todos os gates concluem com código zero e produzem artefatos diagnósticos úteis

### Requirement: Plano de cobertura total

O repositório SHALL manter um plano rastreável para cobrir 100% de statements, branches, functions e lines do código instrumentável, combinando testes unitários, componentes, integração, contrato e jornada crítica.

#### Scenario: Código novo ou alterado

- **GIVEN** uma mudança introduz linhas ou branches instrumentáveis
- **WHEN** o coverage é calculado
- **THEN** o código novo ou alterado alcança 100% ou a mudança permanece bloqueada com uma exceção explícita, temporária e justificada

#### Scenario: Exclusão de cobertura

- **GIVEN** um arquivo gerado, declaração de tipos ou adaptador impossível de instrumentar
- **WHEN** ele é excluído do relatório
- **THEN** a exclusão aparece no plano com motivo verificável e não oculta lógica de negócio

### Requirement: Pirâmide de testes por risco

Fluxos de domínio e segurança MUST ter testes rápidos de unidade/contrato; integrações e jornadas críticas SHALL validar colaboração entre camadas e estados de falha.

#### Scenario: Alteração em endpoint

- **GIVEN** um contrato ou regra de endpoint muda
- **WHEN** a suíte roda
- **THEN** cobre método permitido, validação, sucesso, erro, rate limit, idempotência, redação e dependência indisponível

#### Scenario: Alteração visual interativa

- **GIVEN** um componente de formulário ou feedback muda
- **WHEN** os testes de componente e jornada rodam
- **THEN** validam teclado, nomes acessíveis, loading, sucesso, erro e nova tentativa

### Requirement: Histórico semântico e automação segura

Mensagens de commit MUST seguir Conventional Commits e o CI SHALL verificar segredos, vulnerabilidades altas/críticas e integridade do lockfile.

#### Scenario: Commit inválido

- **GIVEN** uma mensagem fora do padrão configurado
- **WHEN** o gate de commit é executado
- **THEN** a validação falha com orientação de formato

### Requirement: Ausência de artefatos Claude Code

O projeto MUST permanecer sem diretórios, comandos ou arquivos específicos do Claude Code após a inicialização do OpenSpec para Codex.

#### Scenario: Varredura de configuração

- **GIVEN** o checkout do projeto
- **WHEN** arquivos ocultos e rastreados são inspecionados
- **THEN** nenhuma estrutura `.claude` ou `CLAUDE.md` está presente
