
const MensagemSchema = require('../../messages/model/MensagemSchema');

async function getContatos(idUser) {
    const id = String(idUser);

    const contatos = await MensagemSchema.aggregate([
        {
            $match: {
                $or: [
                    { remetente: id },
                    { destinatario: id }
                ]
            }
        },
        {
            $sort: {
                data: -1
            }
        },
        {
            $addFields: {
                idContato: {
                    $cond: [
                        { $eq: ['$remetente', id] },
                        '$destinatario',
                        '$remetente'
                    ]
                },
                nomeContato: {
                    $cond: [
                        { $eq: ['$remetente', id] },
                        '$nomeDestinatario',
                        '$nomeRemetente'
                    ]
                }
            }
        },
        {
            $group: {
                _id: '$idContato',
                idContato: { $first: '$idContato' },
                nomeContato: { $first: '$nomeContato' },
                texto: { $first: '$texto' },
                data: { $first: '$data' }
            }
        },
        {
            $sort: {
                data: -1
            }
        },
        {
            $project: {
                _id: 0,
                idContato: 1,
                nomeContato: 1,
                texto: 1,
                data: 1
            }
        }
    ]);

    return contatos;
}

module.exports = getContatos;
