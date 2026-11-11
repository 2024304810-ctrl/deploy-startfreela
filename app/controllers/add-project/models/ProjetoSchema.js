const moongose = require('mongoose');

const ProjetoSchema = new moongose.Schema({

    idUser: {
        type: String,
        required: true
    },

    idProjeto: {
        type: String,
        required: true
    },

    imagemCapa: {
        type: String,
        required: true
    },

    titulo: {
        type: String,
        required: true
    },

    categoria: {
        type: String,
        required: true,
    },

    dataConclusao: {
        type: String,
        required: true
    },

    descricao: {
        type: String,
        required: true
    },

    habilidades: [
        {
            type: String,
            required: true
        }
    ]

}, {
    collection: process.env.COLLECTION_FOR_PROJECTS
});

module.exports = moongose.models.ProjetoSchema || moongose.model("Projeto", ProjetoSchema);