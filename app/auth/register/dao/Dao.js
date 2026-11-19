const bcrypt = require('bcrypt');
const UsuarioSchema = require('../model/UsuarioSchema');

class Dao{
    async register(usuario){
    
        try{

            console.log('criando usuario no dao');

            usuario.password = await bcrypt.hash(usuario.password, 10);

            console.log('senha criptografada:', usuario.password);

            console.log('email no dao:', usuario.contato.email);

            const criarUsuario = await UsuarioSchema.create(usuario);

            console.log('deu certo no dao');

            return true;

        } catch(erro) {
            
            console.log('deu errado o dao');

            console.log(erro);

            return false;

        }
    }

    async emailExiste(email){
        const emailUser = await UsuarioSchema.findOne({
            email: email
        }).select("email");

        return emailUser;
    }
}

module.exports=Dao;