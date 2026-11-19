
import logout from '/js.utils/logout.js';
import parseJwt from '/js.utils/parseJwt.js';

const token = localStorage.getItem('token');
const usuario = token ? parseJwt(token) : null;

if (!usuario) {
    console.error('Não foi possível identificar o usuário.');
}

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

    if (isNaN(dataMensagem.getTime())) {
        return '';
    }

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
// CARREGAR CONVERSAS
// =====================================================

async function buscarConversas() {
    const containerContatos = document.querySelector('.lista-conversas');
    const listaVazia = document.querySelector('.lista-vazia');

    if (!containerContatos || !usuario) {
        return;
    }

    try {
        const resposta = await fetch('/api/buscarContatos');

        if (!resposta.ok) {
            throw new Error('Erro ao buscar conversas.');
        }

        const dados = await resposta.json();

        console.log('Conversas encontradas:', dados);

        containerContatos.innerHTML = '';

        if (!Array.isArray(dados) || dados.length === 0) {
            if (listaVazia) {
                listaVazia.hidden = false;
            }

            return;
        }

        dados.forEach(contato => {
            const idContato = contato.idContato;
            const nomeContato = contato.nomeContato || 'Usuário';
            const ultimaMensagem = contato.texto || '';
            const horario = formatarData(contato.data);

            if (!idContato) {
                return;
            }

            const conversaHTML = `
                <a class="conversa-item"
                   id="${escaparHTML(idContato)}"
                   data-id="${escaparHTML(idContato)}"
                   data-status="lida">

                    <div class="conversa-avatar">
                        <img src="/img/icone-user.png" alt="">
                    </div>

                    <div class="conversa-info">

                        <div class="conversa-topo">
                            <span class="conversa-nome">
                                ${escaparHTML(nomeContato)}
                            </span>

                            <span class="conversa-hora">
                                ${escaparHTML(horario)}
                            </span>
                        </div>

                        <div class="conversa-preview-row">
                            <p class="conversa-preview">
                                ${escaparHTML(ultimaMensagem)}
                            </p>
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

                </a>
            `;

            containerContatos.insertAdjacentHTML('beforeend', conversaHTML);
        });

        const conversas = containerContatos.querySelectorAll('.conversa-item');

        if (listaVazia) {
            listaVazia.hidden = conversas.length > 0;
        }

        console.log('Total de conversas:', conversas.length);

    } catch (erro) {
        console.error('Erro ao carregar conversas:', erro);
    }
}

// =====================================================
// FILTRO POR ABAS
// =====================================================

document.addEventListener('DOMContentLoaded', () => {

    const tabs = document.querySelectorAll('.msgs-tab');
    const containerContatos = document.querySelector('.lista-conversas');
    const listaVazia = document.querySelector('.lista-vazia');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filtro = tab.dataset.filtro;

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

                if (mostrar) {
                    algumVisivel = true;
                }
            });

            if (listaVazia) {
                listaVazia.hidden = algumVisivel;
            }
        });
    });

    // =================================================
    // CLIQUES NAS CONVERSAS E NOS MENUS
    // =================================================

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

    // Fechar menus ao clicar fora deles
    document.addEventListener('click', () => {
        document.querySelectorAll('.conversa-menu.open').forEach(menu => {
            menu.classList.remove('open');
        });
    });

});

// =====================================================
// INICIALIZAÇÃO
// =====================================================

buscarConversas();
