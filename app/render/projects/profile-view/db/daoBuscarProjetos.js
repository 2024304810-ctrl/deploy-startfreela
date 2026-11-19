const ProjetoSchema = require('../../../../controllers/add-project/models/ProjetoSchema');

async function daoBuscarProjetos(idUser) {
    console.log('no dao');

    try{
        const projetos = await ProjetoSchema.find({
            idUser: idUser
        }).lean();

        console.log('retornando');

        return projetos;

    }catch(erro){
        console.log(erro);
    }
}

module.exports=daoBuscarProjetos;