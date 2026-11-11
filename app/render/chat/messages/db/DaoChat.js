const Destinatario = require('../model/Destinatario');
const MensagemSchema = require('../model/MensagemSchema');

class DaoChat{
    async getDestinatario(idUserDestinatario){
        const destinatario = await Destinatario.findOne({
            "idUser": idUserDestinatario
        }).lean();

        return destinatario;
    }

    async getMensagens(idUser, idDestinatario){
        const mensagens = await MensagemSchema.find({
            $or: [
                {
                    remetente: idUser,
                    destinatario: idDestinatario
                },
                {
                    remetente: idDestinatario,
                    destinatario: idUser
                }
            ]
        }).sort({data: 1});

        return mensagens;
    }
}

module.exports=DaoChat;

