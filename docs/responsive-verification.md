# Verificação de responsividade e compatibilidade (estática)

## Escopo

Avaliação do comportamento responsivo para smartphones, tablets, notebooks e desktops a partir de análise de CSS e tentativa de execução local.

## Limitações do ambiente

- A instalação de dependências foi bloqueada pelo registro npm (`403 Forbidden`), impedindo iniciar a aplicação com Vite e executar testes visuais reais por navegador/SO.
- Por isso, esta verificação é **estática** (inspeção de código + auditoria automatizada de CSS).

## Procedimento executado

1. Levantamento de breakpoints e regras de responsividade em:
   - `src/App.css`
   - `src/index.css`
   - `src/styles/globals.css`
2. Execução do script `node scripts/responsive-audit.mjs` para detectar:
   - breakpoints configurados;
   - possíveis dimensões fixas potencialmente críticas fora de media queries móveis.

## Resultados

- Breakpoints detectados: **420, 480, 520, 600, 680, 768, 800, 860, 900, 960, 1024, 1100, 1200, 1700**.
- Total de media queries: **16**.
- Potenciais dimensões fixas críticas fora de `max-width <= 960px`: **2 ocorrências**
  - `src/App.css:2055` (`@media (min-width: 1200px)`)
  - `src/App.css:2556` (`@media (min-width: 1700px)`)

## Conclusão

Com base no CSS, o projeto apresenta cobertura ampla de breakpoints e uso frequente de `clamp`, `min`, `max`, `grid` e `flex`, o que indica boa preparação para múltiplos tamanhos de tela.

Não foram encontradas evidências estáticas de quebra grave de layout em mobile/tablet. As duas ocorrências destacadas são ajustes para telas largas (`min-width` grande) e, isoladamente, **não indicam regressão móvel**.

## Próximo passo recomendado (para validação completa)

Executar validação E2E visual em ambiente com acesso ao npm e browsers instalados, cobrindo ao menos:

- iPhone SE (375x667), iPhone 14 Pro Max (430x932)
- Galaxy S8+/S20 (360x740 / 412x915)
- iPad (768x1024) e iPad Pro (1024x1366)
- Notebook 1366x768
- Desktop Full HD 1920x1080 e QHD 2560x1440

Além disso, validar em Chrome, Firefox, Safari (quando disponível) e Edge.
