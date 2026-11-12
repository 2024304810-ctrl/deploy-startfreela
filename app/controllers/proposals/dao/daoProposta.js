
const Proposta = require('../models/PropostaSchema');

async function salvarProposta(dados) {
    return await Proposta.create(dados);
}

async function buscarPropostasDoProjeto(idProjeto) {
    return await Proposta.find({ idProjeto }).lean();
}

async function buscarPropostaDoFreelancer(idProjeto, idFreelancer) {
    return await Proposta.findOne({
        idProjeto,
        idFreelancer
    }).lean();
}
async function buscarPropostasDoProjeto(idProjeto) {
    return await Proposta.find({ idProjeto })
        .sort({ dataEnvio: -1 })
        .lean();
}

module.exports = {
    salvarProposta,
    buscarPropostasDoProjeto,
    buscarPropostaDoFreelancer
};