const { Given, When, Then } = require('@cucumber/cucumber')
const assert = require('node:assert/strict')

Given('que {string} é assinante ativa', function (email) {
  this.servico.cadastrarAssinante(email)
})

Given('que {string} se descadastrou', function (email) {
  this.servico.descadastrar(email)
})

Given('que {string} pediu para voltar à lista há {int} horas', function (email, horas) {
  this.servico.solicitarRetorno(email)
  this.avancarHoras(horas)
})

When('a edição {string} é enviada a {string}', function (titulo, email) {
  this.resultado = this.servico.entregar(titulo, email)
})

When('{string} se descadastra pelo link do e-mail', function (email) {
  this.resultado = this.servico.descadastrar(email)
})

When('{string} pede para voltar à lista', function (email) {
  this.resultado = this.servico.solicitarRetorno(email)
})

When('{string} confirma o retorno pelo link', function (email) {
  this.resultado = this.servico.confirmarRetorno(email)
})

Then('o e-mail recebido por {string} deve trazer o link de descadastro', function (email) {
  const recebidos = this.servico.assinante(email).caixaDeEntrada
  const ultimo = recebidos[recebidos.length - 1]
  assert.ok(ultimo?.linkDescadastro, 'O e-mail não traz o link de descadastro')
})

Then('a situação de {string} deve ser {string}', function (email, situacao) {
  assert.equal(this.servico.assinante(email).situacao, situacao)
})

Then('{string} deve receber o e-mail {string}', function (email, assunto) {
  const assuntos = this.servico.assinante(email).caixaDeEntrada.map(e => e.assunto)
  assert.ok(assuntos.includes(assunto), `E-mail "${assunto}" não recebido. Recebidos: ${assuntos.join(', ')}`)
})

Then('{string} não deve receber a edição {string}', function (email, titulo) {
  const assuntos = this.servico.assinante(email).caixaDeEntrada.map(e => e.assunto)
  assert.ok(!assuntos.includes(titulo), `${email} recebeu "${titulo}"`)
})
