const ResetCode = require('../../../notifications/mail/password_reset/model/ResetCodeSchema')

async function daoResetCode(codigo, contato){

    const resetCode = await ResetCode.findOne({
        resetCode: codigo,
        dataUser: contato
    });

    console.log('resetCode no dao -->', resetCode);

    return resetCode;
}

module.exports=daoResetCode;