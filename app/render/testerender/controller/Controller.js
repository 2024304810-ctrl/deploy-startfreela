const Usuario = require('../../../auth/register/model/UsuarioSchema');

class Controller{

    async renderizar(req){
        
        const {id} = req.usuario;

        console.log('dentro do render')

        const usuario = await Usuario.findOne({
            "idUser": id 
        }).lean();

        console.log("Usuario pegado do render:", usuario);

        return usuario;
    }

}

module.exports=Controller;