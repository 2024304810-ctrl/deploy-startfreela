
import logout from '/js.utils/logout.js';
import parseJwt from '/js.utils/parseJwt.js';

const token = localStorage.getItem('token');
const usuario = parseJwt(token);

const grid = document.querySelector('.freelancers-grid');

let freelancersOriginais = [];
let habilidadesSelecionadas = [];

// ==========================================
// CABEÇALHO E LOGOUT
// ==========================================

document.getElementById('sair')?.addEventListener('click', () => {
    logout();
});

const usuarioRole = document.querySelector('.role-pill');

if (usuarioRole) {
    usuarioRole.textContent = usuarioRole.textContent.toUpperCase();
}

// ==========================================
// ELEMENTOS DOS FILTROS
// ==========================================

const campoProfissao = document.getElementById('filtro-profissao');
const campoHabilidade = document.getElementById('filtro-habilidade-input');
const campoPrecoMin = document.getElementById('filtro-preco-min');
const campoPrecoMax = document.getElementById('filtro-preco-max');
const campoAvaliacao = document.getElementById('filtro-avaliacao');
const campoPesquisa = document.getElementById('search');

const containerHabilidades = document.getElementById(
    'habilidades-selecionadas'
);

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

function escaparHTML(valor) {
    return String(valor ?? '').replace(/[&<>"']/g, caractere => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[caractere]);
}

function converterPreco(valor) {
    if (typeof valor === 'number') {
        return valor;
    }

    let texto = String(valor ?? '')
        .replace(/[^\d,.-]/g, '');

    if (!texto) {
        return 0;
    }

    if (texto.includes(',')) {
        texto = texto.replace(/\./g, '').replace(',', '.');
    }

    return Number(texto) || 0;
}

function obterHabilidades(freelancer) {
    if (!Array.isArray(freelancer.habilidades)) {
        return [];
    }

    return freelancer.habilidades
        .map(habilidade => {
            if (typeof habilidade === 'string') {
                return habilidade;
            }

            return habilidade?.habilidade || '';
        })
        .filter(Boolean);
}

// ==========================================
// RENDERIZAR ETIQUETAS DE HABILIDADES
// ==========================================

function renderizarHabilidadesSelecionadas() {
    if (!containerHabilidades) return;

    containerHabilidades.innerHTML = '';

    habilidadesSelecionadas.forEach((habilidade, indice) => {
        const chip = document.createElement('span');
        chip.className = 'skill-filter-chip';

        const nome = document.createElement('span');
        nome.textContent = habilidade;

        const remover = document.createElement('button');
        remover.type = 'button';
        remover.textContent = '×';
        remover.setAttribute(
            'aria-label',
            `Remover ${habilidade}`
        );

        remover.addEventListener('click', () => {
            habilidadesSelecionadas.splice(indice, 1);

            renderizarHabilidadesSelecionadas();
            aplicarFiltros();
        });

        chip.append(nome, remover);
        containerHabilidades.appendChild(chip);
    });
}

// ==========================================
// ADICIONAR HABILIDADES COM ENTER
// ==========================================

campoHabilidade?.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ',') {
        return;
    }

    event.preventDefault();

    const habilidade = campoHabilidade.value.trim();

    if (!habilidade) return;

    const jaExiste = habilidadesSelecionadas.some(item =>
        item.toLowerCase() === habilidade.toLowerCase()
    );

    if (!jaExiste) {
        habilidadesSelecionadas.push(habilidade);

        renderizarHabilidadesSelecionadas();
        aplicarFiltros();
    }

    campoHabilidade.value = '';
});

// ==========================================
// CRIAR CARD DE FREELANCER
// ==========================================

function criarCard(freelancer) {
    const card = document.createElement('article');

    card.className = 'freelancer-card';

    const nome = escaparHTML(
        freelancer.completeName ||
        freelancer.username ||
        'Freelancer'
    );

    const profissao = escaparHTML(
        freelancer.profissao || 'Profissão não informada'
    );

    const habilidades = obterHabilidades(freelancer);

    const valor = escaparHTML(
        freelancer.quantia?.valor || 'Valor não informado'
    );

    const periodo = escaparHTML(
        freelancer.quantia?.per || ''
    );

    const nota = freelancer.avaliacoes?.nota;

    const quantidade =
        freelancer.avaliacoes?.quantidade_de_avaliacoes || 0;

    let avaliacaoHTML;

    if (quantidade > 0 && nota !== null && nota !== undefined) {
        avaliacaoHTML = `
            <span class="fc-rating">
                <i class="fa-solid fa-star"></i>
                ${Number(nota).toFixed(1)}
                <small>(${quantidade} avaliações)</small>
            </span>
        `;
    } else {
        avaliacaoHTML = `
            <span class="fc-rating fc-sem-avaliacao">
                Sem avaliações
            </span>
        `;
    }

    card.innerHTML = `
        <div class="fc-top">

            <div class="fc-avatar">
                <img src="/img/foto-do-perfil.png" alt="">
            </div>

            ${avaliacaoHTML}

        </div>

        <h3 class="fc-nome">${nome}</h3>

        <p class="fc-profissao">${profissao}</p>

        <div class="tags">
            ${habilidades.map(habilidade => `
                <span class="tag">
                    ${escaparHTML(habilidade)}
                </span>
            `).join('')}
        </div>

        <div class="fc-bottom">

            <span class="fc-preco">
                ${valor}
                <small>${periodo ? `/${periodo}` : ''}</small>
            </span>

            <button
                class="btn-primary btn-sm btn-profile"
                type="button"
            >
                Ver Perfil
            </button>

        </div>
    `;

    card.querySelector('.btn-profile').addEventListener('click', () => {
        window.location.href =
            `/technical.profile?i=${encodeURIComponent(freelancer.idUser)}`;
    });

    return card;
}

