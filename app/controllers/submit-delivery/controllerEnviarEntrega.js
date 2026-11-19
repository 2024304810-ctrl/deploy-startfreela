const Projeto = require('../publish-project/model/ProjetoSchema');

async function enviarEntrega(idProjeto, idFreelancer, descricao, link) {
    try {
        if (
            typeof descricao !== 'string' ||
            !descricao.trim() ||
            descricao.trim().length > 1000
        ) {
            return { status: 400, message: 'Descrição inválida.' };
        }

        if (typeof link !== 'string' || !link.trim()) {
            return { status: 400, message: 'Informe o link da entrega.' };
        }

        let url;

        try {
            url = new URL(link.trim());

            if (!['http:', 'https:'].includes(url.protocol)) {
                throw new Error('Protocolo inválido');
            }
        } catch {
            return { status: 400, message: 'Informe um link válido.' };
        }

        const projeto = await Projeto.findOneAndUpdate(
            {
                idProjeto,
                idFreelancerContratado: idFreelancer,
                status: 'Em andamento'
            },
            {
                $set: {
                    status: 'Aguardando aprovação',
                    entrega: {
                        descricao: descricao.trim(),
                        link: url.href,
                        dataEnvio: new Date(),
                        dataAprovacao: null
                    }
                }
            },
            { new: true, runValidators: true }
        );

        if (!projeto) {
            return {
                status: 404,
                message: 'Projeto não encontrado ou não está disponível para entrega.'
            };
        }

        return {
            status: 200,
            success: true,
            message: 'Entrega enviada para aprovação!'
        };

    } catch (erro) {
        console.error('Erro ao enviar entrega:', erro);
        return { status: 500, message: 'Erro ao enviar entrega.' };
    }
}

module.exports = enviarEntrega;