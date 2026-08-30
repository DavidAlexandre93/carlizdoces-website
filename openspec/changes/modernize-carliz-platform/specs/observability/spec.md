## Purpose

Definir telemetria estruturada e segura que permita correlacionar requisições, erros e dependências sem expor informações pessoais ou segredos.

## ADDED Requirements

### Requirement: Logs JSON correlacionados
Cada requisição SHALL produzir eventos JSON de ciclo de vida contendo timestamp, nível, serviço, ambiente, evento, rota normalizada, status, latência, `requestId`, `traceId` e `spanId` quando disponíveis.

#### Scenario: Requisição concluída
- **GIVEN** uma API processa uma requisição
- **WHEN** a resposta termina
- **THEN** um evento `request.completed` JSON é emitido com correlação e sem body ou IP bruto

### Requirement: Diagnóstico completo no servidor e seguro no cliente
Erros inesperados MUST registrar nome/classe, mensagem, arquivo, linha, coluna, causa e stack completa no servidor, enquanto a resposta pública permanece genérica.

#### Scenario: Exceção inesperada
- **GIVEN** um handler lança uma exceção
- **WHEN** o middleware de erro a captura
- **THEN** o log JSON contém metadados técnicos e stack redigida, e o cliente recebe somente código público, mensagem neutra e `requestId`

### Requirement: Redação de dados sensíveis
O logger MUST redigir recursivamente chaves e padrões relacionados a credenciais, cookies, tokens, e-mail, telefone, endereço, IP e conteúdo livre antes da serialização.

#### Scenario: Objeto contém segredo e PII
- **GIVEN** um contexto de log contém `authorization`, e-mail e telefone
- **WHEN** o evento é serializado
- **THEN** os valores são substituídos por marcadores e o JSON final não contém os dados originais

### Requirement: Traces OpenTelemetry
Requisições e chamadas externas SHALL criar spans OpenTelemetry com status, atributos sem PII e propagação W3C quando o SDK/exportador estiver configurado.

#### Scenario: Exportador configurado
- **GIVEN** o endpoint OTLP e cabeçalhos foram definidos no ambiente
- **WHEN** uma API chama uma dependência externa
- **THEN** o trace contém span pai da requisição e span filho da dependência com resultado e latência

#### Scenario: Exportador ausente
- **GIVEN** nenhuma configuração OTLP existe
- **WHEN** a aplicação inicia
- **THEN** a funcionalidade continua com instrumentação no-op e logs correlacionados por `requestId`

### Requirement: Métricas operacionais sem cardinalidade explosiva
O snapshot de métricas SHALL usar rotas normalizadas e nomes finitos de dependências, limitando janelas e nunca usando identificadores de usuário como labels.

#### Scenario: Produto variável na URL
- **GIVEN** requisições para diversos ids de produto
- **WHEN** as métricas são agregadas
- **THEN** todas usam um template de rota comum e não criam uma série por id

