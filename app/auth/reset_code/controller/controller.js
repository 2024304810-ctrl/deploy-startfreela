const daoResetCode = require('../db/daoResetCode');
const bcrypt = require('bcrypt');

async function controllerVerificarCodigoDeRedefinicao(codigo, email){

    console.log('codigo:', codigo);
    console.log('email:', email);

    console.log('vendo se o código tem a quantidade certa de números');
    if(codigo < 6){
        return {
            success: false
        }
    }

    try{
        console.log('indo pro dao');

        const respostaDao = await daoResetCode(codigo, email);
        
        console.log('resposta retornada -->', respostaDao);

        if(!respostaDao){
            return {
                status: 500,
                erro: "Código Inválido"
            }
        }

        const codigoRetornado = respostaDao.resetCode;

        console.log('codigo retornado -->,', codigoRetornado);

        console.log('codigos são iguais -->', (codigo === codigoRetornado));

        if(codigo === codigoRetornado){
            return {
                success: true,
                status: 201,
                message: "Certo! Código válido"
            }
        }
    }catch(erro){
       console.log(erro); 
    }
}

module.exports=controllerVerificarCodigoDeRedefinicao;