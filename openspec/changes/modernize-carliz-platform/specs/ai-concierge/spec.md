## Purpose

Definir um concierge de confeitaria assistido por IA que recomenda combinações e quantidades úteis sem tornar a navegação dependente de um provedor externo.

## ADDED Requirements

### Requirement: Briefing estruturado e mínimo
O concierge SHALL solicitar somente informações necessárias para recomendar doces, evitando solicitar ou enviar dados pessoais identificáveis.

#### Scenario: Briefing válido
- **GIVEN** uma pessoa informa tipo de evento, quantidade de convidados e preferências alimentares
- **WHEN** solicita uma sugestão
- **THEN** o cliente envia um DTO validado com campos enumerados e limites de tamanho, sem nome, telefone, e-mail ou endereço

#### Scenario: Texto contém PII aparente
- **GIVEN** o campo opcional contém e-mail ou telefone
- **WHEN** o briefing é validado
- **THEN** o sistema remove ou mascara esse conteúdo antes de registrar ou encaminhar a solicitação

### Requirement: Recomendação estruturada e acionável
O concierge MUST responder em um contrato previsível contendo resumo, quantidade estimada, recomendações do catálogo, observações e próxima ação.

#### Scenario: Resposta do provedor válida
- **GIVEN** o provedor de IA está configurado e disponível
- **WHEN** retorna uma resposta compatível com o schema
- **THEN** o visitante vê uma recomendação em português baseada apenas nos itens conhecidos do catálogo e pode convertê-la em mensagem de pedido

#### Scenario: Resposta fora do contrato
- **GIVEN** o provedor retorna conteúdo inválido ou incompleto
- **WHEN** a resposta é validada
- **THEN** o sistema descarta o conteúdo não confiável e usa o fallback seguro

### Requirement: Moderação e limites de uso
Entradas do concierge MUST ser moderadas e protegidas por validação, rate limit, timeout e tamanho máximo antes da geração.

#### Scenario: Conteúdo bloqueado
- **GIVEN** a entrada é classificada como inadequada para o contexto
- **WHEN** a moderação é concluída
- **THEN** nenhuma geração é executada e a API retorna um erro público neutro e tipado

#### Scenario: Limite excedido
- **GIVEN** a origem excedeu o número permitido de solicitações na janela
- **WHEN** envia nova solicitação
- **THEN** a API responde `429`, informa `Retry-After` e a interface comunica quando tentar novamente

### Requirement: Degradação independente do provedor
O site SHALL oferecer uma recomendação determinística útil quando a IA estiver desconfigurada, lenta ou indisponível.

#### Scenario: Chave de IA ausente
- **GIVEN** a credencial do provedor não está definida
- **WHEN** uma recomendação é solicitada
- **THEN** a API retorna o mesmo DTO público usando regras locais e identifica a origem como fallback sem revelar configuração interna

#### Scenario: Timeout do provedor
- **GIVEN** o provedor ultrapassa o limite de latência
- **WHEN** o circuito de resiliência interrompe a chamada
- **THEN** o fallback é retornado e a falha é registrada de forma correlacionada e sem PII

### Requirement: Privacidade da integração
A integração MUST manter credenciais no servidor e solicitar ao provedor que não persista estado quando essa opção existir.

#### Scenario: Inspeção do bundle público
- **GIVEN** o frontend foi compilado para produção
- **WHEN** os artefatos públicos são inspecionados
- **THEN** nenhuma chave, prompt interno, segredo de provedor ou payload privado está presente

