const moongose = require('mongoose');

const DestinatarioSchema = new moongose.Schema({

    idUser: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true
    }      

}, {
    collection: process.env.COLLECTION_FOR_AUTH
});

module.exports= moongose.model("Destinatario", DestinatarioSchema);