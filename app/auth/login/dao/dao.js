const Usuario = require('../models/UsuarioSchema');
const UsuarioSchema = require('../../register/model/UsuarioSchema');

async function dao(email){
    console.log('dentro do dao');

    const usuario = await Usuario.findOne({
       "contato.email" : email
    })

    await UsuarioSchema.findOneAndUpdate(
        {"contato.email": email},
        {ativo: true},
        {new: true}
    )

    console.log("Usuário -->", usuario);

    return usuario;
}

module.exports=dao;
