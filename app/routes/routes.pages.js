const express = require('express');
const router = express.Router();
const path = require('path');
const autenticar = require('../auth/middlewares/autenticar');
const Controller = require('../render/testerender/controller/Controller');
const controller = new Controller();
const jwt = require('jsonwebtoken');
const DaoChat = require('../render/chat/messages/db/DaoChat');
const daoChat = new DaoChat();

//Rota para página inicial (antes do login)
router.get('/', temToken, (req, res) => {

    console.log('acessando index');
    res.sendFile(path.join(__dirname, '..',  '..', 'views/index/index.html'))
});

//Rota para página de login
router.get('/login', temToken, (req, res) => {
    console.log('achando a rota de login');
    res.sendFile(path.join(__dirname, '..', '..', 'views/login/login.html'))
});

router.get('/reset.password', temToken, (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'views', 'reset-password', 'reset-password.html'))
})

//Rota para página de cadastro
router.get('/register', temToken, (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'views', 'register', 'register.html'));
});

//Rota para perfil (após login)
router.get('/profile', autenticar, async(req, res) => {
    console.log('acessando tela de perfil');

    const usuario = await controller.renderizar(req);

    console.log(res.statusCode);

    if(usuario.role ===  "Freelancer"){
        res.render(path.join('profile_freelancers'), {
        layout: false,
        usuario: usuario
    })
    }else{
        res.render(path.join('profile_clients'), {
        layout: false,
        usuario: usuario
    });
    }
}); 


router.get('/edit.profile', autenticar, async(req, res) => {
    console.log('editando perfil...');

    const usuario = await controller.renderizar(req);

    res.render(path.join("editar-perfil"), {
        layout: false,
        usuario
    })
});

router.get('/additional.information', autenticar, async(req, res) => {
    console.log('acessando tela de freelancers');

    const usuario = await controller.renderizar(req);

    res.render(path.join('informacoes_adicionais'), {
        layout: false,
        usuario
    })    
});

router.get('/add.project', autenticar, async(req, res) => {
    console.log('acessando tela de adicionar projeto');
    
    const usuario = await controller.renderizar(req);

    res.render(path.join('tela-adicionar-portfolio'), {
        layout: false,
        usuario
    });    
})

router.get('/home', autenticar, async(req, res) => {
    console.log('acessando tela inicial');

    const usuario = await controller.renderizar(req);

    res.render(path.join('tela-inicial'), {
        layout: false,
        usuario: usuario
    });
})

router.get('/freelancers', autenticar, async(req, res) => {
    console.log('acessando tela de freelancers');

    const usuario = await controller.renderizar(req);

    res.render(path.join('tela-freelancers'), {
        layout: false,
        usuario: usuario
    });
})

router.get('/projects', autenticar, async(req, res) => {
    console.log('acessando tela de projetos');
    const usuario = await controller.renderizar(req);

    res.render(path.join('tela-projetos'), {
        layout: false,
        usuario: usuario,
        isCliente: String(usuario.role || '').toLowerCase() === 'cliente'
    });
});

router.get('/projects/proposta', autenticar, async (req, res) => {
    console.log('acessando tela de enviar proposta');

    const { p } = req.query;
    const idProjeto = p;

    const usuario = await controller.renderizar(req);

    const ProjetoPublicado = require('../render/projects/published-projects/db/ProjetoPublicado');
    const projetoPublicado = new ProjetoPublicado();
    const projeto = await projetoPublicado.daoBuscarProjetoPublicado(idProjeto);

    // Apenas freelancers podem acessar essa tela
    if (String(usuario.role || '').toLowerCase() !== 'freelancer') {
        return res.status(403).render('403', {
            layout: false, 
            usuario: usuario
        });
    }

    res.render(path.join('enviar-proposta'), {
        layout: false,
        usuario: usuario,
        projeto: projeto
    });
});

router.get('/proposal', autenticar, async(req, res) => {
    console.log('acessando tela de proposta');

    const usuario = await controller.renderizar(req);

    res.render(path.join('proposta'), {
        layout: false,
        usuario: usuario
    });
});

router.get('/support', autenticar,  async(req, res) => {
    console.log('acessando tela de suporte');
    const usuario = await controller.renderizar(req)

    console.log('usuario resgatado:', usuario);

    res.render('tela-suporte', {
        layout: false,
        usuario: usuario
    })
})

router.get('/testerender', autenticar, async(req, res) => {

    const Controller = require('../render/testerender/controller/Controller');

    const controller = new Controller();
    const usuario = await controller.renderizar(req);

    console.log('usuario resgatado:', usuario);

    res.render(path.join('testerender'), {
        layout: false,
        usuario: usuario
    });
});

router.get('/technical.profile', autenticar, async(req, res) => {
    const {i} = req.query;
    const idPerfil = i;

    console.log('laallala olha o usuário ae:', req.usuario);

    const daoPerfilTecnico = require('../render/profile/db/daoProfile');

    const {perfil, usuario} = await daoPerfilTecnico(idPerfil, req);

    console.log('perfil a ser analisado:', perfil);
    console.log('dados do usuário atual:', usuario);

    res.render(path.join('perfil-tecnico'), {
        layout: false,
        perfil,
        usuario
    });
});

router.get('/messages', autenticar, async(req, res) => {
    console.log('acessando tela de mensagens');
    const usuario = await controller.renderizar(req);

    res.render(path.join('tela-mensagens'), {
        layout: false,
        usuario: usuario
    });
});

router.get('/chat', autenticar, async(req, res) => {
    console.log('acessando chat de conversa');
    const {di} = req.query;
    const idDestinatario = di;

    const usuario = await controller.renderizar(req);
    const destinatario = await daoChat.getDestinatario(idDestinatario);

    console.log('destinatário resgatado do dao:', destinatario);

    res.render(path.join('tela-conversa'), {
        layout: false,
        usuario: usuario,
        destinatario: destinatario
    });
});

router.get('/settings', autenticar, async(req, res) => {
    console.log('acessando tela de mensagens');
    const usuario = await controller.renderizar(req);

    res.render(path.join('configuracoes'), {
        layout: false,
        usuario: usuario
    });
});

router.get('/notifications', autenticar, async(req, res) => {
    console.log('acessando tela de notificações');
    const usuario = await controller.renderizar(req);

    res.render(path.join('notificacoes'), {
        layout: false,
        usuario: usuario
    });
});

function temToken(req, res, next){
    const token = req.cookies.token;

    if(!token){
        return next();
    }

    try{

        jwt.verify(token, process.env.JWT_SECRET);

        return res.redirect('/profile');

    }catch(erro){
        console.log(erro);

        res.clearCookie('token', {
            httpOnly: true,
            path: '/'
        });

        next();
    }
}


module.exports = router;