
import logout from '/js.utils/logout.js';
import parseJwt from '/js.utils/parseJwt.js';

const token = localStorage.getItem('token');
const usuario = parseJwt(token);

if (!usuario) {
    window.location.href = '/login';
}

document.addEventListener('DOMContentLoaded', () => {

    // ================= USUÁRIO =================

    const btnSair = document.getElementById('sair');

    if (btnSair) {
        btnSair.addEventListener('click', logout);
    }

    const usuarioRole = document.querySelector('.role-pill');

    if (usuarioRole) {
        usuarioRole.textContent = usuarioRole.textContent.toUpperCase();
    }

    // ================= CAPA =================

    const capaUpload = document.getElementById('capaUpload');
    const capaInput = document.getElementById('capaInput');

    if (capaInput) {
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

                if (placeholder) placeholder.hidden = true;
                if (trocar) trocar.hidden = false;

                capaUpload.classList.add('tem-imagem');
            };

            leitor.readAsDataURL(arquivo);
        });
    }

    // ================= IMAGENS ADICIONAIS =================

    const carrosselImagens = document.getElementById('carrosselImagens');
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

                if (icone) {
                    icone.hidden = true;
                }
            };

            leitor.readAsDataURL(arquivo);
        });

        item.querySelector('.carrossel-remover').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            item.remove();
        });
    }

    function criarItemCarrossel() {
        const item = document.createElement('div');

        item.className = 'carrossel-item';

        item.innerHTML = `
            <label class="carrossel-slot">
                <input
                    type="file"
                    accept="image/*"
                    class="carrossel-input"
                    hidden
                >

                <i class="fa-solid fa-plus"></i>

                <img
                    class="carrossel-preview"
                    hidden
                    alt=""
                >

                <button
                    type="button"
                    class="carrossel-remover"
                >
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </label>

            <input
                type="text"
                class="field campo-legenda"
                placeholder="Descreva esta imagem..."
            >
        `;

        ativarItemCarrossel(item);

        return item;
    }

    if (carrosselImagens) {

        document.querySelectorAll(
            '#carrosselImagens .carrossel-item:not(.carrossel-add)'
        ).forEach(ativarItemCarrossel);

    }

    if (btnAdicionarImagem) {
        btnAdicionarImagem.addEventListener('click', () => {
            const novoItem = criarItemCarrossel();

            carrosselImagens.insertBefore(
                novoItem,
                btnAdicionarImagem
            );

            novoItem.querySelector('.carrossel-input').click();

            carrosselImagens.scrollTo({
                left: carrosselImagens.scrollWidth,
                behavior: 'smooth'
            });
        });
    }

    // ================= ANEXOS =================

    const anexoInput = document.getElementById('anexoInput');
    const listaAnexos = document.getElementById('listaAnexos');

    // Guarda os arquivos mesmo depois de limpar o input.
    const arquivosAnexos = [];

    function formatarTamanho(bytes) {
        if (bytes < 1024) {
            return `${bytes} B`;
        }

        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(0)} KB`;
        }

        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    function iconePorTipo(nomeArquivo) {
        const ext = nomeArquivo.split('.').pop().toLowerCase();

        if (['pdf'].includes(ext)) return 'fa-file-pdf';
        if (['doc', 'docx'].includes(ext)) return 'fa-file-word';
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'fa-file-image';
        if (['zip', 'rar'].includes(ext)) return 'fa-file-zipper';

        return 'fa-file';
    }

    function renderizarAnexos() {
        listaAnexos.innerHTML = '';

        arquivosAnexos.forEach((arquivo, indice) => {
            const item = document.createElement('div');

            item.className = 'anexo-item';

            item.innerHTML = `
                <i class="fa-solid ${iconePorTipo(arquivo.name)}"></i>

                <span class="anexo-nome"></span>

                <span class="anexo-tamanho">
                    ${formatarTamanho(arquivo.size)}
                </span>

                <button
                    type="button"
                    class="anexo-remover"
                    title="Remover"
                >
                    <i class="fa-solid fa-xmark"></i>
                </button>
            `;

            item.querySelector('.anexo-nome').textContent = arquivo.name;

            item.querySelector('.anexo-remover').addEventListener('click', () => {
                arquivosAnexos.splice(indice, 1);
                renderizarAnexos();
            });

            listaAnexos.appendChild(item);
        });
    }

    if (anexoInput) {
        anexoInput.addEventListener('change', () => {

            Array.from(anexoInput.files).forEach(arquivo => {
                arquivosAnexos.push(arquivo);
            });

            renderizarAnexos();

            // Limpa o input, mas preserva os arquivos no array.
            anexoInput.value = '';
        });
    }

    // ================= HABILIDADES =================

    const inputHabTec = document.getElementById('inputHabTec');
    const divChips = document.getElementById('div-chips');

    const habilidades = [];

    if (inputHabTec && divChips) {

        inputHabTec.addEventListener('keydown', (event) => {

            if (event.key !== 'Enter') return;

            event.preventDefault();

            const textoChip = inputHabTec.value.trim();

            if (!textoChip) return;

            if (habilidades.includes(textoChip)) {
                inputHabTec.value = '';
                return;
            }

            habilidades.push(textoChip);

            const chip = document.createElement('span');
            chip.className = 'chip';

            const texto = document.createTextNode(textoChip);

            const botaoRemover = document.createElement('i');
            botaoRemover.className = 'fa-solid fa-xmark apagar';

            chip.appendChild(texto);
            chip.appendChild(botaoRemover);

            divChips.appendChild(chip);

            inputHabTec.value = '';
        });

        divChips.addEventListener('click', (event) => {

            if (!event.target.classList.contains('apagar')) return;

            const chip = event.target.closest('.chip');

            const indice = Array.from(divChips.children).indexOf(chip);

            if (indice !== -1) {
                habilidades.splice(indice, 1);
            }

            chip.remove();
        });
    }

    // ================= CADASTRAR PROJETO =================

    const btnSalvar = document.querySelector('#salvar-projeto');

    if (!btnSalvar) return;

    btnSalvar.addEventListener('click', async (e) => {

        e.preventDefault();

        if (btnSalvar.disabled) return;

        try {

            const imagemCapa = document.getElementById('capaInput');

            const tituloProjeto = document.getElementById('tituloInput').value.trim();
            const categoria = document.getElementById('categoriaSelect').value;
            const dataConclusao = document.getElementById('dataConclusao').value;
            const descricao = document.getElementById('descricao').value.trim();

            // Verifica a capa.
            if (!imagemCapa.files[0]) {
                alert('Adicione uma imagem de capa.');
                return;
            }

            // Verifica os campos principais.
            if (!tituloProjeto || !categoria || !dataConclusao || !descricao) {
                alert('Preencha todos os campos obrigatórios.');
                return;
            }

            const formData = new FormData();

            // Dados principais.
            formData.append('imagemCapa', imagemCapa.files[0]);
            formData.append('titulo', tituloProjeto);
            formData.append('categoria', categoria);
            formData.append('dataConclusao', dataConclusao);
            formData.append('descricao', descricao);

            formData.append('habilidades', JSON.stringify(habilidades));

            // Links.
            const camposLinks = document.querySelectorAll('.link');

            formData.append(
                'linkProjeto',
                camposLinks[0]?.value.trim() || ''
            );

            formData.append(
                'linkGithub',
                camposLinks[1]?.value.trim() || ''
            );

            // Imagens adicionais e legendas.
            const legendasImagens = [];

            const itensCarrossel = document.querySelectorAll(
                '#carrosselImagens .carrossel-item:not(.carrossel-add)'
            );

            itensCarrossel.forEach(item => {

                const input = item.querySelector('.carrossel-input');
                const legenda = item.querySelector('.campo-legenda');

                if (input?.files[0]) {

                    formData.append(
                        'imagensAdicionais',
                        input.files[0]
                    );

                    legendasImagens.push(
                        legenda?.value.trim() || ''
                    );
                }
            });

            formData.append(
                'legendasImagens',
                JSON.stringify(legendasImagens)
            );

            // Anexos.
            arquivosAnexos.forEach(arquivo => {
                formData.append('anexos', arquivo);
            });

            // Conferência dos dados enviados.
            console.log('===== DADOS DO PORTFÓLIO =====');

            for (const [chave, valor] of formData.entries()) {

                console.log(
                    chave,
                    valor instanceof File ? valor.name : valor
                );
            }

            btnSalvar.disabled = true;

            const textoOriginal = btnSalvar.textContent;

            btnSalvar.textContent = 'Salvando...';

            const resposta = await fetch('/api/add.project', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            const dados = await resposta.json();

            console.log('Resposta do servidor:', dados);

            if (!resposta.ok || !dados.success) {
                throw new Error(
                    dados.message || 'Não foi possível salvar o projeto.'
                );
            }

            alert('Projeto adicionado ao portfólio!');

            window.location.href = '/profile';

        } catch (erro) {

            console.error('Erro ao cadastrar projeto:', erro);

            alert(erro.message || 'Erro ao cadastrar projeto.');

            btnSalvar.disabled = false;
            btnSalvar.textContent = 'Salvar projeto';
        }
    });

});
