## Context

Ver `proposal.md` para motivação e os cinco delta specs para os contratos. A base atual mistura Vite e Webpack, mas o script de produção aponta para um entry inexistente; o ESLint falha antes de analisar arquivos; o coverage cobre apenas parte de `api/_lib/http.js`; e o frontend reúne boa parte da composição em uma página extensa e em mais de 2.500 linhas de CSS. As funções serverless dependem de estado em memória e integrações HTTP, portanto o desenho precisa funcionar tanto sem serviços externos quanto em Vercel/Supabase configurados.

## Goals / Non-Goals

**Goals:**

- Recuperar uma linha de base verde e reduzir superfície de dependências antes de adicionar capacidades.
- Isolar regras de domínio e contratos de I/O do detalhe visual ou do provedor externo.
- Tornar falhas esperadas parte explícita da experiência e falhas inesperadas diagnosticáveis no servidor.
- Permitir adoção progressiva de TypeScript sem uma reescrita arriscada de toda a interface.

**Non-Goals:**

- Aplicar arquitetura hexagonal a componentes puramente visuais.
- Criar um framework interno de logging, validação ou estado global.
- Oferecer garantias distribuídas usando memória de processo serverless.
- Reescrever todo o catálogo ou substituir serviços já funcionais sem evidência de benefício.

## Decisions

### 1. Vite como única cadeia de frontend

Vite passa a executar desenvolvimento e build; Webpack, Babel e aliases duplicados são removidos. O entry real já é `src/index.jsx`, e os adaptadores locais existentes podem ser mantidos pelos aliases do Vite.

**Alternativas consideradas:** corrigir o entry do Webpack manteria duas configurações e duas árvores de vulnerabilidades; migrar de framework agora aumentaria o risco sem atender melhor à landing page.

### 2. Arquitetura modular com portas somente nos limites externos

O frontend continua organizado por feature. Regras do concierge ficam em `features/ai`, enquanto chamadas HTTP passam por um cliente comum. Nas APIs, middleware/decorators cuidam de contexto, erro, idempotência e tracing; adaptadores encapsulam OpenAI, Resend e persistência. Isso aplica Adapter, Strategy (IA versus fallback), Circuit Breaker e Decorator onde há variação real.

**Alternativas consideradas:** Clean Architecture completa adicionaria entidades, casos de uso e mapeadores sem domínio suficiente; manter lógica diretamente nos handlers perpetuaria duplicação e contratos implícitos.

### 3. DTOs executáveis com Zod e tipagem progressiva

Schemas Zod validam entrada, saída e dependências. Tipos são inferidos onde TypeScript for introduzido e expostos por JSDoc em módulos JavaScript legados, com `tsc --checkJs` inicialmente focado nos contratos e novos módulos. Envelopes e códigos de erro são centralizados e o OpenAPI referencia os mesmos formatos conceituais, com teste de drift de rotas.

**Alternativas consideradas:** tipos TypeScript sem validação desaparecem em runtime; migrar todos os JSX de uma vez ampliaria demais o diff; gerar toda a OpenAPI automaticamente agora exigiria metaprogramação desnecessária.

### 4. Observabilidade OTEL configurável e logs JSON próprios

`@opentelemetry/api` cria spans e lê contexto; um bootstrap opcional do SDK/exportador OTLP é ativado apenas com variáveis `OTEL_*`. O logger JSON é pequeno, determinístico, testável e redige recursivamente antes de serializar. O middleware registra stack completa no servidor e retorna somente um DTO seguro.

**Privacidade:** payloads, prompts completos, IPs brutos, e-mails, telefones, cookies, tokens e credenciais nunca viram atributos ou logs. Para diagnósticos, apenas tamanhos, enums, hashes efêmeros e ids de correlação são permitidos.

### 5. Idempotência em duas camadas

