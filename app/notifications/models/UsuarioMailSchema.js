const moongose = require('mongoose');

const UsuarioSchema = new moongose.Schema({

    contato: {
        email: {
            type: String,
            required: true,
        },
    },

    username: {
        type: String,
        required: true,
    },

}, {
    collection: process.env.COLLECTION_FOR_AUTH
});

module.exports= moongose.model("UsuarioMail", UsuarioSchema);