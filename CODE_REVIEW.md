# Code review — redundâncias e código não utilizado

Data: 2026-02-08

## Ajustes aplicados

- Removidos arquivos estáticos não utilizados herdados de template:
  - `src/assets/react.svg`
  - `src/assets/vite.svg`
  - `public/vite.svg`
- Removido ícone local não utilizado:
  - `src/mui-icons/Person.jsx`

## Evidências verificadas

- Busca por referências não retornou uso dos arquivos removidos (`react.svg`, `vite.svg`).
- Busca por `PersonIcon` retornou apenas a própria definição do componente, sem imports/uso.
- Build e lint continuam passando após remoções.

## Pontos observados (sem alteração automática)

- O bundle principal de produção permanece acima do limite recomendado do webpack (`626 KiB`).
- Existe possibilidade de reduzir duplicação de estado em `HomePage` com extração de hooks menores por domínio (likes, intro, contato).
