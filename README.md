# 🍫 Carliz Doces Website

Landing page institucional/comercial da **Carliz Doces** construída com **React + Webpack**, com foco em conversão para WhatsApp e manutenção simples do catálogo por imagens.

> Deploy principal preparado para **Vercel** (SPA em `dist` + funções serverless em `api/`).

---

## 📑 Sumário

- [Visão geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Stack real do projeto](#-stack-real-do-projeto)
- [Arquitetura e pastas](#-arquitetura-e-pastas)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e execução local](#-instalação-e-execução-local)
- [Scripts disponíveis](#-scripts-disponíveis)
- [Fluxo de catálogo por imagens](#-fluxo-de-catálogo-por-imagens)
- [Variáveis de ambiente](#-variáveis-de-ambiente)
- [APIs serverless](#-apis-serverless)
- [Build e deploy](#-build-e-deploy)
- [Troubleshooting](#-troubleshooting)
- [Licença](#-licença)

---

## 👀 Visão geral

O app é uma SPA com:

- seções institucionais (hero, sobre, localização, contato);
- vitrine de produtos e novidades;
- carrinho simples com resumo e total;
- geração de link de pedido para WhatsApp;
- curtidas e avaliações com sincronização no Supabase quando configurado;
- seção de depoimentos + integração opcional com Disqus;
- envio de contato por e-mail via endpoint serverless.

---

## ✨ Funcionalidades

- Layout responsivo (desktop/mobile);
- Navegação por âncoras;
- Catálogo com dados editáveis e fallback automático por imagem;
- Lazy loading de seções secundárias;
- Likes de loja/produto por `device_id`;
- Ratings por estrelas por `device_id`;
- Envio de mensagem pelo WhatsApp com pedido formatado;
- Envio de contato por e-mail via Resend (`/api/contact-email`).

---

## 🧱 Stack real do projeto

### Front-end

- **React 19** + **React DOM 19**;
- **Material UI** (`@mui/material`) + **Emotion** (`@emotion/react`, `@emotion/styled`);
- **TanStack React Query** para providers/cache;
- **Motion** (`motion/react`) para animações;
- CSS próprio (`src/index.css`, `src/App.css`, `src/animate.css`).

### Build e tooling

- **Webpack 5** + **webpack-dev-server**;
- **Babel** (`@babel/preset-env`, `@babel/preset-react`);
- **ESLint 9** (`@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`);
- Script Node ESM para geração automática de dados de imagens (`scripts/generate-image-data.mjs`).

### Back-end (serverless em `api/`)

- Funções Node/CommonJS executadas na Vercel;
- Endpoint de contato integrando com **Resend API**;
- Endpoints de likes e ratings em memória (fallback/local API);
- Utilitário para leitura/validação de credenciais de conta de serviço Firebase (`api/firebaseServiceAccount.js`).

### Dados e persistência

- Cliente customizado de Supabase REST (sem SDK oficial) em `src/supabaseClient.js`;
- Tabelas esperadas no Supabase para uso em produção: `likes_anon`, `ratings_anon` e visão `ratings_summary`.

---

## 🗂️ Arquitetura e pastas

```bash
.
├── api/                          # Funções serverless (likes, ratings, contato por e-mail)
├── public/images/               # Fonte de imagens do catálogo/novidades
├── scripts/generate-image-data.mjs
├── src/
│   ├── app/                     # Providers e roteamento
│   ├── components/              # Componentes de layout/UI/seções
│   ├── features/home/sections/  # Seções principais da home
│   ├── data/                    # Conteúdo editável + agregação
│   ├── hooks/                   # Regras de negócio (carrinho, ratings, WhatsApp)
│   ├── pages/HomePage.jsx
│   ├── supabaseClient.js
│   └── index.js                 # Entry usado no Webpack
├── webpack.config.js
├── vercel.json
├── firebase.json
└── package.json
```

---

## ⚙️ Pré-requisitos

- **Node.js** `>= 20`
- **npm** `>= 10`

Verifique:

```bash
node -v
npm -v
```

---

## 🚀 Instalação e execução local

```bash
git clone https://github.com/<seu-usuario>/carlizdoces-website.git
cd carlizdoces-website
npm install
npm start
```

A aplicação abre em:

```text
http://localhost:3000
```

> `prestart` executa automaticamente `npm run generate:image-data` antes de subir o dev server.

---

## 📜 Scripts disponíveis

- `npm start` → sobe o `webpack-dev-server` (modo desenvolvimento);
- `npm run build` → gera build de produção em `dist/`;
- `npm run lint` → executa ESLint;
- `npm run generate:image-data` → atualiza `src/data/generatedImages.js` com base em `public/images`;
- `npm run deploy:firebase` → build + deploy de hosting no Firebase.

Scripts encadeados:

- `prestart`: `generate:image-data`
- `prebuild`: `generate:image-data`
- `postbuild`: `cp -r public/* dist/`

---

## 🖼️ Fluxo de catálogo por imagens

Este projeto foi pensado para facilitar manutenção sem mexer em muitos componentes:

1. Adicione/remova imagens em `public/images/*`;
2. Rode `npm run generate:image-data` (ou use `npm start`/`npm run build`, que já chamam o script);
3. O arquivo `src/data/generatedImages.js` será atualizado automaticamente;
4. `src/data/siteData.js` combina imagens detectadas com overrides de `src/data/editableContent.js`.

Assim é possível cadastrar novos itens rapidamente mantendo fallback automático (nome, slug, texto básico) e customização opcional de preço/descrição.

---

## 🔐 Variáveis de ambiente

### Front-end / build

| Variável | Obrigatória | Uso |
|---|---:|---|
| `REACT_APP_SUPABASE_URL` | Recomendada | URL do projeto Supabase para likes/ratings. |
| `REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY` (ou `REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT`) | Recomendada | Chave pública (anon) do Supabase. |
| `VITE_DISQUS_SHORTNAME` | Opcional | Habilita comentários Disqus na seção de depoimentos. |
| `VITE_RATINGS_API_URL` | Opcional | URL alternativa para endpoint de ratings (quando não usar rota local). |

### Serverless (`api/`)

| Variável | Obrigatória | Uso |
|---|---:|---|
| `RESEND_API_KEY` | Obrigatória para `/api/contact-email` | Token da API Resend para envio de e-mails. |
| `CONTACT_TO_EMAIL` | Opcional | Destinatário dos contatos (default: `carlizdoces@gmail.com`). |
| `CONTACT_FROM_EMAIL` | Opcional | Remetente dos e-mails (default: `Carliz Doces <onboarding@resend.dev>`). |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Opcional | JSON completo de conta de serviço Firebase (uso server-side). |
| `FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` | Opcional | Alternativa em campos separados para conta de serviço Firebase. |

Exemplo mínimo (`.env.local`):

```bash
REACT_APP_SUPABASE_URL=https://SEU-PROJETO.supabase.co
REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY=SEU_ANON_KEY
VITE_DISQUS_SHORTNAME=seu-shortname

RESEND_API_KEY=re_xxx
CONTACT_TO_EMAIL=carlizdoces@gmail.com
```

---

## 🔌 APIs serverless

### `POST /api/contact-email`

Envia contato por e-mail via Resend.

Body esperado:

```json
{
  "name": "Seu nome",
  "email": "voce@email.com",
  "message": "Mensagem"
}
```

### `GET /api/ratings`

Retorna agregados do store em memória (`{ [productId]: { votes, total } }`).

### `POST /api/ratings`

Registra voto em memória por IP e produto.

Body:

```json
{
  "productId": "ferrero",
  "rating": 5
}
```

### Likes (store em memória)

- `GET /api/likes/summary?userId=...`
- `POST /api/likes/store` com `{ "userId": "..." }`
- `POST /api/likes/product/:id` com `{ "userId": "..." }`

> Observação: no fluxo atual da Home, curtidas/ratings priorizam Supabase quando configurado; os endpoints em memória funcionam como alternativa de API local.

---

## 🌐 Build e deploy

### Build local

```bash
npm run build
```

Saída em `dist/`.

### Vercel

`vercel.json` já define:

- `installCommand`: `npm install --production=false`
- `buildCommand`: `npm run build`
- `outputDirectory`: `dist`
- rewrite para SPA (`/(.*) -> /index.html`)
- rota explícita para APIs (`/api/(.*) -> /api/$1`)

### Firebase Hosting (opcional)

```bash
npm run deploy:firebase
```

Com `firebase.json` configurado para servir `dist/` com rewrite SPA.

---

## 🛠️ Troubleshooting

### Porta 3000 ocupada

```bash
PORT=3001 npm start
```

### Erros após atualização de dependências

```bash
rm -rf node_modules package-lock.json
npm install
```

### Likes/Ratings não persistem

- Verifique `REACT_APP_SUPABASE_URL` e `REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY`.
- Confirme a existência das tabelas/visões no Supabase.

### Comentários Disqus não aparecem

- Defina `VITE_DISQUS_SHORTNAME` corretamente.
- Verifique configuração de domínio no Disqus.

### Endpoint de contato retorna erro

- Verifique `RESEND_API_KEY`.
- Confira logs da função `/api/contact-email` no ambiente de deploy.

---

## 📄 Licença

Este projeto está sob licença **MIT**. Veja [`LICENSE`](./LICENSE).
