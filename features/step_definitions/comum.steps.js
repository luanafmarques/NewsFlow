const { Given, Then } = require('@cucumber/cucumber')
const assert = require('node:assert/strict')

Given('que estou autenticado/autenticada como {papel} {string}', function (papel, nome) {
  this.servico.autenticar(nome, papel)
})

Given('que existe a edição {string} em rascunho', function (titulo) {
  this.edicao = this.servico.criarEdicao(titulo, this.servico.usuarioAtual.nome, 'rascunho')
})

Given('que existe a edição {string} escrita por {string} aguardando aprovação', function (titulo, autor) {
  this.edicao = this.servico.criarEdicao(titulo, autor, 'aguardando aprovação')
})

Given('que existe a edição {string} aprovada', function (titulo) {
  this.edicao = this.servico.criarEdicao(titulo, 'Ana', 'aprovada')
})

Then('devo ver a mensagem {string}', function (esperada) {
  assert.equal(this.resultado.mensagem, esperada)
})
