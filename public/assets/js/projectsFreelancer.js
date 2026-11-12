
import logout from '/js.utils/logout.js';

const $ = (seletor, raiz = document) => raiz.querySelector(seletor);
const $$ = (seletor, raiz = document) => [...raiz.querySelectorAll(seletor)];

const lista = $('#freelancer-project-list');
const busca = $('#freelancer-search');
const modal = $('#project-modal');
const modalTitle = $('#modal-title');
const modalContent = $('#modal-content');

let projetos = {
    disponiveis: [],
    candidaturas: [],
    andamento: [],
    concluidos: []
};

let abaAtual = 'disponiveis';

function escapar(valor) {
    return String(valor ?? '').replace(/[&<>"']/g, caractere => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[caractere]);
}

function moeda(valor) {
    return Number(valor || 0).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function notificar(mensagem) {
    const toast = $('#toast');

    if (!toast) {
        alert(mensagem);
        return;
    }

    toast.textContent = mensagem;
    toast.classList.remove('hidden');

    setTimeout(() => toast.classList.add('hidden'), 3000);
}

function abrirDetalhes(projeto, tipo) {
    modalTitle.textContent = projeto.titulo;

    const proposta = projeto.proposta;
    const entrega = projeto.entrega;

    modalContent.innerHTML = `
        <p><strong>Cliente:</strong> ${escapar(projeto.clienteUsername)}</p>
        <p><strong>Categoria:</strong> ${escapar(projeto.categoria)}</p>
        <p><strong>Status:</strong> ${escapar(projeto.status || 'Aberto')}</p>

        <p><strong>Orçamento:</strong>
            ${moeda(projeto.orcamentoMinimo)} -
            ${moeda(projeto.orcamentoMaximo)}
        </p>

        <p><strong>Prazo desejado:</strong>
            ${escapar(projeto.prazoDesejado)}
        </p>

        <p><strong>Descrição:</strong></p>
        <p>${escapar(projeto.descricao)}</p>

        <p><strong>Habilidades:</strong></p>
        <div class="tag-row">
            ${(projeto.habilidades || []).map(h =>
        `<span>${escapar(h)}</span>`
    ).join('')}
        </div>

        ${proposta ? `
            <hr>
            <p><strong>Minha proposta:</strong> ${moeda(proposta.valor)}</p>
            <p><strong>Prazo proposto:</strong> ${proposta.prazoDias} dias</p>
            <p><strong>Status da proposta:</strong> ${escapar(proposta.status)}</p>
            <p>${escapar(proposta.mensagem)}</p>
        ` : ''}

        ${tipo === 'andamento' ? `
    <hr>
    <h3>Histórico de atividades</h3>

    ${(projeto.atualizacoesProgresso || []).length
                ? projeto.atualizacoesProgresso.map(item => `
            <div class="activity-item">
                <strong>${Number(item.percentual)}%</strong>
                <p>${escapar(item.descricao)}</p>
                <small>
                    ${item.data
                        ? new Date(item.data).toLocaleString('pt-BR')
                        : ''}
                </small>
            </div>
        `).join('')
                : '<p>Nenhuma atualização registrada.</p>'
            }
` : ''}

        ${entrega?.descricao ? `
            <hr>
            <h3>Minha entrega</h3>
            <p>${escapar(entrega.descricao)}</p>
            <p>
                <strong>Link:</strong>
                <a href="${escapar(entrega.link)}"
                   target="_blank" rel="noopener noreferrer">
                    Acessar entrega
                </a>
            </p>
            <p><strong>Enviada em:</strong>
                ${entrega.dataEnvio
                ? new Date(entrega.dataEnvio).toLocaleString('pt-BR')
                : 'Não informado'}
            </p>
        ` : ''}
    `;

    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}
function mostrarFormularioAvaliacao(projeto) {
    modalTitle.textContent = 'Avaliar cliente';

    modalContent.innerHTML = `
        <div class="evaluation-form">
            <h3>
                Como foi sua experiência com
                ${escapar(projeto.clienteUsername || 'Cliente')}?
            </h3>

            <p>Sua avaliação será registrada no perfil do cliente.</p>

            <form id="evaluation-form">
                <div class="form-field">
                    <label>Sua avaliação *</label>

                    <div class="star-rating">
                        ${[1, 2, 3, 4, 5].map(n => `
                            <button
                                type="button"
                                class="star"
                                data-rating="${n}"
                                aria-label="${n} estrela(s)"
                                style="color: #ccc; background: none; border: none; font-size: 30px; cursor: pointer;">
                                ★
                            </button>
                        `).join('')}
                    </div>

                    <input type="hidden" id="evaluation-rating">
                </div>

                <div class="form-field">
                    <label for="evaluation-comment">
                        Comentário (opcional)
                    </label>

                    <textarea
    id="evaluation-comment"
    maxlength="500"
    placeholder="Conte brevemente como foi a experiência...">
</textarea>
                </div>

                <div class="modal-actions">
                    <button type="submit" class="btn btn-primary">
                        <i class="fa-solid fa-star"></i>
                        Enviar avaliação
                    </button>

                    <button
                        type="button"
                        class="btn btn-outline"
                        data-modal-action="skip-evaluation">
                        Pular por enquanto
                    </button>
                </div>
            </form>
        </div>
    `;

    modalContent.dataset.evaluationProjectId = projeto.idProjeto;

    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}
modalContent.addEventListener('click', event => {
    const estrela = event.target.closest('[data-rating]');

    if (estrela) {
        const nota = Number(estrela.dataset.rating);

        $('#evaluation-rating').value = nota;

        $$('.star', modalContent).forEach(botao => {
            const valor = Number(botao.dataset.rating);

            botao.style.color = valor <= nota ? '#f5b301' : '#ccc';
        });

        return;
    }

    if (event.target.closest('[data-modal-action="skip-evaluation"]')) {
        fecharModal();
    }
});
modalContent.addEventListener('submit', async event => {
    if (event.target.id !== 'evaluation-form') return;

    event.preventDefault();

    const idProjeto = modalContent.dataset.evaluationProjectId;
    const nota = Number($('#evaluation-rating')?.value);
    const comentario = $('#evaluation-comment')?.value.trim() || '';

    if (!nota || nota < 1 || nota > 5) {
        notificar('Selecione uma quantidade de estrelas.');
        return;
    }

    try {
        const resposta = await fetch(
            `/api/projetos/${encodeURIComponent(idProjeto)}/avaliar`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nota,
                    comentario
                })
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.message || 'Erro ao enviar avaliação.');
        }

        notificar('Avaliação enviada com sucesso!');
        fecharModal();

        await carregarProjetos();

    } catch (erro) {
        notificar(erro.message);
    }
});

