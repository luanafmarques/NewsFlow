const { setWorldConstructor, defineParameterType } = require('@cucumber/cucumber')
const Servico = require('./dominio')

class MundoDoNewsFlow {
  constructor () {
    this.servico = new Servico()
    this.edicao = null
    this.resultado = null
    this.segmentosEscolhidos = []
  }

  avancarSegundos (segundos) {
    this.servico.avancarRelogio(segundos * 1000)
  }

  avancarMinutos (minutos) {
    this.servico.avancarRelogio(minutos * Servico.MINUTO)
  }

  avancarHoras (horas) {
    this.servico.avancarRelogio(horas * Servico.HORA)
  }
}
setWorldConstructor(MundoDoNewsFlow)

// {papel}: aceita a forma masculina e a feminina e devolve o papel no sistema.
defineParameterType({
  name: 'papel',
  regexp: /redator|redatora|revisor|revisora|gestor|gestora/,
  transformer: texto => texto.replace(/a$/, '')
})

// {horario}: "10/03/2026 às 9h00", sempre no fuso America/Sao_Paulo (UTC-3).
defineParameterType({
  name: 'horario',
  regexp: /(\d{2})\/(\d{2})\/(\d{4}) às (\d{1,2})h(\d{2})/,
  transformer: (dia, mes, ano, hora, minuto) =>
    new Date(`${ano}-${mes}-${dia}T${hora.padStart(2, '0')}:${minuto}:00-03:00`)
})
