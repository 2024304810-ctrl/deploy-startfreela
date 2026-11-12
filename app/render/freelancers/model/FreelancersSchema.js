const moongose = require('mongoose');

const FreelancersSchema = new moongose.Schema({

    username: {
        type: String,
        required: true,
    },

    profissao: {
        type: String,
        required: true
    },

    avaliacoes: {
        nota: {
            type: Number,
            required: true
        },

        quantidade_de_avaliacoes: {
            type: Number,
            required: true
        }
    },

    habilidades: [
        {
            habilidade: {
                type: String,
                required: true
            }
        }
    ],

    nivel: {
        type: Number,
        required: true
    }

}, {
    collection: process.env.COLLECTION_FOR_AUTH
});

module.exports= moongose.model("Freelancers", FreelancersSchema);