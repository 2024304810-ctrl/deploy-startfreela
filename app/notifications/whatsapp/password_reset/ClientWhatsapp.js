const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const mensagem = require('./mensagem');
const gerarCodigo = require('../../../notifications/services/gerarCodigo');

const client = new Client({
            authStrategy: new LocalAuth(),
    
            puppeteer: {
            executablePath: "/usr/bin/google-chrome",
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox"
            ]
        }
        });

class ClientWhatsapp{

    clientWhatsapp(){
    
        client.on("qr", (qr) => {
            console.log("Escaneie essa merda ae");
            qrcode.generate(qr, {small: true})
        });
    
        client.on("ready", () => {
            console.log("ZapZap Conectado!");
        });
    
        client.on("authenticated", () => {
            console.log("ZapZap Autenticado!");
        });
    
        client.on("auth_failure", (msg) => {
            console.log("Falha na autenticação", msg);
        });
    
        client.on("disconnected", (reason) => {
            console.log("ZapZAp Desconectado:", reason);
        })

        client.initialize();
}

    async enviarZap(phone, code){
    console.log('entrando na função - enviando zap');
    

    const chatId = `${phone}@c.us`;

    const contato = await client.getNumberId(chatId);

    console.log('fazendo essa merda');
    
    try{
        await client.sendMessage(contato._serialized, mensagem(code));
        console.log("Enviado!");
        
    }catch(error){
        console.log(error);
        return {
            status: 500,
            success: false,
            message: "Algo deu errado!"
        }
    }


    }

    async testeId(phone){
        const contato = await client.getNumberId(phone);
        console.log("Numero:", phone);
        console.log("ID:", contato);
    }

}

module.exports=ClientWhatsapp;