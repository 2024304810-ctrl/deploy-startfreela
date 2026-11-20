
const Projeto = require('../../../controllers/publish-project/model/ProjetoSchema');
const Avaliacao = require('../../../controllers/evaluations/models/AvaliacaoSchema');

async function daoDadosFreelancer(idFreelancer) {
    const [projetos, avaliacoes] = await Promise.all([
        Projeto.find({
            idFreelancerContratado: String(idFreelancer),
            status: 'Concluído'
        }).lean(),

        Avaliacao.find({
            idFreelancer: String(idFreelancer),
            tipoAvaliador: 'cliente'
        }).sort({ dataAvaliacao: -1 }).lean()
    ]);

    const projetosPorId = new Map(
        projetos.map(projeto => [String(projeto.idProjeto), projeto])
    );

    const avaliacoesComProjeto = avaliacoes.map(avaliacao => ({
        ...avaliacao,
        tituloProjeto:
            projetosPorId.get(String(avaliacao.idProjeto))?.titulo ||
            'Projeto concluído',
        inicialAvaliador: String(
            avaliacao.avaliadorUsername || '?'
        ).charAt(0).toUpperCase(),
        dataFormatada: new Date(
            avaliacao.dataAvaliacao
        ).toLocaleDateString('pt-BR')
    }));

    const media = avaliacoes.length
        ? avaliacoes.reduce((soma, item) => soma + item.nota, 0) / avaliacoes.length
        : 0;

    const distribuicaoNotas = [5, 4, 3, 2, 1].map(nota => {
        const quantidade = avaliacoes.filter(
            item => item.nota === nota
        ).length;

        return {
            nota,
            quantidade,
            percentual: avaliacoes.length
                ? (quantidade / avaliacoes.length) * 100
                : 0
        };
    });

    const projetosComAvaliacao = projetos.map(projeto => ({
        ...projeto,
        avaliacao: avaliacoesComProjeto.find(
            item => String(item.idProjeto) === String(projeto.idProjeto)
        ) || null
    }));

    return {
        projetosConcluidos: projetosComAvaliacao,
        avaliacoes: avaliacoesComProjeto,
        totalProjetos: projetos.length,
        totalAvaliacoes: avaliacoes.length,
        mediaAvaliacoes: Number(media.toFixed(1)),
        distribuicaoNotas
    };
}

module.exports = daoDadosFreelancer;
