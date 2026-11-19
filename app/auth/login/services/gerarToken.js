const jwt = require('jsonwebtoken');

function gerarToken(usuario){
    const token = jwt.sign(
    {
        id: usuario.idUser,
        completeName: usuario.completeName,
        username: usuario.username,
        role: usuario.role,
        premium: usuario.premium,
        informacoesAdicionais: usuario.informacoesAdicionais
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "1h"
    }
);
    console.log(token);
    return token;
}

module.exports=gerarToken;