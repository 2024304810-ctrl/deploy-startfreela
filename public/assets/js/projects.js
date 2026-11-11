import logout from '/js.utils/logout.js';
import parseJwt from '/js.utils/parseJwt.js';

const token = localStorage.getItem('token');
const usuario = parseJwt(token);

console.log('usuario do token:', usuario);
/* =========================================================
   1. CONFIGURAÇÕES E ELEMENTOS DO DOM
========================================================= */

const $ = (selector, root = document) =>
    root.querySelector(selector);

const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];

const role = (document.body.dataset.role || '').toLowerCase();
const isClient = role.includes('cliente');

const modal = $('#project-modal');
const modalTitle = $('#modal-title');
const modalContent = $('#modal-content');
const toast = $('#toast');

let toastTimer;


/* =========================================================
   2. NOTIFICAÇÕES (TOAST)
========================================================= */

function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.remove('hidden');

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.add('hidden');
    }, 3200);
}


/* =========================================================
   3. CONTROLE DOS MODAIS
========================================================= */

function openModal(title, html) {
    if (!modal || !modalTitle || !modalContent) return;

    modalTitle.textContent = title;
    modalContent.innerHTML = html;

    const isPublishing = title.toLowerCase().includes('publicar');

    modal.classList.toggle('publish-modal', isPublishing);
    modal.classList.remove('hidden');

    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal?.classList.add('hidden');
    modal?.classList.remove('publish-modal');

    modal?.setAttribute('aria-hidden', 'true');

    document.body.style.overflow = '';
}

// Fechar pelo botão
$('#close-modal')?.addEventListener('click', closeModal);

// Fechar clicando fora do conteúdo
modal?.addEventListener('click', event => {
    if (event.target === modal) {
        closeModal();
    }
});

// Fechar pressionando ESC
document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
        closeModal();
    }
});


/* =========================================================
   4. MENU DA CONTA
========================================================= */

const avatarButton = $('#avatar-menu-button');
const avatarDropdown = $('#avatar-dropdown');

avatarButton?.addEventListener('keydown', event => {
    const isActivationKey = ['Enter', ' '].includes(event.key);

    if (!isActivationKey || !avatarDropdown) return;

    event.preventDefault();
    avatarDropdown.classList.toggle('open');
});

$('#sair')?.addEventListener('click', event => {
    event.preventDefault();
    logout();
});


/* =========================================================
   5. PUBLICAÇÃO DE PROJETOS
========================================================= */

const publishForm = `
    <div class="modal-notice">
        <i class="fa-solid fa-circle-info"></i>

        Esta tela é a proposta visual da funcionalidade.
        A publicação real precisa ser conectada ao backend
        e ao banco de dados.
    </div>

    <form id="publish-project-form">

        <div class="form-grid">

            <div class="form-field full">
                <label for="new-title">Título do projeto *</label>

                <input
                    id="new-title"
                    name="titulo"
                    required
                    maxlength="100"
                    placeholder="Ex.: Criar site para minha empresa"
                >
            </div>


            <div class="form-field">
                <label for="new-category">Categoria *</label>

                <select id="new-category" name="categoria" required>
                    <option value="">Selecione</option>
                    <option>Desenvolvimento Web</option>
                    <option>Design</option>
                    <option>Aplicativos</option>
                    <option>Dados</option>
                    <option>Redação</option>
                    <option>Marketing</option>
                    <option>Outro</option>
                </select>
            </div>


            <div class="form-field">
                <label for="new-deadline">Prazo desejado *</label>

                <input
                    id="new-deadline"
                    name="prazo"
                    type="date"
                    required
                >
            </div>


            <div class="form-field">
                <label for="new-min-budget">Orçamento mínimo (R$) *</label>

                <input
                    id="new-min-budget"
                    name="orcamentoMin"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    placeholder="500"
                >
            </div>


            <div class="form-field">
                <label for="new-max-budget">Orçamento máximo (R$) *</label>

                <input
                    id="new-max-budget"
                    name="orcamentoMax"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    placeholder="1200"
                >
            </div>


            <div class="form-field full">
                <label for="new-description">Descrição detalhada *</label>

                <textarea
                    id="new-description"
                    name="descricao"
                    required
                    minlength="30"
                    placeholder="Explique o objetivo, o que precisa ser desenvolvido e os requisitos..."
                ></textarea>

                <span class="form-help">
                    Inclua informações suficientes para que os freelancers
                    estimem o trabalho.
                </span>
            </div>


            <div class="form-field full">
                <label for="new-skills">Habilidades desejadas</label>

                <input
                    id="new-skills"
                    autocomplete="off"
                    placeholder="Digite uma habilidade e pressione Enter"
                >

                <span class="form-help">
                    Ex.: HTML, CSS, JavaScript, Figma.
                    Você pode adicionar várias.
                </span>

                <div
                    id="new-skills-list"
                    class="project-skill-chips"
                    aria-live="polite"
                ></div>
            </div>


            <div class="form-field full">
                <label for="new-files">
                    Arquivos de referência (opcional)
                </label>

                <label class="project-upload-zone" for="new-files">
                    <i class="fa-solid fa-cloud-arrow-up"></i>

                    <strong>Clique para selecionar arquivos</strong>

                    <span>
                        Você pode selecionar mais de um arquivo.
                    </span>
                </label>

                <input
                    id="new-files"
                    class="project-file-input"
                    name="anexos"
                    type="file"
                    multiple
                >

                <div
                    id="new-files-list"
                    class="project-file-list"
                    aria-live="polite"
                ></div>
            </div>

        </div>


        <div class="modal-actions">

            <button
                type="button"
                class="btn btn-outline"
                id="cancel-publish"
            >
                Cancelar
            </button>

            <button
                type="button"
                class="btn btn-outline"
                id="save-draft"
            >
                Salvar rascunho
            </button>

            <button
                type="submit"
                class="btn btn-primary"
            >
                <i class="fa-solid fa-bullhorn"></i>
                Publicar projeto
            </button>

        </div>

    </form>
`;


