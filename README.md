# 🍫 Carliz Doces Website

Landing page institucional e comercial da **Carliz Doces**, desenvolvida com React + Webpack, com foco em apresentação de produtos, captação de pedidos e conversão via WhatsApp.

> Projeto pronto para deploy estático (SPA) com suporte a Vercel.

---

## 📑 Sumário

- [📌 Sobre o projeto](#-sobre-o-projeto)
- [🔗 Demo](#-demo)
- [✨ Funcionalidades](#-funcionalidades)
- [🧱 Arquitetura e stack](#-arquitetura-e-stack)
- [📂 Estrutura de pastas](#-estrutura-de-pastas)
- [⚙️ Pré-requisitos](#️-pré-requisitos)
- [🚀 Como executar localmente](#-como-executar-localmente)
- [📜 Scripts disponíveis](#-scripts-disponíveis)
- [📦 Dependências](#-dependências)
- [🌎 Deploy](#-deploy)
- [🧪 Qualidade e boas práticas](#-qualidade-e-boas-práticas)
- [🔧 Solução de problemas](#-solução-de-problemas)
- [📄 Licença](#-licença)

---

## 📌 Sobre o projeto

Este repositório contém o front-end do site da **Carliz Doces**, com navegação por seções, catálogo sazonal, destaques promocionais, depoimentos, atualizações e formulário de pedido.

A aplicação foi estruturada como **Single Page Application (SPA)** e utiliza:

- **React 19** para construção da interface;
- **Material UI (MUI)** para componentes visuais;
- **TanStack React Query** para padrão de gerenciamento de dados assíncronos (quando necessário);
- **Webpack 5 + Babel** para build e ambiente de desenvolvimento.

---

## 🔗 Demo

- **Produção (Vercel):** `https://carlizdoces-website.vercel.app`

> Caso o domínio mude, basta atualizar este link e/ou configurar domínio customizado na Vercel.

---

## ✨ Funcionalidades

- Layout responsivo para desktop e mobile;
- Seções institucionais (hero, sobre, contato e localização);
- Vitrine de produtos e destaques sazonais;
- Carrinho simplificado com cálculo de total por item e valor final;
- Montagem automática de mensagem para pedido no WhatsApp;
- Botões de ação rápida para Instagram e WhatsApp;
- Carregamento sob demanda (lazy loading) em seções específicas;
- Suporte a tema claro/escuro e interações modernas da interface.

---

## 🧱 Arquitetura e stack

### Front-end

- **React:** `^19.0.0`
- **React DOM:** `^19.0.0`
- **MUI Material:** `^6.4.0`
- **Emotion (styled/react):** `^11.14.0`
- **TanStack React Query:** `^5.90.20`

### Build e tooling

- **Webpack:** `^5.98.0`
- **Webpack Dev Server:** `^5.2.0`
- **Babel:** `@babel/core`, `@babel/preset-env`, `@babel/preset-react`
- **ESLint 9** com plugins de hooks e react-refresh

### Padrões aplicados

- Organização por domínio/seção (`features`, `components`, `hooks`, `data`);
- Componentização orientada a reutilização;
- Hooks customizados para regras de negócio (ex.: carrinho e link de pedido);
- Separação entre dados estáticos e camada visual.

---

## 📂 Estrutura de pastas

```bash
.
├── public/                     # Arquivos estáticos (imagens, ícones)
├── src/
│   ├── app/                    # Providers e roteamento base
│   ├── components/             # Componentes reutilizáveis de layout e seções
│   ├── data/                   # Dados e constantes da aplicação
│   ├── features/               # Seções/páginas por domínio
│   ├── hooks/                  # Hooks customizados
│   ├── pages/                  # Composição de páginas
│   ├── App.jsx
│   └── main.jsx
├── vercel.json                 # Configuração de deploy
├── webpack.config.js           # Configuração de build
└── package.json
```

---

## ⚙️ Pré-requisitos

Antes de iniciar, tenha instalado:

- **Node.js** `>= 20` (recomendado LTS);
- **npm** `>= 10`.

Verifique as versões:

```bash
node -v
npm -v
```

---

## 🚀 Como executar localmente

1. **Clone o repositório**

```bash
git clone https://github.com/<seu-usuario>/carlizdoces-website.git
cd carlizdoces-website
```

2. **Instale as dependências**

```bash
npm install
```

3. **Inicie o servidor de desenvolvimento**

```bash
npm start
```

4. Acesse no navegador:

```txt
http://localhost:3000
```

---

## 📜 Scripts disponíveis

- `npm start` → inicia ambiente de desenvolvimento com hot reload;
- `npm run build` → gera bundle de produção em `dist/`;
- `npm run lint` → executa análise estática com ESLint.

---

## 📦 Dependências

### Dependências de produção

- `@emotion/react`
- `@emotion/styled`
- `@mui/material`
- `@tanstack/react-query`
- `react`
- `react-dom`

### Dependências de desenvolvimento

- `@babel/core`
- `@babel/preset-env`
- `@babel/preset-react`
- `@eslint/js`
- `babel-loader`
- `css-loader`
- `eslint`
- `eslint-plugin-react-hooks`
- `eslint-plugin-react-refresh`
- `globals`
- `html-webpack-plugin`
- `style-loader`
- `webpack`
- `webpack-cli`
- `webpack-dev-server`

---

## 🌎 Deploy

O projeto está preparado para deploy na **Vercel** com saída estática em `dist/`.

### Configuração atual (`vercel.json`)

- `installCommand`: `npm install --production=false`
- `buildCommand`: `npm run build`
- `outputDirectory`: `dist`
- `rewrites`: fallback para `index.html` (compatível com SPA)

### Publicação rápida

1. Faça push da branch para o GitHub;
2. Importe o repositório na Vercel;
3. Garanta que os comandos de build sejam os mesmos do `vercel.json`.

---

## 🔁 CI/CD (GitHub Actions + Vercel)

Foram adicionados pipelines completos para elevar a qualidade das entregas:

- **CI - Quality Gate** (`.github/workflows/ci.yml`)
  - roda em **Node 20 e 22** (matrix);
  - executa `npm ci`, lint com **zero warnings** e build de produção;
  - publica artefato `dist` para inspeção;
  - inclui **Dependency Review** (falha para vulnerabilidades de severidade alta+ em PRs);
  - inclui **CodeQL** para análise de segurança de código.

- **CD - Vercel Preview** (`.github/workflows/cd-vercel-preview.yml`)
  - dispara em PRs e gera deploy de preview na Vercel;
  - comenta automaticamente a URL do preview no próprio PR.

- **CD - Vercel Production** (`.github/workflows/cd-vercel.yml`)
  - dispara após CI verde em `main` (via `workflow_run`);
  - também pode ser executado manualmente (`workflow_dispatch`);
  - faz deploy de produção na Vercel.

### 🔐 Secrets obrigatórios no GitHub

Configure os seguintes segredos no repositório (Settings → Secrets and variables → Actions):

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Sem eles, os jobs de deploy irão falhar por segurança.

## 🧪 Qualidade e boas práticas

- Lint com ESLint para padronização e prevenção de erros comuns;
- Código modular e organizado por responsabilidade;
- Mensagens de pedido no WhatsApp geradas de forma padronizada;
- Estrutura pronta para escalar novas seções e integrações.

---

## 🔧 Solução de problemas

### Porta 3000 em uso

Inicie em outra porta:

```bash
PORT=3001 npm start
```

### Erros após atualizar dependências

Faça uma instalação limpa:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Build falhando na Vercel

Verifique se o output está apontando para `dist/` e se não há override conflitante no painel do projeto.

---

## 📄 Licença

Distribuído sob a licença **MIT**. Consulte o arquivo [`LICENSE`](./LICENSE) para mais detalhes.
