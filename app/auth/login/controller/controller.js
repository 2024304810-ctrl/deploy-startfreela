
const dao = require('../dao/dao');
const emailValido = require('../../../utils/email/emailValido');
const bcrypt = require('bcrypt');
const gerarToken = require('../services/gerarToken');

async function controllerLogin(email, senha, res) {
    if (!email || !senha || !emailValido(email)) {
        return {
            status: 400,
            success: false,
            message: 'Email ou senha incorretos!'
        };
    }

    try {
        console.log('Consultando usuário...');

        const usuarioRetornado = await dao(email);

        // Verifica se o usuário existe
        if (!usuarioRetornado || !usuarioRetornado.contato) {
            return {
                status: 401,
                success: false,
                message: 'Email ou senha incorretos!'
            };
        }

        // Confere email e senha
        const emailCorreto =
            usuarioRetornado.contato.email === email;

        const senhaCorreta = await bcrypt.compare(
            senha,
            usuarioRetornado.password
        );

        if (!emailCorreto || !senhaCorreta) {
            return {
                status: 401,
                success: false,
                message: 'Email ou senha incorretos!'
            };
        }

        console.log('Login realizado com sucesso!');

        // Gera o token
        const token = gerarToken(usuarioRetornado);

        // Salva o token no cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });

        // Verifica se as informações adicionais foram preenchidas
        const informacoesAdicionaisConcluidas =
            usuarioRetornado.informacoesAdicionais === true;

            console.log('STATUS DAS INFORMAÇÕES ADICIONAIS:',
    usuarioRetornado.informacoesAdicionais
);

        return {
            status: 200,
            success: true,
            token,
            informacoesAdicionaisConcluidas
        };

    } catch (error) {
        console.error('Erro no controller de login:', error);
        throw error;
    }
}

module.exports = controllerLogin;
