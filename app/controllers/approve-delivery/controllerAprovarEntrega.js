const Projeto = require('../publish-project/model/ProjetoSchema');

async function aprovarEntrega(idProjeto, idCliente) {
    try {
        const projeto = await Projeto.findOneAndUpdate(
            {
                idProjeto,
                idCliente,
                status: 'Aguardando aprovação'
            },
            {
                $set: {
                    status: 'Concluído',
                    progresso: 100,
                    'entrega.dataAprovacao': new Date()
                }
            },
            { new: true }
        );

        if (!projeto) {
            return {
                status: 404,
                message: 'Projeto não encontrado ou não está aguardando aprovação.'
            };
        }

        return {
            status: 200,
            success: true,
            message: 'Entrega aprovada! Projeto concluído.'
        };

    } catch (erro) {
        console.error('Erro ao aprovar entrega:', erro);
        return { status: 500, message: 'Erro ao aprovar entrega.' };
    }
}

module.exports = aprovarEntrega;