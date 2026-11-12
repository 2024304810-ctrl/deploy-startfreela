const Projeto = require('../../../../controllers/publish-project/model/ProjetoSchema');

class ProjetoPublicado {
    async daoBuscarProjetosPublicados(){
        try{
            const projetos = await Projeto.find().lean();
            console.log(projetos);

            return projetos;
        }catch(erro){
            console.log('erro');
        }
    }   

    async daoBuscarProjetoPublicado(idProjeto){
        try{
            const projeto = await Projeto.findOne({
                "idProjeto": idProjeto
            }).lean();

            console.log('projeto buscado:', projeto);

            return projeto;

        }catch(erro){
            console.log(erro);
        }
    }
    async daoBuscarProjetosDoCliente(idCliente) {
    try {
        const projetos = await Projeto.find({
            idCliente: idCliente
        }).lean();

        return projetos;

    } catch (erro) {
        console.log('Erro ao buscar projetos do cliente:', erro);
        throw erro;
    }
}
}


module.exports = ProjetoPublicado;