const express = require('express');
const router = express.Router();
const autenticar = require('../auth/middlewares/autenticar');
const Controller = require('../render/testerender/controller/Controller');
const controller = new Controller();
const DaoChat = require('../render/chat/messages/db/DaoChat');
const daoChat = new DaoChat();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage
});

router.use(express.json());

//API para processamento de login do usuário
router.post('/api/login', async (req, res) => {
    //Dados recebidos
    const { email, senha } = req.body;

    try {
        console.log("Email:", email);

        //Controller que inicia a função
        const controller = require('../auth/login/controller/controller');
        const resposta = await controller(email, senha, res);

        console.log("resposta:", resposta);

        //Retorno ao Front
        res.json(resposta);

    } catch (error) {
        console.log("ERRO:", error);
        res.status(500).json({
            error: "Algum erro ocorreu no servidor!"
        });
    }
});

//API para processamento de cadastro do usuário
router.post("/api/register", async (req, res) => {
    const Usuario = require('../auth/register/model/Usuario');
    const controllerRegister = require('../auth/register/controller/controller');
    const setIdUser = require('../auth/services/setIdUser');

    const { completeName, username, email, dateOfBirth, phone, password, passwordConf, role } = req.body;

    //Hash com caracteres aleatórios para formar um id para o usuário
    const idUser = setIdUser();

    const usuario = new Usuario(idUser, completeName, username, email, dateOfBirth, phone, 123, password, passwordConf, role, "false", "false", "today", "false");

    for (let atributo in usuario) {
        console.log(`${atributo} --> ${usuario[atributo]}`);
    }

    //Controller
    const resposta = await controllerRegister(usuario);

    res.json(resposta);
});

router.post('/api/sendMail', async (req, res) => {
    const { email } = req.body;

    console.log('Email:', email);

    const controllerEnviarEmailDeRecuperacao = require('../notifications/mail/password_reset/controller/controller');

    const resposta = await controllerEnviarEmailDeRecuperacao(email);

    res.json(resposta);
});

router.post('/api/sendMessageWhatsapp', async (req, res) => {
    const controllerEnviarWhatsappDeRecuperacao = require('../notifications/whatsapp/password_reset/controller/controller');

    console.log('chegando na rota do zap');

    const { phoneNumber } = req.body;

    console.log(phoneNumber);

    try {
        const resposta = await controllerEnviarWhatsappDeRecuperacao(phoneNumber);

        res.json(resposta);
    } catch (erro) {
        console.log(erro);
        res.json({
            status: 500,
            message: "Algo deu errado no servidor!"
        })
    }
});

router.post('/api/verifyResetCode', async (req, res) => {
    const { code, email } = req.body;

    const controllerVerificarCodigoDeRedefinicao = require('../auth/reset_code/controller/controller');

    const resposta = await controllerVerificarCodigoDeRedefinicao(code, email);

    res.json(resposta);
});

router.put('/api/updatePassword', async (req, res) => {
    const { newPassword, confirmNewPassword, email } = req.body;

    const controller = require('../notifications/put_password/controller/controller');

    const resposta = await controller(email, newPassword, confirmNewPassword);

    res.json(resposta);
});

router.post('/api/add.project', upload.single('imagemCapa'), async (req, res) => {
    console.log('adicionando projeto');

    const imagemCapa = req.file;
    const { idUser, titulo, categoria, dataConclusao, descricao } = req.body;

    console.log('imagem:', req.file);

    console.log('dados:', req.body);

    let habilidades = (req.body.habilidades).split(',');

    console.log('habilidades:', habilidades);

    const setIdProject = require('../auth/services/setIdProject');

    const Projeto = require('../controllers/add-project/models/Projeto');
    const projeto = new Projeto(idUser, setIdProject(), imagemCapa, titulo, categoria, dataConclusao, descricao, habilidades);

    console.log('objeto:', projeto);

    const controllerAddProjeto = require('../controllers/add-project/controller/controllerAddProjeto');

    const resposta = await controllerAddProjeto(projeto, req.file.buffer);

    res.json(resposta);
});

