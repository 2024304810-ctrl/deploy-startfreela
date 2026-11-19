
const Projeto = require('../models/ProjetoSchema');

async function daoAddProjeto(projeto) {
    const projetoSalvo = await Projeto.create(projeto);

    return projetoSalvo;
}

module.exports = daoAddProjeto;
