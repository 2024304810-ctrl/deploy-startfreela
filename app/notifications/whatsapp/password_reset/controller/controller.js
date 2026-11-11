const validarNumero = require('../../../../utils/phone/numeroValido');
const gerarCodigo = require('../../../services/gerarCodigo');
const DaoMailResetCode = require('../../../mail/password_reset/dao/DaoMailResetCode');
const daoMail = new DaoMailResetCode();
const getUser = require('../db/dao');
const ClientWhatsapp = require('../ClientWhatsapp');
const whatsapp = new ClientWhatsapp();
const ResetCode = require('../../../mail/password_reset/model/ResetCode');

async function controllerEnviarWhatsappDeRecuperacao(numero){
    if(!numero || !validarNumero(numero)){
        return {
            status: 400,
            erro: "Número inserido incorretamente!"
        }
    } 

    const usuarioRetornado = await getUser(numero);

    console.log('depois de retornar do dao');

    console.log('retornando usuario --> ', usuarioRetornado?.user);

    console.log('retornando usuario --> ', usuarioRetornado.user.contato?.email);
    console.log('retornando usuario --> ', usuarioRetornado.user?.username);
    console.log('retornando usuario --> ', usuarioRetornado.user?.password);
    console.log('retornando usuario --> ', usuarioRetornado.user?.completeName);

    if(!usuarioRetornado.user){
        console.log('deu erro no sucesso');

        return {
            erro: "Número não existente no sistema!"
        }
    }

    const emailRetornado = usuarioRetornado.user.contato.email;
    console.log('Email retornado do dao:', emailRetornado);

    const tokenDeRecuperacao = gerarCodigo();

    const resetCodeObject = new ResetCode("Whatsapp", tokenDeRecuperacao, emailRetornado);

    await daoMail.setResetCode(resetCodeObject);

    try{
        console.log('dentro do try');


        await whatsapp.enviarZap(numero, tokenDeRecuperacao);

        console.log('Depois de ter enviado');

        return {
            email: emailRetornado,
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

module.exports=controllerEnviarWhatsappDeRecuperacao;