router.get('/api/buscarFreelancers', async (req, res) => {
    console.log('buscando os usuários...');

    const renderizarFreelancers = require('../render/freelancers/db/dao');

    const retorno = await renderizarFreelancers();

    console.log('resposta retornada:', retorno);

    res.json(retorno);
});

router.get('/api/buscarProjetos', autenticar, async (req, res) => {
    console.log('buscando projetos...');

    const daoBuscarProjetos = require('../render/projects/profile-view/db/daoBuscarProjetos');

    const resposta = await daoBuscarProjetos(req.usuario.id);

    res.json(resposta);
});

router.post('/api/publish_project', autenticar, async (req, res) => {
    try {
        if (String(req.usuario.role).toLowerCase() !== 'cliente') {
            return res.status(403).json({
                success: false,
                message: 'Apenas clientes podem publicar projetos.'
            });
        }

        const setIdProject = require('../auth/services/setIdProject');
        const Projeto = require('../controllers/publish-project/model/Projeto');
        const controllerPublishProject = require('../controllers/publish-project/controller/controller');

        const {
            titulo,
            categoria,
            prazoDesejado,
            orcamentoMinimo,
            orcamentoMaximo,
            descricao,
            habilidades
        } = req.body;

        if (
            !titulo?.trim() ||
            !categoria ||
            !prazoDesejado ||
            !descricao?.trim() ||
            !Array.isArray(habilidades) ||
            Number(orcamentoMinimo) <= 0 ||
            Number(orcamentoMaximo) < Number(orcamentoMinimo)
        ) {
            return res.status(400).json({
                success: false,
                message: 'Verifique os dados do projeto.'
            });
        }

        const projeto = new Projeto(
            req.usuario.id,
            req.usuario.username,
            setIdProject(),
            titulo.trim(),
            categoria,
            new Date().toISOString().slice(0, 10),
            prazoDesejado,
            String(orcamentoMinimo),
            String(orcamentoMaximo),
            descricao.trim(),
            habilidades
        );

        const resposta = await controllerPublishProject(projeto);

        return res.status(resposta.status).json(resposta);

    } catch (erro) {
        console.error('Erro ao publicar projeto:', erro);

        return res.status(500).json({
            success: false,
            message: 'Erro interno ao publicar projeto.'
        });
    }
});

router.get('/api/buscarProjetosPublicados', async (req, res) => {
    console.log('buscando projetos publicados...');

    const ProjetoPublicado = require('../render/projects/published-projects/db/ProjetoPublicado');
    const projetoPublicado = new ProjetoPublicado();
    const resposta = await projetoPublicado.daoBuscarProjetosPublicados();

    res.json(resposta);
})

