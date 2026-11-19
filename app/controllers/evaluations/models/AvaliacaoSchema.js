const mongoose = require('mongoose');

const AvaliacaoSchema = new mongoose.Schema({
    idProjeto: {
        type: String,
        required: true
    },
    idCliente: {
        type: String,
        required: true
    },
    idFreelancer: {
        type: String,
        required: true
    },

    tipoAvaliador: {
        type: String,
        enum: ['cliente', 'freelancer'],
        required: true
    },

    avaliadorUsername: {
        type: String,
        required: true
    },

    avaliadoUsername: {
        type: String,
        required: true
    },

    nota: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },

    comentario: {
        type: String,
        default: '',
        maxlength: 500
    },

    dataAvaliacao: {
        type: Date,
        default: Date.now
    }
});

// Permite uma avaliação de cada cargo por projeto.
AvaliacaoSchema.index(
    { idProjeto: 1, tipoAvaliador: 1 },
    { unique: true }
);

module.exports = mongoose.model('Avaliacao', AvaliacaoSchema);