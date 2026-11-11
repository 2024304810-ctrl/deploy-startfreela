const emailValido = require('../../../../utils/email/emailValido');
const gerarCodigo = require('../../../services/gerarCodigo');
const Dao = require('../dao/DaoMailResetCode');
const dao = new Dao();
const mandarEmail = require('../service/mandarEmail');
const ResetCode = require('../model/ResetCode');

async function controllerEnviarEmailDeRecuperacao(email){
    if(!email || !emailValido(email)){
        return {
            status: 400,
            erro: "Email inserido incorretamente!"
        }
    } 

    const usuarioRetornado = await dao.getUser(email);

    console.log('depois de retornar do dao');

    console.log('retornando usuario --> ', usuarioRetornado.user.email);
    console.log('retornando usuario --> ', usuarioRetornado.user?.username);
    console.log('retornando usuario --> ', usuarioRetornado.user?.password);
    console.log('retornando usuario --> ', usuarioRetornado.user?.completeName);
    console.log('retornando usuario --> ', usuarioRetornado?.user);

    if(!usuarioRetornado.user){
        console.log('deu erro no sucesso');

        return {
            erro: "Email não existente no sistema!"
        }
    }

    const tokenDeRecuperacao = gerarCodigo();

    const resetCodeObject = new ResetCode("Email", tokenDeRecuperacao, email);

    await dao.setResetCode(resetCodeObject);

    try{
        console.log('dentro do try');

        console.log('Email');

        await mandarEmail(usuarioRetornado.user, tokenDeRecuperacao);

        console.log('Depois de ter enviado')

        return {
            email: email,
            status: 201,
            success: true
        };

    }catch(erro){
        console.log(erro);

        console.log('deu algo de errado sei lá');
        
        return {
            status: 500,
            erro: "Algo deu errado!"
        }
    }
    
}

function criarModelo(){

}

module.exports=controllerEnviarEmailDeRecuperacao;