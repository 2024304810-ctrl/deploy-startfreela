const daoAddInfo = require('../db/daoAddInfo');

async function controllerAdditionalInformation(informacoesAdicionais) {
    for(let atributo in informacoesAdicionais){
        if(!informacoesAdicionais[atributo] || informacoesAdicionais[atributo].length < 1){
            console.log('excluindo:', atributo);
            delete informacoesAdicionais[atributo];
        }
    }

    console.log('depois de remover:', informacoesAdicionais);

    try{
        console.log('indo para o dao...');
        await daoAddInfo(informacoesAdicionais);

        return {
            success: true
        };
    }catch(erro){
        console.log(erro);
        return{success: false};
    }
}

module.exports=controllerAdditionalInformation;