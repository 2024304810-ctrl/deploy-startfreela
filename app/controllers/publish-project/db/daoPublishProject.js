const ProjetoPublicado = require('../model/ProjetoSchema');

async function daoPublishProject(projeto) {
    try {
        return await ProjetoPublicado.create(projeto);

    } catch (erro) {
        console.error('Erro ao salvar projeto:', erro);
        throw erro;
    }
}

module.exports = daoPublishProject;