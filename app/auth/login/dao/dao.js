
const UsuarioSchema = require('../../register/model/UsuarioSchema');

async function dao(email) {
    console.log('Dentro do DAO de login');

    const usuario = await UsuarioSchema.findOneAndUpdate(
        { "contato.email": email },
        { $set: { ativo: true } },
        { new: true }
    );

    console.log('Usuário encontrado:', usuario);

    return usuario;
}

module.exports = dao;