// ==========================================
// APLICAR FILTROS
// ==========================================

function aplicarFiltros() {
    if (!grid) return;

    const profissao = (
        campoProfissao?.value || ''
    ).toLowerCase().trim();

    const termoPesquisa = (
        campoPesquisa?.value || ''
    ).toLowerCase().trim();

    const precoMin = Number(
        campoPrecoMin?.value || 0
    );

    const precoMaxTexto = campoPrecoMax?.value || '';

    const precoMax = precoMaxTexto === ''
        ? Infinity
        : Number(precoMaxTexto);

    const avaliacaoMinima = Number(
        campoAvaliacao?.value || 0
    );

    const habilidadesFiltro = habilidadesSelecionadas.map(
        habilidade => habilidade.toLowerCase()
    );

    const filtrados = freelancersOriginais.filter(freelancer => {

        const nome = String(
            freelancer.completeName ||
            freelancer.username ||
            ''
        ).toLowerCase();

        const profissaoFreelancer = String(
            freelancer.profissao || ''
        ).toLowerCase();

        const habilidades = obterHabilidades(freelancer);

        const habilidadesTexto = habilidades
            .join(' ')
            .toLowerCase();

        const preco = converterPreco(
            freelancer.quantia?.valor
        );

        const quantidade =
            freelancer.avaliacoes?.quantidade_de_avaliacoes || 0;

        const nota = freelancer.avaliacoes?.nota;

        // Pesquisa geral
        const correspondePesquisa =
            !termoPesquisa ||
            `${nome} ${profissaoFreelancer} ${habilidadesTexto}`
                .includes(termoPesquisa);

        // Profissão digitada
        const correspondeProfissao =
            !profissao ||
            profissaoFreelancer.includes(profissao);

        // Todas as habilidades selecionadas
        const correspondeHabilidade =
            habilidadesFiltro.every(habilidade =>
                habilidadesTexto.includes(habilidade)
            );

        // Faixa de preço
        const correspondePreco =
            preco >= precoMin &&
            preco <= precoMax;

        // Avaliação mínima
        const correspondeAvaliacao =
            !avaliacaoMinima ||
            (
                quantidade > 0 &&
                nota !== null &&
                nota !== undefined &&
                Number(nota) >= avaliacaoMinima
            );

        return (
            correspondePesquisa &&
            correspondeProfissao &&
            correspondeHabilidade &&
            correspondePreco &&
            correspondeAvaliacao
        );
    });

    grid.innerHTML = '';

    if (filtrados.length === 0) {
        grid.innerHTML = `
            <p class="fc-empty">
                Nenhum freelancer encontrado com esses filtros.
            </p>
        `;

        return;
    }

    filtrados.forEach(freelancer => {
        grid.appendChild(criarCard(freelancer));
    });
}

// ==========================================
// BUSCAR FREELANCERS NO BANCO
// ==========================================

async function buscarFreelancers() {
    try {
        const resposta = await fetch('/api/buscarFreelancers');

        if (!resposta.ok) {
            throw new Error(
                'Não foi possível buscar os freelancers.'
            );
        }

        const dados = await resposta.json();

        console.log('Freelancers recebidos:', dados);

        const idUsuarioAtual = String(
            usuario?.idUser ?? usuario?.id ?? ''
        );

        // Não exibir o próprio usuário
        freelancersOriginais = dados.filter(freelancer =>
            String(freelancer.idUser) !== idUsuarioAtual
        );

        aplicarFiltros();

    } catch (erro) {
        console.error('Erro ao buscar freelancers:', erro);

        if (grid) {
            grid.innerHTML = `
                <p class="fc-empty">
                    Não foi possível carregar os freelancers.
                </p>
            `;
        }
    }
}

// ==========================================
// EVENTOS DOS FILTROS
// ==========================================

[
    campoProfissao,
    campoPrecoMin,
    campoPrecoMax,
    campoAvaliacao,
    campoPesquisa
].forEach(campo => {
    campo?.addEventListener('input', aplicarFiltros);
    campo?.addEventListener('change', aplicarFiltros);
});

// ==========================================
// LIMPAR TODOS OS FILTROS
// ==========================================

document
    .getElementById('limpar-filtros-freelancer')
    ?.addEventListener('click', () => {

        if (campoProfissao) {
            campoProfissao.value = '';
        }

        if (campoPrecoMin) {
            campoPrecoMin.value = '';
        }

        if (campoPrecoMax) {
            campoPrecoMax.value = '';
        }

        if (campoAvaliacao) {
            campoAvaliacao.value = '';
        }

        if (campoPesquisa) {
            campoPesquisa.value = '';
        }

        if (campoHabilidade) {
            campoHabilidade.value = '';
        }

        habilidadesSelecionadas = [];

        renderizarHabilidadesSelecionadas();
        aplicarFiltros();
    });

// ==========================================
// INICIALIZAÇÃO
// ==========================================

buscarFreelancers();
