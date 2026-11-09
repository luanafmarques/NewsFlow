# language: pt
@US03 @RN03 @RN04
Funcionalidade: Agendar envio de newsletter
  Como gestora de comunicação
  Quero agendar o envio de uma edição aprovada para os segmentos certos
  Para que ela chegue no melhor horário sem eu precisar apertar o botão

  Contexto:
    Dado que estou autenticada como gestora "Carla"
    E que existe a edição "Informativo #42" aprovada
    E que o segmento "Clientes Premium" tem 1200 assinantes

  @feliz
  Cenário: Agendamento com antecedência suficiente
    Dado que agora é 10/03/2026 às 8h30 no horário de Brasília
    Quando agendo o envio para daqui a 30 minutos
    Então o disparo deve estar agendado para 10/03/2026 às 9h00
    E devo ver a mensagem "Envio agendado"

  @limite
  Esquema do Cenário: Antecedência mínima de 15 minutos
    Quando agendo o envio para daqui a <minutos> minutos
    Então devo ver a mensagem "<mensagem>"

    Exemplos:
      | minutos | mensagem                               |
      | 60      | Envio agendado                         |
      | 16      | Envio agendado                         |
      | 15      | Envio agendado                         |
      | 14      | O envio precisa de ao menos 15 minutos |
      | 0       | O envio precisa de ao menos 15 minutos |

  @excecao
  Cenário: Segmento sem assinantes bloqueia o agendamento
    Dado que o segmento "Beta Testers" tem 0 assinantes
    Quando agendo o envio para daqui a 30 minutos
    Então devo ver a mensagem "O segmento Beta Testers não tem assinantes"
    E o disparo não deve estar agendado

  @limite
  Esquema do Cenário: No máximo 2 reagendamentos
    Dado que o envio já foi reagendado <vezes> vez(es)
    Quando reagendo o envio para daqui a 60 minutos
    Então devo ver a mensagem "<mensagem>"

    Exemplos:
      | vezes | mensagem                            |
      | 0     | Envio reagendado                    |
      | 1     | Envio reagendado                    |
      | 2     | Limite de 2 reagendamentos atingido |

  @limite
  Esquema do Cenário: Cancelamento até 5 minutos antes do horário marcado
    Dado que o envio está agendado para daqui a <minutos> minutos
    Quando cancelo o envio
    Então devo ver a mensagem "<mensagem>"

    Exemplos:
      | minutos | mensagem                                                   |
      | 6       | Envio cancelado                                            |
      | 5       | Envio cancelado                                            |
      | 4       | O cancelamento só é permitido até 5 minutos antes do envio |