function fecharModal() {
    modal?.classList.add('hidden');
    modal?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

$('#close-modal')?.addEventListener('click', fecharModal);

modal?.addEventListener('click', e => {
    if (e.target === modal) fecharModal();
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') fecharModal();
});

function criarCard(projeto, tipo) {
    const proposta = projeto.proposta;

    let status = 'Recebendo propostas';
    let classeStatus = 'status-open';
    let fatos = '';
    let acao = '';

    if (tipo === 'candidaturas') {
        status = proposta.status === 'Pendente'
            ? 'Em análise'
            : proposta.status;

        classeStatus = proposta.status === 'Recusada'
            ? 'status-review'
            : 'status-open';

        fatos = `
            <span><small>Minha proposta</small>
                <strong>${moeda(proposta.valor)}</strong>
            </span>
            <span><small>Prazo proposto</small>
                <strong>${proposta.prazoDias} dias</strong>
            </span>
        `;
    } else if (tipo === 'andamento') {
        status = projeto.status;
        classeStatus = projeto.status === 'Aguardando aprovação'
            ? 'status-review'
            : 'status-progress';

        fatos = `
            <span><small>Progresso</small>
                <strong>${Number(projeto.progresso || 0)}%</strong>
            </span>
            <span><small>Prazo desejado</small>
                <strong>${escapar(projeto.prazoDesejado)}</strong>
            </span>
        `;
    } else if (tipo === 'concluidos') {
        status = 'Concluído';
        classeStatus = 'status-done';

        fatos = `
            <span><small>Projeto</small>
                <strong>Finalizado</strong>
            </span>
        `;
        if (tipo === 'concluidos' && !projeto.avaliado) {
            acao = `
        <button class="btn btn-outline btn-sm"
            data-action="evaluate"
            data-id="${escapar(projeto.idProjeto)}">
            <i class="fa-solid fa-star"></i>
            Avaliar cliente
        </button>
    `;
        }
    } else {
        fatos = `
            <span><small>Orçamento</small>
                <strong>${moeda(projeto.orcamentoMinimo)} - ${moeda(projeto.orcamentoMaximo)}</strong>
            </span>
            <span><small>Prazo desejado</small>
                <strong>${escapar(projeto.prazoDesejado)}</strong>
            </span>
        `;
    }

    if (tipo === 'disponiveis') {
        acao = `
        <a class="btn btn-primary btn-sm"
           href="/projects/proposta?p=${encodeURIComponent(projeto.idProjeto)}">
            Enviar proposta <i class="fa-solid fa-arrow-right"></i>
        </a>
    `;
    }

    if (
        tipo === 'andamento' &&
        projeto.status === 'Em andamento'
    ) {
        acao = `
        <button class="btn btn-outline btn-sm"
            data-action="update-progress"
            data-id="${escapar(projeto.idProjeto)}">
            Atualizar progresso
        </button>

        <button class="btn btn-primary btn-sm"
            data-action="submit-delivery"
            data-id="${escapar(projeto.idProjeto)}">
            Enviar entrega
        </button>
    `;
    }

    if (
        tipo === 'andamento' &&
        projeto.status === 'Aguardando aprovação'
    ) {
        acao = `
        <span class="status status-review">
            Entrega enviada. Aguardando cliente.
        </span>
    `;
    }

    const progresso = Math.min(
        100,
        Math.max(0, Number(projeto.progresso || 0))
    );

    return `
        <article class="opportunity-card"
            data-status="${tipo}"
            data-category="${escapar(projeto.categoria)}"
            data-budget="${Number(projeto.orcamentoMaximo || 0)}"
            data-title="${escapar(projeto.titulo).toLowerCase()}">

            <div class="opp-top">
                <div class="project-symbol code">
                    <i class="fa-solid fa-code"></i>
                </div>

                <div class="opp-title">
                    <h2>${escapar(projeto.titulo)}</h2>
                    <p>
                        <i class="fa-regular fa-building"></i>
                        ${escapar(projeto.clienteUsername || 'Cliente')}
                    </p>
                </div>

                <span class="status ${classeStatus}">
                    ${escapar(status)}
                </span>
            </div>

            <p class="project-description">
                ${escapar(projeto.descricao)}
            </p>

            <div class="tag-row">
                ${(projeto.habilidades || []).map(h =>
        `<span>${escapar(h)}</span>`
    ).join('')}
            </div>

            ${tipo === 'andamento' ? `
                <div class="progress-line">
                    <span style="width:${progresso}%"></span>
                </div>
                <small class="progress-caption">
                    Progresso informado: ${progresso}%
                </small>
            ` : ''}

            <div class="opp-bottom">
                <div class="opp-facts">
                    ${fatos}
                </div>

                <div class="opp-actions">
                    <button class="btn btn-outline btn-sm"
                        data-action="details"
                        data-id="${escapar(projeto.idProjeto)}">
                        Ver detalhes
                    </button>
                    ${acao}
                </div>
            </div>
        </article>
    `;
}

function atualizarIndicadores() {
    const contagens = [
        projetos.disponiveis.length,
        projetos.candidaturas.length,
        projetos.andamento.length,
        projetos.concluidos.length
    ];

    $$('.freelancer-stats .stat-card strong')
        .forEach((elemento, indice) => {
            elemento.textContent = contagens[indice];
        });

    $$('[data-freelancer-filter]').forEach(botao => {
        const tipo = botao.dataset.freelancerFilter;
        const contador = botao.querySelector('span');

        if (contador) {
            contador.textContent = projetos[tipo].length;
        }
    });
}

function aplicarFiltros() {
    const termo = (busca?.value || '').toLowerCase().trim();
    const categoria = $('#category-filter')?.value || '';
    const orcamento = Number($('#budget-filter')?.value || 0);
    const habilidade = ($('#skills-filter')?.value || '').toLowerCase().trim();

    $$('.opportunity-card', lista).forEach(card => {
        const texto = card.textContent.toLowerCase();

        const corresponde =
            card.dataset.title.includes(termo) &&
            texto.includes(habilidade) &&
            (!categoria || card.dataset.category === categoria) &&
            Number(card.dataset.budget) >= orcamento;

        card.classList.toggle('hidden', !corresponde);
    });

    const possuiVisiveis = $$('.opportunity-card', lista)
        .some(card => !card.classList.contains('hidden'));

    $('#freelancer-empty')?.classList.toggle('hidden', possuiVisiveis);
}

function renderizarProjetos() {
    const listaAtual = projetos[abaAtual] || [];

    lista.innerHTML = listaAtual.map(projeto =>
        criarCard(projeto, abaAtual)
    ).join('') + `
        <div class="empty-state ${listaAtual.length ? 'hidden' : ''}"
             id="freelancer-empty">
            <i class="fa-regular fa-folder-open"></i>
            <h3>Nenhum projeto encontrado</h3>
            <p>Não há projetos nesta categoria no momento.</p>
        </div>
    `;

    aplicarFiltros();
}

async function carregarProjetos() {
    try {
        const resposta = await fetch('/api/freelancer/projetos');

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.message || 'Erro ao carregar projetos.');
        }

        const andamento = dados.andamento || [];
        const concluidos = dados.concluidos || [];

        // IDs de projetos que já foram contratados ou finalizados
        const idsContratados = new Set([
            ...andamento,
            ...concluidos
        ].map(p => String(p.idProjeto)));

        projetos = {
            disponiveis: (dados.disponiveis || []).filter(p => {
                const id = String(p.idProjeto);
                const status = String(p.status || 'Aberto')
                    .trim()
                    .toLowerCase();

                const contratado = Boolean(p.idFreelancerContratado);

                return (
                    status === 'aberto' &&
                    !contratado &&
                    !idsContratados.has(id)
                );
            }),

            candidaturas: (dados.candidaturas || []).filter(p => {
                return !idsContratados.has(String(p.idProjeto));
            }),

            andamento,
            concluidos
        };

        atualizarIndicadores();
        renderizarProjetos();

    } catch (erro) {
        console.error(erro);
        notificar(erro.message);
    }
}