router.get('/api/meusProjetos', autenticar, async (req, res) => {
    try {
        const ProjetoPublicado = require(
            '../render/projects/published-projects/db/ProjetoPublicado'
        );

        const Avaliacao = require(
            '../controllers/evaluations/models/AvaliacaoSchema'
        );

        const projetoPublicado = new ProjetoPublicado();

        const idCliente = String(req.usuario.id);

        const projetos = await projetoPublicado
            .daoBuscarProjetosDoCliente(idCliente);

        const projetosComAvaliacao = await Promise.all(
            projetos.map(async (projeto) => {

                const avaliacao = await Avaliacao.findOne({
                    idProjeto: projeto.idProjeto,
                    tipoAvaliador: 'cliente'
                }).select('_id idProjeto tipoAvaliador avaliadorUsername avaliadoUsername nota dataAvaliacao').lean();
                console.log('VERIFICAÇÃO DA AVALIAÇÃO:', {
                    projeto: projeto.titulo,
                    idProjeto: projeto.idProjeto,
                    idClienteLogado: idCliente,
                    avaliacaoEncontrada: avaliacao
                });

                return {
                    ...projeto,
                    avaliado: !!avaliacao
                };
            })
        );

        console.log('Projetos enviados ao cliente:');

        console.table(projetosComAvaliacao.map(projeto => ({
            titulo: projeto.titulo,
            idProjeto: projeto.idProjeto,
            status: projeto.status,
            idCliente: projeto.idCliente,
            avaliado: projeto.avaliado
        })));

        return res.json(projetosComAvaliacao);

    } catch (erro) {
        console.error('Erro ao buscar meus projetos:', erro);

        return res.status(500).json({
            message: 'Erro ao buscar projetos.'
        });
    }
});
// Editar projeto
router.put('/api/projetos/:idProjeto', autenticar, async (req, res) => {
    try {

        if (String(req.usuario.role).toLowerCase() !== 'cliente') {
            return res.status(403).json({
                message: 'Apenas clientes podem editar projetos.'
            });
        }

        const Projeto = require(
            '../controllers/publish-project/model/ProjetoSchema'
        );

        const { idProjeto } = req.params;

        const projeto = await Projeto.findOne({
            idProjeto,
            idCliente: req.usuario.id
        });

        if (!projeto) {
            return res.status(404).json({
                message: 'Projeto não encontrado.'
            });
        }

        // Só pode editar enquanto ainda está aberto
        if (projeto.status !== 'Aberto') {
            return res.status(400).json({
                message: 'Não é possível editar um projeto que já está em andamento.'
            });
        }

        const {
            titulo,
            categoria,
            prazoDesejado,
            orcamentoMinimo,
            orcamentoMaximo,
            descricao,
            habilidades
        } = req.body;

        if (
            !titulo?.trim() ||
            !categoria ||
            !prazoDesejado ||
            !descricao?.trim() ||
            !Array.isArray(habilidades) ||
            habilidades.length === 0 ||
            Number(orcamentoMinimo) <= 0 ||
            Number(orcamentoMaximo) < Number(orcamentoMinimo)
        ) {
            return res.status(400).json({
                message: 'Verifique os dados do projeto.'
            });
        }

        projeto.titulo = titulo.trim();
        projeto.categoria = categoria;
        projeto.prazoDesejado = prazoDesejado;
        projeto.orcamentoMinimo = String(orcamentoMinimo);
        projeto.orcamentoMaximo = String(orcamentoMaximo);
        projeto.descricao = descricao.trim();
        projeto.habilidades = habilidades;

        await projeto.save();

        return res.json({
            success: true,
            message: 'Projeto atualizado com sucesso.',
            projeto
        });

    } catch (erro) {

        console.error('Erro ao editar projeto:', erro);

        return res.status(500).json({
            message: 'Erro interno ao editar projeto.'
        });
    }
});


// Excluir projeto
router.delete('/api/projetos/:idProjeto', autenticar, async (req, res) => {
    try {

        if (String(req.usuario.role).toLowerCase() !== 'cliente') {
            return res.status(403).json({
                message: 'Apenas clientes podem excluir projetos.'
            });
        }

        const Projeto = require(
            '../controllers/publish-project/model/ProjetoSchema'
        );

        const { idProjeto } = req.params;

        const projeto = await Projeto.findOne({
            idProjeto,
            idCliente: req.usuario.id
        });

        if (!projeto) {
            return res.status(404).json({
                message: 'Projeto não encontrado.'
            });
        }

        // Segurança: só pode excluir projeto aberto
        if (projeto.status !== 'Aberto') {
            return res.status(400).json({
                message: 'Só é possível excluir projetos que ainda estão abertos.'
            });
        }

        await Projeto.deleteOne({
            idProjeto,
            idCliente: req.usuario.id
        });

        return res.json({
            success: true,
            message: 'Projeto excluído com sucesso.'
        });

    } catch (erro) {

        console.error('Erro ao excluir projeto:', erro);

        return res.status(500).json({
            message: 'Erro interno ao excluir projeto.'
        });
    }
});


