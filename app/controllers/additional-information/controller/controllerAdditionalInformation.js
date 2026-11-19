const daoAddInfo = require('../db/daoAddInfo');

async function controllerAdditionalInformation(informacoesAdicionais) {
    try {
        console.log('Preparando informações adicionais...');

        const dados = {
    idUser: informacoesAdicionais.idUser,
    localidade: informacoesAdicionais.localidade,
    profissao: informacoesAdicionais.profissao,
    redesSociais: informacoesAdicionais.redesSociais || [],
    sobreMim: informacoesAdicionais.sobreMim || ''
};

        // Informações específicas do freelancer
       

        if (informacoesAdicionais.habilidades !== undefined) {
            dados.habilidades = informacoesAdicionais.habilidades;
        }

        if (informacoesAdicionais.quantia !== undefined) {
            dados.quantia = informacoesAdicionais.quantia;
        }

        console.log('Dados preparados:', dados);
        console.log('Enviando para o DAO...');

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