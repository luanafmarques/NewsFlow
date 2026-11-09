# language: pt
@US01 @RN01
Funcionalidade: Salvar rascunho automaticamente
  Como redatora
  Quero que meu texto seja salvo enquanto escrevo
  Para não perder trabalho quando a conexão cair

  Contexto:
    Dado que estou autenticada como redatora "Ana"
    E que existe a edição "Informativo #42" em rascunho

  @feliz
  Cenário: Texto é salvo depois de 30 segundos sem digitar
    Dado que escrevi "Olá, assinantes!" na edição
    Quando fico 30 segundos sem digitar
    Então o rascunho deve ter 1 versão salva
    E a versão 1 deve conter "Olá, assinantes!"

  @limite
  Esquema do Cenário: Salvamento só acontece com 30 segundos de inatividade
    Dado que escrevi "Olá, assinantes!" na edição
    Quando fico <segundos> segundos sem digitar
    Então o rascunho deve ter <versoes> versões salvas

    Exemplos:
      | segundos | versoes |
      | 0        | 0       |
      | 29       | 0       |
      | 30       | 1       |
      | 31       | 1       |

  @feliz
  Cenário: Restaurar uma versão antiga não apaga as versões seguintes
    Dado que a edição já passou por 3 salvamentos automáticos
    Quando restauro a versão 1
    Então o texto da edição deve ser o da versão 1
    E as versões disponíveis devem ir da 1 à 3

  @excecao
  Cenário: Só as últimas 20 versões podem ser restauradas
    Dado que a edição já passou por 25 salvamentos automáticos
    Quando tento restaurar a versão 5
    Então devo ver a mensagem "A versão 5 não está mais disponível para restauração"
    E as versões disponíveis devem ir da 6 à 25
