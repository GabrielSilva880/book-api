# 📘 Política de Promoção — dev → staging → prod

Documento oficial que regula a promoção de versões entre ambientes, garantindo previsibilidade, segurança e qualidade conforme o Blueprint do Downstream.

---

## 1. 🎯 Objetivo

Estabelecer critérios **claros, repetíveis e objetivos** para enviar mudanças para:

1. `dev`
2. `staging`
3. `production (prod)`

Garantindo:

- Qualidade automática via CI/CD  
- Redução de riscos  
- Observabilidade adequada  
- Possibilidade de rollback rápido  
- Maturidade leve conforme PDCA/Kaizen  

---

## 2. 🌎 Ambientes

### **dev**
- Ambiente de desenvolvimento.
- Logs verbosos, dados fictícios, flags livres.
- Usado para testes locais e validação inicial.

### **staging**
- Espelho de produção.
- Validação fim a fim (funcional, integração, migrações, performance básica).

### **prod**
- Ambiente de produção com usuários reais.
- Deploy controlado via pipeline + release canário.

---

## 3. 🔄 Critérios de Promoção — dev → staging

Para uma release ser promovida de **dev** para **staging**, todos os itens abaixo devem estar **100% atendidos**:

### ✔ **Qualidade (CI/CD)**  
- [ ] Pipeline CI **verde** (lint, test, coverage, SAST).  
- [ ] Cobertura de testes ≥ **70%** (limiar inicial).  
- [ ] Lint sem erros.  
- [ ] SAST sem vulnerabilidades **HIGH/CRITICAL**.  

### ✔ **Revisão e documentação**  
- [ ] PR aprovado por pelo menos 1 revisor técnico.  
- [ ] DoD completo no PR.  
- [ ] Documentação atualizada, quando aplicável.  

### ✔ **Ambiente**  
- [ ] Build gerado com sucesso (artefato imutável).  
- [ ] Variáveis de ambiente validadas.  

### ✔ **Segurança**  
- [ ] Sem exposição de dados sensíveis.  
- [ ] Dependências atualizadas sem CVEs graves.  

---

## 4. 🚀 Critérios de Promoção — staging → prod

Para uma release seguir de **staging** para **prod**, é necessário:

### ✔ **Validação em staging**  
- [ ] Testes funcionais e de integração passando.  
- [ ] Migrações verificadas com sucesso.  
- [ ] Logs sem erros críticos no ambiente de staging.  

### ✔ **Release Canário**  
Após deploy inicial para uma parcela pequena do tráfego (5–10%):

- [ ] p95 de latência dentro do SLO configurado.  
- [ ] Taxa de erros **5xx < 2%** por no mínimo **5 minutos**.  
- [ ] Sem regressões nos logs de erro.  
- [ ] Sem anomalias nas métricas de negócio.  

### ✔ **Revisão e Governança**  
- [ ] Plano de rollback disponível e testado.  
- [ ] Aprovação do PO quando houver impacto funcional.  

---

## 5. ❌ Bloqueadores de Promoção

A promoção **NÃO pode ocorrer** se qualquer um dos itens abaixo estiver presente:

- CI falhando em qualquer estágio.  
- Cobertura < 70%.  
- SAST com HIGH/CRITICAL.  
- Rollback anterior não resolvido.  
- Latência acima do SLO durante o canário.  
- Taxa de erro 5xx alta ou crescente.  
- Ausência de aprovação técnica no PR.  
- Falha em migrações de banco.  

---

## 6. 🧾 Evidências Obrigatórias

Toda promoção deve conter na descrição do deploy:

- Link da **pipeline** utilizada.  
- Link do **PR** correspondente.  
- Screenshot ou link de **dashboards** (latência, 5xx, logs críticos).  
- Justificativa do PO (se aplicável).  
- Confirmação de que o rollback foi validado.  

---

## 7. 🕑 Janelas de Mudança & Freeze

- Deploys em **produção** preferencialmente entre 09h e 16h (dias úteis).  
- Períodos de **freeze** podem ser definidos em datas críticas (ex.: Black Friday).  
- Durante freeze:  
  - Apenas hotfixes emergenciais podem ser promovidos.  
  - A política padrão permanece, exceto para casos críticos.  

---

## 8. 🔐 Segurança e Conformidade

Antes de promover para produção, verificar:

- Logs **não** contêm dados sensíveis.  
- Variáveis de ambiente e segredos estão corretos.  
- Acesso dos serviços está conforme regras de permissão.  
- Dependências atualizadas sem CVEs graves.  

---

## 9. 🔁 Revisão da Política (PDCA)

Esta política deve ser revisada:

- A cada **2 meses**, ou  
- Após qualquer incidente relevante, ou  
- Quando uma ação de melhoria (Kaizen) impactar este documento.  

Alterações devem ser feitas somente após consenso do time e incorporadas ao Blueprint do Downstream.

---
