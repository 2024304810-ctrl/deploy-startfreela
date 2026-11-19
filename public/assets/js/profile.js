
import logout from '/js.utils/logout.js';

const { usuario } = window.dadosPagina;

const sair = document.getElementById('sair');

if (sair) {
    sair.addEventListener('click', logout);
}

const usuarioRole = document.querySelector('.role-pill');

if (usuarioRole) {
    usuarioRole.textContent = usuarioRole.textContent.toUpperCase();
}

const btnEditar = document.getElementById('btn-editProfile');

if (btnEditar) {
    btnEditar.addEventListener('click', () => {
        window.location.href = '/edit.profile';
    });
}

const btnAdicionarInfo = document.getElementById('btn-addInfo');

if (btnAdicionarInfo) {
    btnAdicionarInfo.addEventListener('click', () => {
        window.location.href = '/additional.information';
    });
}

const cardAdicionar = document.querySelector('.card-add-projeto');

if (cardAdicionar) {
    cardAdicionar.addEventListener('click', () => {
        window.location.href = '/add.project';
    });
}

// ================= HABILIDADES =================

const divHabilidades = document.querySelector('.chips');

divHabilidades.innerHTML = '';

(usuario.habilidades || []).forEach(habilidade => {
    const chip = document.createElement('span');

    chip.className = 'chip';
    chip.textContent = habilidade;

    divHabilidades.appendChild(chip);
});

// ================= REDES SOCIAIS =================

const divLinks = document.querySelector('.perfil-links');

divLinks.innerHTML = '';

(usuario.redesSociais || []).forEach(rede => {
    let icone = null;
    let nome = null;

    switch (String(rede.site).toLowerCase()) {
        case 'instagram':
            icone = 'fa-brands fa-instagram';
            nome = 'Instagram';
            break;

        case 'github':
            icone = 'fa-brands fa-github';
            nome = 'GitHub';
            break;

        default:
            return;
    }

    if (!rede.link) return;

    const link = document.createElement('a');

    link.className = 'link-externo';
    link.href = rede.link;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    const i = document.createElement('i');
    i.className = icone;

    link.appendChild(i);
    link.appendChild(document.createTextNode(` ${nome}`));

    divLinks.appendChild(link);
});

// ================= PORTFÓLIO =================

function validarLink(url) {
    if (!url) return null;

    try {
        const link = new URL(
            url.startsWith('http://') || url.startsWith('https://')
                ? url
                : `https://${url}`
        );

        if (!['http:', 'https:'].includes(link.protocol)) {
            return null;
        }

        return link.href;

    } catch {
        return null;
    }
}


function criarCardProjeto(projeto) {
    const card = document.createElement('div');

    card.className = 'card-projeto';
    card.style.cursor = 'pointer';

    const imagem = document.createElement('img');

    imagem.src = projeto.imagemCapa;
    imagem.alt = projeto.titulo || 'Projeto do portfólio';

    const informacoes = document.createElement('div');

    informacoes.className = 'info-projeto';

    const titulo = document.createElement('h4');

    titulo.textContent = projeto.titulo || 'Projeto sem título';

    const tags = document.createElement('div');

    tags.className = 'tags';

    (projeto.habilidades || []).forEach(habilidade => {
        const tag = document.createElement('span');

        tag.className = 'tag';
        tag.textContent = habilidade;

        tags.appendChild(tag);
    });

    informacoes.appendChild(titulo);
    informacoes.appendChild(tags);

    const linkProjeto = validarLink(projeto.links?.projeto);

    if (linkProjeto) {
        const link = document.createElement('a');

        link.href = linkProjeto;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = 'link-projeto';

        link.innerHTML = '<i class="fa-solid fa-link"></i> Ver link';

        informacoes.appendChild(link);

    } else {
        const linkGithub = validarLink(projeto.links?.github);

        if (linkGithub) {
            const link = document.createElement('a');

            link.href = linkGithub;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.className = 'link-projeto';

            link.innerHTML = '<i class="fa-brands fa-github"></i> Ver GitHub';

            informacoes.appendChild(link);
        }
    }

    // Abrir detalhes do projeto ao clicar no card
    card.addEventListener('click', () => {
        if (!projeto.idProjeto) {
            console.error('Projeto sem idProjeto:', projeto);
            return;
        }

        window.location.href =
            `/portfolio/projeto?p=${encodeURIComponent(projeto.idProjeto)}`;
    });

    // Evita que clicar em um link externo abra também os detalhes
    informacoes.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', evento => {
            evento.stopPropagation();
        });
    });

    card.appendChild(imagem);
    card.appendChild(informacoes);

    return card;
}


async function buscarProjetos() {
    const divProjetos = document.querySelector('.grid-portfolio');

    if (!divProjetos) return;

    // Mantém o botão de adicionar e remove apenas os cards antigos
    divProjetos.querySelectorAll('.card-projeto').forEach(card => {
        card.remove();
    });

    try {
        const resposta = await fetch('/api/buscarProjetos');

        if (!resposta.ok) {
            throw new Error('Não foi possível buscar os projetos.');
        }

        const projetos = await resposta.json();

        console.log('Projetos do portfólio:', projetos);

        projetos.forEach(projeto => {
            divProjetos.appendChild(criarCardProjeto(projeto));
        });

    } catch (erro) {
        console.error('Erro ao carregar portfólio:', erro);
    }
}

buscarProjetos();
