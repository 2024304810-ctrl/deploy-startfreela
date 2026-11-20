
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
let habilidadesSelecionadas = [];

// =====================================================
// FUNÇÕES AUXILIARES
// =====================================================

function escapar(valor) {
    return String(valor ?? '').replace(/[&<>"']/g, caractere => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[caractere]);
}

function numero(valor) {
    if (typeof valor === 'number') return valor;

    const limpo = String(valor ?? '')
        .replace(/[^\d,.-]/g, '')
        .replace(/\.(?=\d{3}(?:,|$))/g, '')
        .replace(',', '.');

    return Number(limpo) || 0;
}

function moeda(valor) {
    return numero(valor).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function linkPerfilCliente(projeto) {
    if (!projeto.idCliente) {
        return escapar(projeto.clienteUsername || 'Cliente');
    }

    const url = `/technical.profile?i=${encodeURIComponent(projeto.idCliente)}`;

    return `
        <a href="${url}" title="Ver perfil do cliente">
            ${escapar(projeto.clienteUsername || 'Cliente')}
        </a>
    `;
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

// =====================================================
// CONFIGURAÇÃO DOS FILTROS
// =====================================================

function configurarEstilosFiltros() {
    if ($('#project-filters-dynamic-style')) return;

    const estilo = document.createElement('style');
    estilo.id = 'project-filters-dynamic-style';

    estilo.textContent = `
        .project-skill-filter {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 7px;
            min-height: 44px;
            padding: 8px;
            border: 1px solid #dfe2e8;
            border-radius: 9px;
            background: #fff;
            cursor: text;
        }

        .project-skill-filter:focus-within {
            border-color: #1c2a4e;
            box-shadow: 0 0 0 2px rgba(28,42,78,.08);
        }

        .project-skill-filter input {
            flex: 1;
            min-width: 100px;
            width: 100%;
            border: none !important;
            outline: none !important;
            box-shadow: none !important;
            padding: 5px !important;
            background: transparent;
        }

        .project-skill-chip {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            padding: 6px 9px;
            border-radius: 20px;
            background: #eef0f3;
            color: #1c2a4e;
            font-size: 12px;
            font-weight: 600;
        }

        .project-skill-chip button {
            border: none;
            background: none;
            color: #565b6b;
            cursor: pointer;
            font-size: 15px;
            line-height: 1;
            padding: 0;
        }

        .project-filter-hint {
            display: block;
            margin-top: 5px;
            color: #777;
            font-size: 11px;
        }
    `;

    document.head.appendChild(estilo);
}


function configurarFiltroCategoria() {
    const campoOriginal = $('#category-filter');

    if (!campoOriginal) return;

    let input = campoOriginal;

    if (campoOriginal.tagName !== 'INPUT') {
        input = document.createElement('input');

        input.type = 'text';
        input.id = 'category-filter';
        input.className = campoOriginal.className;

        campoOriginal.replaceWith(input);
    }

    input.placeholder = 'Digite ou selecione uma categoria';
    input.setAttribute('list', 'project-category-options');
    input.autocomplete = 'off';

    let datalist = $('#project-category-options');

    if (!datalist) {
        datalist = document.createElement('datalist');
        datalist.id = 'project-category-options';
        input.insertAdjacentElement('afterend', datalist);
    }

    input.addEventListener('input', aplicarFiltros);
}


function configurarFiltroHabilidades() {
    const campoOriginal = $('#skills-filter');

    if (
        !campoOriginal ||
        campoOriginal.parentElement.classList.contains('project-skill-filter')
    ) {
        return;
    }

    const container = document.createElement('div');
    container.className = 'project-skill-filter';

    const etiquetas = document.createElement('div');
    etiquetas.className = 'project-skill-tags';
    etiquetas.style.display = 'contents';

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'skills-filter';
    input.placeholder = 'Digite uma habilidade e pressione Enter';
    input.autocomplete = 'off';

    campoOriginal.replaceWith(container);
    container.append(etiquetas, input);

    const dica = document.createElement('small');
    dica.className = 'project-filter-hint';
    dica.textContent = 'Pressione Enter para adicionar uma habilidade.';

    container.insertAdjacentElement('afterend', dica);

    input.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ',') {
            event.preventDefault();

            const habilidade = input.value.trim().replace(/,$/, '');

            if (!habilidade) return;

            const jaExiste = habilidadesSelecionadas.some(
                item => item.toLowerCase() === habilidade.toLowerCase()
            );

            if (!jaExiste) {
                habilidadesSelecionadas.push(habilidade);
                renderizarEtiquetasHabilidades();
                aplicarFiltros();
            }

            input.value = '';
        }

        if (
            event.key === 'Backspace' &&
            !input.value &&
            habilidadesSelecionadas.length
        ) {
            habilidadesSelecionadas.pop();
            renderizarEtiquetasHabilidades();
            aplicarFiltros();
        }
    });

    container.addEventListener('click', () => input.focus());

    renderizarEtiquetasHabilidades();
}

function renderizarEtiquetasHabilidades() {
    const container = $('.project-skill-tags');

    if (!container) return;

    container.innerHTML = habilidadesSelecionadas.map((habilidade, indice) => `
        <span class="project-skill-chip">
            ${escapar(habilidade)}
            <button
                type="button"
                data-remove-skill="${indice}"
                aria-label="Remover ${escapar(habilidade)}">
                &times;
            </button>
        </span>
    `).join('');

    container.querySelectorAll('[data-remove-skill]').forEach(botao => {
        botao.addEventListener('click', event => {
            event.stopPropagation();

            const indice = Number(botao.dataset.removeSkill);

            habilidadesSelecionadas.splice(indice, 1);

            renderizarEtiquetasHabilidades();
            aplicarFiltros();
        });
    });
}

function configurarFiltros() {
    configurarEstilosFiltros();
    configurarFiltroCategoria();
    configurarFiltroHabilidades();
}

// =====================================================
// MODAL DE DETALHES
// =====================================================

function abrirDetalhes(projeto, tipo) {
    if (!modal || !modalTitle || !modalContent) return;

    modalTitle.textContent = projeto.titulo;

    const proposta = projeto.proposta;
    const entrega = projeto.entrega;

    const habilidades = Array.isArray(projeto.habilidades)
        ? projeto.habilidades
        : [];

    modalContent.innerHTML = `
        <p>
            <strong>Cliente:</strong>
            ${linkPerfilCliente(projeto)}
        </p>

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
            ${habilidades.map(h =>
        `<span>${escapar(h)}</span>`
    ).join('')}
        </div>

        ${proposta ? `
            <hr>
            <p><strong>Minha proposta:</strong> ${moeda(proposta.valor)}</p>
            <p><strong>Prazo proposto:</strong> ${escapar(proposta.prazoDias)} dias</p>
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

// =====================================================
// AVALIAÇÃO
// =====================================================

function mostrarFormularioAvaliacao(projeto) {
    if (!modal || !modalTitle || !modalContent) return;

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

modalContent?.addEventListener('click', event => {
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

modalContent?.addEventListener('submit', async event => {
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
                body: JSON.stringify({ nota, comentario })
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

modal?.addEventListener('click', event => {
    if (event.target === modal) fecharModal();
});

document.addEventListener('keydown', event => {
    if (event.key === 'Escape') fecharModal();
});

// =====================================================
// CARDS DOS PROJETOS
// =====================================================

function criarCard(projeto, tipo) {
    const proposta = projeto.proposta;

    const habilidades = Array.isArray(projeto.habilidades)
        ? projeto.habilidades
        : [];

    let status = 'Recebendo propostas';
    let classeStatus = 'status-open';
    let fatos = '';
    let acao = '';

    if (tipo === 'candidaturas') {
        status = proposta?.status === 'Pendente'
            ? 'Em análise'
            : (proposta?.status || 'Em análise');

        classeStatus = proposta?.status === 'Recusada'
            ? 'status-review'
            : 'status-open';

        fatos = `
            <span>
                <small>Minha proposta</small>
                <strong>${moeda(proposta?.valor)}</strong>
            </span>
            <span>
                <small>Prazo proposto</small>
                <strong>${escapar(proposta?.prazoDias)} dias</strong>
            </span>
        `;
    } else if (tipo === 'andamento') {
        status = projeto.status;
        classeStatus = projeto.status === 'Aguardando aprovação'
            ? 'status-review'
            : 'status-progress';

        fatos = `
            <span>
                <small>Progresso</small>
                <strong>${Number(projeto.progresso || 0)}%</strong>
            </span>
            <span>
                <small>Prazo desejado</small>
                <strong>${escapar(projeto.prazoDesejado)}</strong>
            </span>
        `;
    } else if (tipo === 'concluidos') {
        status = 'Concluído';
        classeStatus = 'status-done';

        fatos = `
            <span>
                <small>Projeto</small>
                <strong>Finalizado</strong>
            </span>
        `;

        if (!projeto.avaliado) {
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
            <span>
                <small>Orçamento</small>
                <strong>
                    ${moeda(projeto.orcamentoMinimo)} -
                    ${moeda(projeto.orcamentoMaximo)}
                </strong>
            </span>
            <span>
                <small>Prazo desejado</small>
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

    if (tipo === 'andamento' && projeto.status === 'Em andamento') {
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

    if (tipo === 'andamento' && projeto.status === 'Aguardando aprovação') {
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
            data-budget="${numero(projeto.orcamentoMaximo)}"
            data-title="${escapar(projeto.titulo).toLowerCase()}">

            <div class="opp-top">
                <div class="project-symbol code">
                    <i class="fa-solid fa-code"></i>
                </div>

                <div class="opp-title">
    <h2>${escapar(projeto.titulo)}</h2>

    <p class="client-profile">
        <i class="fa-regular fa-building"></i>
        ${linkPerfilCliente(projeto)}
    </p>

    <p class="project-category">
        <i class="fa-solid fa-layer-group"></i>
        ${escapar(projeto.categoria || 'Sem categoria')}
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
                ${habilidades.map(h =>
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

// =====================================================
// ORDENAÇÃO
// =====================================================

function dataProjeto(projeto) {
    const valor = projeto.dataPostagem;

    if (!valor) return 0;

    const dataNormal = new Date(valor);

    if (!Number.isNaN(dataNormal.getTime())) {
        return dataNormal.getTime();
    }

    const partes = String(valor).match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

    if (partes) {
        return new Date(
            Number(partes[3]),
            Number(partes[2]) - 1,
            Number(partes[1])
        ).getTime();
    }

    return 0;
}

function prazoEmDias(projeto) {
    const texto = String(projeto.prazoDesejado || '');
    const encontrado = texto.match(/\d+/);

    return encontrado ? Number(encontrado[0]) : Infinity;
}

function ordenarProjetos(listaProjetos) {
    const modo = $('#freelancer-sort')?.value || 'recentes';

    const copia = [...listaProjetos];

    if (modo === 'orcamento') {
        copia.sort((a, b) =>
            numero(b.orcamentoMaximo) - numero(a.orcamentoMaximo)
        );
    } else if (modo === 'prazo') {
        copia.sort((a, b) =>
            prazoEmDias(a) - prazoEmDias(b)
        );
    } else {
        copia.sort((a, b) =>
            dataProjeto(b) - dataProjeto(a)
        );
    }

    return copia;
}

// =====================================================
// INDICADORES E FILTROS
// =====================================================

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

        if (contador && projetos[tipo]) {
            contador.textContent = projetos[tipo].length;
        }
    });
}


function normalizarTexto(valor) {
    return String(valor ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase();
}

function aplicarFiltros() {
    if (!lista) return;

    const termo = normalizarTexto(busca?.value);

    const categoria = normalizarTexto(
        $('#category-filter')?.value
    );

    const orcamento = numero(
        $('#budget-filter')?.value || 0
    );

    const habilidades = habilidadesSelecionadas.map(
        normalizarTexto
    );

    const cards = $$('.opportunity-card', lista);

    cards.forEach(card => {
        const texto = normalizarTexto(card.textContent);

        const categoriaCard = normalizarTexto(
            card.dataset.category
        );

        const orcamentoCard = numero(
            card.dataset.budget || 0
        );

        const correspondePesquisa =
            !termo || texto.includes(termo);

        const correspondeCategoria =
            !categoria || categoriaCard === categoria;

        const correspondeOrcamento =
            orcamentoCard >= orcamento;

        const correspondeHabilidades =
            habilidades.every(habilidade =>
                texto.includes(habilidade)
            );

        const corresponde =
            correspondePesquisa &&
            correspondeCategoria &&
            correspondeOrcamento &&
            correspondeHabilidades;

        card.classList.toggle('hidden', !corresponde);
    });

    const possuiVisiveis = cards.some(card =>
        !card.classList.contains('hidden')
    );

    $('#freelancer-empty')?.classList.toggle(
        'hidden',
        possuiVisiveis
    );
}


// =====================================================
// RENDERIZAÇÃO
// =====================================================

function renderizarProjetos() {
    if (!lista) return;

    const listaAtual = ordenarProjetos(
        projetos[abaAtual] || []
    );

    lista.innerHTML = listaAtual.map(projeto =>
        criarCard(projeto, abaAtual)
    ).join('') + `
        <div class="empty-state ${listaAtual.length ? 'hidden' : ''}"
             id="freelancer-empty">
            <i class="fa-regular fa-folder-open"></i>
            <h3>Nenhum projeto encontrado</h3>
            <p>Não há projetos que correspondam aos filtros selecionados.</p>
        </div>
    `;

    aplicarFiltros();
}

// =====================================================
// BUSCAR PROJETOS NA API
// =====================================================

async function carregarProjetos() {
    try {
        const resposta = await fetch('/api/freelancer/projetos');
        const dados = await resposta.json();

       console.log(
    'DADOS COMPLETOS DO PROJETO:',
    JSON.stringify(dados.disponiveis[0], null, 2)
);

        if (!resposta.ok) {
            throw new Error(dados.message || 'Erro ao carregar projetos.');
        }

        const andamento = dados.andamento || [];
        const concluidos = dados.concluidos || [];

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

        // Atualiza as sugestões de categoria usando os projetos recebidos.
        const datalist = $('#project-category-options');

        if (datalist) {
            datalist.innerHTML = '';

            const categorias = [
                ...new Set(
                    Object.values(projetos)
                        .flat()
                        .map(p => String(p.categoria || '').trim())
                        .filter(Boolean)
                )
            ];

            categorias.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria;
                datalist.appendChild(option);
            });
        }

        atualizarIndicadores();
        renderizarProjetos();

    } catch (erro) {
        console.error('Erro ao carregar projetos:', erro);
        notificar(erro.message);
    }
}

// =====================================================
// ABAS
// =====================================================

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

// =====================================================
// EVENTOS DOS FILTROS
// =====================================================

busca?.addEventListener('input', aplicarFiltros);

$('#budget-filter')?.addEventListener('input', aplicarFiltros);

$('#freelancer-sort')?.addEventListener('change', renderizarProjetos);

$('#clear-filters')?.addEventListener('click', () => {
    const categoria = $('#category-filter');
    const orcamento = $('#budget-filter');
    const habilidade = $('#skills-filter');

    if (categoria) categoria.value = '';
    if (orcamento) orcamento.value = '';
    if (habilidade) habilidade.value = '';

    if (busca) busca.value = '';

    const pesquisaCabecalho = $('#search');

    if (pesquisaCabecalho) {
        pesquisaCabecalho.value = '';
    }

    habilidadesSelecionadas = [];

    renderizarEtiquetasHabilidades();
    aplicarFiltros();
});

// =====================================================
// DETALHES E AÇÕES DOS PROJETOS
// =====================================================

lista?.addEventListener('click', async event => {
    const botao = event.target.closest('[data-action]');

    if (!botao) return;

    const idProjeto = botao.dataset.id;

    const projeto = (projetos[abaAtual] || []).find(p =>
        String(p.idProjeto) === String(idProjeto)
    );

    if (!projeto) return;

    if (botao.dataset.action === 'evaluate') {
        mostrarFormularioAvaliacao(projeto);
        return;
    }

    if (botao.dataset.action === 'details') {
        abrirDetalhes(projeto, abaAtual);
        return;
    }

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

        const numeroPercentual = Number(percentual);

        if (
            !Number.isInteger(numeroPercentual) ||
            numeroPercentual < 0 ||
            numeroPercentual > 100
        ) {
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
                        percentual: numeroPercentual,
                        descricao
                    })
                }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.message || 'Erro ao atualizar progresso.');
            }

            notificar('Progresso atualizado!');
            await carregarProjetos();

        } catch (erro) {
            notificar(erro.message);
        }

        return;
    }

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

            if (!resposta.ok) {
                throw new Error(dados.message || 'Erro ao enviar entrega.');
            }

            notificar('Entrega enviada para aprovação!');
            await carregarProjetos();

        } catch (erro) {
            notificar(erro.message);
        }
    }
});

// =====================================================
// PESQUISA DO CABEÇALHO
// =====================================================

$('#search')?.addEventListener('input', event => {
    if (busca) {
        busca.value = event.target.value;
        aplicarFiltros();
    }
});

// =====================================================
// LOGOUT
// =====================================================

$('#sair')?.addEventListener('click', event => {
    event.preventDefault();
    logout();
});

// =====================================================
// INICIALIZAÇÃO
// =====================================================

configurarFiltros();
carregarProjetos();
