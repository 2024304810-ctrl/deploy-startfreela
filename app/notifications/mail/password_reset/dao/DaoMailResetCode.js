const UsuarioMail = require('../../../models/UsuarioMailSchema');
const ResetCode = require('../model/ResetCodeSchema');
const bcrypt = require('bcrypt');

class DaoMailResetCode{
    async getUser(contato){
    console.log('dentro do dao');

    try{

        const usuario = await UsuarioMail.findOne({
            "contato.email": contato
        }).lean();

        console.log(usuario?.username);
        console.log(usuario.contato.email);

        console.log('retornando do dao');
            return {
                success:true,
                user: usuario
            }

    }catch(erro){
        console.log(erro);
        return {
            success: false
        }
    }

    }

    async setResetCode(schema){

        try{
        
            console.log('código criptografado:', schema.resetCode);
            
            const criarUsuario = await ResetCode.create(schema);
            
            return true;
            
        }catch(erro){
            console.log(erro);

            return;
        }

    }


}


module.exports=DaoMailResetCode;
