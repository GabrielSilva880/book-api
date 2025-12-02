# Blueprint do Downstream — Acme Books API (Exemplo Fictício)

## 1. Fluxo & Git

### 1.1 Estrutura de branches

- Branch principal: `main`, sempre em estado implantável.
- Trabalho diário em branches curtas criadas a partir de `main`:
  - `feat/<resumo-da-feature>` (ex.: `feat/cadastro-livros`)
  - `fix/<resumo-do-fix>` (ex.: `fix/corrige-preco-negativo`)
  - `chore/<tarefa-de-suporte>` (ex.: `chore/atualiza-dependencias`)
- Regra geral:
  - Uma feature/fix por branch.
  - Não ficar mais que 1 sprint com a mesma branch aberta.

### 1.2 Commits

- Commits atômicos: uma ideia por commit.
- Convenção de mensagem (estilo Conventional Commits):
  - `feat: ...` — nova funcionalidade
  - `fix: ...` — correção de bug
  - `chore: ...` — tarefas de suporte (infra, deps, etc.)
  - `test: ...` — ajustes/adicionais de testes
- Exemplo:
  - `feat(books): add endpoint to create book`
  - `fix(auth): handle expired refresh tokens`

### 1.3 Pull Requests (PR)

- Toda mudança vai para `main` via PR.
- Nome do PR reflete o objetivo principal (ex.: `[feat] Cadastro de livros`).
- O PR usa obrigatoriamente o `PULL_REQUEST_TEMPLATE.md`, contendo:
  - Checklist de **Definition of Ready (DoR)**:
    - História clara, linkada ao item de backlog.
    - Critérios de aceitação definidos.
  - Checklist de **Definition of Done (DoD)**:
    - Código revisado.
    - Testes automatizados atualizados/criados.
    - Cobertura global ≥ limiar configurado (inicialmente 70%).
    - Lint sem erros.
    - SAST sem vulnerabilidades HIGH/CRITICAL abertas.
  - Campo de **riscos e rollback**.
  - Indicação de uso de **feature flags**, quando aplicável.

### 1.4 Quality gates no PR

Um PR só pode ser mergeado se:

1. Pipeline de CI no GitHub Actions estiver **100% verde**.
2. Cobertura de testes global ≥ **70%** (limiar inicial).
3. Ferramenta de SAST (CodeQL/Semgrep) sem findings **HIGH/CRITICAL** pendentes.
4. Pelo menos **1 revisão técnica aprovada**.
5. Quando houver impacto funcional relevante, aprovação do **PO** antes do deploy em produção.

---

## 2. Qualidade & Testes

### 2.1 Pirâmide de testes

Adotamos a seguinte pirâmide:

1. **Testes unitários (base)**  
   - Escopo: funções/métodos isolados.
   - Características:
     - Rápidos (milissegundos/segundos).
     - Sem dependências externas reais (usar mocks/doubles).
   - Objetivo: dar feedback rápido sobre regras de negócio.

2. **Testes de integração (meio da pirâmide)**
   - Escopo: interação entre módulos (ex.: API + banco; serviço + fila).
   - Características:
     - Podem usar banco/fila em ambiente controlado (docker-compose).
   - Objetivo: validar se as peças funcionam bem juntas.

3. **Testes end-to-end (E2E) (topo da pirâmide)**
   - Escopo: fluxo completo de uso (ex.: criar livro → consultar → atualizar).
   - Características:
     - Mais lentos, mais caros de manter.
   - Objetivo: validar cenários críticos do ponto de vista do usuário.

### 2.2 Cobertura de testes

- Cobertura global mínima: **70%** (ponto de partida).
- Código novo deve vir já com testes, evitando queda na cobertura.
- Arquivos críticos (núcleo de domínio) devem tender a ≥ 80% à medida que o time evolui.

### 2.3 Lint

- Ferramenta sugerida: **ESLint** (para projetos JS/TS).
- Rodado automaticamente no estágio `lint` da CI.
- **Gates**:
  - PR **não pode ser mergeado** se houver erros de lint.
  - Warnings podem ser tolerados no início, mas devem ser tratados em ações de melhoria (PDCA).

### 2.4 SAST (Static Application Security Testing)

- Ferramentas sugeridas:
  - **CodeQL** (GitHub) ou **Semgrep OSS**.
- Rodado no estágio `SAST` da CI.
- **Gates**:
  - Findings com severidade **HIGH ou CRITICAL** bloqueiam o merge/deploy.
  - Findings MEDIUM/LOW entram em backlog técnico com priorização por risco.

---

## 3. CI/CD & Ambientes

### 3.1 Pipeline de CI (GitHub Actions)

Pipeline mínimo executado a cada push e PR:

1. **Install**  
   - Instala dependências (ex.: `npm ci`).

2. **Lint**  
   - Executa `npm run lint`.

3. **Test + Coverage**  
   - Executa `npm test -- --coverage`.  
   - Falha se cobertura global < 70%.

4. **SAST**  
   - Executa workflow de CodeQL/Semgrep.  
   - Falha se houver vulnerabilidades HIGH/CRITICAL não resolvidas.

5. **Build/Artifacts**  
   - Gera build da aplicação (ex.: `npm run build`) e/ou imagem Docker.  
   - Publica artefatos necessários ao deploy.

### 3.2 Ambientes

Adotamos três ambientes:

1. **dev**
   - Uso diário do time de desenvolvimento.
   - Dados fictícios/anônimos.
   - Logs verbosos.
   - Flags mais permissivas (para experimentos).

