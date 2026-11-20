
const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    idUser: {
        type: String,
        required: true
    },

    completeName: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true
    },

    contato: {
        email: {
            type: String,
            required: true,
            unique: true
        },
        phone: {
            type: String,
            required: true
        }
    },

    dateOfBirth: {
        type: Date,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        required: true
    },

    ativo: {
        type: Boolean
    },

    premium: {
        type: Boolean,
        required: true
    },

    createdIn: {
        type: String,
        required: true
    },

    localizacao: {
        pais: String,
        estado: String,
        cidade: String,
        cep: String
    },

    profissao: {
        type: String,
        default: ''
    },

    habilidades: {
        type: [String],
        default: []
    },

    quantia: {
        valor: {
            type: String,
            default: ''
        },
        per: {
            type: String,
            default: ''
        }
    },

    redesSociais: {
        type: [{
            site: String,
            link: String
        }],
        default: []
    },

    sobreMim: {
        type: String,
        default: ''
    },

    informacoesAdicionais: {
        type: Boolean,
        required: true,
        default: false
    }

}, {
    collection: process.env.COLLECTION_FOR_AUTH
});

module.exports = mongoose.model('UsuarioSchema', UsuarioSchema);
