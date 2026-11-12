const UsuarioSchema = require('../../../auth/register/model/UsuarioSchema');

async function daoAddInfo(informacoesAdicionais) {

    try{
        console.log('adicionando');

        const usuario = await UsuarioSchema.findOneAndUpdate(
            {idUser: informacoesAdicionais.idUser},
            {
                $set: {
                    localizacao: informacoesAdicionais?.localidade,
                    profissao: informacoesAdicionais?.profissao,
                    habilidades: informacoesAdicionais?.habilidades,
                    quantia: informacoesAdicionais?.quantia,
                    redesSociais: informacoesAdicionais?.redesSociais,
                    sobreMim: informacoesAdicionais?.sobreMim
                },
                informacoesAdicionais: true
            },
            {
                new: true,
                strict: false
            }
        )

        console.log('foi');

    }catch(erro){
        console.log(erro);
    };
    
}

module.exports=daoAddInfo;