Uma store com TTL impede duplicação best-effort dentro da instância e fornece semântica consistente para testes/local. A migração Supabase cria chaves únicas e funções transacionais para efeitos duráveis/concorrentes. A documentação declara claramente que somente o adaptador persistente fornece ACID distribuído.

**Alternativas consideradas:** exigir um Redis adicional contraria YAGNI; alegar garantia com mapas globais seria incorreto.

### 6. Concierge de IA como aprimoramento progressivo

O cliente envia um briefing mínimo e enumerado. O servidor modera a entrada, chama a Responses API com Structured Outputs e `store: false`, valida a resposta e faz interseção com ids reais do catálogo. Uma Strategy determinística produz o mesmo DTO quando a credencial está ausente, ocorre timeout/circuit breaker ou o schema é inválido. A chave nunca chega ao browser.

### 7. Sistema visual evolutivo, não reescrita total

Tokens de cor, tipografia, raio, sombra, espaçamento e movimento são consolidados no topo dos estilos. O hero recebe hierarquia mais editorial; o concierge vira uma seção reconhecível e carregada sob demanda; feedback remoto usa um componente reutilizável; Error Boundary recebe uma tela de recuperação da marca. Efeitos Three/partículas permanecem opcionais e preguiçosos.

A direção visual implementada usa tipografia editorial para títulos, sans humanista para leitura, superfícies creme, berry e teal para contraste de marca, raios menores para controles e foco visível com redução global de movimento. A paleta evita depender de roxo e mantém a identidade artesanal sem transformar a interface em uma sequência de cartões arredondados.

### 8. Estratégia de testes orientada a risco

Vitest + Testing Library cobrem domínio, componentes e hooks; testes Node/HTTP cobrem handlers e contratos; validação OpenAPI e OpenSpec entram no CI; uma jornada Playwright futura cobre descoberta → IA/fallback → WhatsApp. O plano em `docs/test-plan.md` mapeia cada requisito a suites e registra a trajetória para 100% de statements, branches, functions e lines.

## Risks / Trade-offs

- **[Risco] Migração parcial de tipagem deixa código legado fora do typecheck estrito** → expandir o include por feature, exigir 100% no código novo e registrar backlog por arquivo.
- **[Risco] OTEL adiciona cold-start e tamanho às funções** → manter SDK/exportador opcionais e importar sob configuração; API no-op sem coletor.
- **[Risco] Resposta de IA inventa itens** → schema estrito, lista explícita de catálogo, validação pós-resposta e fallback.
- **[Risco] Estado em memória diverge entre instâncias** → rotular como fallback e usar RPC transacional Supabase em produção.
- **[Risco] Mudança visual extensa causa regressão responsiva** → tokens primeiro, componentes pequenos, auditoria responsiva e checklist manual representativo.
- **[Risco] 100% de cobertura incentiva testes frágeis** → priorizar comportamentos e branches, excluir apenas código gerado/declarativo com justificativa documentada.

## Migration Plan

1. Registrar linha de base e preservar alterações locais existentes.
2. Unificar tooling/build e atualizar lockfile; rollback: restaurar scripts/dependências sem alterar dados.
3. Introduzir contratos, middleware, observabilidade e testes; publicar APIs de forma retrocompatível durante a migração do envelope.
4. Aplicar migração Supabase primeiro em staging; rollback: remover RPCs novos sem apagar tabelas/dados.
5. Entregar frontend, concierge e estados de erro com fallback ativo por padrão.
6. Habilitar `OPENAI_API_KEY`/OTLP somente após observar health checks e logs em staging.
7. Promover para produção usando o pipeline existente; rollback: redeploy do artefato anterior e desabilitar integrações por env.

## Open Questions

- O coletor OTLP e a organização OpenAI finais serão escolhidos no ambiente de implantação; os contratos e variáveis não dependem dessa escolha.
- O threshold global de coverage subirá por marcos até 100%; código novo/alterado fica em 100% desde esta mudança e o gap legado permanece quantificado no relatório.
