
const Projeto = require('../../publish-project/model/ProjetoSchema');

async function atualizarProgresso(idProjeto, idFreelancer, percentual, descricao) {
    try {
        percentual = Number(percentual);

        if (
            !Number.isInteger(percentual) ||
            percentual < 0 ||
            percentual > 100 ||
            typeof descricao !== 'string' ||
            !descricao.trim() ||
            descricao.trim().length > 500
        ) {
            return {
                status: 400,
                message: 'Percentual ou descrição inválidos.'
            };
        }

        const projeto = await Projeto.findOneAndUpdate(
            {
                idProjeto,
                idFreelancerContratado: idFreelancer,
                status: 'Em andamento'
            },
            {
                $set: {
                    progresso: percentual
                },
                $push: {
                    atualizacoesProgresso: {
                        percentual,
                        descricao: descricao.trim(),
                        data: new Date()
                    }
                }
            },
            { new: true }
        );

        if (!projeto) {
            return {
                status: 404,
                message: 'Projeto não encontrado ou você não é o freelancer contratado.'
            };
        }

        return {
            status: 200,
            success: true,
            message: 'Progresso atualizado!',
            progresso: projeto.progresso
        };

    } catch (erro) {
        console.error('Erro ao atualizar progresso:', erro);

        return {
            status: 500,
            message: 'Erro ao atualizar progresso.'
        };
    }
}

module.exports = atualizarProgresso;
