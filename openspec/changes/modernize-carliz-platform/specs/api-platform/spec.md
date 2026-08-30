## Purpose

Definir contratos consistentes, validação, segurança, idempotência, saúde e persistência transacional para as funções HTTP consumidas pelo site.

## ADDED Requirements

### Requirement: Envelope de resposta tipado
Toda API pública SHALL retornar um DTO validado com `requestId`, sucesso explícito e exatamente um de `data` ou `error`.

#### Scenario: Resposta de sucesso
- **GIVEN** uma requisição válida é processada
- **WHEN** a operação conclui
- **THEN** a resposta contém `ok: true`, `requestId` e `data` compatível com o contrato documentado

#### Scenario: Resposta de erro
- **GIVEN** validação, dependência ou regra de negócio falha
- **WHEN** a API responde
- **THEN** o payload contém `ok: false`, `requestId` e erro com código enumerado, mensagem segura e detalhes de campo opcionais

### Requirement: Validação nos limites
Headers, query, path, body e respostas de dependências externas MUST ser validados e normalizados antes de entrar no domínio.

#### Scenario: Body inválido
- **GIVEN** uma requisição contém tipo, enum ou tamanho inválido
- **WHEN** chega ao endpoint
- **THEN** a API responde `400` com detalhes de validação seguros e não executa efeitos colaterais

### Requirement: Idempotência de comandos
Comandos que enviam e-mail, consultam IA ou alteram estado SHALL aceitar `Idempotency-Key` e impedir repetição do efeito para a mesma chave e payload.

#### Scenario: Repetição equivalente
- **GIVEN** um comando já foi concluído com determinada chave e fingerprint
- **WHEN** o mesmo comando é repetido dentro da janela
- **THEN** a API devolve o resultado armazenado sem repetir o efeito externo

#### Scenario: Reuso conflitante da chave
- **GIVEN** uma chave já foi usada com outro payload
- **WHEN** o cliente a reutiliza
- **THEN** a API responde `409` e não executa a operação

### Requirement: Persistência ACID no adaptador durável
Operações de likes e avaliações no banco durável MUST executar atomicamente com constraints, unicidade e transação; adaptadores em memória SHALL ser identificados como best-effort.

#### Scenario: Voto repetido concorrente
- **GIVEN** duas requisições concorrentes do mesmo dispositivo e produto
- **WHEN** o banco durável processa ambas
- **THEN** existe no máximo um voto efetivo por dispositivo/produto e os agregados permanecem consistentes

#### Scenario: Falha durante a transação
- **GIVEN** uma atualização durável falha antes do commit
- **WHEN** a transação é abortada
- **THEN** nenhuma alteração parcial fica visível

### Requirement: Saúde e prontidão
O sistema SHALL expor health check raso da aplicação e diagnóstico profundo das dependências configuradas sem divulgar segredos.

#### Scenario: Processo saudável
- **GIVEN** a função está respondendo
- **WHEN** `GET /api/health` é consultado
- **THEN** retorna estado, versão, timestamp, uptime e `requestId` em DTO documentado

#### Scenario: Dependência essencial indisponível
- **GIVEN** uma verificação profunda detecta dependência configurada indisponível
- **WHEN** a prontidão é consultada
- **THEN** retorna `503` com nomes e estados normalizados, nunca credenciais ou URLs sensíveis

### Requirement: Contrato OpenAPI navegável
Todas as rotas públicas MUST estar documentadas em OpenAPI com schemas, exemplos, códigos de resposta, idempotência, rate limits e autenticação/configuração aplicáveis.

#### Scenario: Validação do contrato
- **GIVEN** o arquivo OpenAPI do repositório
- **WHEN** o gate de contrato é executado
- **THEN** o documento é válido e cada handler público possui path e operação correspondentes

