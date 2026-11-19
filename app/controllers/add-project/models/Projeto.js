
class Projeto {
    constructor(
        idUser,
        idProjeto,
        imagemCapa,
        titulo,
        categoria,
        dataConclusao,
        descricao,
        habilidades,
        imagensAdicionais = [],
        links = {},
        anexos = []
    ) {
        this.idUser = idUser;
        this.idProjeto = idProjeto;
        this.imagemCapa = imagemCapa;
        this.titulo = titulo;
        this.categoria = categoria;
        this.dataConclusao = dataConclusao;
        this.descricao = descricao;
        this.habilidades = habilidades;

        this.imagensAdicionais = imagensAdicionais;

        this.links = {
            projeto: links.projeto || '',
            github: links.github || ''
        };

        this.anexos = anexos;
    }
}

module.exports = Projeto;
