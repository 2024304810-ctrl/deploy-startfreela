import logout from '/js.utils/logout.js';
import parseJwt from '/js.utils/parseJwt.js';

const token = localStorage.getItem('token');
const usuario = parseJwt(token);

console.log('usuario:', usuario);

console.log(localStorage.getItem('token'));

document.getElementById('sair').addEventListener('click', () => {
    logout();
});

const usuarioRole = document.querySelector(".role-pill");
usuarioRole.innerHTML = usuarioRole.textContent.toUpperCase();

async function buscarFreelancers(){
    const resposta = await fetch('/api/buscarFreelancers');
    const dados = await resposta.json();

    console.log(dados);

    const divFreelancersGrid = document.querySelector('.freelancers-grid');

    for(let i = 0; i <= dados.length-1; i++){
      if(usuario.id !== dados[i].idUser){
        console.log('freelancer diferente da conta atual!');
        console.log('id do usuário:', usuario.idUser);
        console.log('id do freelancer:', dados[i].idUser);
        const divFreelancersGrid = document.querySelector('.freelancers-grid');

        divFreelancersGrid.insertAdjacentHTML('beforeend', `
            <article class="freelancer-card">
          <div class="fc-top">
            <div class="fc-avatar"><img src="../assets/img/icone-user.png" alt=""></div>
            <span class="fc-nivel"><i class="fa-solid fa-star"></i> Nível 5</span>
          </div>
          <h3 class="fc-nome">${dados[i].completeName}</h3>
          <p class="fc-profissao">${dados[i].profissao}</p>
          <div class="fc-nota"><i class="fa-solid fa-star"></i> 4.5 <span>(17 avaliações)</span></div>
          <div class="tags_${dados[i].idUser}"></div>
          <div class="fc-bottom">
            <span class="fc-preco">${dados[i].quantia.valor}<small>/${dados[i].quantia.per}</small></span>
            <button class="btn-primary btn-sm btn-profile" id="${dados[i].idUser}">Ver Perfil</button>
          </div>
        </article>
        `);
          
        dados[i].habilidades.forEach(habilidade => {
            document.querySelector(`.tags_${dados[i].idUser}`).insertAdjacentHTML('beforeend', `
              <span class="tag">${habilidade}</span>
            `)
        });
      }

    }

    const botoesPerfil = document.querySelectorAll('.btn-profile');

    console.log(botoesPerfil.length);

    botoesPerfil.forEach(botao => {
        botao.addEventListener('click', () => {
            console.log('id do botão:', botao.id);
            window.location.href=`/technical.profile?i=${botao.id}`;
        });
    });
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
  })
});