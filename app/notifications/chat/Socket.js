const MensagemSchema = require('../../render/chat/messages/model/MensagemSchema');
const usuariosConectados = new Map();

class Socket{
    async conectar(wss){

        wss.on('connection', async(socket) => {
        console.log('Cliente websocket conectado nessa budega!');

        socket.send(JSON.stringify('Bem vindo'));

        socket.on('message', async(mensagem) => {
            const dados = JSON.parse(mensagem.toString());

            if(dados.tipo === "Identificacao"){
                console.log("id do usuario: ",dados.usuarioId);
                usuariosConectados.set(dados.usuarioId, socket);

                console.log('usuario conectado:', dados.usuarioId);
            }

            if(dados.tipo === "mensagem"){

                if(!dados.texto){
                    return;
                }

                const destinatario = usuariosConectados.get(dados.destinatario);

                console.log(dados.destinatario);

                console.log(dados);

                const novaMensagem = new MensagemSchema({
                    remetente: dados.remetente,
                    nomeRemetente: dados.nomeRemetente,
                    destinatario: dados.destinatario,
                    nomeDestinatario: dados.nomeDestinatario,
                    texto: dados.texto
                });

                console.log('salvando mensagem...');
                await novaMensagem.save();

                if(destinatario){
                    console.log('enviando...');

                    destinatario.send(JSON.stringify({
                        tipo: "mensagem",
                        remetente: dados.remetente,
                        texto: dados.texto
                    }));

                    console.log('enviado!');
                }
            }

        });

        socket.on('close', () => {
            console.log('cliente desconectado');
        })
    });
    }
}

module.exports=Socket;
