
const daoAddInfo = require('../db/daoAddInfo');

async function controllerAdditionalInformation(informacoesAdicionais) {
    try {
        console.log('Preparando informações adicionais...');

        const dados = {
            idUser: informacoesAdicionais.idUser,

            localizacao:
                informacoesAdicionais.localizacao ||
                informacoesAdicionais.localidade,

            redesSociais: informacoesAdicionais.redesSociais || [],
            sobreMim: informacoesAdicionais.sobreMim || ''
        };

        if (informacoesAdicionais.profissao !== undefined) {
            dados.profissao = informacoesAdicionais.profissao;
        }

        if (informacoesAdicionais.habilidades !== undefined) {
            dados.habilidades = informacoesAdicionais.habilidades;
        }

        if (informacoesAdicionais.quantia !== undefined) {
            dados.quantia = informacoesAdicionais.quantia;
        }

        console.log('Dados preparados:', dados);

        await daoAddInfo(dados);

        return {
            success: true,
            message: 'Informações adicionais salvas com sucesso!'
        };

    } catch (erro) {
        console.error('Erro no controller:', erro);
        throw erro;
    }
}

module.exports = controllerAdditionalInformation;
