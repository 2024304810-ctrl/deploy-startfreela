const emailValido = require('../../../utils/email/emailValido');
const Dao = require('../dao/Dao');
const dao = new Dao();
const getDate = require('../../services/getDate');


async function controllerRegister(usuario){
    let camposVazios = 0;


    for(let atributo in usuario){
        if(!usuario[atributo]){
            camposVazios++;
        }
    }

    //Verificando se há algum campo vazio. Se tiver --> status 400
    if(camposVazios > 0){
        return {
            status: 400,
            erro: "Os campos não foram preenchidos corretamente!"
        }
    }

    console.log("Email do cara:", usuario.email);

    //Verificando se o email digitado é válido
    if(!emailValido(usuario.email)){
        return {
            status: 400,
            erro: "O formato de email está incorreto!"
        }
    }

    if(await dao.emailExiste(usuario.email) !== null){
        return {
            status: 400,
            erro: "Email já existente"
        }
    }

    //Verificando se a data de nascimento é válida
    if(!dataDeNascimentoValida(usuario.dateOfBirth)){
        return {
            status: 400,
            erro: "Data de nascimento inválida"
        }
    }

    if(usuario.phone.length < 11){
        return {
            status: 400,
            erro: "Formato de telefone não ideal"
        }
    }


    //Verificando se as senhas digitadas coincidem
    if(usuario.password !== usuario.passwordConf){
        return {
            status: 400,
            erro: "As senhas digitadas não coincidem!"
        }
    }

    console.log(`Usuário sem o passwordConf --> ${delete usuario.passwordConf}`);

    usuario.contato = {email: usuario.email, phone: usuario.phone};
    delete usuario.email; 
    delete usuario.phone;

    console.log("CONTATO:", usuario.contato);

    for(let atributo in usuario){
        console.log(`${atributo} --> ${usuario[atributo]}`);
    }

    usuario.premium = false;

    usuario.createdIn = getDate();
    usuario.informacoesAdicionais = false;
    usuario.ativo = false;

    console.log('antes de ir pro dao');
    console.log(usuario);

    const cadastro = await dao.register(usuario);

    if(cadastro){

        console.log('retornando tudo certo');

        return {
            success: true,
            status: 201,
            message: "tudo certo pelo visto"
        }

    }else{

        console.log('bagulho deu errado');

        return {
            success: false,
            status: 500,
            message: "Algo deu errado!"
        }
    }

}


function dataDeNascimentoValida(dataDeNascimento){
    const [ano, mes, dia] = dataDeNascimento.split('-').map(Number);

    console.log("Ano:", ano);
    console.log("Mês", mes);
    console.log("Dia,", dia);

    const anoAtual = new Date().getFullYear();

    console.log("vendo o mês");
    if(mes < 1 || mes > 12){
        return false;
    }

    console.log('vendo o ano');
    if(ano > anoAtual){
        return false;
    }

    const dataObjeto = new Date(ano, mes - 1, dia);
    if(dataObjeto.getFullYear() !== ano || dataObjeto.getMonth() !== (mes - 1) || dataObjeto.getDate() !== dia){
        return false;
    }  

    return true;

}


module.exports=controllerRegister;