// Alternar abas
$$('[data-freelancer-filter]').forEach(botao => {
    botao.addEventListener('click', () => {
        $$('[data-freelancer-filter]').forEach(item =>
            item.classList.remove('active')
        );

        botao.classList.add('active');
        abaAtual = botao.dataset.freelancerFilter;

        renderizarProjetos();
    });
});

// Pesquisa e filtros
busca?.addEventListener('input', aplicarFiltros);

['category-filter', 'budget-filter', 'skills-filter'].forEach(id => {
    $('#' + id)?.addEventListener('input', aplicarFiltros);
});

$('#clear-filters')?.addEventListener('click', () => {
    ['category-filter', 'budget-filter', 'skills-filter'].forEach(id => {
        $('#' + id).value = '';
    });

    if (busca) busca.value = '';

    aplicarFiltros();
});

// Ordenação
$('#freelancer-sort')?.addEventListener('change', () => {
    const modo = $('#freelancer-sort').value;
    const atual = projetos[abaAtual];

    if (modo === 'orcamento') {
        atual.sort((a, b) =>
            Number(b.orcamentoMaximo || 0) -
            Number(a.orcamentoMaximo || 0)
        );
    } else if (modo === 'recentes') {
        atual.reverse();
    }

    renderizarProjetos();
});