/* =========================================================
   6. ABRIR FORMULÁRIO DE PUBLICAÇÃO
========================================================= */

function showPublishForm() {
    openModal('Publicar novo projeto', publishForm);
}

$('#open-publish')?.addEventListener('click', showPublishForm);
$('#empty-publish')?.addEventListener('click', showPublishForm);

function showEditProjectForm(projeto) {

    openModal('Editar projeto', publishForm);

    const form = $('#publish-project-form');

    if (!form) return;

    // Preencher os campos atuais
    $('#new-title', form).value = projeto.titulo || '';
    $('#new-category', form).value = projeto.categoria || '';
    $('#new-deadline', form).value = projeto.prazoDesejado || '';
    $('#new-min-budget', form).value = projeto.orcamentoMinimo || '';
    $('#new-max-budget', form).value = projeto.orcamentoMaximo || '';
    $('#new-description', form).value = projeto.descricao || '';

    // Marca que esse formulário está editando
    form.dataset.editProjectId = projeto.idProjeto;

    // Habilidades atuais
    form._projectSkills = [...(projeto.habilidades || [])];

    renderProjectSkills(form);

    // Mudar texto do botão
    const submitButton = form.querySelector(
        'button[type="submit"]'
    );

    if (submitButton) {
        submitButton.innerHTML = `
            <i class="fa-solid fa-floppy-disk"></i>
            Salvar alterações
        `;
    }
}

/* =========================================================
   7. HABILIDADES DO PROJETO
========================================================= */

let listHabilidades = [];

function renderProjectSkills(form) {
    const list = $('#new-skills-list', form);

    if (!list) return;

    const skills = form._projectSkills || [];

    list.innerHTML = skills.map((skill, index) => `
        <span class="project-skill-chip">

            ${escapeHtml(skill)}

            <button
                type="button"
                data-remove-skill="${index}"
                aria-label="Remover ${escapeHtml(skill)}"
            >
                <i class="fa-solid fa-xmark"></i>
            </button>

        </span>
    `).join('');
}

function addProjectSkill(form, value) {

    const skill = value.trim().replace(/,$/, '');

    if (!skill) return;

    form._projectSkills ||= [];

    const alreadyExists = form._projectSkills.some(item =>
        item.toLowerCase() === skill.toLowerCase()
    );

    if (alreadyExists) return;

    form._projectSkills.push(skill);

    renderProjectSkills(form);
}


/* =========================================================
   8. ARQUIVOS DO PROJETO
========================================================= */

function getFileIcon(filename) {
    const extension = filename.split('.').pop().toLowerCase();

    const icons = {
        pdf: 'fa-file-pdf',

        png: 'fa-file-image',
        jpg: 'fa-file-image',
        jpeg: 'fa-file-image',
        gif: 'fa-file-image',
        webp: 'fa-file-image',

        doc: 'fa-file-word',
        docx: 'fa-file-word',

        zip: 'fa-file-zipper',
        rar: 'fa-file-zipper'
    };

    return icons[extension] || 'fa-file';
}

