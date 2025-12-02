# 📌 Pull Request — Template Oficial

Obrigado por abrir este PR!  
Preencha as seções abaixo para garantir qualidade, rastreabilidade e previsibilidade conforme nosso Blueprint do Downstream.

---

## 📝 Descrição do PR
Explique **o que foi alterado** e **por quê**:

- Qual problema este PR resolve?
- Há alguma motivação adicional ou contexto útil?

---

## 🔗 Issue / História Relacionada
Link para a história/tarefa no backlog (ex.: Jira, Trello, GitHub Issues):


---

# ✅ Definition of Ready (DoR)

Marque os itens que estavam prontos **antes de iniciar** o desenvolvimento:

- [ ] História clara e compreendida pelo time  
- [ ] Critérios de aceitação definidos  
- [ ] Dependências identificadas  
- [ ] Impactos mapeados (frontend/backend/infra)  
- [ ] Dados de teste preparados (se necessário)  
- [ ] Feature flag definida (quando aplicável)  

---

# 🏁 Definition of Done (DoD)

O PR só pode ser considerado concluído se **todos** os itens foram atendidos:

- [ ] Código implementado  
- [ ] Testes criados/atualizados  
- [ ] Cobertura global mantida ou aumentada  
- [ ] Logs estruturados revisados (request/error)  
- [ ] Documentação atualizada (README, Blueprint, etc.)  
- [ ] Sem débitos técnicos novos não justificados  
- [ ] Aprovado em revisão técnica  
- [ ] Aprovado pelo PO (quando há impacto funcional)  

---

# 🧪 Quality Gates (CI/CD)

Este PR só pode ser mergeado se atingir todos os critérios:

- [ ] CI **verde** em todos os estágios  
- [ ] Lint sem erros  
- [ ] Testes **verdes**  
- [ ] Cobertura ≥ **70%** (limiar inicial)  
- [ ] SAST sem vulnerabilidades **HIGH/CRITICAL**  
- [ ] Build gerado com sucesso  

---

# 🛡️ Segurança

- [ ] Mudança revisada pensando em segurança (inputs, validações, permissões)  
- [ ] SAST analisado e findings avaliados  
- [ ] Sem exposição de dados sensíveis  

---

# 🚨 Riscos & Rollback

Descreva:

1. Possíveis riscos da mudança  
2. Como reverter (plano rápido)  

Exemplo: Se falhar, rollback feito via RUNBOOK_rollback.md revertendo para a versão estável anterior.


---

# 🏳️ Feature Flags (quando aplicável)

- [ ] Há feature flag associada?  
- [ ] Flag foi testada ligada e desligada?  
- [ ] Flag está documentada?  

---

# 📸 Evidências / Screenshots (opcional)

Adicione logs, prints, resultados de testes E2E, etc.

---

# 👥 Revisores

- [ ] Revisão técnica por: @usuario  
- [ ] Aprovação do PO (se aplicável): @produto  

---

