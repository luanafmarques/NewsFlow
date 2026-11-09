# Histórias de usuário — NewsFlow

## US01 — Salvar rascunho automaticamente

**Como** redatora
**Quero** que meu texto seja salvo enquanto escrevo
**Para** não perder trabalho quando a conexão cair

**Critérios de aceitação**
- O rascunho é salvo depois de 30 segundos sem digitação; antes disso, nada é salvo.
- Cada salvamento cria uma versão numerada.
- As últimas 20 versões podem ser restauradas; as mais antigas deixam de estar disponíveis.
- Restaurar uma versão não apaga as versões seguintes.

**Regras cobertas:** RN01
**Prioridade:** Alta — perda de conteúdo é a reclamação número um dos redatores.
**Cenários:** [features/us01-rascunho.feature](../features/us01-rascunho.feature)

---

## US02 — Aprovar ou devolver uma edição

**Como** revisor
**Quero** aprovar a edição ou devolvê-la com um comentário
**Para** que nada seja enviado sem uma segunda leitura e o redator saiba o que corrigir

**Critérios de aceitação**
- Um revisor aprova a edição escrita por outra pessoa.
- O autor não consegue aprovar a própria edição, mesmo sendo revisor.
- Reprovar devolve a edição ao rascunho e exige um comentário.
- Uma edição que não foi aprovada não pode ser agendada.

**Regras cobertas:** RN02
**Prioridade:** Alta — é o controle que impede um erro de chegar a 40 mil assinantes.
**Cenários:** [features/us02-aprovacao.feature](../features/us02-aprovacao.feature)

---

## US03 — Agendar envio para segmentos

**Como** gestora de comunicação
**Quero** agendar o envio de uma edição aprovada para os segmentos certos
**Para** que ela chegue no melhor horário sem eu precisar apertar o botão

**Critérios de aceitação**
- O envio só é agendado com no mínimo 15 minutos de antecedência, no fuso America/Sao_Paulo.
- Segmento com zero assinantes bloqueia o agendamento.
- O envio pode ser reagendado no máximo 2 vezes.
- O envio pode ser cancelado até 5 minutos antes do horário marcado.

**Regras cobertas:** RN03, RN04 (segmento vazio)
**Prioridade:** Alta — é o fluxo central do produto e concentra as fronteiras numéricas mais arriscadas.
**Cenários:** [features/us03-agendamento.feature](../features/us03-agendamento.feature)

---

## US04 — Sair da lista e voltar quando quiser

**Como** assinante
**Quero** sair da lista pelo próprio e-mail e poder voltar depois
**Para** receber só o que me interessa, sem depender de ninguém da Vértice

**Critérios de aceitação**
- Todo e-mail de newsletter traz o link de descadastro.
- O descadastro tem efeito imediato: a próxima edição já não é entregue.
- O descadastro é confirmado por e-mail.
- Voltar à lista exige confirmação por um link válido por 48 horas.

**Regras cobertas:** RN06
**Prioridade:** Média — não gera receita, mas é obrigação legal (LGPD) e protege a reputação da lista.
**Cenários:** [features/us04-descadastro.feature](../features/us04-descadastro.feature)