function formatFileSize(bytes) {
    if (bytes < 1024 * 1024) {
        return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    }

    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function renderProjectFiles(form) {
    const list = $('#new-files-list', form);

    if (!list) return;

    const files = form._projectFiles || [];

    list.innerHTML = files.map((file, index) => `
        <div class="project-file-item">

            <i class="fa-solid ${getFileIcon(file.name)}"></i>

            <span class="project-file-name">
                ${escapeHtml(file.name)}
            </span>

            <small>
                ${formatFileSize(file.size)}
            </small>

            <button
                type="button"
                data-remove-file="${index}"
                aria-label="Remover ${escapeHtml(file.name)}"
            >
                <i class="fa-solid fa-xmark"></i>
            </button>

        </div>
    `).join('');
}

function addProjectFiles(form, selectedFiles) {
    form._projectFiles ||= [];

    [...selectedFiles].forEach(file => {
        const alreadyExists = form._projectFiles.some(item =>
            item.name === file.name &&
            item.size === file.size &&
            item.lastModified === file.lastModified
        );

        if (!alreadyExists) {
            form._projectFiles.push(file);
        }
    });

    renderProjectFiles(form);
}


/* =========================================================
   9. EVENTOS DO FORMULÁRIO DE PUBLICAÇÃO
========================================================= */

// Eventos de clique
modalContent?.addEventListener('click', event => {

    const form = $('#publish-project-form');

    if (event.target.closest('#cancel-publish')) {
        closeModal();
        return;
    }

    // Salvar rascunho
    if (event.target.closest('#save-draft') && form) {
        const draft = Object.fromEntries(
            new FormData(form).entries()
        );

        draft.habilidades = [...(form._projectSkills || [])];

        draft.arquivos = (form._projectFiles || []).map(file =>
            file.name
        );

        try {
            sessionStorage.setItem(
                'startfreela-project-draft',
                JSON.stringify(draft)
            );
        } catch (_) {
            // O armazenamento pode estar indisponível.
        }

        showToast('Rascunho salvo nesta sessão do navegador.');
    }

    // Remover habilidade
    const removeSkill = event.target.closest('[data-remove-skill]');

    if (removeSkill && form) {
        const skills = form._projectSkills || [];

        skills.splice(Number(removeSkill.dataset.removeSkill), 1);

        renderProjectSkills(form);
    }

    // Remover arquivo
    const removeFile = event.target.closest('[data-remove-file]');

    if (removeFile && form) {
        const files = form._projectFiles || [];

        files.splice(Number(removeFile.dataset.removeFile), 1);

        renderProjectFiles(form);
    }
});


// Adicionar habilidades
modalContent?.addEventListener('keydown', event => {
    if (
        event.target.id !== 'new-skills' ||
        !['Enter', ','].includes(event.key)
    ) {
        return;
    }

    event.preventDefault();

    const form = $('#publish-project-form');

    if (!form) return;

    addProjectSkill(form, event.target.value);

    console.log('skill:', event.target.value);

    event.target.value = '';
});


// Selecionar arquivos
modalContent?.addEventListener('change', event => {
    if (event.target.id !== 'new-files') return;

    const form = $('#publish-project-form');

    if (!form) return;

    addProjectFiles(form, event.target.files);

    // Permite selecionar novamente o mesmo arquivo.
    event.target.value = '';
});

const hoje = new Date();
const dia = hoje.getDate();
const mes = hoje.getMonth() + 1;
const ano = hoje.getFullYear();
const dataHoje = `${ano}-${mes}-${dia}`;


// Enviar formulário
modalContent?.addEventListener('submit', async (e) => {
    if (e.target.id !== 'publish-project-form') return;

    e.preventDefault();

    const form = e.target;

    const minBudget = Number($('#new-min-budget')?.value || 0);
    const maxBudget = Number($('#new-max-budget')?.value || 0);

    if (maxBudget < minBudget) {
        showToast(
            'O orçamento máximo precisa ser igual ou maior que o mínimo.'
        );

        return;
    }

    // Pega as habilidades e arquivos do formulário
    const skills = form._projectSkills || [];
    const files = form._projectFiles || [];

    // Dados do formulário
    const title = document.getElementById('new-title').value;
    const categoria = document.getElementById('new-category').value;
    const prazoDesejado = document.getElementById('new-deadline').value;
    const orcamentoMinimo = document.getElementById('new-min-budget').value;
    const orcamentoMaximo = document.getElementById('new-max-budget').value;
    const descricao = document.getElementById('new-description').value;

    // ==========================================
    // VERIFICA SE ESTAMOS EDITANDO OU PUBLICANDO
    // ==========================================

    const idProjetoEditando = form.dataset.editProjectId;

    // Se existe ID -> EDITAR
    // Se não existe ID -> PUBLICAR
    const url = idProjetoEditando
        ? `/api/projetos/${encodeURIComponent(idProjetoEditando)}`
        : '/api/publish_project';

    const method = idProjetoEditando
        ? 'PUT'
        : 'POST';

    // ==========================================
    // REQUISIÇÃO
    // ==========================================

    try {

        const resposta = await fetch(url, {
            method: method,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                // Esses campos abaixo provavelmente continuam
                // sendo necessários apenas para PUBLICAR
                idCliente: usuario.id,
                clienteUsername: usuario.username,
                dataPostagem: dataHoje,

                // Dados do projeto
                titulo: title,
                categoria: categoria,
                prazoDesejado: prazoDesejado,
                orcamentoMinimo: orcamentoMinimo,
                orcamentoMaximo: orcamentoMaximo,
                descricao: descricao,

                // IMPORTANTE:
                // usa as habilidades do formulário atual
                habilidades: skills
            })
        });

        const dados = await resposta.json();

        console.log(dados);

        if (!resposta.ok) {

            showToast(
                dados.message || 'Ocorreu um erro ao salvar o projeto.'
            );

            return;
        }

        showToast(
            idProjetoEditando
                ? 'Projeto atualizado com sucesso!'
                : 'Projeto publicado com sucesso!'
        );

        // Limpa a marcação de edição
        delete form.dataset.editProjectId;

        // Recarrega para atualizar os projetos
        window.location.reload();

    } catch (erro) {

        console.error('Erro ao salvar projeto:', erro);

        showToast(
            'Não foi possível conectar ao servidor.'
        );
    }
});


