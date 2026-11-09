// Domínio do NewsFlow em memória, com relógio simulado (nada de sleep).
const SEGUNDO = 1000
const MINUTO = 60 * SEGUNDO
const HORA = 60 * MINUTO

const INTERVALO_SALVAMENTO = 30 * SEGUNDO // RN01
const VERSOES_MANTIDAS = 20 // RN01
const ANTECEDENCIA_MINIMA = 15 * MINUTO // RN03
const MAX_REAGENDAMENTOS = 2 // RN03
const PRAZO_CANCELAMENTO = 5 * MINUTO // RN03
const MAX_SEGMENTOS = 5 // RN04
const VALIDADE_OPTIN = 48 * HORA // RN06

const ok = mensagem => ({ sucesso: true, mensagem })
const falha = mensagem => ({ sucesso: false, mensagem })

class Servico {
  constructor (agora = new Date('2026-03-10T08:00:00-03:00')) {
    this.agora = agora.getTime()
    this.usuarioAtual = null
    this.edicoes = new Map()
    this.segmentos = new Map()
    this.assinantes = new Map()
  }

  // ---------- Relógio ----------
  definirAgora (data) {
    this.agora = data.getTime()
  }

  avancarRelogio (ms) {
    this.agora += ms
    for (const edicao of this.edicoes.values()) this._salvarSePendente(edicao)
  }

  // ---------- Usuários ----------
  autenticar (nome, papel) {
    this.usuarioAtual = { nome, papel }
  }

  // ---------- Edições e rascunho (RN01) ----------
  criarEdicao (titulo, autor, estado = 'rascunho') {
    const edicao = {
      titulo,
      autor,
      estado,
      conteudo: '',
      versoes: [],
      ultimaVersao: 0,
      alteracaoPendente: false,
      ultimaDigitacao: null,
      comentarios: [],
      disparo: null
    }
    this.edicoes.set(titulo, edicao)
    return edicao
  }

  escrever (edicao, texto) {
    edicao.conteudo = texto
    edicao.alteracaoPendente = true
    edicao.ultimaDigitacao = this.agora
  }

  _salvarSePendente (edicao) {
    if (!edicao.alteracaoPendente) return
    if (this.agora - edicao.ultimaDigitacao < INTERVALO_SALVAMENTO) return
    edicao.ultimaVersao++
    edicao.versoes.push({ numero: edicao.ultimaVersao, texto: edicao.conteudo, salvaEm: this.agora })
    if (edicao.versoes.length > VERSOES_MANTIDAS) edicao.versoes.shift()
    edicao.alteracaoPendente = false
  }

  restaurar (edicao, numero) {
    const versao = edicao.versoes.find(v => v.numero === numero)
    if (!versao) return falha(`A versão ${numero} não está mais disponível para restauração`)
    edicao.conteudo = versao.texto
    return ok(`Versão ${numero} restaurada`)
  }

  // ---------- Aprovação (RN02) ----------
  aprovar (edicao) {
    const usuario = this.usuarioAtual
    if (!usuario || usuario.papel !== 'revisor') return falha('Apenas revisores podem aprovar edições')
    if (usuario.nome === edicao.autor) return falha('O autor não pode aprovar a própria edição')
    if (edicao.estado !== 'aguardando aprovação') return falha('A edição não está aguardando aprovação')
    edicao.estado = 'aprovada'
    return ok('Edição aprovada')
  }

  reprovar (edicao, comentario) {
    const usuario = this.usuarioAtual
    if (!usuario || usuario.papel !== 'revisor') return falha('Apenas revisores podem reprovar edições')
    if (!comentario || !comentario.trim()) return falha('Informe um comentário para reprovar a edição')
    edicao.estado = 'rascunho'
    edicao.comentarios.push({ autor: usuario.nome, texto: comentario })
    return ok('Edição devolvida ao rascunho')
  }

  // ---------- Segmentação e agendamento (RN03, RN04) ----------
  definirSegmento (nome, quantidadeDeAssinantes) {
    this.segmentos.set(nome, quantidadeDeAssinantes)
  }

