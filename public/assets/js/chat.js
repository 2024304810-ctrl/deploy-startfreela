import logout from '/js.utils/logout.js';
import parseJwt from '/js.utils/parseJwt.js';

const token = localStorage.getItem('token');
const usuario = parseJwt(token);

const urlAtual = window.location.href;
console.log('URL ATUAL:', urlAtual);
const idDestinatario = urlAtual.slice(-22);

const getDestinatario = async() => {
    const resposta = await fetch(`/api/getDestinatario?d=${idDestinatario}`);
    const dados = await resposta.json();
    return dados;
}

const destinatario = await getDestinatario();

console.log('destinatario:', destinatario);

const agora = new Date();
const horario = `${agora.getHours()}:${agora.getMinutes()}`;

document.getElementById('sair').addEventListener('click', () => { logout() });

const usuarioRole = document.querySelector(".role-pill");
usuarioRole.innerHTML = usuarioRole.textContent.toUpperCase();

document.getElementById('message-text').focus();

////////////////////////WEBSOCKET///////////////////////////////
const socket = new WebSocket("ws://localhost:3000");

socket.onopen = () => {
    console.log('conectando com o protocolo');

    socket.send(JSON.stringify({
        tipo: "Identificacao",
        usuarioId: usuario.id
    }))
};

socket.onmessage = (evento) => {
    const dados = JSON.parse(evento.data);

    console.log('mensagem de:', dados.remetente);
    console.log('texto:', dados.texto);

    if(dados.tipo === "mensagem"){
        const novaMensagem = document.createElement("p");
        
        novaMensagem.textContent=dados.texto;
        novaMensagem.classList.add('texto_destinatario');

        const elementoPai = document.getElementById('mensagens'); 
        elementoPai.insertAdjacentHTML('beforeend', `
            <div class="bolha recebida">
            <p>${dados.texto}</p>
            <span class="bolha-hora">${horario}</span>
            </div>    
        `);

        const containerMensagens = document.getElementById('mensagens');
        containerMensagens.scrollTop = containerMensagens.scrollHeight;

    }
}
//////////////////////WEBSOCKET/////////////////////////////////////

async function buscarMensagens(){
    const resposta = await fetch(`/api/buscarMensagens?d=${idDestinatario}`);

    const dados = await resposta.json();

    console.log(dados);

    console.log('remetente:', dados[0].remetente);
    console.log('id do usuário:', usuario.id);
    console.log('são iguais:', dados[0].remetente !== usuario.id);

    const containerMensagens = document.getElementById('mensagens');

    for(let i = 0; i <= dados.length-1; i++){
        if(dados[i].remetente !== usuario.id){
            containerMensagens.insertAdjacentHTML('beforeend', `
                <div class="bolha recebida">
                <p>${dados[i].texto}</p>
                <span class="bolha-hora">${horario}</span>
                </div>    
            `);
        }else{
            containerMensagens.insertAdjacentHTML('beforeend', `
                <div class="bolha enviada">
                <p>${dados[i].texto}</p>
                <span class="bolha-hora">${horario}</span>
                </div>    
            `);
        }

    }

    containerMensagens.scrollTop = containerMensagens.scrollHeight;
}

buscarMensagens();


document.querySelector('.input-mensagem').addEventListener('submit', (e) => {
    e.preventDefault();

    console.log('enviando...');

    mandarMensagem();
})

function mandarMensagem(){

    const text = document.getElementById('message-text').value;

    if(text === ""){
        return false;
    }

    console.log('mandando mensagem');

    console.log('nome do usuário:', usuario.completeName);

    socket.send(JSON.stringify({
        remetente: usuario.id,
        nomeRemetente: usuario.completeName,
        tipo: "mensagem",
        destinatario: idDestinatario,
        nomeDestinatario: destinatario.completeName,
        texto: text
    }));

    const containerMensagens = document.getElementById('mensagens');

    containerMensagens.insertAdjacentHTML('beforeend', `
        <div class="bolha enviada">
          <p>${text}</p>
          <span class="bolha-hora">${horario}</span>
        </div>    
    `);

    containerMensagens.scrollTop = containerMensagens.scrollHeight;

    document.getElementById('message-text').value = "";
}