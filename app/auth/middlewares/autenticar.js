const jwt = require('jsonwebtoken');
const logout = require('../logout/logout');

async function autenticar(req, res, next){
    const token = req.cookies?.token;

    if(!token && req.path !== '/login'){
        return res.redirect('/login');
    }

    try{
        const usuario = jwt.verify(token, process.env.JWT_SECRET);

        req.usuario = usuario;

        console.log(req.usuario);

        console.log('tem token');

        next();

    }catch(erro){
        console.log('token inválido ou expirado');

        //await logout(req.usuario.id);
        
        res.clearCookie('token', {
            httpOnly: true,
            path: '/'
        })

        return res.redirect('/login');
    }
}

module.exports=autenticar;