
const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');

async function enviarEmail(usuario, code) {
    console.log('Preparando email de recuperação');

    try {
        const caminho = path.join(
            process.cwd(),
            'views',
            'message.handlebars'
        );

        if (!fs.existsSync(caminho)) {
            throw new Error(`Template não encontrado: ${caminho}`);
        }

        const arquivo = fs.readFileSync(caminho, 'utf8');

        const template = handlebars.compile(arquivo);

        const html = template({
            username: usuario.username,
            code: code
        });

        const emailDestino = usuario.contato.email;

        const resposta = await fetch(
            'https://api.brevo.com/v3/smtp/email',
            {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'api-key': process.env.BREVO_API_KEY,
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    sender: {
                        name: 'Equipe Start Freela',
                        email: process.env.BREVO_SENDER_EMAIL
                    },
                    to: [
                        {
                            email: emailDestino,
                            name: usuario.username
                        }
                    ],
                    subject: 'Recuperar Senha',
                    htmlContent: html
                })
            }
        );

        const resultadoTexto = await resposta.text();

        let resultado;

        try {
            resultado = JSON.parse(resultadoTexto);
        } catch {
            resultado = resultadoTexto;
        }

        if (!resposta.ok) {
            console.error(
                'Erro do Brevo:',
                resposta.status,
                resultado
            );

            throw new Error(
                typeof resultado === 'object'
                    ? resultado.message || 'Falha ao enviar email'
                    : 'Falha ao enviar email'
            );
        }

        console.log('Email enviado com sucesso!');

        return true;

    } catch (erro) {
        console.error('Erro ao enviar email:', erro.message);
        throw erro;
    }
}

module.exports = enviarEmail;
