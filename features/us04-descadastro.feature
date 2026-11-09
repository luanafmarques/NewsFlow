# language: pt
@US04 @RN06
Funcionalidade: Sair da lista e voltar quando quiser
  Como assinante
  Quero sair da lista pelo próprio e-mail e poder voltar depois
  Para receber só o que me interessa, sem depender de ninguém da Vértice

  Contexto:
    Dado que "maria@exemplo.com" é assinante ativa

  @feliz
  Cenário: Todo e-mail traz o link de descadastro
    Quando a edição "Informativo #42" é enviada a "maria@exemplo.com"
    Então o e-mail recebido por "maria@exemplo.com" deve trazer o link de descadastro

  @feliz
  Cenário: Descadastro tem efeito imediato e é confirmado por e-mail
    Quando "maria@exemplo.com" se descadastra pelo link do e-mail
    Então a situação de "maria@exemplo.com" deve ser "descadastrada"
    E "maria@exemplo.com" deve receber o e-mail "Descadastro confirmado"

  @excecao
  Cenário: Quem se descadastrou não recebe a próxima edição
    Dado que "maria@exemplo.com" se descadastrou
    Quando a edição "Informativo #43" é enviada a "maria@exemplo.com"
    Então "maria@exemplo.com" não deve receber a edição "Informativo #43"

  @alternativo
  Cenário: Voltar à lista exige confirmação por e-mail
    Dado que "maria@exemplo.com" se descadastrou
    Quando "maria@exemplo.com" pede para voltar à lista
    Então a situação de "maria@exemplo.com" deve ser "aguardando confirmação"
    E "maria@exemplo.com" deve receber o e-mail "Confirme seu retorno à lista"

  @limite
  Esquema do Cenário: Link de confirmação vale por 48 horas
    Dado que "maria@exemplo.com" se descadastrou
    E que "maria@exemplo.com" pediu para voltar à lista há <horas> horas
    Quando "maria@exemplo.com" confirma o retorno pelo link
    Então a situação de "maria@exemplo.com" deve ser "<situacao>"

    Exemplos:
      | horas | situacao      |
      | 1     | ativa         |
      | 47    | ativa         |
      | 48    | ativa         |
      | 49    | descadastrada |
