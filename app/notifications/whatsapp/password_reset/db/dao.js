const UsuarioMail = require('../../../models/UsuarioMailSchema');

async function getUser(contato){
    console.log('dentro do dao');

    try{

        const usuario = await UsuarioMail.findOne({
            "contato.phone": contato
        });

        console.log(usuario?.username);

        console.log('usuario no dao:', usuario);

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

module.exports=getUser;