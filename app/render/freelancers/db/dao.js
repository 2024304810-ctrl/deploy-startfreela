
const UsuarioSchema = require('../../../auth/register/model/UsuarioSchema');

const Avaliacao = require(
    '../../../controllers/evaluations/models/AvaliacaoSchema'
);

async function renderizarFreelancers() {
    console.log('Buscando freelancers...');

    const freelancers = await UsuarioSchema.find({
        role: 'Freelancer'
    })
    .select(
        'idUser completeName username profissao habilidades quantia'
    )
    .lean();

    const avaliacoes = await Avaliacao.aggregate([
        {
            $match: {
                tipoAvaliador: 'cliente'
            }
        },
        {
            $group: {
                _id: '$idFreelancer',
                nota: { $avg: '$nota' },
                quantidade: { $sum: 1 }
            }
        }
    ]);

    const mapaAvaliacoes = new Map(
        avaliacoes.map(item => [
            String(item._id),
            {
                nota: Number(item.nota.toFixed(1)),
                quantidade_de_avaliacoes: item.quantidade
            }
        ])
    );

    return freelancers.map(freelancer => ({
        ...freelancer,
        avaliacoes: mapaAvaliacoes.get(String(freelancer.idUser)) || {
            nota: null,
            quantidade_de_avaliacoes: 0
        }
    }));
}

module.exports = renderizarFreelancers;
