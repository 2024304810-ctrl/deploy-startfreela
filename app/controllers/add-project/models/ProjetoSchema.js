
const mongoose = require('mongoose');

const ProjetoSchema = new mongoose.Schema({
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
        required: true
    },

    dataConclusao: {
        type: String,
        required: true
    },

    descricao: {
        type: String,
        required: true
    },

    habilidades: [{
        type: String
    }],

    imagensAdicionais: [{
        url: {
            type: String,
            required: true
        },
        legenda: {
            type: String,
            default: ''
        }
    }],

    links: {
        projeto: {
            type: String,
            default: ''
        },
        github: {
            type: String,
            default: ''
        }
    },

    anexos: [{
        nome: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
        tipo: {
            type: String,
            default: ''
        },
        tamanho: {
            type: Number,
            default: 0
        }
    }]

}, {
    collection: process.env.COLLECTION_FOR_PROJECTS,
    timestamps: true
});

module.exports =
    mongoose.models.Projeto ||
    mongoose.model('Projeto', ProjetoSchema);
