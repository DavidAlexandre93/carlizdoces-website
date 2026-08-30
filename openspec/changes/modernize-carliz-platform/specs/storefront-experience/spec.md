## Purpose

Define a experiência comercial responsiva, acessível e resiliente que apresenta a Carliz Doces, ajuda visitantes a descobrir produtos e conduz pedidos ao WhatsApp.

## ADDED Requirements

### Requirement: Experiência visual coerente com a marca
O site SHALL apresentar uma linguagem visual consistente, moderna e reconhecível como Carliz Doces em todos os breakpoints suportados.

#### Scenario: Primeira visita em desktop
- **GIVEN** uma pessoa acessa a página inicial em uma viewport desktop
- **WHEN** o conteúdo principal é renderizado
- **THEN** a proposta de valor, produtos reais e ação principal de pedido ficam identificáveis sem depender de animação

#### Scenario: Primeira visita em dispositivo móvel
- **GIVEN** uma pessoa acessa o site em uma viewport estreita
- **WHEN** navega pelas seções e controles
- **THEN** não há overflow horizontal, alvos de toque permanecem utilizáveis e a ação de pedido continua acessível

### Requirement: Navegação e interação acessíveis
O site MUST preservar semântica, foco visível, nomes acessíveis, contraste adequado e alternativas para movimento reduzido.

#### Scenario: Navegação por teclado
- **GIVEN** uma pessoa usa apenas teclado
- **WHEN** percorre menu, catálogo, formulários, diálogos e ações flutuantes
- **THEN** a ordem de foco é previsível, cada controle informa sua finalidade e nenhum fluxo essencial fica bloqueado

#### Scenario: Preferência por movimento reduzido
- **GIVEN** o dispositivo declara `prefers-reduced-motion: reduce`
- **WHEN** a experiência é carregada
- **THEN** animações decorativas ou contínuas são removidas ou simplificadas sem ocultar conteúdo

### Requirement: Estados completos para ações remotas
Toda interação que depende de uma API SHALL comunicar carregamento, sucesso, indisponibilidade e possibilidade de recuperação sem perder a entrada do usuário.

#### Scenario: Ação concluída
- **GIVEN** uma ação remota válida está em andamento
- **WHEN** a API responde com sucesso
- **THEN** o controle deixa o estado de carregamento e o resultado é anunciado visualmente e por tecnologia assistiva

#### Scenario: Serviço indisponível
- **GIVEN** uma ação remota falha por timeout, rede ou erro de servidor
- **WHEN** o erro é recebido
- **THEN** uma superfície amigável informa que o serviço está temporariamente indisponível, oferece nova tentativa e preserva dados não sensíveis do formulário

### Requirement: Isolamento de falhas de renderização
Falhas inesperadas no frontend MUST ser capturadas sem exibir stack trace, segredos ou detalhes internos à pessoa visitante.

#### Scenario: Exceção de componente
- **GIVEN** um componente lança uma exceção durante a renderização
- **WHEN** o limite de erro captura a falha
- **THEN** uma página alinhada à marca exibe mensagem de tentativa posterior, identificador de suporte e ações para tentar novamente ou voltar ao início

### Requirement: Carregamento proporcional ao dispositivo
Recursos pesados e não essenciais SHALL permanecer fora do caminho crítico e respeitar capacidade do dispositivo e preferências de movimento.

#### Scenario: Recurso decorativo pesado
- **GIVEN** um dispositivo móvel, economia de dados ou movimento reduzido
- **WHEN** uma seção com efeito tridimensional ou partículas se torna visível
- **THEN** o site usa uma alternativa leve e mantém o conteúdo e a ação principal disponíveis

