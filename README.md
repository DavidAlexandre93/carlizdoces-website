# 🍫 Carliz Doces Website

Landing page institucional e comercial da **Carliz Doces**, construída com **React + Webpack**, com foco em apresentação do catálogo, captação de pedidos e conversão direta para WhatsApp.

> Projeto preparado para deploy na Vercel (SPA + funções serverless em `/api`).

---

## 📑 Sumário

- [Visão geral](#-visão-geral)
- [Demo](#-demo)
- [Principais funcionalidades](#-principais-funcionalidades)
- [Tecnologias e arquitetura](#-tecnologias-e-arquitetura)
- [Estrutura de pastas](#-estrutura-de-pastas)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e execução local](#-instalação-e-execução-local)
- [Scripts disponíveis](#-scripts-disponíveis)
- [Fluxo de conteúdo dinâmico por imagens](#-fluxo-de-conteúdo-dinâmico-por-imagens)
- [Guia rápido de edição de catálogo](#-guia-rápido-de-edição-de-catálogo)
- [Variáveis de ambiente](#-variáveis-de-ambiente)
- [APIs serverless disponíveis](#-apis-serverless-disponíveis)
- [Build e deploy](#-build-e-deploy)
- [CI/CD com GitHub Actions](#-cicd-com-github-actions)
- [Boas práticas para evolução do projeto](#-boas-práticas-para-evolução-do-projeto)
- [Troubleshooting](#-troubleshooting)
- [Roadmap sugerido](#-roadmap-sugerido)
- [Licença](#-licença)

---

## 👀 Visão geral

Este repositório contém o front-end do site da **Carliz Doces** em formato **Single Page Application (SPA)**, com:

- Hero com destaque visual da marca;
- Sessões institucionais (sobre, contato, localização);
- Vitrine de produtos com avaliações por estrelas;
- Carrinho simplificado e geração automática de pedido via WhatsApp;
- Destaques/novidades e integrações de engajamento (curtidas, depoimentos e Instagram);
- Login com Google via NextAuth (OAuth no backend, sem expor `GOOGLE_CLIENT_SECRET` no front-end).

A arquitetura foi pensada para permitir que pessoas não técnicas consigam atualizar produtos e novidades principalmente por **adição/remoção de imagens** em `public/images` e ajustes pontuais em `src/data/editableContent.js`.

---

## 🔗 Demo

- **Produção (Vercel):** `https://carlizdoces-website.vercel.app`

---

## ✨ Principais funcionalidades

- Layout responsivo para desktop e mobile;
- Navegação por âncoras entre seções da página;
- Catálogo de produtos com preços, quantidades e detalhes;
- Carrinho com totalizador e resumo por item;
- Montagem de mensagem pronta para WhatsApp com nome, telefone e itens do pedido;
- Avaliação por estrelas por produto (com persistência local e tentativa de sincronização com API);
- Curtidas da loja e por produto (endpoints em `/api/likes/...`);
- Comentários da comunidade com fallback para Disqus configurável;
- Login com Google via NextAuth em `/api/auth/[...nextauth]`;
- Carregamento lazy de seções para reduzir custo inicial de renderização.

---

## 🧱 Tecnologias e arquitetura

### Front-end

- **React 19**
- **React DOM 19**
- **Material UI (MUI)**
- **Emotion**
- **TanStack React Query**
- **Motion** (`motion/react`) para animações

### Build e tooling

- **Webpack 5**
- **Webpack Dev Server**
- **Babel** (`preset-env` + `preset-react`)
- **ESLint 9** (`react-hooks` + `react-refresh`)

### Organização de código

- `src/app`: providers e roteamento base
- `src/features`: componentes de domínio/fluxo principal
- `src/components`: layout e seções reutilizáveis
- `src/hooks`: regras de negócio reaproveitáveis
- `src/data`: conteúdo e agregação de dados exibidos
- `api`: funções serverless utilizadas no deploy da Vercel

---

## 📂 Estrutura de pastas

```bash
.
├── api/                        # Endpoints serverless (likes, ratings)
├── public/
│   └── images/                 # Imagens por coleção (catálogo, novidades, etc.)
├── scripts/
│   └── generate-image-data.mjs # Gera src/data/generatedImages.js automaticamente
├── src/
│   ├── app/
│   ├── components/
│   ├── data/
│   │   ├── editableContent.js  # Edição manual rápida (override de textos/dados)
│   │   ├── generatedImages.js  # Arquivo gerado por script (não editar manualmente)
│   │   └── siteData.js         # Consolida dados renderizados no app
│   ├── features/
│   ├── hooks/
│   ├── pages/
│   ├── App.jsx
│   └── main.jsx
├── .github/workflows/          # CI/CD
├── vercel.json                 # Configuração de build/deploy
├── webpack.config.js
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

1. Clone o repositório:

```bash
git clone https://github.com/<seu-usuario>/carlizdoces-website.git
cd carlizdoces-website
```

2. Instale as dependências:

```bash
npm install
```

3. Rode o projeto em desenvolvimento:

```bash
npm start
```

4. Acesse no navegador:

```text
http://localhost:3000
```

> `npm start` e `npm run build` executam automaticamente o script de geração de dados de imagem antes do comando principal.

---

## 📜 Scripts disponíveis

- `npm start`  
  Inicia o `webpack-dev-server` em modo desenvolvimento.
- `npm run build`  
  Gera build de produção em `dist/`.
- `npm run lint`  
  Executa análise estática com ESLint.
- `npm run generate:image-data`  
  Escaneia `public/images/*` e atualiza `src/data/generatedImages.js`.

### Scripts automáticos encadeados

- `prestart`: roda `generate:image-data` antes de `start`.
- `prebuild`: roda `generate:image-data` antes de `build`.
- `postbuild`: copia os assets de `public/` para `dist/`.

---

## 🖼️ Fluxo de conteúdo dinâmico por imagens

Este projeto usa um fluxo híbrido para facilitar manutenção:

1. Você adiciona/remove imagens nas subpastas de `public/images`.
2. O script `generate-image-data.mjs` transforma isso em estrutura JavaScript (`generatedImages.js`).
3. `siteData.js` cruza imagens geradas com os overrides de `editableContent.js`.
4. A interface renderiza os dados finais (com fallback automático quando não há override manual).

### Benefícios

- Menos necessidade de alterar componentes para atualizar catálogo;
- Menor risco de erro em mudanças recorrentes de conteúdo;
- Escalabilidade para novas coleções visuais.

---

## ✍️ Guia rápido de edição de catálogo

Arquivo principal de edição manual:

- `src/data/editableContent.js`

Você pode:

- atualizar produtos (`productsCatalog`);
- ajustar preço, descrição e quantidades;
- adicionar/remover cards de novidades (`updatesCatalog`);
- trocar imagens (desde que elas existam em `public/images/...`).

### Regras importantes

- mantenha `id` único para cada item;
- `price` deve ser número;
- use caminhos válidos em `image`/`imageUrl` (ex.: `/images/pedidos-de-doces/brigadeiro.png`).

### Passo a passo recomendado

1. Adicione a imagem na pasta correta em `public/images/...`;
2. Rode `npm run generate:image-data` (ou apenas `npm start`);
3. Ajuste dados no `editableContent.js` se precisar de override;
4. Valide visualmente em `http://localhost:3000`.

---

## 🔐 Variáveis de ambiente

Crie um `.env.local` para desenvolvimento local (ou configure no painel da Vercel em produção).

| Variável | Obrigatória? | Uso |
|---|---:|---|
| `VITE_FIREBASE_API_KEY` / `NEXT_PUBLIC_FIREBASE_API_KEY` | Recomendada | Chave pública do projeto Firebase. |
| `VITE_FIREBASE_AUTH_DOMAIN` / `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Recomendada | Domínio de autenticação Firebase (`*.firebaseapp.com`). |
| `VITE_FIREBASE_PROJECT_ID` / `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Recomendada | ID do projeto Firebase. |
| `VITE_FIREBASE_STORAGE_BUCKET` / `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Opcional | Bucket do Firebase Storage. |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` / `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Opcional | Sender ID do Firebase Cloud Messaging. |
| `VITE_FIREBASE_APP_ID` / `NEXT_PUBLIC_FIREBASE_APP_ID` | Recomendada | App ID do Firebase Web App. |
| `VITE_FIREBASE_MEASUREMENT_ID` / `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Opcional | Measurement ID para Analytics. |
| `GOOGLE_CLIENT_ID` | Obrigatória (server) | Client ID OAuth 2.0 para autenticação com Google via NextAuth. |
| `GOOGLE_CLIENT_SECRET` | Obrigatória (server) | Secret OAuth 2.0 usado apenas no backend (nunca no front). |
| `NEXTAUTH_URL` | Obrigatória (server) | URL base da aplicação (ex.: `http://localhost:3000` / URL da Vercel). |
| `NEXTAUTH_SECRET` | Obrigatória (server) | String aleatória usada para assinar tokens e cookies de sessão. |
| `VITE_DISQUS_SHORTNAME` | Opcional | Habilita widget de comentários Disqus na seção de depoimentos. |
| `FIREBASE_SERVICE_ACCOUNT_KEY` | Opcional (server) | JSON da conta de serviço para Firebase Admin SDK (uso apenas em APIs/serverless). |
| `FIREBASE_CLIENT_EMAIL` | Opcional (server) | Alternativa ao JSON completo: e-mail da conta de serviço. |
| `FIREBASE_PRIVATE_KEY` | Opcional (server) | Alternativa ao JSON completo: chave privada da conta de serviço. |

### Exemplo

```bash
VITE_FIREBASE_API_KEY=sua-api-key
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
VITE_FIREBASE_APP_ID=1:000000000000:web:abc123
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_GOOGLE_CLIENT_ID=1234567890-abcdefg.apps.googleusercontent.com
VITE_DISQUS_SHORTNAME=seu-shortname

# Se estiver migrando de Next.js, pode usar os equivalentes NEXT_PUBLIC_FIREBASE_*
NEXT_PUBLIC_FIREBASE_API_KEY=sua-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=1234567890-abcdefg.apps.googleusercontent.com
```

### Firebase Admin SDK (serverless)

> ⚠️ **Nunca exponha a chave privada no frontend**. Use somente em variáveis de ambiente do backend/serverless (Vercel/Firebase Functions/etc.).

Você pode configurar de duas formas:

1. **JSON único (recomendado)**

```bash
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"..."}
```

2. **Campos separados**

```bash
FIREBASE_PROJECT_ID=seu-projeto
FIREBASE_CLIENT_EMAIL=sua-conta@seu-projeto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Este repositório inclui o utilitário `api/firebaseServiceAccount.js` para validar e normalizar essas credenciais no ambiente serverless.


---

## 🔌 APIs serverless disponíveis

A pasta `api/` contém rotas usadas no deploy da Vercel.

### Likes

- `GET /api/likes/summary?userId=...` → resumo de likes da loja e produtos.
- `POST /api/likes/store` com `{ userId }` → curte a loja.
- `POST /api/likes/product/:id` com `{ userId }` → curte um produto.

### Ratings

- `GET /api/ratings` → estatísticas agregadas por produto.
- `POST /api/ratings` com `{ productId, rating }` → registra/atualiza avaliação (1–5).

> Observação: likes e ratings usam armazenamento em memória no ambiente serverless (sem banco persistente).

---

## 🌐 Build e deploy

### Build local de produção

```bash
npm run build
```

Saída em `dist/`.

### Deploy na Vercel

O projeto já possui `vercel.json` com:

- `installCommand`: `npm install --production=false`
- `buildCommand`: `npm run build`
- `outputDirectory`: `dist`
- `rewrites` para SPA (`/(.*) -> /index.html`)

### Deploy no Firebase Hosting

A configuração de hosting também está pronta com `firebase.json` + `.firebaserc`:

```bash
firebase login
firebase init
npm run deploy:firebase
```

Configuração aplicada:

- diretório público: `dist`
- rewrite SPA: `** -> /index.html`
- projeto padrão: `carliz-doces`

---

## 🔁 CI/CD com GitHub Actions

Workflows presentes:

- **CI (`.github/workflows/ci.yml`)**
  - checkout
  - setup Node 20
  - `npm ci`
  - `npm run lint -- --max-warnings=0`
  - `npm run build`

- **CD Preview (`.github/workflows/cd-vercel-preview.yml`)**
  - executa em PR
  - faz deploy preview na Vercel se secrets estiverem presentes
  - comenta URL (ou motivo de skip) no PR

- **CD Production (`.github/workflows/cd-vercel.yml`)**
  - executa em push para `main` e manualmente (`workflow_dispatch`)
  - deploy de produção se credenciais existirem

### Secrets necessários para deploy

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

---

## ✅ Boas práticas para evolução do projeto

- Antes de commitar: rode `npm run lint` e `npm run build`.
- Evite editar manualmente `src/data/generatedImages.js` (arquivo gerado).
- Sempre que alterar imagens, garanta que os caminhos no catálogo batem com os arquivos em `public/images`.
- Para mudanças de UX, preserve IDs de seção usados na navegação por âncoras.
- Ao adicionar endpoint novo em `api/`, documente no README e atualize chamadas no front-end.

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

### Comentários Disqus não aparecem

- Verifique se `VITE_DISQUS_SHORTNAME` está definido corretamente.
- Confirme se o domínio do site está cadastrado no Disqus.

### Login Firebase falhando

- Verifique as variáveis `VITE_FIREBASE_*` no `.env.local` e na Vercel.
- Confirme se o método de login Google está habilitado no Firebase Authentication.
- Confira se o domínio da aplicação está listado em **Authentication → Settings → Authorized domains**.

### Build Vercel sem deploy

- Confira os secrets de deploy no GitHub Actions.
- Verifique logs do workflow para identificar ausência de credenciais.

---

## 🗺️ Roadmap sugerido

- Persistência real de likes/ratings em banco de dados;
- Painel administrativo simples para edição de catálogo sem mexer em código;
- Testes automatizados (unitários + integração de componentes);
- Monitoramento de erro e analytics de conversão de pedidos;
- Otimização adicional de imagens (formatos modernos e compressão por pipeline).

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja [`LICENSE`](./LICENSE).