2. **staging (stg)**
   - Espelho próximo de produção.
   - Usado para validar releases fim a fim.
   - Executamos here:
     - Testes de integração mais pesados.
     - Alguns E2E.
     - Testes de migração e performance básicos.

3. **prod**
   - Ambiente de produção (usuários reais).
   - Deploy apenas via pipeline automatizada.
   - Uso de artefatos imutáveis (imagem versionada).

### 3.3 Critérios de promoção entre ambientes

- **dev → staging**
  - Pipeline de CI **verde** (lint, test, coverage, SAST).
  - Cobertura global ≥ 70%.
  - PR aprovado por revisão técnica.
  - Sem vulnerabilidades HIGH/CRITICAL pendentes.

- **staging → prod**
  - Deploy canário realizado em produção.
  - Janela mínima de observação cumprida (ex.: 30 minutos).
  - Métricas estáveis:
    - p95 de latência dentro do SLO definido.
    - Taxa de erros 5xx dentro do limite acordado.
  - Plano de rollback válido (sem steps manuais perigosos).
  - Quando houver impacto funcional relevante, aprovação do PO.

---

## 4. Releases & Rollback

### 4.1 Estratégia de release

Adotamos **release canário**:

1. Implantar nova versão para uma pequena fatia do tráfego (ex.: 5–10%).
2. Monitorar métricas essenciais (latência, erros, logs de erro).
3. Se estiver tudo ok, ampliar gradualmente o tráfego.
4. Se problemas forem detectados, acionar **rollback imediato**.

Feature flags podem ser usadas para:
- Ativar/desativar funcionalidades sem novo deploy.
- Restringir o acesso a funcionalidades experimentais.

### 4.2 Gatilhos de rollback

Uma release canária deve ser revertida quando qualquer dos critérios abaixo for atendido:

- **Taxa de erros 5xx ≥ 2%** por pelo menos **5 minutos**.
- **p95 de latência HTTP ≥ 600ms** por pelo menos **5 minutos**.
- Aumento súbito de erros de negócios registrados em log (ex.: falha em fluxo de compra).
- Alertas críticos disparados (ex.: indisponibilidade reportada por monitoramento externo).

### 4.3 RUNBOOK de rollback

Os passos detalhados estão em `RUNBOOK_rollback.md`, mas o fluxo geral é:

1. Congelar aumento de tráfego para o canário.
2. Redirecionar tráfego de volta para a versão estável anterior.
3. Desativar feature flags associadas à nova versão.
4. Validar rapidamente a saúde do sistema (10–15 min).
5. Registrar o incidente e disparar análise no ciclo PDCA.

---

## 5. Observabilidade, DORA & PDCA

### 5.1 Logs essenciais

1. **Request log**
   - Campos:
     - correlation-id
     - timestamp
     - método HTTP
     - rota/endpoint
     - status code
     - tempo de resposta (ms)
   - Uso:
     - Monitorar latência e erros.
     - Investigar problemas específicos.

2. **Error log**
   - Campos:
     - correlation-id
     - timestamp
     - tipo de erro/exceção
     - mensagem resumida
     - stacktrace
     - contexto (usuário, operação, etc. — sem dados sensíveis)
   - Uso:
     - Diagnóstico detalhado de incidentes.
     - Base para post-mortems leves.

### 5.2 Métricas essenciais

- **p95 de latência HTTP**
  - Objetivo: garantir que a maior parte das requisições tenha tempo de resposta aceitável.
  - Limite inicial: definido em conjunto com o time (ex.: p95 ≤ 400ms em condições normais).

- **Taxa de erros 5xx/min**
  - Objetivo: detectar rapidamente falhas no backend.
  - Limite inicial: próximo de 0; qualquer aumento sustentado aciona investigação.

### 5.3 Métricas DORA mínimas

Monitoramos inicialmente duas métricas DORA:

1. **Lead time for changes**
   - Definição: tempo entre **abrir um PR** e **o PR ser implantado em produção**.
   - Medição:
     - Timestamp de abertura do PR.
     - Timestamp de deploy da mudança em produção (via pipeline).
   - Objetivo: reduzir o lead time mantendo qualidade.

2. **Change failure rate**
   - Definição: % de deploys que exigem rollback ou hotfix urgente.
   - Fórmula:
     - `deploys com rollback / total de deploys no período`.
   - Objetivo: manter a taxa baixa (ideal < 15%).

### 5.4 Rotina PDCA/Kaizen

- **Periodicidade**: reunião **quinzenal** focada em downstream.
- **Participantes**:
  - Pelo menos 1 dev backend, 1 dev frontend (se houver), 1 pessoa de QA (se houver) e 1 responsável por operações/infra.
- **Check (Checar)**:
  - Revisar:
    - Lead time for changes.
    - Change failure rate.
    - Incidentes e rollbacks ocorridos.
    - Tendência de p95 de latência e 5xx/min.
- **Act (Agir)**:
  - Definir **1–2 ações de melhoria** por ciclo (Kaizen), por exemplo:
    - Aumentar cobertura de testes em módulo crítico.
    - Ajustar limiares de alertas.
    - Melhorar automações de rollback.
  - Registrar as ações e, quando efetivas, padronizar:
    - Atualizando políticas (este Blueprint, `POLITICA_Promocao.md`,
      `PULL_REQUEST_TEMPLATE.md` ou `RUNBOOK_rollback.md`).