//Api para buscar as conversas que o usuário tem (contato ou grupo)
router.get('/api/buscarContatos', autenticar, async (req, res) => {
    const idUser = req.usuario.id;

    const getContatos = require('../render/chat/contacts/db/daoContatos');

    const resposta = await getContatos(idUser);

    res.json(resposta);

});

router.get('/api/getDestinatario', autenticar, async (req, res) => {
    const { d } = req.query;
    const idDestinatario = d;

    const destinatario = await daoChat.getDestinatario(idDestinatario);

    res.json(destinatario);
});

router.get('/api/buscarMensagens', autenticar, async (req, res) => {
    const { d } = req.query;
    const idDestinatario = d;

    console.log(req.usuario);

    const resposta = await daoChat.getMensagens(req.usuario.id, idDestinatario);

    console.log(resposta);

    res.json(resposta);
});

router.post('/api/informacoesAdicionais', async (req, res) => {
    console.log('json chegado:', req.body);

    const controllerAdditionalInformation = require('../controllers/additional-information/controller/controllerAdditionalInformation');
    const resposta = await controllerAdditionalInformation(req.body);
    res.json(resposta);
});

router.post('/logout', autenticar, async (req, res) => {
    console.log('chegando no logout');

    const logout = require('../auth/logout/logout');
    await logout(req.usuario.id);

    res.clearCookie("token");
    console.log('saindo do logout');

    res.json({
        mensagem: "Logout feito com sucesso"
    })
});

router.post('/api/editarPerfil', (req, res) => {
    console.log(req);
});


// API para envio de propostas
router.post('/api/enviarProposta', autenticar, async (req, res) => {
    try {
        // Apenas freelancers podem enviar propostas
        if (String(req.usuario.role).toLowerCase() !== 'freelancer') {
            return res.status(403).json({
                message: 'Apenas freelancers podem enviar propostas.'
            });
        }

        const controllerProposta = require(
            '../controllers/proposals/controller/controllerProposta'
        );

        const { idProjeto, valor, prazoDias, mensagem } = req.body;

        const resposta = await controllerProposta({
            idProjeto,
            idFreelancer: req.usuario.id,
            freelancerUsername: req.usuario.username,
            valor,
            prazoDias,
            mensagem
        });

        return res.status(resposta.status).json(resposta);

    } catch (erro) {
        console.error('Erro na rota de propostas:', erro);

        return res.status(500).json({
            message: 'Erro interno do servidor.'
        });
    }
});

// Buscar propostas recebidas em um projeto
router.get('/api/projetos/:idProjeto/propostas', autenticar, async (req, res) => {
    try {
        if (String(req.usuario.role).toLowerCase() !== 'cliente') {
            return res.status(403).json({
                message: 'Apenas clientes podem visualizar propostas.'
            });
        }

        const Projeto = require('../controllers/publish-project/model/ProjetoSchema');
        const daoProposta = require('../controllers/proposals/dao/daoProposta');

        const { idProjeto } = req.params;

        // Verifica se o projeto pertence ao cliente logado
        const projeto = await Projeto.findOne({
            idProjeto,
            idCliente: req.usuario.id
        }).lean();

        if (!projeto) {
            return res.status(404).json({
                message: 'Projeto não encontrado.'
            });
        }

        const propostas = await daoProposta.buscarPropostasDoProjeto(idProjeto);

        return res.json(propostas);

    } catch (erro) {
        console.error('Erro ao buscar propostas:', erro);

        return res.status(500).json({
            message: 'Erro ao buscar propostas.'
        });
    }
});


