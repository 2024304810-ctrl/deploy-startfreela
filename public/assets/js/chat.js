
import logout from '/js.utils/logout.js';
import parseJwt from '/js.utils/parseJwt.js';

const token = localStorage.getItem('token');

if (!token) {
    window.location.href = '/login';
}

const usuario = parseJwt(token);

const urlAtual = window.location.href;
const idDestinatario = urlAtual.slice(-22);

const elementoPai = document.getElementById('mensagens');
const campoMensagem = document.getElementById('message-text');

let destinatario = null;

const getDestinatario = async () => {
    const resposta = await fetch(
        `/api/getDestinatario?d=${idDestinatario}`
    );

    return await resposta.json();
};

document.getElementById('sair').addEventListener('click', () => {
    logout();
});

const usuarioRole = document.querySelector('.role-pill');

if (usuarioRole) {
    usuarioRole.textContent = usuarioRole.textContent.toUpperCase();
}

campoMensagem.focus();

// HORÁRIO
function formatarHorario(data) {
    if (!data) return '';

    return new Date(data).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// CRIAR ELEMENTO DA MENSAGEM

function renderizarMensagem(mensagem) {

    const minhaMensagem =
        String(mensagem.remetente) === String(usuario.id);

    const bolha = document.createElement('div');

    bolha.classList.add(
        'bolha',
        minhaMensagem ? 'enviada' : 'recebida'
    );

    bolha.dataset.id = mensagem._id;

    // Texto
    const texto = document.createElement('p');
    texto.classList.add('texto-mensagem');
    texto.textContent = mensagem.texto;

    // Horário
    const horario = document.createElement('span');
    horario.classList.add('bolha-hora');
    horario.textContent = formatarHorario(mensagem.data);

    bolha.appendChild(texto);
    bolha.appendChild(horario);

    // AÇÕES SOMENTE NAS MENSAGENS ENVIADAS
    if (minhaMensagem) {

        const acoes = document.createElement('div');
        acoes.classList.add('acoes-mensagem');

        // Botão dos três pontinhos
        const botaoMenu = document.createElement('button');
        botaoMenu.type = 'button';
        botaoMenu.classList.add('botao-menu-mensagem');
        botaoMenu.title = 'Opções da mensagem';
        botaoMenu.innerHTML = '<i class="fa-solid fa-ellipsis-vertical"></i>';

        // Menu
        const menu = document.createElement('div');
        menu.classList.add('menu-acoes-mensagem');

        // Opção editar
        const botaoEditar = document.createElement('button');
        botaoEditar.type = 'button';
        botaoEditar.classList.add('botao-editar');
        botaoEditar.innerHTML = '<i class="fa-solid fa-pen"></i> Editar';

        botaoEditar.addEventListener('click', (e) => {
            e.stopPropagation();

            menu.classList.remove('aberto');

            editarMensagem(mensagem._id, texto.textContent);
        });

        // Opção excluir
        const botaoExcluir = document.createElement('button');
        botaoExcluir.type = 'button';
        botaoExcluir.classList.add('botao-excluir');
        botaoExcluir.innerHTML = '<i class="fa-solid fa-trash"></i> Excluir';

        botaoExcluir.addEventListener('click', (e) => {
            e.stopPropagation();

            menu.classList.remove('aberto');

            excluirMensagem(mensagem._id);
        });

        // Abrir e fechar menu
        botaoMenu.addEventListener('click', (e) => {
            e.stopPropagation();

            document.querySelectorAll('.menu-acoes-mensagem.aberto')
                .forEach(outroMenu => {
                    if (outroMenu !== menu) {
                        outroMenu.classList.remove('aberto');
                    }
                });

            menu.classList.toggle('aberto');
        });

        menu.appendChild(botaoEditar);
        menu.appendChild(botaoExcluir);

        acoes.appendChild(botaoMenu);
        acoes.appendChild(menu);

        bolha.appendChild(acoes);
    }

    elementoPai.appendChild(bolha);

    elementoPai.scrollTop = elementoPai.scrollHeight;
}


// WEBSOCKET
const socket = new WebSocket(
    'wss://deploy-startfreela.onrender.com'
);

socket.onopen = () => {
    console.log('Conectado ao WebSocket');

    socket.send(JSON.stringify({
        tipo: 'Identificacao',
        usuarioId: usuario.id
    }));
};

socket.onmessage = (evento) => {

    const dados = JSON.parse(evento.data);

    if (!dados || typeof dados !== 'object') return;

    console.log('WebSocket:', dados);

    // MENSAGEM NOVA
    if (dados.tipo === 'mensagem') {

        // Evita duplicar mensagem que já esteja na tela
        if (document.querySelector(`[data-id="${dados._id}"]`)) {
            return;
        }

        renderizarMensagem(dados);
    }

    // MENSAGEM EDITADA
    if (dados.tipo === 'mensagemEditada') {

        const bolha = document.querySelector(
            `[data-id="${dados._id}"]`
        );

        if (bolha) {
            bolha.querySelector('.texto-mensagem').textContent =
                dados.texto;
        }
    }

    // MENSAGEM EXCLUÍDA
    if (dados.tipo === 'mensagemExcluida') {

        const bolha = document.querySelector(
            `[data-id="${dados._id}"]`
        );

        if (bolha) {
            bolha.remove();
        }
    }

    // ERRO
    if (dados.tipo === 'erro') {
        alert(dados.mensagem);
    }
};

// BUSCAR HISTÓRICO
async function buscarMensagens() {

    try {
        const resposta = await fetch(
            `/api/buscarMensagens?d=${idDestinatario}`
        );

        if (!resposta.ok) {
            throw new Error('Erro ao buscar mensagens');
        }

        const dados = await resposta.json();

        elementoPai.innerHTML = '';

        dados.forEach(mensagem => {
            renderizarMensagem(mensagem);
        });

    } catch (erro) {
        console.error('Erro ao carregar mensagens:', erro);
    }
}

// EDITAR
function editarMensagem(idMensagem, textoAtual) {

    const novoTexto = prompt(
        'Edite sua mensagem:',
        textoAtual
    );

    if (novoTexto === null) return;

    if (!novoTexto.trim()) {
        alert('A mensagem não pode ficar vazia.');
        return;
    }

    if (socket.readyState !== WebSocket.OPEN) {
        alert('Conexão perdida. Tente novamente.');
        return;
    }

    socket.send(JSON.stringify({
        tipo: 'editarMensagem',
        idMensagem,
        destinatario: idDestinatario,
        texto: novoTexto.trim()
    }));
}

// EXCLUIR
function excluirMensagem(idMensagem) {

    const confirmar = confirm(
        'Deseja realmente excluir esta mensagem?'
    );

    if (!confirmar) return;

    if (socket.readyState !== WebSocket.OPEN) {
        alert('Conexão perdida. Tente novamente.');
        return;
    }

    socket.send(JSON.stringify({
        tipo: 'excluirMensagem',
        idMensagem,
        destinatario: idDestinatario
    }));
}

// ENVIAR MENSAGEM
document.querySelector('.input-mensagem').addEventListener(
    'submit',
    (e) => {
        e.preventDefault();

        mandarMensagem();
    }
);

function mandarMensagem() {

    const texto = campoMensagem.value.trim();

    if (!texto) return;

    if (socket.readyState !== WebSocket.OPEN) {
        alert('Conexão perdida. Tente novamente.');
        return;
    }

    socket.send(JSON.stringify({
        tipo: 'mensagem',
        nomeRemetente: usuario.completeName,
        destinatario: idDestinatario,
        nomeDestinatario: destinatario?.completeName,
        texto
    }));

    campoMensagem.value = '';
    campoMensagem.focus();
}

// INICIALIZAÇÃO
async function iniciarChat() {

    destinatario = await getDestinatario();

    console.log('Destinatário:', destinatario);

    await buscarMensagens();
}

document.addEventListener('click', (e) => {

    if (!e.target.closest('.acoes-mensagem')) {

        document.querySelectorAll('.menu-acoes-mensagem.aberto')
            .forEach(menu => {
                menu.classList.remove('aberto');
            });

    }

});

iniciarChat();
