const atualizarSenha = require('../db/atualizarSenha');

async function controller(email, novaSenha, confirmarNovaSenha){
    if(!novaSenha || !confirmarNovaSenha){
        return {
            status: 400,
            erro: "Os campos estão vazios!"
        }
    }

    if(novaSenha !== confirmarNovaSenha){
        return {
            status: 400,
            erro: "As senhas não coincidem!"
        }
    }

    try{

        await atualizarSenha(novaSenha, email);

        return {
            success: true,
            message: "Deu tudo certo atualizando a senha!"
        }

    }catch(erro){

        console.log(erro);

        res.status(500).json({
            message: "Algo deu errado"
        });

    }
}

module.exports = controller;