router.post(
    '/api/projetos/:idProjeto/avaliar',
    autenticar,
    async (req, res) => {
        try {
            const Projeto = require(
                '../controllers/publish-project/model/ProjetoSchema'
            );

            const Avaliacao = require(
                '../controllers/evaluations/models/AvaliacaoSchema'
            );

            const { idProjeto } = req.params;
            const { nota, comentario } = req.body;

            const role = String(req.usuario.role).toLowerCase();

            if (!['cliente', 'freelancer'].includes(role)) {
                return res.status(403).json({
                    message: 'Cargo não autorizado.'
                });
            }

            if (
                !Number.isInteger(Number(nota)) ||
                Number(nota) < 1 ||
                Number(nota) > 5
            ) {
                return res.status(400).json({
                    message: 'A nota deve ser entre 1 e 5.'
                });
            }

            const projeto = await Projeto.findOne({ idProjeto });

            if (!projeto) {
                return res.status(404).json({
                    message: 'Projeto não encontrado.'
                });
            }

            if (projeto.status !== 'Concluído') {
                return res.status(400).json({
                    message: 'O projeto ainda não foi concluído.'
                });
            }

            if (!projeto.idFreelancerContratado) {
                return res.status(400).json({
                    message: 'Não existe freelancer contratado.'
                });
            }

            const tipoAvaliador = role;

            const jaAvaliou = await Avaliacao.findOne({
                idProjeto,
                tipoAvaliador
            });

            if (jaAvaliou) {
                return res.status(400).json({
                    message: 'Você já avaliou este projeto.'
                });
            }

            let avaliadorUsername;
            let avaliadoUsername;

            if (role === 'cliente') {
                if (String(projeto.idCliente) !== String(req.usuario.id)) {
                    return res.status(403).json({
                        message: 'Este projeto não pertence a você.'
                    });
                }

                avaliadorUsername = projeto.clienteUsername || 'Cliente';
                avaliadoUsername =
                    projeto.freelancerUsernameContratado || 'Freelancer';

            } else {
                if (
                    String(projeto.idFreelancerContratado) !==
                    String(req.usuario.id)
                ) {
                    return res.status(403).json({
                        message: 'Você não é o freelancer contratado.'
                    });
                }

                avaliadorUsername =
                    req.usuario.username || 'Freelancer';

                avaliadoUsername =
                    projeto.clienteUsername || 'Cliente';
            }

            const avaliacao = await Avaliacao.create({
                idProjeto,
                idCliente: projeto.idCliente,
                idFreelancer: projeto.idFreelancerContratado,
                tipoAvaliador,
                avaliadorUsername,
                avaliadoUsername,
                nota: Number(nota),
                comentario: String(comentario || '').trim()
            });

            return res.status(201).json({
                success: true,
                message: 'Avaliação enviada com sucesso!',
                avaliacao
            });

        } catch (erro) {
            console.error('Erro ao avaliar projeto:', erro);

            if (erro.code === 11000) {
                return res.status(400).json({
                    message: 'Você já avaliou este projeto.'
                });
            }

            return res.status(500).json({
                message: 'Erro interno ao registrar avaliação.'
            });
        }
    }
);


router.put('/api/projetos/:idProjeto/progresso', autenticar, async (req, res) => {
    try {
        if (String(req.usuario.role).toLowerCase() !== 'freelancer') {
            return res.status(403).json({
                message: 'Apenas freelancers podem atualizar o progresso.'
            });
        }

        const atualizarProgresso = require(
            '../controllers/proposals/controller/controllerProgresso'
        );

        const { percentual, descricao } = req.body;

        const resultado = await atualizarProgresso(
            req.params.idProjeto,
            req.usuario.id,
            percentual,
            descricao
        );

        return res.status(resultado.status).json(resultado);

    } catch (erro) {
        console.error(erro);

        return res.status(500).json({
            message: 'Erro interno do servidor.'
        });
    }
});

// Freelancer envia a entrega final
router.post('/api/projetos/:idProjeto/entrega', autenticar, async (req, res) => {
    try {
        if (String(req.usuario.role).toLowerCase() !== 'freelancer') {
            return res.status(403).json({
                message: 'Apenas freelancers podem enviar entregas.'
            });
        }

        const enviarEntrega = require(
            '../controllers/submit-delivery/controllerEnviarEntrega'
        );

        const { descricao, link } = req.body;

        const resultado = await enviarEntrega(
            req.params.idProjeto,
            req.usuario.id,
            descricao,
            link
        );

        return res.status(resultado.status).json(resultado);

    } catch (erro) {
        console.error('Erro na rota de entrega:', erro);

        return res.status(500).json({
            message: 'Erro interno do servidor.'
        });
    }
});


