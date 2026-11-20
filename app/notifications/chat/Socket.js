
const MensagemSchema = require('../../render/chat/messages/model/MensagemSchema');

const usuariosConectados = new Map();

class Socket {
    async conectar(wss) {

        wss.on('connection', (socket) => {
            console.log('Cliente WebSocket conectado!');

            socket.send(JSON.stringify({
                tipo: 'conectado'
            }));

            socket.on('message', async (mensagem) => {
                try {
                    const dados = JSON.parse(mensagem.toString());

                    // IDENTIFICAR USUÁRIO
                    if (dados.tipo === 'Identificacao') {
                        if (!dados.usuarioId) return;

                        socket.usuarioId = dados.usuarioId;
                        usuariosConectados.set(dados.usuarioId, socket);

                        console.log('Usuário conectado:', dados.usuarioId);
                        return;
                    }

                    // Impedir ações antes da identificação
                    const idUsuario = socket.usuarioId;

                    if (!idUsuario) return;

                    // ENVIAR MENSAGEM
                    if (dados.tipo === 'mensagem') {

                        const texto = dados.texto?.trim();

                        if (!texto || !dados.destinatario) return;

                        const novaMensagem = new MensagemSchema({
                            remetente: idUsuario,
                            nomeRemetente: dados.nomeRemetente,
                            destinatario: dados.destinatario,
                            nomeDestinatario: dados.nomeDestinatario,
                            texto
                        });

                        await novaMensagem.save();

                        const mensagemEnviada = {
                            tipo: 'mensagem',
                            _id: novaMensagem._id.toString(),
                            remetente: novaMensagem.remetente,
                            nomeRemetente: novaMensagem.nomeRemetente,
                            destinatario: novaMensagem.destinatario,
                            nomeDestinatario: novaMensagem.nomeDestinatario,
                            texto: novaMensagem.texto,
                            data: novaMensagem.data
                        };

                        // Enviar para o remetente
                        socket.send(JSON.stringify(mensagemEnviada));

                        // Enviar para o destinatário
                        const destinatario = usuariosConectados.get(
                            dados.destinatario
                        );

                        if (destinatario && destinatario !== socket) {
                            destinatario.send(JSON.stringify(mensagemEnviada));
                        }

                        return;
                    }

                    // EDITAR MENSAGEM
                    if (dados.tipo === 'editarMensagem') {

                        const texto = dados.texto?.trim();

                        if (!texto || !dados.idMensagem) return;

                        const mensagemAtualizada =
                            await MensagemSchema.findOneAndUpdate(
                                {
                                    _id: dados.idMensagem,
                                    remetente: idUsuario,
                                    destinatario: dados.destinatario
                                },
                                {
                                    $set: { texto }
                                },
                                {
                                    new: true
                                }
                            );

                        if (!mensagemAtualizada) {
                            socket.send(JSON.stringify({
                                tipo: 'erro',
                                mensagem: 'Não foi possível editar esta mensagem.'
                            }));
                            return;
                        }

                        const resposta = {
                            tipo: 'mensagemEditada',
                            _id: mensagemAtualizada._id.toString(),
                            remetente: mensagemAtualizada.remetente,
                            destinatario: mensagemAtualizada.destinatario,
                            texto: mensagemAtualizada.texto
                        };

                        socket.send(JSON.stringify(resposta));

                        const destinatario = usuariosConectados.get(
                            mensagemAtualizada.destinatario
                        );

                        if (destinatario && destinatario !== socket) {
                            destinatario.send(JSON.stringify(resposta));
                        }

                        return;
                    }

                    // EXCLUIR MENSAGEM
                    if (dados.tipo === 'excluirMensagem') {

                        if (!dados.idMensagem) return;

                        const mensagemExcluida =
                            await MensagemSchema.findOneAndDelete({
                                _id: dados.idMensagem,
                                remetente: idUsuario,
                                destinatario: dados.destinatario
                            });

                        if (!mensagemExcluida) {
                            socket.send(JSON.stringify({
                                tipo: 'erro',
                                mensagem: 'Não foi possível excluir esta mensagem.'
                            }));
                            return;
                        }

                        const resposta = {
                            tipo: 'mensagemExcluida',
                            _id: mensagemExcluida._id.toString(),
                            remetente: mensagemExcluida.remetente,
                            destinatario: mensagemExcluida.destinatario
                        };

                        socket.send(JSON.stringify(resposta));

                        const destinatario = usuariosConectados.get(
                            mensagemExcluida.destinatario
                        );

                        if (destinatario && destinatario !== socket) {
                            destinatario.send(JSON.stringify(resposta));
                        }

                        return;
                    }

                } catch (erro) {
                    console.error('Erro no WebSocket:', erro);

                    if (socket.readyState === 1) {
                        socket.send(JSON.stringify({
                            tipo: 'erro',
                            mensagem: 'Ocorreu um erro ao processar a mensagem.'
                        }));
                    }
                }
            });

            socket.on('close', () => {
                if (
                    socket.usuarioId &&
                    usuariosConectados.get(socket.usuarioId) === socket
                ) {
                    usuariosConectados.delete(socket.usuarioId);
                }

                console.log('Cliente desconectado');
            });
        });
    }
}

module.exports = Socket;
