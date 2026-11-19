function mensagemDeRecuperacao(codigo){
    const text = 
`*SUPORTE - START FREELA*

Olá! Recebemos uma solicitação para recuperar ou acessar sua conta. Para continuar com a verificação de forma segura, use o código abaixo:

Código de Segurança: *${codigo}*

Atenção: Nunca compartilhe este código com ninguém, nem mesmo alguém se passe por nossa equipe. Ele é de uso exclusivo e pessoal.`;

    return text;
}

module.exports=mensagemDeRecuperacao;