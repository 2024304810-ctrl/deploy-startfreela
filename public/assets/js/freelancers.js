
import logout from '/js.utils/logout.js';
import parseJwt from '/js.utils/parseJwt.js';

const token = localStorage.getItem('token');
const usuario = parseJwt(token);

console.log('usuario:', usuario);

document.getElementById('sair').addEventListener('click', () => {
    logout();
});

const usuarioRole = document.querySelector(".role-pill");

if (usuarioRole) {
    usuarioRole.innerHTML = usuarioRole.textContent.toUpperCase();
}

async function buscarFreelancers() {
    try {
        const resposta = await fetch('/api/buscarFreelancers');
        const dados = await resposta.json();

        console.log('Freelancers recebidos:', dados);

        const divFreelancersGrid = document.querySelector('.freelancers-grid');

        divFreelancersGrid.innerHTML = '';

        const idUsuarioAtual = usuario.idUser ?? usuario.id;

        dados.forEach(freelancer => {

            // Não exibir o próprio usuário
            if (idUsuarioAtual === freelancer.idUser) {
                return;
            }

            const habilidades = Array.isArray(freelancer.habilidades)
                ? freelancer.habilidades
                : [];

            const profissao = freelancer.profissao || 'Profissão não informada';

            const valor = freelancer.quantia?.valor || 'Valor não informado';
            const periodo = freelancer.quantia?.per || '';

            const nota = freelancer.avaliacoes?.nota ?? 'Sem avaliações';
            const quantidadeAvaliacoes =
                freelancer.avaliacoes?.quantidade_de_avaliacoes ?? 0;

            divFreelancersGrid.insertAdjacentHTML('beforeend', `
                <article class="freelancer-card">
                    <div class="fc-top">
                        <div class="fc-avatar">
                            <img src="../assets/img/icone-user.png" alt="">
                        </div>
                        
                    </div>

                    <h3 class="fc-nome">${freelancer.completeName || freelancer.username}</h3>

                    <p class="fc-profissao">${profissao}</p>

                    <div class="fc-nota">
                        <i class="fa-solid fa-star"></i>
                        ${nota}
                        <span>(${quantidadeAvaliacoes} avaliações)</span>
                    </div>

                    <div class="tags_${freelancer.idUser}"></div>

                    <div class="fc-bottom">
                        <span class="fc-preco">
                            ${valor}
                            <small>${periodo ? `/${periodo}` : ''}</small>
                        </span>

                        <button
                            class="btn-primary btn-sm btn-profile"
                            data-id="${freelancer.idUser}">
                            Ver Perfil
                        </button>
                    </div>
                </article>
            `);

            const divTags = divFreelancersGrid.querySelector(
                `.tags_${CSS.escape(freelancer.idUser)}`
            );

            habilidades.forEach(habilidade => {
                const nomeHabilidade = typeof habilidade === 'string'
                    ? habilidade
                    : habilidade.habilidade;

                if (nomeHabilidade) {
                    divTags.insertAdjacentHTML('beforeend', `
                        <span class="tag">${nomeHabilidade}</span>
                    `);
                }
            });
        });

        const botoesPerfil = document.querySelectorAll('.btn-profile');

        botoesPerfil.forEach(botao => {
            botao.addEventListener('click', () => {
                window.location.href =
                    `/technical.profile?i=${botao.dataset.id}`;
            });
        });

    } catch (erro) {
        console.error('Erro ao buscar freelancers:', erro);
    }
}

buscarFreelancers();

const inputsFaixaPreco = document.querySelectorAll('#inputs-faixapreco');

inputsFaixaPreco.forEach(input => {
    input.addEventListener('input', (event) => {
        const e = event.target;
        let valor = e.value.replace(/\D/g, "");

        const valorDecimal = (Number(valor) / 100).toFixed(2);

        e.value = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valorDecimal);
    });
});