// Cliente aprova a entrega final
router.post('/api/projetos/:idProjeto/aprovar-entrega', autenticar, async (req, res) => {
    try {
        if (String(req.usuario.role).toLowerCase() !== 'cliente') {
            return res.status(403).json({
                message: 'Apenas clientes podem aprovar entregas.'
            });
        }

        const aprovarEntrega = require(
            '../controllers/approve-delivery/controllerAprovarEntrega'
        );

        const resultado = await aprovarEntrega(
            req.params.idProjeto,
            req.usuario.id
        );

        return res.status(resultado.status).json(resultado);

    } catch (erro) {
        console.error('Erro na rota de aprovação:', erro);

        return res.status(500).json({
            message: 'Erro interno do servidor.'
        });
    }
});

router.post(
    '/api/projetos/:idProjeto/propostas/:idProposta/aceitar',
    autenticar,
    async (req, res) => {
        try {
            const Projeto = require(
                '../controllers/publish-project/model/ProjetoSchema'
            );

            const Proposta = require(
                '../controllers/proposals/models/PropostaSchema'
            );

            const { idProjeto, idProposta } = req.params;

            // 1. Somente clientes podem aceitar propostas
            if (String(req.usuario.role).toLowerCase() !== 'cliente') {
                return res.status(403).json({
                    message: 'Apenas clientes podem aceitar propostas.'
                });
            }

            // 2. Buscar o projeto
            const projeto = await Projeto.findOne({
                idProjeto,
                idCliente: String(req.usuario.id)
            });

            if (!projeto) {
                return res.status(404).json({
                    message: 'Projeto não encontrado ou não pertence a você.'
                });
            }

            // 3. Verificar se o projeto ainda está disponível
            if (
                projeto.status !== 'Aberto' ||
                projeto.idFreelancerContratado
            ) {
                return res.status(400).json({
                    message: 'Este projeto não está mais disponível.'
                });
            }

            // 4. Buscar a proposta
            const proposta = await Proposta.findOne({
                _id: idProposta,
                idProjeto,
                status: 'Pendente'
            });

            if (!proposta) {
                return res.status(404).json({
                    message: 'Proposta não encontrada ou não está pendente.'
                });
            }

            // 5. Atualizar o projeto
            const projetoAtualizado = await Projeto.findOneAndUpdate(
                {
                    idProjeto,
                    idCliente: String(req.usuario.id),
                    status: 'Aberto',
                    $or: [
                        { idFreelancerContratado: null },
                        { idFreelancerContratado: '' },
                        { idFreelancerContratado: { $exists: false } }
                    ]
                },
                {
                    $set: {
                        idFreelancerContratado: proposta.idFreelancer,
                        freelancerUsernameContratado: proposta.freelancerUsername,
                        idPropostaAceita: String(proposta._id),
                        status: 'Em andamento'
                    }
                },
                { new: true }
            );

            if (!projetoAtualizado) {
                return res.status(400).json({
                    message: 'Não foi possível contratar este freelancer. O projeto pode já ter sido aceito.'
                });
            }

            // 6. Aceitar a proposta
            const propostaAtualizada = await Proposta.findOneAndUpdate(
                {
                    _id: proposta._id,
                    status: 'Pendente'
                },
                {
                    $set: {
                        status: 'Aceita'
                    }
                },
                { new: true }
            );

            // Se não conseguir atualizar a proposta, desfazer a contratação
            if (!propostaAtualizada) {
                await Projeto.updateOne(
                    {
                        idProjeto,
                        idPropostaAceita: String(proposta._id)
                    },
                    {
                        $set: {
                            idFreelancerContratado: null,
                            freelancerUsernameContratado: null,
                            idPropostaAceita: null,
                            status: 'Aberto'
                        }
                    }
                );

                return res.status(400).json({
                    message: 'Não foi possível aceitar a proposta.'
                });
            }

            // 7. Recusar as demais propostas do projeto
            await Proposta.updateMany(
                {
                    idProjeto,
                    _id: { $ne: proposta._id },
                    status: 'Pendente'
                },
                {
                    $set: {
                        status: 'Recusada'
                    }
                }
            );

            return res.status(200).json({
                success: true,
                message: 'Proposta aceita com sucesso!',
                projeto: projetoAtualizado,
                proposta: propostaAtualizada
            });

        } catch (erro) {
            console.error('Erro ao aceitar proposta:', erro);

            return res.status(500).json({
                message: 'Erro interno ao aceitar proposta.'
            });
        }
    }
);

