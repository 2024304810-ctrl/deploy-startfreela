const crypto = require('crypto');

function setIdProject(){
    const randomHash = crypto.randomBytes(16).toString('hex');

    return randomHash;
}

module.exports=setIdProject;
