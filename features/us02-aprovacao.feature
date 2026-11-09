# language: pt
@US02 @RN02
Funcionalidade: Aprovar ou devolver uma edição
  Como revisor
  Quero aprovar a edição ou devolvê-la com um comentário
  Para que nada seja enviado sem uma segunda leitura e o redator saiba o que corrigir

  Contexto:
    Dado que existe a edição "Informativo #42" escrita por "Ana" aguardando aprovação

  @feliz
  Cenário: Revisor aprova a edição de outra pessoa
    Dado que estou autenticado como revisor "Bruno"
    Quando aprovo a edição
    Então a edição deve estar "aprovada"
    E devo ver a mensagem "Edição aprovada"

  @excecao
  Cenário: Autora não aprova a própria edição
    Dado que estou autenticada como revisora "Ana"
    Quando aprovo a edição
    Então devo ver a mensagem "O autor não pode aprovar a própria edição"
    E a edição deve estar "aguardando aprovação"

  @alternativo
  Cenário: Reprovação devolve a edição ao rascunho com o comentário
    Dado que estou autenticado como revisor "Bruno"
    Quando reprovo a edição com o comentário "O título está desatualizado"
    Então a edição deve estar "rascunho"
    E a autora deve ver o comentário "O título está desatualizado"

  @excecao
  Cenário: Reprovação sem comentário é recusada
    Dado que estou autenticado como revisor "Bruno"
    Quando reprovo a edição sem comentário
    Então devo ver a mensagem "Informe um comentário para reprovar a edição"
    E a edição deve estar "aguardando aprovação"

  @excecao
  Cenário: Edição sem aprovação não pode ser agendada
    Dado que estou autenticada como gestora "Carla"
    E que o segmento "Clientes Premium" tem 1200 assinantes
    Quando agendo o envio para daqui a 30 minutos
    Então devo ver a mensagem "A edição precisa ser aprovada antes do envio"
