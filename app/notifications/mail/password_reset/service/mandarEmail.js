const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');

console.log(process.env.MAIL_APP_PASS);
console.log(process.env.USER_MAIL);

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,

    auth: {
        user: process.env.USER_MAIL,
        pass: process.env.MAIL_APP_PASS
    }
});

async function enviarEmail(usuario, code){
    console.log('Enviando email');
    const caminho = path.join(__dirname, '..', '..', '..', '..', '..', 'views', 'message.hbs');

    const arquivo = fs.readFileSync(caminho, "utf8");

    const template = handlebars.compile(arquivo);

    const html = template({
        username: usuario.username,
        code: code
    })

    try{
        console.log('contatando o transporter');

        const emailDestino = usuario.contato.email;

        await transporter.sendMail({
            from: process.env.USER_MAIL,
            to: emailDestino,
            subject: "Recuperar Senha",
            html: html,
            attachments: {
                filename: "logo-startfreela.png",
                path: "public/assets/img/logo-startfreela.png",    
                cid: "logo"
            }
        });

        console.log('email enviado disk');

        return true;

    }catch(erro){

        console.log(erro);

        return false;

    }
}

module.exports = enviarEmail;