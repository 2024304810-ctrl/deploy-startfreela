const moongose = require('mongoose');

const mensagemSchema = new moongose.Schema({
    remetente: {
        type: String,
        required: true
    },

    nomeRemetente: {
        type: String
    },

    destinatario: {
        type: String,
        required: true
    },

    nomeDestinatario: {
        type: String
    },

    texto: {
        type: String,
        required: true
    },

    data: {
        type: Date,
        required: true,
        default: Date.now
    }
}, {
    collection: process.env.COLLECTION_FOR_CHAT
});

module.exports= moongose.model('MensagemSchema', mensagemSchema);