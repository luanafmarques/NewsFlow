# NewsFlow — do Gherkin ao Cucumber

Alunas: Luana Ferreira Marques e Manuela Edmundo Moss

Exercício de BDD sobre o NewsFlow, a plataforma de newsletters e notificações da Vértice:
quatro histórias de usuário, cenários em Gherkin e uma suíte Cucumber.js que roda de verdade.

## Como rodar

```bash
npm install
npm test            # executa todos os cenários e gera relatorios/cucumber-report.html
npm run test:dry    # valida a sintaxe e confere se todo passo tem implementação
```

Requer Node.js 18 ou mais recente.

## Onde está cada coisa

| Caminho | Conteúdo |
|---|---|
| [docs/historias.md](docs/historias.md) | As histórias US01–US04, com critérios de aceitação, regras e prioridade |
| [features/](features/) | Um `.feature` por história, em português (`# language: pt`) |
| [features/step_definitions/](features/step_definitions/) | Os steps que ligam cada frase do Gherkin ao domínio |
| [features/support/](features/support/) | O World (estado de cada cenário) e o domínio em memória, com relógio simulado |
| [relatorios/cucumber-report.html](relatorios/cucumber-report.html) | Relatório HTML da última execução |

## Histórias

| ID | História | Regras | Prioridade |
|---|---|---|---|
| US01 | Salvar rascunho automaticamente | RN01 | Alta |
| US02 | Aprovar ou devolver uma edição | RN02 | Alta |
| US03 | Agendar envio para segmentos | RN03, RN04 (segmento vazio) | Alta |
| US04 | Sair da lista e voltar quando quiser | RN06 | Média |

Os cenários usam etiquetas para seleção: `@feliz`, `@alternativo`, `@excecao`, `@limite`, além do ID da
história e das regras (`@US03`, `@RN03`). Exemplo: `npx cucumber-js --tags "@US03 and @limite"`.

## Fora de escopo

- **RN05 — Frequência:** o limite de 2 newsletters por semana depende de um histórico de disparos e de uma fila semanal, o que pede uma história própria depois que o agendamento (US03) estiver estável.
- **RN07 — Falha de entrega:** é um comportamento interno do envio, percebido pela equipe de operação, e não pelos atores das quatro histórias escolhidas; fica para quando houver uma história de operação.
- **RN08 — Notificação push:** o canal de notificação no aplicativo é separado do e-mail e tem regras próprias (janela de silêncio, limite diário); merece uma história dedicada.
- **RN04 — parte parcial:** o limite de 5 segmentos e a deduplicação de quem está em dois segmentos ficaram de fora da US03 para manter a história com no máximo seis cenários; só o bloqueio de segmento vazio foi coberto.

## Saída do `npm test`

```
..............................................................................................................................................................................

33 scenarios (33 passed)
174 steps (174 passed)
0m 0.155s (0m 0.022s executing your code)
```