// Detalhes
lista?.addEventListener('click', async event => {
    const botao = event.target.closest('[data-action]');

    if (!botao) return;

    const idProjeto = botao.dataset.id;

    const projeto = projetos[abaAtual].find(p =>
        String(p.idProjeto) === String(idProjeto)
    );

    if (!projeto) return;

    if (botao.dataset.action === 'evaluate') {
        mostrarFormularioAvaliacao(projeto);
        return;
    }

    // Abrir detalhes
    if (botao.dataset.action === 'details') {
        abrirDetalhes(projeto, abaAtual);
        return;
    }

    // Atualizar progresso
    if (botao.dataset.action === 'update-progress') {
        const percentual = prompt(
            'Qual é o novo percentual de progresso? (0 a 100)',
            projeto.progresso || 0
        );

        if (percentual === null) return;

        const descricao = prompt(
            'Descreva o que foi realizado nesta atualização:'
        );

        if (descricao === null || !descricao.trim()) return;

        const numero = Number(percentual);

        if (!Number.isInteger(numero) || numero < 0 || numero > 100) {
            notificar('Informe um percentual inteiro entre 0 e 100.');
            return;
        }

        try {
            const resposta = await fetch(
                `/api/projetos/${encodeURIComponent(idProjeto)}/progresso`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        percentual: numero,
                        descricao
                    })
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) throw new Error(dados.message);

            notificar('Progresso atualizado!');
            await carregarProjetos();

        } catch (erro) {
            notificar(erro.message);
        }

        return;
    }

    // Enviar entrega final
    if (botao.dataset.action === 'submit-delivery') {
        if (!confirm('Deseja enviar a entrega final deste projeto?')) {
            return;
        }

        const descricao = prompt(
            'Descreva o que foi desenvolvido e entregue:'
        );

        if (descricao === null || !descricao.trim()) return;

        const link = prompt(
            'Cole o link da entrega (GitHub, Google Drive, site etc.):'
        );

        if (link === null || !link.trim()) return;

        try {
            const resposta = await fetch(
                `/api/projetos/${encodeURIComponent(idProjeto)}/entrega`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ descricao, link })
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) throw new Error(dados.message);

            notificar('Entrega enviada para aprovação!');
            await carregarProjetos();

        } catch (erro) {
            notificar(erro.message);
        }
    }
});

// Pesquisa superior
$('#search')?.addEventListener('input', event => {
    if (busca) {
        busca.value = event.target.value;
        aplicarFiltros();
    }
});

// Logout
$('#sair')?.addEventListener('click', event => {
    event.preventDefault();
    logout();
});

// Inicialização
carregarProjetos();