/* =========================================================
   10. FUNÇÕES AUXILIARES
========================================================= */

function escapeHtml(value) {
    const characters = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };

    return String(value).replace(/[&<>"']/g, character =>
        characters[character]
    );
}

function updateActiveTab(selector, selectedTab) {
    $$(selector).forEach(tab => {
        tab.classList.toggle('active', tab === selectedTab);
    });
}

function showEvaluationForm(projeto) {

    const nomeAvaliado = isClient
        ? projeto.freelancerUsernameContratado
        : projeto.clienteUsername;

    const tipoAvaliado = isClient
        ? 'freelancer'
        : 'cliente';

    openModal(
        `Avaliar ${tipoAvaliado}`,
        `
        <div class="evaluation-form">

            <h3>
                Como foi sua experiência com
                ${escapeHtml(nomeAvaliado || tipoAvaliado)}?
            </h3>

            <p>
                Sua avaliação será registrada no perfil de
                ${tipoAvaliado === 'freelancer' ? 'freelancer' : 'cliente'}.
            </p>

            <form id="evaluation-form">

                <div class="form-field">
                    <label>Sua avaliação *</label>

                    <div class="star-rating">
                        ${[1, 2, 3, 4, 5].map(n => `
                            <button
                                type="button"
                                class="star"
                                data-rating="${n}"
                                aria-label="${n} estrela(s)">
                                ★
                            </button>
                        `).join('')}
                    </div>

                    <input
                        type="hidden"
                        id="evaluation-rating"
                        value="">
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
        `
    );

    modalContent.dataset.evaluationProjectId = projeto.idProjeto;
}

/* =========================================================
   11. FUNCIONALIDADES DO CLIENTE
========================================================= */


