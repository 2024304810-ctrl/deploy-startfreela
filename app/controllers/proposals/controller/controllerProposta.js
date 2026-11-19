
const dao = require('../dao/daoProposta');
const Projeto = require('../../publish-project/model/ProjetoSchema');

async function enviarProposta(dados) {
    const { idProjeto, idFreelancer, freelancerUsername,
        valor, prazoDias, mensagem } = dados;

    // Validação dos campos
    if (
    !idProjeto ||
    !idFreelancer ||
    !freelancerUsername ||
    !valor ||
    !prazoDias ||
    typeof mensagem !== 'string' ||
    !mensagem.trim()
) {
    return {
        status: 400,
        message: 'Preencha todos os campos.'
    };
}

    if (!Number.isFinite(Number(valor)) || Number(valor) <= 0 ||
        !Number.isInteger(Number(prazoDias)) ||
        Number(prazoDias) < 1 || Number(prazoDias) > 365 ||
        mensagem.trim().length > 1000) {
        return {
            status: 400,
            message: 'Dados da proposta inválidos.'
        };
    }

    try {
        // Verifica se o projeto existe
        const projeto = await Projeto.findOne({ idProjeto });

        if (!projeto) {
            return {
                status: 404,
                message: 'Projeto não encontrado.'
            };
        }

        // Impede o freelancer de propor ao próprio projeto
        if (projeto.idCliente === idFreelancer) {
            return {
                status: 403,
                message: 'Você não pode enviar proposta ao próprio projeto.'
            };
        }

        // Impede propostas em projetos encerrados
        if (projeto.status && projeto.status !== 'Aberto') {
            return {
                status: 400,
                message: 'Este projeto não está recebendo propostas.'
            };
        }

        // Verifica se já existe proposta
        const existente = await dao.buscarPropostaDoFreelancer(
            idProjeto,
            idFreelancer
        );

        if (existente) {
            return {
                status: 409,
                message: 'Você já enviou uma proposta para este projeto.'
            };
        }

        await dao.salvarProposta({
            idProjeto,
            idFreelancer,
            freelancerUsername,
            valor: Number(valor),
            prazoDias: Number(prazoDias),
            mensagem: mensagem.trim()
        });

        return {
            status: 201,
            success: true,
            message: 'Proposta enviada com sucesso!'
        };

    } catch (erro) {
        if (erro.code === 11000) {
            return {
                status: 409,
                message: 'Você já enviou uma proposta para este projeto.'
            };
        }

        console.error('Erro ao enviar proposta:', erro);

        return {
            status: 500,
            message: 'Erro interno ao enviar proposta.'
        };
    }
}

module.exports = enviarProposta;
