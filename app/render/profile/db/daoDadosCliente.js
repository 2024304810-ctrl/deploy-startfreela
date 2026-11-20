
const Projeto = require('../../../controllers/publish-project/model/ProjetoSchema');
const Avaliacao = require('../../../controllers/evaluations/models/AvaliacaoSchema');

async function daoDadosCliente(idCliente) {
    try {
        // Buscar projetos publicados pelo cliente
        const projetos = await Projeto.find({
            idCliente: String(idCliente)
        }).lean();

        // Buscar avaliações feitas pelos freelancers sobre esse cliente
        const avaliacoes = await Avaliacao.find({
            idCliente: String(idCliente),
            tipoAvaliador: 'freelancer'
        }).sort({ dataAvaliacao: -1 }).lean();

        const projetosAbertos = projetos.filter(
            projeto => projeto.status === 'Aberto'
        );

        const projetosConcluidos = projetos.filter(
            projeto => projeto.status === 'Concluído'
        );

        // Relacionar avaliações aos projetos
        const historicoProjetos = projetosConcluidos.map(projeto => {
            const avaliacao = avaliacoes.find(
                item => item.idProjeto === projeto.idProjeto
            );

            return {
                ...projeto,
                avaliacao
            };
        });
        const avaliacoesComProjeto = avaliacoes.map(avaliacao => {
    const projeto = projetos.find(
        item => String(item.idProjeto) === String(avaliacao.idProjeto)
    );

    return {
        ...avaliacao,

        tituloProjeto: projeto
            ? projeto.titulo
            : 'Projeto não encontrado',

        inicialAvaliador: String(
            avaliacao.avaliadorUsername || '?'
        ).charAt(0).toUpperCase(),

        dataFormatada: avaliacao.dataAvaliacao
            ? new Date(avaliacao.dataAvaliacao).toLocaleDateString('pt-BR')
            : 'Data não informada'
    };
});

        // Calcular média das avaliações
        const totalAvaliacoes = avaliacoes.length;

        const somaNotas = avaliacoes.reduce(
            (total, avaliacao) => total + avaliacao.nota,
            0
        );

        const mediaAvaliacoes = totalAvaliacoes > 0
            ? (somaNotas / totalAvaliacoes).toFixed(1)
            : '0.0';

        // Distribuição das notas de 1 a 5
        const distribuicaoAvaliacoes = [5, 4, 3, 2, 1].map(nota => {
            const quantidade = avaliacoes.filter(
                avaliacao => avaliacao.nota === nota
            ).length;

            return {
                nota,
                quantidade,
                percentual: totalAvaliacoes > 0
                    ? (quantidade / totalAvaliacoes) * 100
                    : 0
            };
        });

        return {
    projetosPublicados: projetosAbertos,
    historicoProjetos,
    avaliacoes: avaliacoesComProjeto,

    totalProjetos: projetos.length,
    totalProjetosAbertos: projetosAbertos.length,
    totalConcluidos: projetosConcluidos.length,

    totalAvaliacoes,
    mediaAvaliacoes,
    distribuicaoAvaliacoes
};

    } catch (erro) {
        console.error('Erro ao buscar dados do perfil do cliente:', erro);
        throw erro;
    }
}

module.exports = daoDadosCliente;
