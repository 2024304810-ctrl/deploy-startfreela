const Usuario = require('../../../auth/login/models/UsuarioSchema');
const bcrypt = require('bcrypt');

async function atualizarSenha(senha, email){

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    try{

        const filtro = {"contato.email": email};

        const update = {$set: { password: senhaCriptografada }}

        const opcoes = { new: true, upsert: false };

        const resultado = await Usuario.findOneAndUpdate(filtro, update, opcoes);

        console.log('documento atualizado:', resultado);

    }catch(erro){

        console.log(erro);

    }
}

module.exports=atualizarSenha;