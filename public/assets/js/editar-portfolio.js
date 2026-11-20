document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formEditarPortfolio');
    if (!form) return;

    const idProjeto = form.dataset.id;

    const capaInput = document.getElementById('imagemCapa');
    const previewCapa = document.getElementById('previewCapa');
    const capaUpload = document.getElementById('capaUpload');

    const habilidadesContainer = document.getElementById('habilidadesAtuais');
    const novaHabilidade = document.getElementById('novaHabilidade');

    const imagensExistentes = document.getElementById('imagensExistentes');
    const novasImagens = document.getElementById('novasImagens');

    const anexosExistentes = document.getElementById('anexosExistentes');
    const novosAnexos = document.getElementById('novosAnexos');

    const anexoInput = document.getElementById('anexoInput');
    const adicionarAnexo = document.getElementById('adicionarAnexo');

    const habilidades = [];

    habilidadesContainer.querySelectorAll('[data-habilidade]').forEach(item => {
        habilidades.push(item.dataset.habilidade);
    });

    // Renderizar habilidades
    function renderizarHabilidades() {
        habilidadesContainer.innerHTML = '';

        habilidades.forEach((habilidade, indice) => {
            const chip = document.createElement('span');
            chip.className = 'chip';
            chip.dataset.habilidade = habilidade;

            const texto = document.createElement('span');
            texto.textContent = habilidade;

            const remover = document.createElement('i');
            remover.className = 'fa-solid fa-xmark remover-habilidade';
            remover.title = 'Remover habilidade';
            remover.setAttribute('role', 'button');

            remover.addEventListener('click', () => {
                habilidades.splice(indice, 1);
                renderizarHabilidades();
            });

            chip.appendChild(texto);
            chip.appendChild(remover);
            habilidadesContainer.appendChild(chip);
        });
    }

    function adicionarHabilidade() {
        const valor = novaHabilidade.value.trim();

        if (!valor) return;

        if (habilidades.some(item => item.toLowerCase() === valor.toLowerCase())) {
            alert('Essa habilidade já foi adicionada.');
            return;
        }

        habilidades.push(valor);
        novaHabilidade.value = '';
        renderizarHabilidades();
    }

    novaHabilidade.addEventListener('keydown', evento => {
        if (evento.key === 'Enter') {
            evento.preventDefault();
            adicionarHabilidade();
        }
    });

    // Alterar imagem de capa
    capaUpload.addEventListener('click', evento => {
        if (evento.target.closest('.capa-trocar') ||
            evento.target.closest('.capa-placeholder') ||
            evento.target === capaUpload ||
            evento.target === previewCapa) {
            evento.preventDefault();
            capaInput.click();
        }
    });

    capaInput.addEventListener('change', () => {
        const arquivo = capaInput.files[0];

        if (!arquivo) return;

        if (!arquivo.type.startsWith('image/')) {
            alert('Selecione um arquivo de imagem válido.');
            capaInput.value = '';
            return;
        }

        previewCapa.src = URL.createObjectURL(arquivo);
        previewCapa.hidden = false;
        capaUpload.classList.add('tem-imagem');
    });

    // Remover imagens e anexos existentes
    function configurarRemocao(container) {
        container.addEventListener('click', evento => {
            const botao = evento.target.closest('.remover-arquivo');

            if (!botao) return;

            const arquivo = botao.closest('.imagem-existente, .editar-anexo-existente');

            if (arquivo) {
                arquivo.remove();
            }
        });
    }

    configurarRemocao(imagensExistentes);
    configurarRemocao(anexosExistentes);

    // Adicionar nova imagem
    document.getElementById('adicionarImagem').addEventListener('click', () => {
        const item = document.createElement('div');
        item.className = 'carrossel-item nova-imagem-item';

        item.innerHTML = `
            <label class="carrossel-slot">
                <input type="file" class="nova-imagem-input" accept="image/*" hidden>
                <i class="fa-solid fa-plus"></i>
                <img class="carrossel-preview" hidden alt="Prévia da nova imagem">

                <button type="button"
                        class="carrossel-remover remover-novo-arquivo"
                        title="Remover imagem">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </label>

            <input type="text"
                   class="field campo-legenda nova-imagem-legenda"
                   placeholder="Descreva esta imagem...">
        `;

        const input = item.querySelector('.nova-imagem-input');
        const preview = item.querySelector('.carrossel-preview');
        const icone = item.querySelector('.carrossel-slot > i');

        input.addEventListener('change', () => {
            const arquivo = input.files[0];

            if (!arquivo) return;

            if (!arquivo.type.startsWith('image/')) {
                alert('Selecione um arquivo de imagem válido.');
                input.value = '';
                return;
            }

            preview.src = URL.createObjectURL(arquivo);
            preview.hidden = false;
            icone.hidden = true;
            item.querySelector('.carrossel-slot').classList.add('tem-imagem');
        });

        item.querySelector('.carrossel-slot').addEventListener('click', evento => {
            if (evento.target.closest('.remover-novo-arquivo')) return;

            evento.preventDefault();
            input.click();
        });

        item.querySelector('.remover-novo-arquivo').addEventListener('click', evento => {
            evento.preventDefault();
            item.remove();
        });

        novasImagens.appendChild(item);
    });

    // Abrir seletor de anexos
    adicionarAnexo.addEventListener('click', () => {
        anexoInput.click();
    });

    // Mostrar anexos selecionados
    anexoInput.addEventListener('change', () => {
        Array.from(anexoInput.files).forEach(arquivo => {
            const item = document.createElement('div');
            item.className = 'anexo-item novo-anexo-item';

            const icone = document.createElement('i');
            icone.className = 'fa-solid fa-paperclip';

            const nome = document.createElement('span');
            nome.className = 'anexo-nome';
            nome.textContent = arquivo.name;

            const remover = document.createElement('button');
            remover.type = 'button';
            remover.className = 'anexo-remover';
            remover.title = 'Remover anexo';
            remover.innerHTML = '<i class="fa-solid fa-xmark"></i>';

            remover.addEventListener('click', () => {
                item.remove();
            });

            item.appendChild(icone);
            item.appendChild(nome);
            item.appendChild(remover);

            item._arquivo = arquivo;
            novosAnexos.appendChild(item);
        });

        // Permite selecionar novamente o mesmo arquivo depois
        anexoInput.value = '';
    });

    // Salvar alterações
    form.addEventListener('submit', async evento => {
        evento.preventDefault();

        const botaoSalvar = document.getElementById('salvarEdicao');

        

        botaoSalvar.disabled = true;
        botaoSalvar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Salvando...';

        try {
            const dados = new FormData();

            dados.append('titulo', document.getElementById('titulo').value.trim());
            dados.append('categoria', document.getElementById('categoria').value);
            dados.append('dataConclusao', document.getElementById('dataConclusao').value.trim());
            dados.append('descricao', document.getElementById('descricao').value.trim());

            dados.append('habilidades', JSON.stringify(habilidades));

            dados.append('linkProjeto', document.getElementById('linkProjeto').value.trim());
            dados.append('linkGithub', document.getElementById('linkGithub').value.trim());

            // Nova capa, caso tenha sido selecionada
            if (capaInput.files[0]) {
                dados.append('imagemCapa', capaInput.files[0]);
            }

            // Imagens antigas que foram mantidas
            const imagensMantidas = [];

            imagensExistentes.querySelectorAll('.imagem-existente').forEach(item => {
                imagensMantidas.push({
                    url: item.dataset.url,
                    legenda: item.querySelector('.legenda-existente').value.trim()
                });
            });

            dados.append('imagensExistentes', JSON.stringify(imagensMantidas));

            // Novas imagens
            const legendasNovas = [];

            novasImagens.querySelectorAll('.nova-imagem-item').forEach(item => {
                const arquivo = item.querySelector('.nova-imagem-input').files[0];

                if (arquivo) {
                    dados.append('imagensAdicionais', arquivo);

                    legendasNovas.push(
                        item.querySelector('.nova-imagem-legenda').value.trim()
                    );
                }
            });

            dados.append('legendasImagens', JSON.stringify(legendasNovas));

            // Anexos antigos que foram mantidos
            const anexosMantidos = [];

            anexosExistentes.querySelectorAll('.editar-anexo-existente').forEach(item => {
                anexosMantidos.push({
                    url: item.dataset.url
                });
            });

            dados.append('anexosExistentes', JSON.stringify(anexosMantidos));

            // Novos anexos
            novosAnexos.querySelectorAll('.novo-anexo-item').forEach(item => {
                if (item._arquivo) {
                    dados.append('anexos', item._arquivo);
                }
            });

            const resposta = await fetch(
                `/api/portfolio/${encodeURIComponent(idProjeto)}`,
                {
                    method: 'PUT',
                    body: dados,
                    credentials: 'same-origin'
                }
            );

            const resultado = await resposta.json();

            if (!resposta.ok || !resultado.success) {
                throw new Error(
                    resultado.message || 'Não foi possível atualizar o projeto.'
                );
            }

            alert(resultado.message || 'Projeto atualizado com sucesso!');

            window.location.href =
                `/portfolio/projeto?p=${encodeURIComponent(idProjeto)}`;

        } catch (erro) {
            console.error('Erro ao atualizar portfólio:', erro);
            alert(erro.message || 'Erro ao salvar as alterações.');
        } finally {
            botaoSalvar.disabled = false;
            botaoSalvar.innerHTML = '<i class="fa-solid fa-check"></i> Salvar alterações';
        }
    });

    renderizarHabilidades();
});