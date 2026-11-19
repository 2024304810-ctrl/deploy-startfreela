
const UsuarioSchema = require('../../../auth/register/model/UsuarioSchema');

async function daoAddInfo(informacoesAdicionais) {

    try {

        console.log('Salvando informações adicionais...');

        const campos = {
            localizacao: informacoesAdicionais.localidade,
            profissao: informacoesAdicionais.profissao,
            redesSociais: informacoesAdicionais.redesSociais || [],
            sobreMim: informacoesAdicionais.sobreMim || '',
            informacoesAdicionais: true,
            
        };

       

        if (informacoesAdicionais.habilidades !== undefined) {
            campos.habilidades = informacoesAdicionais.habilidades;
        }

        if (informacoesAdicionais.quantia !== undefined) {
            campos.quantia = informacoesAdicionais.quantia;
        }

        const usuario = await UsuarioSchema.findOneAndUpdate(
            {
                idUser: informacoesAdicionais.idUser
            },
            {
                $set: campos
            },
            {
                new: true,
                strict: false,
                runValidators: true
            }
        );

        if (!usuario) {
            throw new Error('Usuário não encontrado no banco de dados.');
        }

        console.log('Informações adicionais salvas:', usuario.idUser);

        return usuario;

    } catch (erro) {

        console.error('Erro no DAO de informações adicionais:', erro);

        throw erro;
    }
}

module.exports = daoAddInfo;
