const UsuarioSchema = require('../register/model/UsuarioSchema');

async function logout(idUser){

    try{
        const logout = await UsuarioSchema.findOneAndUpdate(
            {idUser: idUser},
            {ativo: false},
            {new: true}
        );
    }catch(erro){
        console.log(erro);
    }

}

module.exports=logout;