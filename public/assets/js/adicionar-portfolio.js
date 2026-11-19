
import logout from '/js.utils/logout.js';
import parseJwt from '/js.utils/parseJwt.js';

const token = localStorage.getItem('token');
const usuario = parseJwt(token);

const sair = document.getElementById('sair');

if (sair) {
    sair.addEventListener('click', logout);
}

const usuarioRole = document.querySelector('.role-pill');

if (usuarioRole) {
    usuarioRole.textContent = usuarioRole.textContent.toUpperCase();
}

document.addEventListener('DOMContentLoaded', () => {

    // ================= CAPA =================

    const capaUpload = document.getElementById('capaUpload');
    const capaInput = document.getElementById('capaInput');

    capaInput.addEventListener('change', () => {
        const arquivo = capaInput.files[0];

        if (!arquivo) return;

        const leitor = new FileReader();

        leitor.onload = (e) => {
            const placeholder = capaUpload.querySelector('.capa-placeholder');
            const preview = capaUpload.querySelector('.capa-preview');
            const trocar = capaUpload.querySelector('.capa-trocar');

            preview.src = e.target.result;
            preview.hidden = false;
            placeholder.hidden = true;
            trocar.hidden = false;

            capaUpload.classList.add('tem-imagem');
        };

        leitor.readAsDataURL(arquivo);
    });

    // ================= CARROSSEL =================

    const carrossel = document.getElementById('carrosselImagens');
    const btnAdicionarImagem = document.getElementById('btnAdicionarImagem');

    function ativarItemCarrossel(item) {
        const input = item.querySelector('.carrossel-input');
        const icone = item.querySelector('.carrossel-slot > i');
        const preview = item.querySelector('.carrossel-preview');

        input.addEventListener('change', () => {
            const arquivo = input.files[0];

            if (!arquivo) return;

            const leitor = new FileReader();

            leitor.onload = (e) => {
                preview.src = e.target.result;
                preview.hidden = false;
                icone.hidden = true;
            };

            leitor.readAsDataURL(arquivo);
        });

        item.querySelector('.carrossel-remover').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            item.remove();
        });
    }

    document.querySelectorAll(
        '#carrosselImagens .carrossel-item:not(.carrossel-add)'
    ).forEach(ativarItemCarrossel);

    function criarItemCarrossel() {
        const item = document.createElement('div');

        item.className = 'carrossel-item';

        item.innerHTML = `
            <label class="carrossel-slot">
                <input type="file" accept="image/*" class="carrossel-input" hidden>
                <i class="fa-solid fa-plus"></i>
                <img class="carrossel-preview" hidden alt="">
                <button type="button" class="carrossel-remover">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </label>

            <input type="text" class="field campo-legenda"
                placeholder="Descreva esta imagem...">
        `;

        ativarItemCarrossel(item);

        return item;
    }

    btnAdicionarImagem.addEventListener('click', () => {
        const novoItem = criarItemCarrossel();

        carrossel.insertBefore(novoItem, btnAdicionarImagem);

        novoItem.querySelector('.carrossel-input').click();

        carrossel.scrollTo({
            left: carrossel.scrollWidth,
            behavior: 'smooth'
        });
    });

    // ================= ANEXOS =================

    const anexoInput = document.getElementById('anexoInput');
    const listaAnexos = document.getElementById('listaAnexos');

    let anexosSelecionados = [];

    function formatarTamanho(bytes) {
        if (bytes < 1024) return `${bytes} B`;

        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(0)} KB`;
        }

        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    function iconePorTipo(nomeArquivo) {
        const ext = nomeArquivo.split('.').pop().toLowerCase();

        if (ext === 'pdf') return 'fa-file-pdf';

        if (['doc', 'docx'].includes(ext)) {
            return 'fa-file-word';
        }

        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
            return 'fa-file-image';
        }

        if (['zip', 'rar'].includes(ext)) {
            return 'fa-file-zipper';
        }

        return 'fa-file';
    }

    function renderizarAnexos() {
        listaAnexos.innerHTML = '';

        anexosSelecionados.forEach((arquivo, indice) => {
            const item = document.createElement('div');

            item.className = 'anexo-item';

            item.innerHTML = `
                <i class="fa-solid ${iconePorTipo(arquivo.name)}"></i>
                <span class="anexo-nome"></span>
                <span class="anexo-tamanho">
                    ${formatarTamanho(arquivo.size)}
                </span>
                <button type="button" class="anexo-remover" title="Remover">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            `;

            item.querySelector('.anexo-nome').textContent = arquivo.name;

            item.querySelector('.anexo-remover').addEventListener('click', () => {
                anexosSelecionados.splice(indice, 1);
                renderizarAnexos();
            });

            listaAnexos.appendChild(item);
        });
    }

    anexoInput.addEventListener('change', () => {
        anexosSelecionados.push(...Array.from(anexoInput.files));

        renderizarAnexos();

        anexoInput.value = '';
    });

    // ================= HABILIDADES =================

    const inputHabTec = document.getElementById('inputHabTec');
    const divChips = document.getElementById('div-chips');

    const habilidades = [];

    function renderizarHabilidades() {
        divChips.innerHTML = '';

        habilidades.forEach((habilidade, indice) => {
            const chip = document.createElement('span');

            chip.className = 'chip';

            const texto = document.createElement('span');
            texto.textContent = habilidade;

            const remover = document.createElement('i');
            remover.className = 'fa-solid fa-xmark apagar';
            remover.style.cursor = 'pointer';

            remover.addEventListener('click', () => {
                habilidades.splice(indice, 1);
                renderizarHabilidades();
            });

            chip.appendChild(texto);
            chip.appendChild(remover);

            divChips.appendChild(chip);
        });
    }

    inputHabTec.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter') return;

        event.preventDefault();

        const texto = inputHabTec.value.trim();

        if (!texto) return;

        if (
            habilidades.some(
                habilidade => habilidade.toLowerCase() === texto.toLowerCase()
            )
        ) {
            return;
        }

        habilidades.push(texto);

        inputHabTec.value = '';

        renderizarHabilidades();
    });

    // ================= SALVAR PROJETO =================

    document.getElementById('salvar-projeto').addEventListener('click', async (event) => {
        event.preventDefault();

        const botao = event.currentTarget;

        const imagemCapa = capaInput.files[0];

        const titulo = document.getElementById('tituloInput').value.trim();
        const categoria = document.getElementById('categoriaSelect').value;
        const dataConclusao = document.getElementById('dataConclusao').value.trim();
        const descricao = document.getElementById('descricao').value.trim();

        const links = document.querySelectorAll('.link');

        const linkProjeto = links[0]?.value.trim() || '';
        const linkGithub = document.getElementById('linkGithub')?.value.trim() || '';

        if (!imagemCapa || !titulo || !categoria || !dataConclusao || !descricao) {
            alert('Preencha os campos obrigatórios e selecione uma imagem de capa.');
            return;
        }

        if (habilidades.length === 0) {
            alert('Adicione pelo menos uma habilidade técnica.');
            return;
        }

        const formData = new FormData();

        formData.append('imagemCapa', imagemCapa);
        formData.append('titulo', titulo);
        formData.append('categoria', categoria);
        formData.append('dataConclusao', dataConclusao);
        formData.append('descricao', descricao);

        formData.append('habilidades', JSON.stringify(habilidades));

        formData.append('linkProjeto', linkProjeto);
        formData.append('linkGithub', linkGithub);

        // Imagens adicionais e legendas
        const imagens = [];

        document.querySelectorAll(
            '#carrosselImagens .carrossel-item:not(.carrossel-add)'
        ).forEach(item => {
            const arquivo = item.querySelector('.carrossel-input').files[0];

            if (arquivo) {
                imagens.push({
                    arquivo,
                    legenda: item.querySelector('.campo-legenda').value.trim()
                });
            }
        });

        const legendas = [];

        imagens.forEach(imagem => {
            formData.append('imagensAdicionais', imagem.arquivo);
            legendas.push(imagem.legenda);
        });

        formData.append('legendasImagens', JSON.stringify(legendas));

        // Anexos
        anexosSelecionados.forEach(arquivo => {
            formData.append('anexos', arquivo);
        });

        try {
            botao.disabled = true;

            const resposta = await fetch('/api/add.project', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            const dados = await resposta.json();

            if (!resposta.ok || !dados.success) {
                throw new Error(
                    dados.message || 'Não foi possível salvar o projeto.'
                );
            }

            window.location.href = '/profile';

        } catch (erro) {
            console.error('Erro ao salvar projeto:', erro);

            alert(erro.message);

            botao.disabled = false;
        }
    });

});
