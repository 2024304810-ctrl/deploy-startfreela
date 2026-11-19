const moongose = require('mongoose');

const ResetCodeSchema = new moongose.Schema({

    requestMethod: {
        type: String,
        required: true
    },

    resetCode: {
        type: String,
        required: true
    },

    dataUser: {
        type: String,
        require: true
    },

    createIn: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 300
    }

}, {
    collection: process.env.COLLECTION_FOR_RESET_CODE
});

module.exports= moongose.model("ResetCode", ResetCodeSchema);