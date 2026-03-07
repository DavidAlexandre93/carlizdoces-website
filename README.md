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
- Logs estruturados com `requestId` e endpoint de métricas `/api/metrics`;
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
│   ├── components/              # Componentes compartilhados de layout/UI
│   ├── features/home/pages/     # Página(s) da experiência Home
│   ├── features/home/sections/  # Blocos visuais da Home (hero, novidades, contato etc.)
│   ├── data/                    # Conteúdo editável + agregação
│   ├── hooks/                   # Regras de negócio (carrinho, ratings, WhatsApp)
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
- `npm run format` → aplica formatação com Prettier;
- `npm run format:check` → valida formatação sem alterar arquivos;
- `npm run test:coverage` → executa testes unitários com relatório de cobertura;
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

| Variável                                                                                   | Obrigatória | Uso                                                                    |
| ------------------------------------------------------------------------------------------ | ----------: | ---------------------------------------------------------------------- |
| `REACT_APP_SUPABASE_URL`                                                                   | Recomendada | URL do projeto Supabase para likes/ratings.                            |
| `REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY` (ou `REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT`) | Recomendada | Chave pública (anon) do Supabase.                                      |
| `VITE_DISQUS_SHORTNAME`                                                                    |    Opcional | Habilita comentários Disqus na seção de depoimentos.                   |
| `VITE_RATINGS_API_URL`                                                                     |    Opcional | URL alternativa para endpoint de ratings (quando não usar rota local). |

### Serverless (`api/`)

| Variável                                                                 |                           Obrigatória | Uso                                                                      |
| ------------------------------------------------------------------------ | ------------------------------------: | ------------------------------------------------------------------------ |
| `RESEND_API_KEY`                                                         | Obrigatória para `/api/contact-email` | Token da API Resend para envio de e-mails.                               |
| `CONTACT_TO_EMAIL`                                                       |                              Opcional | Destinatário dos contatos (default: `carlizdoces@gmail.com`).            |
| `CONTACT_FROM_EMAIL`                                                     |                              Opcional | Remetente dos e-mails (default: `Carliz Doces <onboarding@resend.dev>`). |
| `FIREBASE_SERVICE_ACCOUNT_KEY`                                           |                              Opcional | JSON completo de conta de serviço Firebase (uso server-side).            |
| `FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` |                              Opcional | Alternativa em campos separados para conta de serviço Firebase.          |

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

### `GET /api/metrics`

Retorna snapshot em memória com métricas operacionais por rota e por dependência externa (latência p50/p95/p99, taxa de erro, falhas de integração). Útil para baseline/local troubleshooting.

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

## 🔁 CI/CD (GitHub Actions)

O repositório possui pipeline completo para entrega contínua do frontend:

### CI (`.github/workflows/ci.yml`)

Executado em `pull_request` e `push` para `main` com as etapas:

1. Instalação reprodutível (`npm ci`);
2. Lint (`npm run lint`);
3. Validação de formatação (`npm run format:check`);
4. Testes unitários (`npm run test:ci`);
5. Testes de cobertura com quality gate (`npm run test:coverage`);
6. Validação de build (`npm run build`);
7. Auditoria de vulnerabilidades de dependências (`npm run audit:high`);
8. Upload de artefatos (`dist/` e relatórios de cobertura).

Checks complementares de segurança/qualidade:

- Dependency Review (licenças e severidade);
- CodeQL (SAST para JavaScript);
- Gitleaks (detecção de segredos);
- Quality Gate final agregando status dos jobs críticos.

### Security Hardening (`.github/workflows/security-hardening.yml`)

Execução agendada/manual para:

- gerar SBOM CycloneDX;
- escanear filesystem com Trivy (`HIGH`/`CRITICAL`);
- publicar resultado SARIF em Security tab.

### CD (`.github/workflows/cd.yml`)

Fluxo de deploy por ambiente com promoção para produção:

- `push` em `main`: build + deploy automático em **staging** (Firebase Hosting channel `staging`);
- `workflow_dispatch` com `deploy_production=true`: promove o mesmo fluxo para **production**, dependente do sucesso prévio do job de staging no workflow.

A promoção para produção usa `environment: production`, permitindo aplicar regras de aprovação/manual review no GitHub Environments.

### Segredos necessários

- `FIREBASE_TOKEN` → token de deploy do Firebase CLI;
- `GITHUB_TOKEN` é fornecido automaticamente para jobs nativos do GitHub.

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

### `npm install` retorna erro 403

Esse cenário costuma acontecer em rede corporativa/proxy restritivo, com mensagens como `403 Forbidden - GET https://registry.npmjs.org/...`.

```bash
npm config get registry
npm config set registry https://registry.npmjs.org/
npm config delete proxy
npm config delete https-proxy
npm config delete http-proxy
npm install
```

Se o bloqueio persistir, solicite liberação do domínio `registry.npmjs.org` para sua máquina/rede.

### `npm audit` reporta vulnerabilidades

```bash
npm audit
npm audit fix
```

Para CI, use o script:

```bash
npm run audit:high
```

Ele reprova apenas quando existir vulnerabilidade `high`/`critical`.

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
