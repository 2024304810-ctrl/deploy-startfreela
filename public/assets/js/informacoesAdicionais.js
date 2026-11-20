
import parseJwt from '/js.utils/parseJwt.js';

document.addEventListener('DOMContentLoaded', () => {

    const body = document.body;
    const token = localStorage.getItem('token');
    const usuario = parseJwt(token);

    if (!usuario) {
        window.location.href = '/login';
        return;
    }

    const roleAtual = (body.dataset.role || '').trim().toLowerCase();

    const etapas = Array.from(document.querySelectorAll('.etapa'));
    const barraPreenchida = document.querySelector('.progresso-preenchida');
    const progressoTexto = document.querySelector('.progresso-texto');

    const btnVoltar = document.querySelector('.btn-voltar-etapa');
    const btnPular = document.querySelector('.btn-pular-etapa');
    const btnContinuar = document.querySelector('.btn-continuar');
    const btnFechar = document.querySelector('.onboarding-fechar');

    const tituloSobre = document.querySelector('.titulo-sobre');
    const descSobre = document.querySelector('.descricao-sobre');

    let indiceAtual = 0;
    let etapasVisiveis = [];
    let habilidades = [];

    // ETAPAS VISÍVEIS CONFORME O PERFIL
    function calcularEtapasVisiveis() {

        etapasVisiveis = etapas.filter(etapa => {

            if (etapa.hasAttribute('data-etapa-comum')) {
                return true;
            }

            if (etapa.hasAttribute('data-etapa-freelancer')) {
                return roleAtual === 'freelancer';
            }

            return true;
        });

        if (tituloSobre && descSobre) {
            tituloSobre.textContent = 'Fale um pouco sobre você';

            descSobre.textContent = roleAtual === 'cliente'
                ? 'Conte um pouco sobre sua profissão, suas habilidades e os projetos que costuma contratar.'
                : 'Uma breve apresentação ajuda clientes a conhecerem seu perfil antes de contratar.';
        }
    }

    // MOSTRAR ETAPA
    function mostrarEtapa(indice) {

        etapas.forEach(etapa => {
            etapa.hidden = true;
        });

        etapasVisiveis.forEach((etapa, i) => {
            etapa.hidden = i !== indice;
        });

        const total = etapasVisiveis.length;
        const passoAtual = indice + 1;

        if (progressoTexto) {
            progressoTexto.textContent = `Passo ${passoAtual} de ${total}`;
        }

        if (barraPreenchida) {
            barraPreenchida.style.width = `${(passoAtual / total) * 100}%`;
        }

        if (btnVoltar) {
            btnVoltar.disabled = indice === 0;
        }

        if (btnContinuar) {
            btnContinuar.innerHTML = indice === total - 1
                ? 'Concluir <i class="fa-solid fa-check"></i>'
                : 'Continuar <i class="fa-solid fa-arrow-right"></i>';
        }
    }

    function irPara(indice) {

        indiceAtual = Math.max(
            0,
            Math.min(indice, etapasVisiveis.length - 1)
        );

        mostrarEtapa(indiceAtual);
    }

    function avancar() {

        if (indiceAtual >= etapasVisiveis.length - 1) {
            adicionarInformacoes();
            return;
        }

        irPara(indiceAtual + 1);
    }

    btnContinuar?.addEventListener('click', avancar);
    btnPular?.addEventListener('click', avancar);

    btnVoltar?.addEventListener('click', () => {
        irPara(indiceAtual - 1);
    });

    btnFechar?.addEventListener('click', () => {
        window.location.href = '/home';
    });

    calcularEtapasVisiveis();

    if (etapasVisiveis.length) {
        irPara(0);
    }

    // HABILIDADES
    const inputChips = document.getElementById('inputChips');
    const divChips = document.getElementById('div-chips');

    inputChips?.addEventListener('keydown', event => {

        if (event.key !== 'Enter') return;

        event.preventDefault();

        const textoChip = inputChips.value.trim();

        if (!textoChip) return;

        const existe = habilidades.some(
            habilidade => habilidade.toLowerCase() === textoChip.toLowerCase()
        );

        if (existe) {
            inputChips.value = '';
            return;
        }

        habilidades.push(textoChip);

        const chip = document.createElement('span');
        chip.classList.add('chip');
        chip.dataset.habilidade = textoChip;

        chip.appendChild(document.createTextNode(textoChip));

        const botaoExcluir = document.createElement('i');
        botaoExcluir.className = 'fa-solid fa-xmark apagar';

        chip.appendChild(botaoExcluir);
        divChips?.appendChild(chip);

        inputChips.value = '';
    });

    divChips?.addEventListener('click', event => {

        if (!event.target.classList.contains('apagar')) return;

        const chip = event.target.closest('.chip');

        if (!chip) return;

        const habilidade = chip.dataset.habilidade;

        habilidades = habilidades.filter(
            item => item !== habilidade
        );

        chip.remove();
    });

    // CEP
    const inputCEP = document.getElementById('inputCEP');

    inputCEP?.addEventListener('input', event => {

        let value = event.target.value.replace(/\D/g, '');

        value = value.replace(/^(\d{5})(\d)/, '$1-$2');

        event.target.value = value.slice(0, 9);

        if (value.length === 9) {
            buscarCEP(value);
        }
    });

    async function buscarCEP(cep) {

        try {

            const resposta = await fetch(
                `https://viacep.com.br/ws/${cep.replace('-', '')}/json/`
            );

            if (!resposta.ok) {
                throw new Error('Erro ao consultar o CEP.');
            }

            const dados = await resposta.json();

            if (dados.erro) {
                alert('CEP não encontrado.');
                return;
            }

            const selects = [
                {
                    elemento: document.getElementById('pais'),
                    valor: 'Brasil'
                },
                {
                    elemento: document.getElementById('estado'),
                    valor: dados.estado || dados.uf
                },
                {
                    elemento: document.getElementById('cidade'),
                    valor: dados.localidade
                }
            ];

            selects.forEach(({ elemento, valor }) => {

                if (!elemento) return;

                elemento.innerHTML = '';

                const opcao = document.createElement('option');

                opcao.value = valor || '';
                opcao.textContent = valor || 'Não identificado';

                elemento.appendChild(opcao);
                elemento.disabled = false;
            });

        } catch (erro) {

            console.error('Erro ao consultar CEP:', erro);
            alert('Não foi possível consultar o CEP.');
        }
    }

    // FORMATAÇÃO DO PREÇO — SOMENTE FREELANCER
    const inputQuantia = document.querySelector('.inputQuantia');

    inputQuantia?.addEventListener('input', event => {

        const valor = event.target.value.replace(/\D/g, '');
        const valorDecimal = (Number(valor) / 100).toFixed(2);

        event.target.value = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(Number(valorDecimal));
    });

    // SALVAR INFORMAÇÕES
    async function adicionarInformacoes() {

        const localidade = {
            pais: document.getElementById('pais')?.value || '',
            estado: document.getElementById('estado')?.value || '',
            cidade: document.getElementById('cidade')?.value || '',
            cep: inputCEP?.value.trim() || ''
        };

        const redesSociais = [];

        document.querySelectorAll('.input-redesocial').forEach(input => {

            const link = input.value.trim();

            if (link) {
                redesSociais.push({
                    site: input.name,
                    link
                });
            }
        });

        const dadosParaEnviar = {

            idUser: usuario.idUser ?? usuario.id,

            // O controller atual espera "localidade".
            localidade,

            profissao:
                document.querySelector('#profissao')?.value.trim() || '',

            habilidades,

            redesSociais,

            sobreMim:
                document.querySelector('#sobre-mim')?.value.trim() || ''
        };

        // Preço exclusivo do freelancer.
        if (roleAtual === 'freelancer') {

            dadosParaEnviar.quantia = {
                valor: inputQuantia?.value || '',
                per: document.querySelector('.selectQuantia')?.value || ''
            };
        }

        console.log('Dados enviados:', dadosParaEnviar);

        if (btnContinuar) {
            btnContinuar.disabled = true;
        }

        try {

            const resposta = await fetch('/api/informacoesAdicionais', {

                method: 'POST',

                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },

                body: JSON.stringify(dadosParaEnviar)
            });

            const dados = await resposta.json();

            if (!resposta.ok || !dados.success) {
                throw new Error(
                    dados.message || 'Erro ao salvar perfil.'
                );
            }

            alert('Informações salvas com sucesso!');

            window.location.href = '/profile';

        } catch (erro) {

            console.error('Erro ao salvar informações:', erro);

            alert(
                erro.message || 'Não foi possível salvar suas informações.'
            );

            if (btnContinuar) {
                btnContinuar.disabled = false;
            }
        }
    }

});
