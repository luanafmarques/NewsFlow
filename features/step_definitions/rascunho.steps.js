const { Given, When, Then } = require('@cucumber/cucumber')
const assert = require('node:assert/strict')

Given('que escrevi {string} na edição', function (texto) {
  this.servico.escrever(this.edicao, texto)
})

Given('que a edição já passou por {int} salvamentos automáticos', function (quantidade) {
  for (let i = 1; i <= quantidade; i++) {
    this.servico.escrever(this.edicao, `Texto da versão ${i}`)
    this.avancarSegundos(30)
  }
})

When('fico {int} segundos sem digitar', function (segundos) {
  this.avancarSegundos(segundos)
})

When('restauro a versão {int}', function (numero) {
  this.resultado = this.servico.restaurar(this.edicao, numero)
})

When('tento restaurar a versão {int}', function (numero) {
  this.resultado = this.servico.restaurar(this.edicao, numero)
})

Then('o rascunho deve ter {int} versão/versões salva(s)', function (quantidade) {
  assert.equal(this.edicao.versoes.length, quantidade)
})

Then('a versão {int} deve conter {string}', function (numero, texto) {
  const versao = this.edicao.versoes.find(v => v.numero === numero)
  assert.ok(versao, `A versão ${numero} não existe`)
  assert.equal(versao.texto, texto)
})

Then('o texto da edição deve ser o da versão {int}', function (numero) {
  const versao = this.edicao.versoes.find(v => v.numero === numero)
  assert.equal(this.edicao.conteudo, versao.texto)
})

Then('as versões disponíveis devem ir da {int} à {int}', function (primeira, ultima) {
  const numeros = this.edicao.versoes.map(v => v.numero)
  const esperados = Array.from({ length: ultima - primeira + 1 }, (_, i) => primeira + i)
  assert.deepEqual(numeros, esperados)
})
