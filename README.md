# React + Webpack

This project is a Node.js React application bundled with Webpack and managed with npm.

## Scripts

- `npm start` - Run the development server with hot reload on http://localhost:3000
- `npm run build` - Create a production bundle in `dist/`
- `npm run lint` - Run ESLint

## Build

```bash
npm install
npm run build
```

## Deploy na Vercel

Este projeto gera saída de produção em `dist/` (Webpack), não em `build/` ou `public/`.

### Fonte da verdade

As configurações de deploy ficam no arquivo [`vercel.json`](./vercel.json):

- `framework`: `other`
- `installCommand`: `npm ci --include=dev`
- `buildCommand`: `npm run build`
- `outputDirectory`: `dist`

### Ajuste recomendado no painel da Vercel

Para evitar conflitos entre **Production Overrides** e **Project Settings**:

1. Configure os **Project Settings** com os mesmos valores do `vercel.json`; **ou**
2. Remova os **overrides** e deixe a Vercel seguir apenas o `vercel.json`.

Se houver divergência, a Vercel mostrará aviso de configuração diferente entre deployment e projeto.
