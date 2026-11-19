const Usuario = require('../../../auth/register/model/UsuarioSchema');

async function daoPerfilTecnico(idPerfil, req){
    const {id} = req.usuario;

    const perfil = await Usuario.findOne({
        "idUser": idPerfil
    }).lean();

    const usuario = await Usuario.findOne({
        "idUser": id
    }).lean();

    console.log('usuario resgatda no daoPerfilTecnico -->', usuario);
    return {perfil, usuario}
}

module.exports=daoPerfilTecnico;