  agendar (edicao, segmentos, minutos) {
    if (edicao.estado !== 'aprovada') return falha('A edição precisa ser aprovada antes do envio')
    if (segmentos.length > MAX_SEGMENTOS) return falha(`Uma edição vai para no máximo ${MAX_SEGMENTOS} segmentos`)
    const vazio = segmentos.find(nome => !this.segmentos.get(nome))
    if (vazio) return falha(`O segmento ${vazio} não tem assinantes`)
    if (minutos * MINUTO < ANTECEDENCIA_MINIMA) return falha('O envio precisa de ao menos 15 minutos')
    edicao.disparo = {
      horario: this.agora + minutos * MINUTO,
      segmentos: [...segmentos],
      reagendamentos: 0,
      situacao: 'agendado'
    }
    return ok('Envio agendado')
  }

  reagendar (edicao, minutos) {
    const disparo = edicao.disparo
    if (!disparo || disparo.situacao !== 'agendado') return falha('Não há envio agendado')
    if (disparo.reagendamentos >= MAX_REAGENDAMENTOS) return falha('Limite de 2 reagendamentos atingido')
    if (minutos * MINUTO < ANTECEDENCIA_MINIMA) return falha('O envio precisa de ao menos 15 minutos')
    disparo.horario = this.agora + minutos * MINUTO
    disparo.reagendamentos++
    return ok('Envio reagendado')
  }

  cancelar (edicao) {
    const disparo = edicao.disparo
    if (!disparo || disparo.situacao !== 'agendado') return falha('Não há envio agendado')
    if (disparo.horario - this.agora < PRAZO_CANCELAMENTO) {
      return falha('O cancelamento só é permitido até 5 minutos antes do envio')
    }
    disparo.situacao = 'cancelado'
    return ok('Envio cancelado')
  }

  // ---------- Assinantes e descadastro (RN06) ----------
  cadastrarAssinante (email) {
    this.assinantes.set(email, { email, situacao: 'ativa', optin: null, caixaDeEntrada: [] })
  }

  assinante (email) {
    const assinante = this.assinantes.get(email)
    if (!assinante) throw new Error(`Assinante ${email} não cadastrada`)
    return assinante
  }

  entregar (titulo, email) {
    const assinante = this.assinante(email)
    if (assinante.situacao !== 'ativa') return falha(`${email} não está inscrita na lista`)
    assinante.caixaDeEntrada.push({
      assunto: titulo,
      tipo: 'newsletter',
      linkDescadastro: `https://newsflow.vertice.com.br/descadastro?assinante=${encodeURIComponent(email)}`
    })
    return ok('Edição entregue')
  }

  descadastrar (email) {
    const assinante = this.assinante(email)
    assinante.situacao = 'descadastrada'
    assinante.optin = null
    assinante.caixaDeEntrada.push({ assunto: 'Descadastro confirmado', tipo: 'transacional' })
    return ok('Você saiu da lista')
  }

  solicitarRetorno (email) {
    const assinante = this.assinante(email)
    if (assinante.situacao === 'ativa') return falha('Você já está inscrita na lista')
    assinante.situacao = 'aguardando confirmação'
    assinante.optin = { expiraEm: this.agora + VALIDADE_OPTIN }
    assinante.caixaDeEntrada.push({ assunto: 'Confirme seu retorno à lista', tipo: 'transacional' })
    return ok('Enviamos um link de confirmação para o seu e-mail')
  }

  confirmarRetorno (email) {
    const assinante = this.assinante(email)
    if (!assinante.optin) return falha('Não há pedido de retorno para confirmar')
    if (this.agora > assinante.optin.expiraEm) {
      assinante.situacao = 'descadastrada'
      assinante.optin = null
      return falha('O link de confirmação expirou')
    }
    assinante.situacao = 'ativa'
    assinante.optin = null
    return ok('Inscrição confirmada')
  }
}

module.exports = Servico
module.exports.MINUTO = MINUTO
module.exports.HORA = HORA
