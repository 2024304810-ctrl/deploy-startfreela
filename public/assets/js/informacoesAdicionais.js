
import parseJwt from '/js.utils/parseJwt.js';

document.addEventListener('DOMContentLoaded', () => {

    const body = document.body;
    const token = localStorage.getItem('token');
    const usuario = parseJwt(token);

    if (!usuario) {
        window.location.href = '/login';
        return;
    }

    const roleAtual = body.dataset.role.trim().toLowerCase();

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

    // =========================
    // ETAPAS DO PERFIL
    // =========================

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

        // Ajustar redes sociais conforme o tipo de usuário
        document.querySelectorAll('.etapa-so-freelancer-inline')
            .forEach(elemento => {
                elemento.style.display =
                    roleAtual === 'freelancer' ? '' : 'none';
            });

        // Personalizar descrição
        if (tituloSobre && descSobre) {

            tituloSobre.textContent = 'Fale um pouco sobre você';

            if (roleAtual === 'cliente') {
                descSobre.textContent =
                    'Conte que tipo de projeto você costuma contratar — isso ajuda freelancers a entenderem seu perfil.';
            } else {
                descSobre.textContent =
                    'Uma breve bio ajuda clientes a te conhecerem antes de contratar.';
            }
        }
    }

    function mostrarEtapa(indice) {

        etapas.forEach(etapa => {
            etapa.hidden = true;
        });

        etapasVisiveis.forEach((etapa, i) => {
            etapa.hidden = i !== indice;
        });

        const total = etapasVisiveis.length;
        const passoAtual = indice + 1;

        progressoTexto.textContent = `Passo ${passoAtual} de ${total}`;

        barraPreenchida.style.width =
            `${(passoAtual / total) * 100}%`;

        btnVoltar.disabled = indice === 0;

        if (indice === total - 1) {
            btnContinuar.innerHTML =
                'Concluir <i class="fa-solid fa-check"></i>';
        } else {
            btnContinuar.innerHTML =
                'Continuar <i class="fa-solid fa-arrow-right"></i>';
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

    btnContinuar.addEventListener('click', avancar);
    btnPular.addEventListener('click', avancar);

    btnVoltar.addEventListener('click', () => {
        irPara(indiceAtual - 1);
    });

    btnFechar.addEventListener('click', () => {
        window.location.href = '/home';
    });

    calcularEtapasVisiveis();
    irPara(0);

    // =========================
    // HABILIDADES
    // =========================

    const inputChips = document.getElementById('inputChips');
    const divChips = document.getElementById('div-chips');

    inputChips.addEventListener('keydown', event => {

        if (event.key !== 'Enter') return;

        event.preventDefault();

        const textoChip = inputChips.value.trim();

        if (!textoChip) return;

        if (habilidades.includes(textoChip)) {
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
        divChips.appendChild(chip);

        inputChips.value = '';
    });

    divChips.addEventListener('click', event => {

        if (!event.target.classList.contains('apagar')) return;

        const chip = event.target.closest('.chip');
        const habilidade = chip.dataset.habilidade;

        habilidades = habilidades.filter(
            item => item !== habilidade
        );

        chip.remove();
    });

    // =========================
    // CEP
    // =========================

    const inputCEP = document.getElementById('inputCEP');

    inputCEP.addEventListener('input', event => {

        let value = event.target.value;

        value = value.replace(/\D/g, '');
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

            const dados = await resposta.json();

            if (dados.erro) {
                alert('CEP não encontrado.');
                return;
            }

            const selectPais = document.getElementById('pais');
            const selectEstado = document.getElementById('estado');
            const selectCidade = document.getElementById('cidade');

            const dadosCep = [
                'Brasil',
                dados.estado || dados.uf,
                dados.localidade
            ];

            const selects = [
                selectPais,
                selectEstado,
                selectCidade
            ];

            selects.forEach((select, indice) => {

                select.innerHTML = '';

                const opcao = document.createElement('option');

                opcao.value = dadosCep[indice];
                opcao.textContent = dadosCep[indice] || 'Não identificado';

                select.appendChild(opcao);
                select.disabled = false;
            });

        } catch (erro) {
            console.error('Erro ao consultar CEP:', erro);
            alert('Não foi possível consultar o CEP.');
        }
    }

    // =========================
    // FORMATAÇÃO DO PREÇO
    // =========================

    const inputQuantia = document.querySelector('.inputQuantia');

    if (inputQuantia) {

        inputQuantia.addEventListener('input', event => {

            const e = event.target;

            let valor = e.value.replace(/\D/g, '');

            const valorDecimal = (Number(valor) / 100).toFixed(2);

            e.value = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(valorDecimal);
        });
    }

    // =========================
    // ADICIONAR INFORMAÇÕES
    // =========================

    async function adicionarInformacoes() {

        const localidade = {
            pais: document.getElementById('pais').value,
            estado: document.getElementById('estado').value,
            cidade: document.getElementById('cidade').value
        };

        const redesSociais = [];

        document.querySelectorAll('#input-redesocial')
            .forEach(redeSocial => {

                if (redeSocial.value.trim() !== '') {

                    redesSociais.push({
                        site: redeSocial.name,
                        link: redeSocial.value.trim()
                    });
                }
            });

        const sobreMim = document
            .querySelector('#sobre-mim')
            .value.trim();

        const dadosParaEnviar = {
            idUser: usuario.idUser ?? usuario.id,
            localidade,
            redesSociais,
            sobreMim
        };

        if (roleAtual === 'freelancer') {

            

            dadosParaEnviar.habilidades = habilidades;

            dadosParaEnviar.quantia = {
                valor: inputQuantia.value,
                per: document.querySelector('.selectQuantia').value
            };
        }

        console.log('Dados enviados:', dadosParaEnviar);

        btnContinuar.disabled = true;

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
                throw new Error(dados.message || 'Erro ao salvar perfil.');
            }

            alert('Informações salvas com sucesso!');

            window.location.href = '/profile';

        } catch (erro) {

            console.error('Erro ao salvar informações:', erro);

            alert('Não foi possível salvar suas informações.');

            btnContinuar.disabled = false;
        }
    }

});
