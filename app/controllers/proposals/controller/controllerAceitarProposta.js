
const mongoose = require('mongoose');

const Projeto = require('../../publish-project/model/ProjetoSchema');
const Proposta = require('../models/PropostaSchema');

async function aceitarProposta(idProjeto, idProposta, idCliente) {
    try {
        // Busca proposta pendente
        const proposta = await Proposta.findOne({
            _id: idProposta,
            idProjeto,
            status: 'Pendente'
        });

        if (!proposta) {
            return {
                status: 404,
                message: 'Proposta não encontrada ou já processada.'
            };
        }

        // Reserva o projeto para apenas uma contratação
        const projeto = await Projeto.findOneAndUpdate(
            {
                idProjeto,
                idCliente,
                $or: [
                    { status: 'Aberto' },
                    { status: { $exists: false } }
                ]
            },
            {
                $set: {
                    status: 'Em andamento',
                    idFreelancerContratado: proposta.idFreelancer,
                    freelancerUsernameContratado: proposta.freelancerUsername,
                    idPropostaAceita: String(proposta._id)
                }
            },
            { new: true }
        );

        if (!projeto) {
            return {
                status: 409,
                message: 'Projeto já está em andamento ou não pertence a você.'
            };
        }

        // Aceita a proposta escolhida
        await Proposta.updateOne(
            { _id: proposta._id },
            { $set: { status: 'Aceita' } }
        );

        // Recusa todas as outras propostas
        await Proposta.updateMany(
            {
                idProjeto,
                _id: { $ne: proposta._id },
                status: 'Pendente'
            },
            {
                $set: { status: 'Recusada' }
            }
        );

        return {
            status: 200,
            success: true,
            message: 'Proposta aceita! Freelancer contratado.'
        };

    } catch (erro) {
        console.error('Erro ao aceitar proposta:', erro);

        return {
            status: 500,
            message: 'Erro ao aceitar proposta.'
        };
    }
}

module.exports = aceitarProposta;
