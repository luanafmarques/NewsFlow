const { Given, When, Then } = require('@cucumber/cucumber')
const assert = require('node:assert/strict')

Given('que o segmento {string} tem {int} assinantes', function (nome, quantidade) {
  this.servico.definirSegmento(nome, quantidade)
  this.segmentosEscolhidos.push(nome)
})

Given('que agora é {horario} no horário de Brasília', function (horario) {
  this.servico.definirAgora(horario)
})

Given('que o envio já foi reagendado {int} vez\\(es)', function (vezes) {
  this.servico.agendar(this.edicao, this.segmentosEscolhidos, 30)
  for (let i = 0; i < vezes; i++) this.servico.reagendar(this.edicao, 60)
})

Given('que o envio está agendado para daqui a {int} minutos', function (minutos) {
  // Agenda com a antecedência mínima e deixa o relógio correr até faltar o tempo pedido.
  this.servico.agendar(this.edicao, this.segmentosEscolhidos, 30)
  this.avancarMinutos(30 - minutos)
})

When('agendo o envio para daqui a {int} minutos', function (minutos) {
  this.resultado = this.servico.agendar(this.edicao, this.segmentosEscolhidos, minutos)
})

When('reagendo o envio para daqui a {int} minutos', function (minutos) {
  this.resultado = this.servico.reagendar(this.edicao, minutos)
})

When('cancelo o envio', function () {
  this.resultado = this.servico.cancelar(this.edicao)
})

Then('o disparo deve estar agendado para {horario}', function (horario) {
  assert.equal(this.edicao.disparo?.situacao, 'agendado')
  assert.equal(this.edicao.disparo.horario, horario.getTime())
})

Then('o disparo não deve estar agendado', function () {
  assert.equal(this.edicao.disparo, null)
})
