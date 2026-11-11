
const mongoose = require('mongoose');

const PropostaSchema = new mongoose.Schema({
    idProjeto: {
        type: String,
        required: true
    },

    idFreelancer: {
        type: String,
        required: true
    },

    freelancerUsername: {
        type: String,
        required: true
    },

    valor: {
        type: Number,
        required: true,
        min: 1
    },

    prazoDias: {
        type: Number,
        required: true,
        min: 1,
        max: 365
    },

    mensagem: {
        type: String,
        required: true,
        maxlength: 1000
    },

    status: {
        type: String,
        enum: ['Pendente', 'Aceita', 'Recusada'],
        default: 'Pendente'
    },

    dataEnvio: {
        type: Date,
        default: Date.now
    }
}, {
    collection: process.env.COLLECTION_FOR_PROPOSALS
});

// Um freelancer só pode enviar uma proposta por projeto.
PropostaSchema.index(
    { idProjeto: 1, idFreelancer: 1 },
    { unique: true }
);

module.exports = mongoose.models.Proposta ||
    mongoose.model('Proposta', PropostaSchema);
