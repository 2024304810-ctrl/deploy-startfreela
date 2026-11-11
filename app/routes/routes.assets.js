const { File } = require('buffer');
const express = require('express');
const router = express.Router();
const path = require('path');

//------------------------------------CSS----------------------------------------------//
router.get('/css/:file', (req, res) => {
    const file = req.params.file;
    res.sendFile(path.join(__dirname, '..', '..', "public", 'assets', 'css', file));
});


//------------------------------------IMAGES-------------------------------------------//
router.get('/img/:file', (req, res) => {
    const file = req.params.file;
    res.sendFile(path.join(__dirname, '..', '..', "public", 'assets', 'img', file));
});

//------------------------------------VIDEOS-------------------------------------------//
router.get('/videos/:file', (req, res) => {
    const file = req.params.file;
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'assets', 'videos', file));
});

//------------------------------------JS-----------------------------------------------//
/*Arquivos de Autenticação*/
router.get('/js.auth/:folder/:file', (req, res) => {
    const {folder, file} = req.params;
    res.sendFile(path.join(__dirname, '..', '..', "public", 'assets', 'js', 'auth', folder, file));
});

/*Arquivos de Notificação*/
router.get('/js.notification/password_reset/:folder/:file', (req, res) => {
    const {folder, file} = req.params;
    res.sendFile(path.join(__dirname, '..', '..', "public", 'assets', 'js', 'auth', 'password-reset', folder, file));
});

/*Arquivos de Componentes*/
router.get('/js.components/:file', (req, res) => {
    const { file } = req.params;
    res.sendFile(path.join(__dirname, '..', '..', "public", 'assets', 'js', 'components', file));
});

//Arquivos Comuns 
router.get('/js/:file', (req, res) => {
    const {file} = req.params;
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'assets', 'js', file));
});

//Utils
router.get('/js.utils/:file', (req, res) => {
    const {file} = req.params;
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'assets', 'js', 'utils', file));
})

router.get('/helpers/:file', (req, res) => {
    const {file} = req.params;
    res.sendFile(path.join(__dirname, '..', '..', 'helpers', file))
})

module.exports = router;

