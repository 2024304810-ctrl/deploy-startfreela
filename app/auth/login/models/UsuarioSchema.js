const moongose = require('mongoose');

const UsuarioSchema = new moongose.Schema({

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
            required: true,
        }
    },

    role: {
        type: String,
        required: true
    },

    premium: {
        type: Boolean,
        required: true
    },

    password: {
        type: String,
        required: true
    }

}, {
    collection: process.env.COLLECTION_FOR_AUTH
});

module.exports= moongose.model("Usuario", UsuarioSchema);