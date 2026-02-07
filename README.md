# Carliz doces 🍬

Landing page da Carliz doces com catálogo em ReactJS e interface construída com Tailwind CSS.

## Funcionalidades
- Catálogo de doces fixos (ano inteiro).
- Catálogo de ovos de Páscoa com opção de desligar facilmente.
- Montagem de pedido com quantidade por item.
- Resumo automático do pedido com subtotal.
- Botão **Realizar solicitação** com redirecionamento para WhatsApp já com mensagem pronta.

## Tecnologias
- TypeScript (fonte tipada)
- ReactJS (via ESM no navegador)
- Tailwind CSS (CDN)
- TanStack Query (`useQuery`)

## Estrutura
- `index.html`: base da aplicação e configuração do Tailwind.
- `src/app.ts`: aplicação React com componentes, props e estado tipados.
- `src/catalog-data.ts`: interfaces e dados tipados do catálogo.
- `js/*.js`: JavaScript gerado pelo compilador TypeScript para execução no navegador.

## Desenvolvimento
- Gerar build JS a partir do TypeScript: `tsc --project tsconfig.json`
- Validar tipagem sem gerar arquivos: `tsc --project tsconfig.json --noEmit`

## Número para pedidos
- +55 11 99217-5496

## Como desligar a seção de Páscoa
- No site, clique no botão **Páscoa ON/OFF**.
- Ou use a URL com `?pascoa=off`.
