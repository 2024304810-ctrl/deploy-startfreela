
const daoPublishProject = require('../db/daoPublishProject');

async function controllerPublishProject(projeto){
    //Vendo se há algo vazio
    let camposVazios = 0;

    for(let atributo in projeto){
        if(!projeto[atributo]){
            camposVazios++;
        }
    }

    if(camposVazios > 0){
        return {
            message: "Os campos não foram preenchidos corretamente!",
            status: 400
        }
    }

    try{

        await daoPublishProject(projeto);

        return {
            message: 'operação realizada com sucesso!',
            status: 201,
            success: true
        }
    }catch(erro){
        console.log(erro);
        return {
            message: "erro no servidor!",
            status: 500
        }
    }

}

module.exports = controllerPublishProject;