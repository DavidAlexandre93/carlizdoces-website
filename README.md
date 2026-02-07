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

## Deploy na Vercel (erro `missing-public-directory`)

Este projeto gera saída de produção em `dist/` (Webpack), não em `public/`.

Para evitar o erro **Missing public directory** na Vercel:

1. Use `vercel.json` com `outputDirectory: "dist"`.
2. Mantenha `buildCommand` como `npm run build`.
3. Em projetos SPA, preserve o rewrite para `index.html`.

As configurações já estão aplicadas no repositório.
