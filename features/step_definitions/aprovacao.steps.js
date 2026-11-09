const { When, Then } = require('@cucumber/cucumber')
const assert = require('node:assert/strict')

When('aprovo a edição', function () {
  this.resultado = this.servico.aprovar(this.edicao)
})

When('reprovo a edição com o comentário {string}', function (comentario) {
  this.resultado = this.servico.reprovar(this.edicao, comentario)
})

When('reprovo a edição sem comentário', function () {
  this.resultado = this.servico.reprovar(this.edicao, '')
})

Then('a edição deve estar {string}', function (estado) {
  assert.equal(this.edicao.estado, estado)
})

Then('a autora deve ver o comentário {string}', function (texto) {
  assert.ok(
    this.edicao.comentarios.some(c => c.texto === texto),
    `Comentário "${texto}" não encontrado na edição`
  )
})
