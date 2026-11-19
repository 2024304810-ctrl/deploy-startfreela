const validator = require('validator');

function emailValido(email){
    if(validator.isEmail(email)){
        return true;
    }else{
        return false;
    }
}

module.exports=emailValido;