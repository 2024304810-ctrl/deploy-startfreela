const crypto = require('crypto');

function setIdUser(){
    const randomHash = crypto.randomBytes(11).toString('hex');

    return randomHash;
}

module.exports=setIdUser;
