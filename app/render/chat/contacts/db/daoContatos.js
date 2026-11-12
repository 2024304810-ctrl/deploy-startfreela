const MensagemSchema = require('../../messages/model/MensagemSchema');

async function getContatos(idUser){
    const contatos = await MensagemSchema.find({
        $or: [
            {
                remetente: idUser
            },
            {
                destinatario: idUser
            }
        ]
    }).sort({data: -1}).limit(1);

    return contatos;
}

module.exports=getContatos;