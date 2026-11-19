import logout from "/js.utils/logout.js";

const {projeto} = window.dadosPagina;

const usuarioRole = document.querySelector(".role-pill");
usuarioRole.innerHTML = usuarioRole.textContent.toUpperCase();

document.getElementById('sair').addEventListener('click', () => {
    logout();
});

console.log(projeto);

const skills = document.querySelector('#project-skills');
for(let i = 0; i < projeto.habilidades.length; i++){
    skills.insertAdjacentHTML('beforeend', `<span>${projeto.habilidades[i]}</span>`);
}

function converterData(dataStr){
    const [ano, mes, dia] = dataStr.split('-');
    return `${dia}/${mes}/${ano}`
}

function calcularQuantosDias(dataStr){
    console.log("data:", dataStr);

    const [ano, mes, dia] = dataStr.split('-');

    const dataAlvo = new Date(ano, mes-1, dia);
    console.log('data alvo:', dataAlvo);

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    console.log('hoje:', hoje);

    const diferencaMs = hoje - dataAlvo;
    console.log('diferença em milissegundos:', diferencaMs);
    
    const umDiaEmMs = 1000 * 60 * 60 * 24;
    console.log('Um dia em mês:', umDiaEmMs);

    const diasRestantes = Math.ceil(diferencaMs/umDiaEmMs);
    console.log('dias restantes:', diasRestantes);
    
    return diasRestantes;
}

const cliente = document.querySelector('#project-client');
let diasPassados = calcularQuantosDias(projeto.dataPostagem);

if(diasPassados == 1){
    diasPassados = `${diasPassados} dia`;
}else{
    diasPassados = `${diasPassados} dias`;
}

cliente.textContent = `${projeto.clienteUsername} · Publicado há ${diasPassados}`;

const prazoEstimando = document.querySelector('#project-deadline');
prazoEstimando.textContent = converterData(projeto.prazoDesejado);


const formulario = document.querySelector('#proposal-form');

formulario.addEventListener('submit', async (event) => {
    event.preventDefault();

    const botao = document.querySelector('#submit-proposal');

    const dados = {
        idProjeto: projeto.idProjeto,
        valor: document.querySelector('#proposal-value').value,
        prazoDias: document.querySelector('#proposal-deadline').value,
        mensagem: document.querySelector('#proposal-message').value
    };

    botao.disabled = true;
    botao.textContent = 'Enviando...';

    try {
        const resposta = await fetch('/api/enviarProposta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.message);
        }

        alert(resultado.message);

        window.location.href = '/projects';

    } catch (erro) {
        alert(erro.message || 'Erro ao enviar proposta.');

        botao.disabled = false;
        botao.innerHTML =
            'Enviar proposta <i class="fa-solid fa-paper-plane"></i>';
    }
});
