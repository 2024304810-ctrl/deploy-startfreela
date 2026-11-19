const Projeto = require('../models/ProjetoSchema');

async function daoAddProject(projeto) {

    try{

        await Projeto.create(projeto);

        console.log('deu certo');
        
    }catch(erro){
        
        console.log(erro);

    }
}

module.exports=daoAddProject;