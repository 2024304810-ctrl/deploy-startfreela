class Projeto {
    constructor(idCliente, clienteUsername, idProjeto, titulo, categoria, dataPostagem, prazoDesejado, orcamentoMinimo, orcamentoMaximo, descricao, habilidades){
        this.idCliente = idCliente;
        this.clienteUsername = clienteUsername
        this.idProjeto = idProjeto;
        this.titulo = titulo;
        this.categoria = categoria;
        this.dataPostagem = dataPostagem
        this.prazoDesejado = prazoDesejado;
        this.orcamentoMinimo = orcamentoMinimo;
        this.orcamentoMaximo = orcamentoMaximo;
        this.descricao = descricao;
        this.habilidades = habilidades
    }
}

module.exports = Projeto;