if (isClient) {

    let clientFilter = 'todos';
    let meusProjetos = [];

    const search = $('#client-search');
    const projectList = $('#client-project-list');

    const statusMap = {
        'Aberto': {
            filtro: 'publicado',
            texto: 'Recebendo propostas',
            classe: 'status-open'
        },
        'Em andamento': {
            filtro: 'andamento',
            texto: 'Em andamento',
            classe: 'status-progress'
        },
        'Aguardando aprovação': {
            filtro: 'aprovacao',
            texto: 'Aguardando aprovação',
            classe: 'status-review'
        },
        'Concluído': {
            filtro: 'concluido',
            texto: 'Concluído',
            classe: 'status-done'
        }
    };
    function obterStatusProjeto(statusProjeto) {
        const statusNormalizado = String(statusProjeto || 'Aberto')
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();

        const equivalencias = {
            'aberto': 'Aberto',
            'em andamento': 'Em andamento',
            'aguardando aprovacao': 'Aguardando aprovação',
            'concluido': 'Concluído'
        };

        const statusOriginal = equivalencias[statusNormalizado];

        return statusMap[statusOriginal] || null;
    }

    function atualizarContadores() {

        const contagens = {
            todos: meusProjetos.length,
            publicado: 0,
            andamento: 0,
            aprovacao: 0,
            concluido: 0
        };

        meusProjetos.forEach(projeto => {
            const status = obterStatusProjeto(projeto.status);
            if (status) contagens[status.filtro]++;
        });

        const stats = $$('.client-stats .stat-card strong');

        ['publicado', 'andamento', 'aprovacao', 'concluido']
            .forEach((filtro, indice) => {
                if (stats[indice]) {
                    stats[indice].textContent = contagens[filtro];
                }
            });

        $$('[data-client-filter]').forEach(tab => {
            const contador = tab.querySelector('span');
            const filtro = tab.dataset.clientFilter;

            if (contador) {
                contador.textContent = contagens[filtro];
            }
        });
    }

    function renderizarProjeto(projeto) {

        const status = obterStatusProjeto(projeto.status);

        if (!status) return '';

        const habilidades = (projeto.habilidades || [])
            .map(h => `<span>${escapeHtml(h)}</span>`)
            .join('');

        const contratado = projeto.idFreelancerContratado
            ? `<span>
                <i class="fa-solid fa-user-check"></i>
                Freelancer: ${escapeHtml(projeto.freelancerUsernameContratado || 'Contratado')}
               </span>`
            : '';

        const progresso = Number(projeto.progresso || 0);

        return `
            <article class="project-item"
                data-status="${status.filtro}"
                data-title="${escapeHtml(projeto.titulo).toLowerCase()}"
                data-project-id="${escapeHtml(projeto.idProjeto)}"
                data-date="${escapeHtml(projeto.dataPostagem || '')}">

                <div class="project-symbol code">
                    <i class="fa-solid fa-code"></i>
                </div>

                <div class="project-main">

                    <div class="project-heading">
                        <h2>${escapeHtml(projeto.titulo)}</h2>

                        <span class="status ${status.classe}">
                            <i></i>
                            ${status.texto}
                        </span>
                    </div>

                    <p class="project-description">
                        ${escapeHtml(projeto.descricao)}
                    </p>

                    <div class="tag-row">
                        ${habilidades}
                    </div>

                    <div class="project-meta">

                        <span>
                            <i class="fa-solid fa-wallet"></i>
                            Orçamento:
                            R$ ${escapeHtml(projeto.orcamentoMinimo)}
                            – R$ ${escapeHtml(projeto.orcamentoMaximo)}
                        </span>

                        <span>
                            <i class="fa-regular fa-calendar"></i>
                            Prazo: ${escapeHtml(projeto.prazoDesejado)}
                        </span>

                        ${contratado}

                    </div>

                    ${status.filtro === 'andamento' ||
                status.filtro === 'aprovacao' ? `
                        <div class="progress-line">
                            <span style="width:${Math.min(100, progresso)}%"></span>
                        </div>
                        <small>Progresso informado: ${progresso}%</small>
                    ` : ''}

                </div>

                <div class="project-actions">

    <button class="btn btn-outline btn-sm"
        data-action="details">
        Detalhes
    </button>

    ${status.filtro === 'publicado' ? `
        <button class="btn btn-primary btn-sm"
            data-action="proposals">
            Ver propostas
        </button>

        <button class="btn btn-outline btn-sm"
            data-action="edit">
            <i class="fa-solid fa-pen"></i>
            Editar
        </button>

        <button class="btn btn-outline btn-sm"
            data-action="delete">
            <i class="fa-solid fa-trash"></i>
            Excluir
        </button>
    ` : ''}

    ${status.filtro === 'aprovacao' ? `
        <button class="btn btn-primary btn-sm"
            data-action="view-delivery">
            Ver entrega e aprovar
        </button>
    ` : ''}

    ${projeto.status === 'Concluído' && !projeto.avaliado ? `
    <button class="btn btn-outline btn-sm"
        data-action="evaluate">
        <i class="fa-solid fa-star"></i>
        Avaliar Cliente
    </button>
` : ''}

</div>

            </article>
        `;
    }

    async function carregarMeusProjetos() {

        try {

            const resposta = await fetch('/api/meusProjetos');

            if (!resposta.ok) {
                throw new Error('Erro ao buscar projetos.');
            }

            meusProjetos = await resposta.json();

            console.log('PROJETOS RECEBIDOS:', meusProjetos);

            console.table(meusProjetos.map(projeto => ({
                titulo: projeto.titulo,
                status: projeto.status,
                idProjeto: projeto.idProjeto,
                avaliado: projeto.avaliado
            })));

            atualizarContadores();

            projectList.innerHTML = meusProjetos
                .map(renderizarProjeto)
                .join('') + `
                    <div class="empty-state hidden" id="client-empty">
                        <i class="fa-regular fa-folder-open"></i>
                        <h3>Nenhum projeto encontrado</h3>
                        <p>Tente mudar o filtro ou publicar uma nova oportunidade.</p>
                        <button class="btn btn-primary" id="empty-publish">
                            Publicar projeto
                        </button>
                    </div>
                `;

            aplicarFiltrosCliente();

        } catch (erro) {

            console.error(erro);
            showToast('Não foi possível carregar seus projetos.');

        }
    }

    function aplicarFiltrosCliente() {

        const termo = (search?.value || '').toLowerCase().trim();

        let visiveis = 0;

        $$('.project-item', projectList).forEach(card => {

            const correspondeStatus =
                clientFilter === 'todos' ||
                card.dataset.status === clientFilter;

            const correspondeBusca =
                card.dataset.title.includes(termo);

            const corresponde =
                correspondeStatus && correspondeBusca;

            card.classList.toggle('hidden', !corresponde);

            if (corresponde) visiveis++;
        });

        $('#client-empty')?.classList.toggle(
            'hidden',
            visiveis > 0
        );
    }


    // Abas
    $$('[data-client-filter]').forEach(tab => {

        tab.addEventListener('click', () => {

            updateActiveTab('[data-client-filter]', tab);

            clientFilter = tab.dataset.clientFilter;

            aplicarFiltrosCliente();
        });
    });

    search?.addEventListener('input', aplicarFiltrosCliente);

    // Ordenação
    $('#client-sort')?.addEventListener('change', event => {

        const cards = $$('.project-item', projectList);

        const modo = event.target.value;

        if (modo === 'titulo') {

            cards.sort((a, b) =>
                a.dataset.title.localeCompare(b.dataset.title)
            );

        } else if (modo === 'antigos') {

            cards.sort((a, b) =>
                a.dataset.date.localeCompare(b.dataset.date)
            );

        } else {

            cards.sort((a, b) =>
                b.dataset.date.localeCompare(a.dataset.date)
            );
        }

        cards.forEach(card => {
            projectList.insertBefore(card, $('#client-empty'));
        });
    });
    function showDelivery(projeto) {
        const entrega = projeto.entrega;

        if (!entrega?.descricao || !entrega?.link) {
            showToast('Este projeto ainda não possui uma entrega registrada.');
            return;
        }

        openModal('Entrega do projeto', `
        <h3>${escapeHtml(projeto.titulo)}</h3>

        <p><strong>Freelancer:</strong>
            ${escapeHtml(projeto.freelancerUsernameContratado)}
        </p>

        <hr>

        <p><strong>Descrição da entrega:</strong></p>
        <p>${escapeHtml(entrega.descricao)}</p>

        <p><strong>Link:</strong></p>

        <p>
            <a href="${escapeHtml(entrega.link)}"
               target="_blank" rel="noopener noreferrer">
                Acessar arquivos da entrega
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
        </p>

        <p><strong>Enviada em:</strong>
            ${entrega.dataEnvio
                ? new Date(entrega.dataEnvio).toLocaleString('pt-BR')
                : 'Não informado'}
        </p>

        <div class="modal-actions">
            <button class="btn btn-primary"
                data-modal-action="approve-delivery"
                data-project-id="${escapeHtml(projeto.idProjeto)}">
                <i class="fa-solid fa-check"></i>
                Aprovar entrega e concluir projeto
            </button>
        </div>
    `);
    }

    

    // Detalhes e propostas
    projectList.addEventListener('click', event => {

        if (event.target.closest('#empty-publish')) {
            showPublishForm();
            return;
        }

        const botao = event.target.closest('[data-action]');

        if (!botao) return;

        const card = botao.closest('.project-item');

        const projeto = meusProjetos.find(p =>
            p.idProjeto === card.dataset.projectId
        );

        if (!projeto) return;

        if (botao.dataset.action === 'proposals') {
            showProposals(projeto.idProjeto);
        }
        if (botao.dataset.action === 'view-delivery') {
            showDelivery(projeto);
        }

        if (botao.dataset.action === 'details') {

            const status = statusMap[projeto.status || 'Aberto'];

            openModal('Detalhes do projeto', `
    <h3>${escapeHtml(projeto.titulo)}</h3>

    <p><strong>Status:</strong> ${status.texto}</p>

    <p><strong>Descrição:</strong></p>
    <p>${escapeHtml(projeto.descricao)}</p>

    <p><strong>Categoria:</strong>
        ${escapeHtml(projeto.categoria)}
    </p>

    <p><strong>Orçamento:</strong>
        R$ ${escapeHtml(projeto.orcamentoMinimo)}
        - R$ ${escapeHtml(projeto.orcamentoMaximo)}
    </p>

    <p><strong>Prazo:</strong>
        ${escapeHtml(projeto.prazoDesejado)}
    </p>

    ${projeto.freelancerUsernameContratado ? `
        <p><strong>Freelancer contratado:</strong>
            ${escapeHtml(projeto.freelancerUsernameContratado)}
        </p>
    ` : ''}

    ${projeto.atualizacoesProgresso?.length ? `
        <hr>
        <h3>Histórico de atividades</h3>

        ${projeto.atualizacoesProgresso.map(item => `
            <div class="activity-item">
                <strong>${Number(item.percentual)}%</strong>
                <p>${escapeHtml(item.descricao)}</p>
                <small>
                    ${item.data
                    ? new Date(item.data).toLocaleString('pt-BR')
                    : ''}
                </small>
            </div>
        `).join('')}
    ` : '<p>Nenhuma atualização de progresso registrada.</p>'}
`);
        }

        if (botao.dataset.action === 'edit') {
            showEditProjectForm(projeto);
        }

        if (botao.dataset.action === 'delete') {
            deleteProject(projeto);
        }
        if (botao.dataset.action === 'evaluate') {
            showEvaluationForm(projeto);
        }
    });

    // Buscar propostas
    async function showProposals(idProjeto) {

        openModal('Propostas recebidas', '<p>Carregando propostas...</p>');

        try {

            const resposta = await fetch(
                `/api/projetos/${encodeURIComponent(idProjeto)}/propostas`
            );

            const propostas = await resposta.json();

            if (!resposta.ok) {
                throw new Error(propostas.message);
            }

            if (!propostas.length) {
                openModal('Propostas recebidas', `
                    <div class="empty-state">
                        <h3>Nenhuma proposta recebida</h3>
                        <p>As propostas dos freelancers aparecerão aqui.</p>
                    </div>
                `);
                return;
            }

            const html = propostas.map(proposta => `

                <div class="proposal-person">

                    <strong>${escapeHtml(proposta.freelancerUsername)}</strong>

                    <p>
                        Valor: R$ ${Number(proposta.valor).toFixed(2)}
                    </p>

                    <p>
                        Prazo: ${proposta.prazoDias} dias
                    </p>

                    <p>${escapeHtml(proposta.mensagem)}</p>

                    <span class="status">
                        ${escapeHtml(proposta.status)}
                    </span>

                    ${proposta.status === 'Pendente' ? `
                        <div class="modal-actions">
                            <button class="btn btn-primary"
                                data-modal-action="accept"
                                data-project-id="${escapeHtml(idProjeto)}"
                                data-proposal-id="${escapeHtml(proposta._id)}">
                                Aceitar proposta
                            </button>
                        </div>
                    ` : ''}

                </div>

            `).join('');

            openModal('Propostas recebidas', html);

        } catch (erro) {

            console.error(erro);

            openModal('Erro', `
                <p>${escapeHtml(erro.message)}</p>
            `);
        }
    }

    // Aceitar proposta
    modalContent?.addEventListener('click', async event => {

        const botao = event.target.closest(
            '[data-modal-action="accept"]'
        );

        if (!botao || botao.disabled) return;

        if (!confirm('Deseja realmente contratar este freelancer?')) {
            return;
        }

        const idProjeto = botao.dataset.projectId;
        const idProposta = botao.dataset.proposalId;

        botao.disabled = true;
        botao.textContent = 'Contratando...';

        try {

            const resposta = await fetch(
                `/api/projetos/${encodeURIComponent(idProjeto)}/propostas/${encodeURIComponent(idProposta)}/aceitar`,
                { method: 'POST' }
            );

            const resultado = await resposta.json();

            if (!resposta.ok) {
                throw new Error(resultado.message);
            }

            closeModal();

            showToast('Proposta aceita! O freelancer foi contratado.');

            await carregarMeusProjetos();

        } catch (erro) {

            alert(erro.message);

            botao.disabled = false;
            botao.textContent = 'Aceitar proposta';
        }
    });
    modalContent?.addEventListener('click', async event => {
        const botao = event.target.closest(
            '[data-modal-action="approve-delivery"]'
        );

        if (!botao || botao.disabled) return;

        if (!confirm(
            'Tem certeza que deseja aprovar esta entrega? O projeto será marcado como concluído.'
        )) {
            return;
        }

        const idProjeto = botao.dataset.projectId;

        botao.disabled = true;
        botao.textContent = 'Aprovando...';

        try {
            const resposta = await fetch(
                `/api/projetos/${encodeURIComponent(idProjeto)}/aprovar-entrega`,
                { method: 'POST' }
            );

            const dados = await resposta.json();

            if (!resposta.ok) {
                throw new Error(dados.message || 'Erro ao aprovar entrega.');
            }

            closeModal();
            showToast('Projeto concluído com sucesso!');

            await carregarMeusProjetos();

        } catch (erro) {
            showToast(erro.message);
            botao.disabled = false;
            botao.textContent = 'Aprovar entrega e concluir projeto';
        }
    });
    modalContent?.addEventListener('click', event => {

        const estrela = event.target.closest('[data-rating]');

        if (!estrela) return;

        const nota = Number(estrela.dataset.rating);

        const inputNota = $('#evaluation-rating');

        if (!inputNota) return;

        inputNota.value = nota;

        // Atualiza visual das estrelas
        $$('[data-rating]').forEach(item => {

            const valor = Number(item.dataset.rating);

            item.classList.toggle(
                'selected',
                valor <= nota
            );
        });
    });

    modalContent?.addEventListener('submit', async event => {

        if (event.target.id !== 'evaluation-form') {
            return;
        }

        event.preventDefault();

        const idProjeto =
            modalContent.dataset.evaluationProjectId;

        const nota = Number(
            $('#evaluation-rating')?.value || 0
        );

        const comentario =
            $('#evaluation-comment')?.value.trim() || '';

        if (nota < 1 || nota > 5) {

            showToast(
                'Selecione uma nota de 1 a 5 estrelas.'
            );

            return;
        }

        const botao = event.target.querySelector(
            'button[type="submit"]'
        );

        if (botao) {
            botao.disabled = true;
            botao.textContent = 'Enviando...';
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
                throw new Error(
                    dados.message ||
                    'Não foi possível enviar a avaliação.'
                );
            }

            closeModal();

            showToast(
                'Avaliação enviada com sucesso!'
            );

            await carregarMeusProjetos();

        } catch (erro) {

            console.error(erro);

            showToast(erro.message);

            if (botao) {
                botao.disabled = false;
                botao.innerHTML = `
                <i class="fa-solid fa-star"></i>
                Enviar avaliação
            `;
            }
        }
    });

    modalContent?.addEventListener('click', event => {

        const botao = event.target.closest(
            '[data-modal-action="skip-evaluation"]'
        );

        if (!botao) return;

        closeModal();

        showToast(
            'Você poderá avaliar o freelancer posteriormente.'
        );
    });
    // Inicialização
    carregarMeusProjetos();



} else {

    let freelancerTab = 'disponiveis';

    const search = $('#freelancer-search');
    const projectList = $('#freelancer-project-list');

    const statusByTab = {
        disponiveis: 'disponivel',
        candidaturas: 'candidatura',
        andamento: 'andamento',
        concluidos: 'concluidos'
    };


    /* -----------------------------------------------------
       FILTRAR PROJETOS
    ----------------------------------------------------- */

    function applyFreelancerFilters() {

        const term = (search?.value || '').trim().toLowerCase();

        const category = $('#category-filter')?.value || '';

        const budget = Number($('#budget-filter')?.value || 0);

        const skill = ($('#skills-filter')?.value || '')
            .trim()
            .toLowerCase();

        let visible = 0;

        $$('.opportunity-card').forEach(card => {

            const text = (
                (card.dataset.title || '') + ' ' + card.textContent
            ).toLowerCase();

            const matchesStatus =
                card.dataset.status === statusByTab[freelancerTab];

            const matchesSearch = text.includes(term);

            const matchesCategory =
                !category || card.dataset.category === category;

            const matchesBudget =
                Number(card.dataset.budget) >= budget;

            const matchesSkill =
                !skill || text.includes(skill);

            const matches =
                matchesStatus &&
                matchesSearch &&
                matchesCategory &&
                matchesBudget &&
                matchesSkill;

            card.classList.toggle('hidden', !matches);

            if (matches) visible++;
        });

        $('#freelancer-empty')?.classList.toggle(
            'hidden',
            visible > 0
        );
    }


    /* -----------------------------------------------------
       ORDENAR PROJETOS
    ----------------------------------------------------- */

    function sortFreelancerCards() {

        if (!projectList) return;

        const cards = $$('.opportunity-card', projectList);

        const mode = $('#freelancer-sort')?.value;

        const statusOrder = [
            'disponivel',
            'candidatura',
            'andamento',
            'concluidos'
        ];

        if (mode === 'orcamento') {

            cards.sort((a, b) =>
                Number(b.dataset.budget) -
                Number(a.dataset.budget)
            );

        } else if (mode === 'prazo') {

            cards.sort((a, b) => {

                const aStatus = a.dataset.status === 'andamento' ? -1 : 1;
                const bStatus = b.dataset.status === 'andamento' ? -1 : 1;

                return aStatus - bStatus;
            });

        } else {

            cards.sort((a, b) =>
                statusOrder.indexOf(a.dataset.status) -
                statusOrder.indexOf(b.dataset.status)
            );

        }

        cards.forEach(card => {
            projectList.insertBefore(card, $('#freelancer-empty'));
        });
    }


    /* -----------------------------------------------------
       EVENTOS DOS FILTROS
    ----------------------------------------------------- */

    search?.addEventListener('input', applyFreelancerFilters);

    [
        'category-filter',
        'budget-filter',
        'skills-filter'
    ].forEach(id => {

        $('#' + id)?.addEventListener('input', applyFreelancerFilters);

    });


    /* -----------------------------------------------------
       EVENTO DE ORDENAÇÃO
    ----------------------------------------------------- */

    $('#freelancer-sort')?.addEventListener('change', () => {

        sortFreelancerCards();

        applyFreelancerFilters();

    });


    /* -----------------------------------------------------
       LIMPAR FILTROS
    ----------------------------------------------------- */

    $('#clear-filters')?.addEventListener('click', () => {

        $('#category-filter').value = '';
        $('#budget-filter').value = '';
        $('#skills-filter').value = '';

        if (search) {
            search.value = '';
        }

        applyFreelancerFilters();

    });


    /* -----------------------------------------------------
       ABAS DO FREELANCER
    ----------------------------------------------------- */

    $$('[data-freelancer-filter]').forEach(tab => {

        tab.addEventListener('click', () => {

            updateActiveTab('[data-freelancer-filter]', tab);

            freelancerTab = tab.dataset.freelancerFilter;

            applyFreelancerFilters();

        });

    });


    /* -----------------------------------------------------
       SALVAR PROJETOS NOS FAVORITOS
    ----------------------------------------------------- */

    $$('.save-project').forEach(button => {

        button.addEventListener('click', () => {

            button.classList.toggle('saved');

            const isSaved = button.classList.contains('saved');

            button.innerHTML = isSaved
                ? '<i class="fa-solid fa-bookmark"></i>'
                : '<i class="fa-regular fa-bookmark"></i>';

            showToast(
                'Projeto salvo nos favoritos desta sessão.'
            );

        });

    });


    /* -----------------------------------------------------
       INICIALIZAÇÃO DOS PROJETOS
    ----------------------------------------------------- */

    const tituloProjeto = document.querySelector('#project-title');
    tituloProjeto.textContent = projeto.titulo;

    const cliente = document.querySelector('#project-client');
    c

    sortFreelancerCards();

    applyFreelancerFilters();

}


/* =========================================================
   13. PESQUISA GLOBAL
========================================================= */

$('#global-search')?.addEventListener('input', event => {

    const target = isClient
        ? $('#client-search')
        : $('#freelancer-search');

    if (!target) return;

    target.value = event.target.value;

    target.dispatchEvent(
        new Event('input', { bubbles: true })
    );

});

async function deleteProject(projeto) {

    const confirmar = confirm(
        `Tem certeza que deseja excluir o projeto "${projeto.titulo}"?`
    );

    if (!confirmar) return;

    try {

        const resposta = await fetch(
            `/api/projetos/${encodeURIComponent(projeto.idProjeto)}`,
            {
                method: 'DELETE'
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(
                dados.message || 'Erro ao excluir projeto.'
            );
        }

        showToast('Projeto excluído com sucesso!');

        window.location.reload();

    } catch (erro) {

        console.error(erro);

        showToast(
            erro.message || 'Não foi possível excluir o projeto.'
        );
    }
}