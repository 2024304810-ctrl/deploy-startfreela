
const ProjetoSchema = require(
    '../../../../controllers/add-project/models/ProjetoSchema'
);

async function daoBuscarProjetos(idUser) {
    const projetos = await ProjetoSchema.find({
        idUser: String(idUser)
    })
    .sort({ createdAt: -1 })
    .lean();

    return projetos;
}

module.exports = daoBuscarProjetos;
