const salvarImagem = require('../services/salvarImagem');
const daoAddProjeto = require('../db/daoAddProjeto');

async function controllerAddProjeto(projeto, buffer) {
    console.log('no controller!');

    let camposVazios = 0;

    for(let atributo in projeto){
        if(!projeto[atributo]){
            camposVazios++;
        }
    }

    console.log('vendo se tem campos vazios');

    //Verificando se há algum campo vazio. Se tiver --> status 400
    if(camposVazios > 0){
        return {
            status: 400,
            erro: "Os campos não foram preenchidos corretamente!"
        }
    }

    //Salvar imagem e retornar URL

    console.log('indo salvar a imagem');

    const urlImagem = await salvarImagem(buffer);

    projeto.imagemCapa = urlImagem;

    console.log('projeto no controller:', projeto);

    try{

        await daoAddProjeto(projeto);

        return {
            success: true
        };

    }catch(erro){
        console.log(erro);
        return;
    }

}

module.exports=controllerAddProjeto;