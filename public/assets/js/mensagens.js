
import logout from '/js.utils/logout.js';
import parseJwt from '/js.utils/parseJwt.js';

const token = localStorage.getItem('token');
const usuario = token ? parseJwt(token) : null;

if (!usuario) {
    console.error('Não foi possível identificar o usuário.');
    window.location.href = '/login';
}

const idUsuario = String(usuario?.idUser ?? usuario?.id);

const botaoSair = document.getElementById('sair');

if (botaoSair) {
    botaoSair.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
}

const usuarioRole = document.querySelector('.role-pill');

if (usuarioRole) {
    usuarioRole.textContent = usuarioRole.textContent.toUpperCase();
}

const containerContatos = document.querySelector('.lista-conversas');
const listaVazia = document.querySelector('.lista-vazia');

let socket;

// =====================================================
// FUNÇÕES AUXILIARES
// =====================================================

function escaparHTML(texto) {
    const elemento = document.createElement('div');
    elemento.textContent = texto ?? '';
    return elemento.innerHTML;
}

function formatarData(data) {
    if (!data) return '';

    const dataMensagem = new Date(data);

    if (isNaN(dataMensagem.getTime())) return '';

    const hoje = new Date();

    const mesmaData =
        dataMensagem.getDate() === hoje.getDate() &&
        dataMensagem.getMonth() === hoje.getMonth() &&
        dataMensagem.getFullYear() === hoje.getFullYear();

    if (mesmaData) {
        return dataMensagem.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    return dataMensagem.toLocaleDateString('pt-BR');
}

// =====================================================
// FILTRO DAS CONVERSAS
// =====================================================

function aplicarFiltroAtual() {
    const abaAtiva = document.querySelector('.msgs-tab.active');
    const filtro = abaAtiva?.dataset.filtro || 'todas';

    const conversas = document.querySelectorAll('.conversa-item');

    let algumVisivel = false;

    conversas.forEach(conversa => {
        const status = conversa.dataset.status || '';

        let mostrar = false;

        if (filtro === 'todas') {
            mostrar = !status.includes('arquivada');

        } else if (filtro === 'nao-lidas') {
            mostrar =
                status.includes('nao-lida') &&
                !status.includes('arquivada');

        } else if (filtro === 'arquivadas') {
            mostrar = status.includes('arquivada');
        }

        conversa.style.display = mostrar ? '' : 'none';

        if (mostrar) algumVisivel = true;
    });

    if (listaVazia) {
        listaVazia.hidden = algumVisivel;
    }
}

// =====================================================
// CRIAR OU ATUALIZAR UMA CONVERSA
// =====================================================

function atualizarConversa(dados) {

    if (!containerContatos) return;

    const idContato = String(
        String(dados.remetente) === idUsuario
            ? dados.destinatario
            : dados.remetente
    );

    if (!idContato || idContato === 'undefined') return;

    const nomeContato =
        String(dados.remetente) === idUsuario
            ? dados.nomeDestinatario
            : dados.nomeRemetente;

    const textoPreview =
        String(dados.remetente) === idUsuario
            ? `Você: ${dados.texto}`
            : dados.texto;

    let conversa = containerContatos.querySelector(
        `.conversa-item[data-id="${CSS.escape(idContato)}"]`
    );

    // Se a conversa ainda não existe, criar.
    if (!conversa) {

        conversa = document.createElement('a');

        conversa.className = 'conversa-item';
        conversa.dataset.id = idContato;
        conversa.dataset.status =
            String(dados.remetente) === idUsuario
                ? 'lida'
                : 'nao-lida';

        conversa.innerHTML = `
            <div class="conversa-avatar">
                <img src="/img/icone-user.png" alt="">
            </div>

            <div class="conversa-info">

                <div class="conversa-topo">
                    <span class="conversa-nome"></span>
                    <span class="conversa-hora"></span>
                </div>

                <div class="conversa-preview-row">
                    <p class="conversa-preview"></p>
                </div>

            </div>

            <button class="conversa-menu-btn" type="button">
                <i class="fa-solid fa-ellipsis-vertical"></i>
            </button>

            <div class="conversa-menu">
                <a href="#">
                    <i class="fa-solid fa-thumbtack"></i>
                    Fixar
                </a>

                <a href="#">
                    <i class="fa-solid fa-envelope"></i>
                    Marcar como não lida
                </a>

                <a href="#">
                    <i class="fa-solid fa-box-archive"></i>
                    Arquivar
                </a>
            </div>
        `;
    }

    conversa.href = `/chat?di=${encodeURIComponent(idContato)}`;

    conversa.querySelector('.conversa-nome').textContent =
        nomeContato || 'Usuário';

    conversa.querySelector('.conversa-hora').textContent =
        formatarData(dados.data);

    conversa.querySelector('.conversa-preview').textContent =
        textoPreview;

    // Colocar a conversa no primeiro lugar.
    containerContatos.prepend(conversa);

    aplicarFiltroAtual();
}

// =====================================================
// CARREGAR CONVERSAS DO BANCO
// =====================================================

async function buscarConversas() {

    if (!containerContatos || !usuario) return;

    try {
        const resposta = await fetch('/api/buscarContatos');

        if (!resposta.ok) {
            throw new Error('Erro ao buscar conversas.');
        }

        const dados = await resposta.json();

        console.log('Conversas encontradas:', dados);

        containerContatos.innerHTML = '';

        if (!Array.isArray(dados) || dados.length === 0) {
            if (listaVazia) listaVazia.hidden = false;
            return;
        }

        dados.forEach(contato => {

            if (!contato.idContato) return;

            const idContato = String(contato.idContato);

            const conversa = document.createElement('a');

            conversa.className = 'conversa-item';
            conversa.dataset.id = idContato;
            conversa.dataset.status = 'lida';
            conversa.href = `/chat?di=${encodeURIComponent(idContato)}`;

            conversa.innerHTML = `
                <div class="conversa-avatar">
                    <img src="/img/icone-user.png" alt="">
                </div>

                <div class="conversa-info">

                    <div class="conversa-topo">
                        <span class="conversa-nome"></span>
                        <span class="conversa-hora"></span>
                    </div>

                    <div class="conversa-preview-row">
                        <p class="conversa-preview"></p>
                    </div>

                </div>

                <button class="conversa-menu-btn" type="button">
                    <i class="fa-solid fa-ellipsis-vertical"></i>
                </button>

                <div class="conversa-menu">
                    <a href="#">
                        <i class="fa-solid fa-thumbtack"></i>
                        Fixar
                    </a>

                    <a href="#">
                        <i class="fa-solid fa-envelope"></i>
                        Marcar como não lida
                    </a>

                    <a href="#">
                        <i class="fa-solid fa-box-archive"></i>
                        Arquivar
                    </a>
                </div>
            `;

            conversa.querySelector('.conversa-nome').textContent =
                contato.nomeContato || 'Usuário';

            conversa.querySelector('.conversa-hora').textContent =
                formatarData(contato.data);

            conversa.querySelector('.conversa-preview').textContent =
                String(contato.remetente) === idUsuario
                    ? `Você: ${contato.texto || ''}`
                    : contato.texto || '';

            containerContatos.appendChild(conversa);
        });

        aplicarFiltroAtual();

    } catch (erro) {
        console.error('Erro ao carregar conversas:', erro);
    }
}

// =====================================================
// WEBSOCKET
// =====================================================

function conectarWebSocket() {

    socket = new WebSocket(
        'wss://deploy-startfreela.onrender.com'
    );

    socket.onopen = () => {

        console.log('WebSocket conectado na tela de mensagens!');

        socket.send(JSON.stringify({
            tipo: 'Identificacao',
            usuarioId: idUsuario
        }));
    };

    socket.onmessage = async (evento) => {

        try {

            const dados = JSON.parse(evento.data);

            console.log('Evento recebido na lista:', dados);

            if (dados.tipo === 'mensagem') {

                atualizarConversa(dados);

            }

            // Quando uma mensagem é editada,
            // buscar novamente a prévia atualizada.
            if (dados.tipo === 'mensagemEditada') {

                await buscarConversas();

            }

            // Quando uma mensagem é excluída,
            // atualizar a prévia da conversa.
            if (dados.tipo === 'mensagemExcluida') {

                await buscarConversas();

            }

            if (dados.tipo === 'erro') {
                console.error('Erro no WebSocket:', dados.mensagem);
            }

        } catch (erro) {
            console.error('Erro ao processar evento:', erro);
        }
    };

    socket.onerror = (erro) => {
        console.error('Erro na conexão WebSocket:', erro);
    };

    socket.onclose = () => {
        console.log('WebSocket desconectado da tela de mensagens.');
    };
}

// =====================================================
// FILTRO POR ABAS
// =====================================================

document.querySelectorAll('.msgs-tab').forEach(tab => {

    tab.addEventListener('click', () => {

        document.querySelectorAll('.msgs-tab').forEach(t => {
            t.classList.remove('active');
        });

        tab.classList.add('active');

        aplicarFiltroAtual();
    });

});

// =====================================================
// CLIQUES NAS CONVERSAS E NOS MENUS
// =====================================================

if (containerContatos) {

    containerContatos.addEventListener('click', (e) => {

        const botaoMenu = e.target.closest('.conversa-menu-btn');

        if (botaoMenu) {

            e.preventDefault();
            e.stopPropagation();

            const menu = botaoMenu.nextElementSibling;

            if (!menu) return;

            const jaAberto = menu.classList.contains('open');

            document.querySelectorAll('.conversa-menu.open').forEach(m => {
                m.classList.remove('open');
            });

            menu.classList.toggle('open', !jaAberto);

            return;
        }

        const linkMenu = e.target.closest('.conversa-menu a');

        if (linkMenu) {

            e.preventDefault();
            e.stopPropagation();

            return;
        }

        const conversa = e.target.closest('.conversa-item');

        if (conversa) {

            e.preventDefault();

            const idContato = conversa.dataset.id;

            if (idContato) {
                window.location.href =
                    `/chat?di=${encodeURIComponent(idContato)}`;
            }
        }
    });
}

// Fechar menus ao clicar fora.

document.addEventListener('click', () => {

    document.querySelectorAll('.conversa-menu.open').forEach(menu => {
        menu.classList.remove('open');
    });

});

// =====================================================
// INICIALIZAÇÃO
// =====================================================

async function iniciar() {

    if (!usuario) return;

    await buscarConversas();

    conectarWebSocket();
}

iniciar();
