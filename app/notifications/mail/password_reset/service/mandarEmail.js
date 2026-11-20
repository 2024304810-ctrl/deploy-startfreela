
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,

    auth: {
        user: process.env.USER_MAIL,
        pass: process.env.MAIL_APP_PASS
    }
});

async function enviarEmail(usuario, code) {
    console.log('Enviando email');

    try {
        // Localizar o template de recuperação de senha
        const caminho = path.join(
            process.cwd(),
            'views',
            'message.handlebars'
        );

        if (!fs.existsSync(caminho)) {
            throw new Error(`Template de email não encontrado: ${caminho}`);
        }

        const arquivo = fs.readFileSync(caminho, 'utf8');

        const template = handlebars.compile(arquivo);

        const html = template({
            username: usuario.username,
            code: code
        });

        console.log('Contatando o transporter');

        const emailDestino = usuario.contato.email;

        // Localizar a imagem da logo
        const caminhoLogo = path.join(
            process.cwd(),
            'public',
            'assets',
            'img',
            'logo-startfreela.png'
        );

        const opcoesEmail = {
            from: process.env.USER_MAIL,
            to: emailDestino,
            subject: 'Recuperar Senha',
            html: html
        };

        // Anexar a logo somente se o arquivo existir
        if (fs.existsSync(caminhoLogo)) {
            opcoesEmail.attachments = [{
                filename: 'logo-startfreela.png',
                path: caminhoLogo,
                cid: 'logo'
            }];
        } else {
            console.log('Logo não encontrada:', caminhoLogo);
        }

        await transporter.sendMail(opcoesEmail);

        console.log('Email enviado com sucesso!');

        return true;

    } catch (erro) {
        console.log('Erro ao enviar email:', erro);
        throw erro;
    }
}

module.exports = enviarEmail;
