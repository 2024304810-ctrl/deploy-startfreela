const moongose = require('mongoose');

const ProjetoSchema = new moongose.Schema({

    idCliente: {
        type: String,
        required: true
    },

    clienteUsername: {
        type: String,
        required: true
    },

    idProjeto: {
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

    dataPostagem: {
        type: String,
        required: true,
    },

    prazoDesejado: {
        type: String,
        required: true,
    },

    orcamentoMinimo: {
        type: String,
        required: true,
    },

    orcamentoMaximo: {
        type: String,
        required: true,
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
    ],
    status: {
        type: String,
        enum: [
            'Aberto',
            'Em andamento',
            'Aguardando aprovação',
            'Concluído'
        ],
        default: 'Aberto'
    },

    idFreelancerContratado: {
        type: String,
        default: null
    },

    freelancerUsernameContratado: {
        type: String,
        default: null
    },

    idPropostaAceita: {
        type: String,
        default: null
    },
    progresso: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
},

    atualizacoesProgresso: [
        {
            percentual: {
                type: Number,
                required: true
            },
            descricao: {
                type: String,
                required: true
            },
            data: {
                type: Date,
                default: Date.now
            }
        }
    ],entrega: {
    descricao: {
        type: String,
        default: null
    },
    link: {
        type: String,
        default: null
    },
    dataEnvio: {
        type: Date,
        default: null
    },
    dataAprovacao: {
        type: Date,
        default: null
    }
}


}, {
    collection: process.env.COLLECTION_FOR_PUBLISHED_PROJECTS
});

module.exports = moongose.models.ProjetoSchema || moongose.model("ProjetoPublicado", ProjetoSchema);