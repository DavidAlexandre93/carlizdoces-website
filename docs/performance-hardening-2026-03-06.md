# Plano aplicado de performance, confiabilidade e redução de bugs (2026-03-06)

## 1) Baseline medido antes de alterações profundas

### Métricas-alvo iniciais (SLO operacional sugerido)
- API pública (`/api/*`) com p95 < 200ms e p99 < 400ms para rotas sem dependência externa.
- Endpoint de e-mail (`/api/contact-email`) com p95 < 900ms (com dependência externa).
- Erros 5xx < 1% por rota.
- Throughput alvo inicial: >= 30 req/s por instância para rotas em memória (`likes`, `ratings`).
- Tempo de build alvo: < 90s (quando dependências estiverem disponíveis no ambiente).

### Baseline executado neste ambiente
- `npm run build`: falhou por ausência de `webpack` no ambiente atual (dependências bloqueadas por política de registry), mas mediu ciclo inicial até o ponto de falha em ~0.67s.
- `npm run lint`: falhou por ausência de pacote `@eslint/js` (mesma limitação de dependências).
- `node --test tests/api-http.test.cjs`: passou (3/3), validando limitador de taxa, instrumentação e retry.

> Resultado: baseline de qualidade local ficou parcialmente bloqueado por limitação de instalação de dependências externas no ambiente.

---

## 2) Melhorias aplicadas no código (nesta rodada)

### Observabilidade e profiling operacional
- Instrumentação central de latência por rota (janela de 500 amostras).
- Cálculo de p50/p95/p99 em memória por rota.
- Métricas de dependências externas (total de chamadas, falhas, latência e último erro).
- Log estruturado por request (`request_completed`) e por falha externa (`dependency_error`) com `requestId`.
- Novo endpoint `GET /api/metrics` para consulta de snapshot operacional.

### Chamadas externas mais resilientes
- Novo helper `fetchWithResilience` com:
  - timeout por tentativa;
  - retry em falhas transitórias (5xx, 408, 425, 429);
  - backoff exponencial com jitter;
  - circuit breaker simples (abre após falhas consecutivas).
- `POST /api/contact-email` migrado para esse helper.

### Limites operacionais e proteção de abuso
- Rate limiting aplicado também em:
  - `GET/POST /api/ratings`;
  - `GET /api/likes/summary`;
  - `POST /api/likes/store`;
  - `POST /api/likes/product/[id]`.
- Mensagens de erro padronizadas com `code`, `message`, `details`, `requestId`.

### Qualidade/robustez
- Validação adicional de formato de e-mail no endpoint de contato.
- Testes automatizados (Node test runner) para componentes críticos de infraestrutura HTTP.

---

## 3) Cenário de carga realista (recomendado para próxima etapa)

### Fluxos críticos
1. `GET /api/likes/summary?userId=...` (60% tráfego)
2. `POST /api/likes/store` e `POST /api/likes/product/[id]` (25% tráfego)
3. `POST /api/ratings` (10% tráfego)
4. `POST /api/contact-email` (5% tráfego, custo externo)

### Modelo de carga sugerido
- Rampa de 1 min até 20 RPS, sustentação de 5 min.
- Pico de 60 RPS por 2 min nas rotas de likes/ratings.
- Injeção de falha no provedor externo (respostas 503 e timeout) para validar retry + circuit breaker.

### Coleta mínima
- p50/p95/p99 por rota.
- Taxa de erro 4xx/5xx por rota.
- Latência e falhas por dependência externa (`resend_api`).
- Saturação (429 por rota para calibrar limites).

---

## 4) Backlog objetivo para as próximas ondas

1. Persistir métricas em backend de observabilidade (Prometheus/Grafana/DataDog) em vez de memória.
2. Adicionar tracing distribuído (controller → serviço → integração externa).
3. Criar testes de carga automatizados em CI noturno.
4. Migrar likes/ratings para banco com índices e auditoria de query lenta.
5. Incluir cache HTTP seletivo (ETag/Cache-Control) para leitura não sensível.
6. Implementar fila assíncrona para tarefas caras futuras (uploads/relatórios).
