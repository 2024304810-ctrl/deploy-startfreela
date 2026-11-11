class Projeto{

    constructor(idUser, idProjeto, imagemCapa, titulo, categoria, dataConclusao, descricao, habilidades){
        this.idUser = idUser;
        this.idProjeto = idProjeto
        this.imagemCapa = imagemCapa;
        this.titulo = titulo;
        this.categoria = categoria;
        this.dataConclusao = dataConclusao;
        this.descricao = descricao;
        this.habilidades = habilidades;
    }

}

module.exports=Projeto;