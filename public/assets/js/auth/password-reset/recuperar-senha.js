const etapaAtual = document.querySelector(".etapa-atual")
const barraPreenchidaAtual = document.querySelector(".barra-etapas-preenchida")
const barra= document.querySelector('.barra-etapas')

function voltar(idAtual, idAnterior) {
    document.getElementById(idAtual).classList.add('escondido');
    document.getElementById(idAnterior).classList.remove('escondido');
  
    barraPreenchidaAtual.style.visibility = "visible"
    barra.style.visibility = "visible"

    etapaAtual.innerText = "Etapa 1/4"
    barraPreenchidaAtual.style.width = "25%"
}

function irParaEmail() {
    document.getElementById('tela-recuperar-senha').classList.add('escondido');
    document.getElementById('tela-email').classList.remove('escondido');

    etapaAtual.innerText = "Etapa 2/4"
    barraPreenchidaAtual.style.width = "50%"
}

function irParaWhatsApp(){
    document.getElementById('tela-recuperar-senha').classList.add('escondido');
    document.getElementById('tela-whatsapp').classList.remove('escondido');

    etapaAtual.innerText = "Etapa 2/4"
    barraPreenchidaAtual.style.width = "50%"
}

function btnContinuar(idAtual, idProximo) {
    document.getElementById(idAtual).classList.add('escondido');
    document.getElementById(idProximo).classList.remove('escondido');

    etapaAtual.innerText = "Etapa 3/4"
    barraPreenchidaAtual.style.width = "75%"  
} 


function btnEnviarCodigo(idAtual, idAnterior) {
    document.getElementById(idAtual).classList.add('escondido');
    document.getElementById(idAnterior).classList.remove('escondido');

    etapaAtual.innerText = "Etapa 4/4"
    barraPreenchidaAtual.style.width = "100%"   
}

function btnEnviarSenhaNova(idAtual, idAnterior) {
    document.getElementById(idAtual).classList.add('escondido');
    document.getElementById(idAnterior).classList.remove('escondido');
    
    etapaAtual.innerText = "";
    barraPreenchidaAtual.style.visibility = "hidden";
    barra.style.visibility = "hidden";

}

let cod = ['cod1', 'cod2', 'cod3', 'cod4', 'cod5', 'cod6']

for(let codigo in cod){
    let inputCodigo = document.querySelector(`#${cod[codigo]}`);
    console.log(cod[codigo])
    inputCodigo.addEventListener('input', ()=>{
    inputCodigo.value = inputCodigo.value.replace(/\D/g, "")
    console.log("teste")
})
};

function trocarInput(idAtual, idProximo){
    if(document.getElementById(idAtual).value >= 0){
        document.getElementById(idProximo).focus();
    }
}



//------------------------------------------------------------------------------------------//


//Request para mandar o email
document.getElementById('btn-send_email').addEventListener('click', async(e) => {
    //localStorage.removeItem("Metodo_de_envio");

    const btnEnviar = document.getElementById("btn-send_email");
    const loading = document.getElementById('loading');

    e.preventDefault();

    const email = document.getElementById('email').value;

    btnEnviar.classList.add('loading');
    btnEnviar.style.backgroundColor = "blue";

    loading.classList.remove('hidden');


    btnEnviar.disabled=true;

    try{
        const resposta = await fetch('/api/sendMail', {method: "POST", headers: {
       "Content-Type": "application/json"
        }, body: JSON.stringify({
            email: email
            })
        });

        const dados = await resposta.json();

        console.log(dados);

        if(await dados.success){
            localStorage.setItem("Email", dados.email);
            console.log('deu certo! email enviado');
            btnContinuar('tela-email', 'tela-codigo');
        }else{
            console.log('deu errado! email não enviado');
        }
    }catch(erro){
        console.log('erro');
    }
    finally{
        loading.classList.add('hidden');
        btnEnviar.classList.remove('loading');
        btnEnviar.style.backgroundColor = "yellow";

        btnEnviar.disabled=false;
    }
});


//Request para mandar mensagem no Whatsapp
document.getElementById('btn-send_whatsapp').addEventListener('click', async(e) => {
    e.preventDefault();
    
    const phoneNumber = document.getElementById('telefone').value;

    const resposta = await fetch('/api/sendMessageWhatsapp', ({method: "POST", headers: {
            "Content-Type": "application/json"
        }, body: JSON.stringify({
            phoneNumber: phoneNumber
        })
    }));

    const dados = await resposta.json();

    console.log(dados);

    if(dados.success){
        console.log('deu certo! mensagem enviado');
        localStorage.setItem("Email", dados.email);
        btnContinuar('tela-', 'tela-codigo');
    }else{
        console.log('deu errado! zap não enviado');
    }
});


function getCodeValue(){
    const valores = [];

    for(let i in cod){
        let valor = document.getElementById(cod[i]).value;
        
        valores.push(valor);
    }

    const codigo = valores.join("");
    return codigo;
}



//Request para ver se o código tá certo!
document.getElementById('continuar').addEventListener('click', async(e) => {
    e.preventDefault();

    const codigoDeRedefinicao = getCodeValue();
    
    console.log('lalala');
    
    const email = localStorage.getItem("Email");

    const btnEnviarCodigo = document.getElementById("continuar");
    const loading = document.getElementById('loading');

    btnEnviarCodigo.classList.add('loading');
    btnEnviarCodigo.style.backgroundColor = "blue";

    loading.classList.remove('hidden');

    btnEnviarCodigo.disabled=true;

    try{
        const resposta  = await fetch('/api/verifyResetCode', {method: "POST", headers:{
            "Content-Type": "application/json"
        }, body: JSON.stringify({code: codigoDeRedefinicao, email: email})});

        const dados = await resposta.json();

        console.log(dados);

        if(dados.success){
            console.log('deu certo com o código');
            btnContinuar('tela-codigo', 'tela-novasenha');
        }else{
            console.log(dados.erro);
        }
    }catch(erro){
        console.log(erro);
    }finally{
        loading.classList.add('hidden');
        btnEnviarCodigo.classList.remove('loading');
        btnEnviarCodigo.style.backgroundColor = "yellow";

        btnEnviarCodigo.disabled=false;
    }
});

//Request pra atualizar senha
document.getElementById('btn-atualizasenha').addEventListener('click', async(e) => {

    e.preventDefault();
    
    const newPassword = document.getElementById('novasenha').value;
    const confirmNewPassword  = document.getElementById('confirmar-novasenha').value;
    const email = localStorage.getItem("Email");

    const resposta = await fetch('/api/updatePassword', {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            newPassword: newPassword,
            confirmNewPassword: confirmNewPassword,
            email: email
        })
    });

    const dados = await resposta.json();

    console.log(dados);

    if(dados.success){
        localStorage.clear();
        window.location.href='/login'
    }else{
        console.log(dados.erro);
    }
})