// Listagem completa da área do freelancer
router.get('/api/freelancer/projetos', autenticar, async (req, res) => {
    try {
        if (String(req.usuario.role).toLowerCase() !== 'freelancer') {
            return res.status(403).json({
                message: 'Acesso permitido apenas para freelancers.'
            });
        }

        const Projeto = require(
            '../controllers/publish-project/model/ProjetoSchema'
        );

        const Proposta = require(
            '../controllers/proposals/models/PropostaSchema'
        );

        const idFreelancer = req.usuario.id;

        // 1. Projetos disponíveis
        const disponiveis = await Projeto.find({
            idCliente: { $ne: idFreelancer },

            $and: [
                {
                    $or: [
                        { status: 'Aberto' },
                        { status: { $exists: false } }
                    ]
                },
                {
                    idFreelancerContratado: { $in: [null, ''] }
                }
            ]
        }).sort({ _id: -1 }).lean();

        // 2. Propostas enviadas pelo freelancer
        const propostas = await Proposta.find({
            idFreelancer
        }).sort({ dataEnvio: -1 }).lean();

        const idsProjetos = [
            ...new Set(propostas.map(p => p.idProjeto))
        ];

        const projetosDasPropostas = await Projeto.find({
            idProjeto: { $in: idsProjetos }
        }).lean();

        const mapaProjetos = new Map(
            projetosDasPropostas.map(p => [p.idProjeto, p])
        );

        const candidaturas = propostas
            .filter(proposta => {
                const projeto = mapaProjetos.get(proposta.idProjeto);

                return projeto &&
                    (!projeto.status || projeto.status === 'Aberto') &&
                    proposta.status !== 'Aceita';
            })
            .map(proposta => ({
                ...mapaProjetos.get(proposta.idProjeto),
                proposta
            }));

        // 3. Projetos contratados
        const projetosContratados = await Projeto.find({
            idFreelancerContratado: idFreelancer,
            status: {
                $in: [
                    'Em andamento',
                    'Aguardando aprovação',
                    'Concluído'
                ]
            }
        }).sort({ _id: -1 }).lean();

        const andamento = projetosContratados.filter(
            p => p.status === 'Em andamento' ||
                p.status === 'Aguardando aprovação'
        );

        const Avaliacao = require(
            '../controllers/evaluations/models/AvaliacaoSchema'
        );

        const concluidosBase = projetosContratados.filter(
            p => p.status === 'Concluído'
        );

        const concluidos = await Promise.all(
            concluidosBase.map(async (projeto) => {

                const avaliacao = await Avaliacao.findOne({
                    idProjeto: projeto.idProjeto,
                    tipoAvaliador: 'freelancer'
                }).select('_id').lean();

                return {
                    ...projeto,
                    avaliado: !!avaliacao
                };
            })
        );

        return res.json({
            disponiveis,
            candidaturas,
            andamento,
            concluidos
        });

    } catch (erro) {
        console.error('Erro ao buscar projetos do freelancer:', erro);

        return res.status(500).json({
            message: 'Erro ao carregar projetos.'
        });
    }
});

module.exports = router;