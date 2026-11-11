const validator = require('validator');
const dao = require('../dao/dao');
const emailValido = require('../../../utils/email/emailValido');
const bcrypt = require('bcrypt');
const gerarToken = require('../services/gerarToken');
const cookieParser = require('cookie-parser');

async function controllerLogin(email, senha, res){
    //O números de erros é um INT para que a cada erro seja acrescentado +1
    let erros = 0;

    //Vendo se os campos EMAIL e SENHA estão vazios
    if(!email || !senha){
        erros++;
    }

    //Verificando se o formato do email é válido
    if(!emailValido(email)){
        erros++;
    }

    //Hora da verdade: se o número de erros for maior que 0, retorna FALSE imediatamente para o cliente
    if(erros > 0){
        return {
           status: 400,
           erro: "Email ou senha incorretos!"
       }
    }else{
        console.log('consultando o DAO');
        
        //Se não houver erros --> consultando o DAO para achar tal usuário
        const usuarioRetornado = await dao(email);

        console.log('Email retornado:', usuarioRetornado.email);
        console.log("Telefone retornado:", usuarioRetornado.contato?.phone);
        console.log('Senha retornada:', usuarioRetornado.password);
        console.log('Email iguais:',usuarioRetornado.contato.email === email);
        console.log(await bcrypt.compare(senha, usuarioRetornado.password));

        //Comparando se os dados do cliente recebidos são iguais as informações retornadas do DAO
        if(usuarioRetornado.contato.email === email && await bcrypt.compare(senha, usuarioRetornado.password)){
            console.log('deu certo');

            //Gerando o JWT (ou token de autenticação)
            const token = gerarToken(usuarioRetornado);

            //Guardando o token no servidor para casos de renderizações e aplicações de middleware
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax"
            });

            //Retornando tais dados para o cliente:
            return {
                status: 201,
                success: true,
                token: token
            }
    
        }else{
            console.log('deu errado');

            //Caso a operação não dê certo --> retornando erro ao cliente
            return {
                success: false,
                message: "Email ou senha incorretos!"
            }
        }
    }
}

//Exportando controller
module.exports=controllerLogin;