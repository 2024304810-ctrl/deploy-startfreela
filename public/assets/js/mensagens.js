import logout from '/js.utils/logout.js';
import parseJwt from '/js.utils/parseJwt.js';

console.log(localStorage.getItem('token'));
const usuario = parseJwt(localStorage.getItem('token'));
console.log(usuario);

document.getElementById('sair').addEventListener('click', () => {
    logout();
});

const usuarioRole = document.querySelector(".role-pill");
usuarioRole.innerHTML = usuarioRole.textContent.toUpperCase();

document.addEventListener('DOMContentLoaded', () => {

  // ===== Filtro por abas (Todas / Não Lidas / Arquivadas) =====
  const tabs = document.querySelectorAll('.msgs-tab');
  const conversas = document.querySelectorAll('.conversa-item');
  const listaVazia = document.querySelector('.lista-vazia');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filtro = tab.dataset.filtro;
      let algumVisivel = false;

      conversas.forEach((conversa) => {
        const status = conversa.dataset.status || '';
        let mostrar = false;

        if (filtro === 'todas') {
          mostrar = !status.includes('arquivada');
        } else if (filtro === 'nao-lidas') {
          mostrar = status.includes('nao-lida') && !status.includes('arquivada');
        } else if (filtro === 'arquivadas') {
          mostrar = status.includes('arquivada');
        }

        conversa.style.display = mostrar ? '' : 'none';
        if (mostrar) algumVisivel = true;
      });

      if (listaVazia) listaVazia.hidden = algumVisivel;
    });
  });

  // ===== Menu "..." de cada conversa =====
  document.querySelectorAll('.conversa-menu-btn').forEach((botao) => {
    botao.addEventListener('click', (e) => {
      e.preventDefault();   // nao segue o link da conversa
      e.stopPropagation();  // nao fecha o menu na hora

      const menu = botao.nextElementSibling;
      const jaAberto = menu.classList.contains('open');

      // fecha todos os outros menus abertos
      document.querySelectorAll('.conversa-menu.open').forEach((m) => {
        if (m !== menu) m.classList.remove('open');
      });

      menu.classList.toggle('open', !jaAberto);
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.conversa-menu.open').forEach((m) => m.classList.remove('open'));
  });

});

//////////////////////////APIs/////////////////////////////

async function buscarConversas(){
    const resposta = await fetch('/api/buscarContatos');

    const dados = await resposta.json();

    console.log(dados);

    const containerContatos = document.querySelector('.lista-conversas');

    console.log('nome remetente:', dados[0].nomeRemetente);
    console.log('nome destinatário:', dados[0].nomeDestinatario)

    console.log('nome do usuario:', usuario.completeName);

    console.log('iguais:', dados[0].nomeRemetente === usuario.completeName);

    for(let i = 0; i <= dados.length-1; i++){
      let nomeContato = null;
      let idContato = null;

      if(dados[i].nomeDestinatario === usuario.completeName){
        nomeContato = dados[i].nomeRemetente;
        idContato = dados[i].remetente;
      }else if(dados[i].nomeRemetente === usuario.completeName){
        nomeContato = dados[i].nomeDestinatario;
        idContato = dados[i].destinatario;
      }

        containerContatos.insertAdjacentHTML('beforeend', `
        <a class="conversa-item" id="${idContato}" data-status="lida">
          <div class="conversa-avatar"><img src="/img/icone-user.png" alt=""></div>
          <div class="conversa-info">
            <div class="conversa-topo">
              <span class="conversa-nome">${nomeContato}</span>
              <span class="conversa-hora">Ontem</span>
            </div>
            <div class="conversa-preview-row">
              <p class="conversa-preview">${dados[i].texto}</p>
            </div>
          </div>
          <button class="conversa-menu-btn" type="button"><i class="fa-solid fa-ellipsis-vertical"></i></button>
          <div class="conversa-menu">
            <a href="#"><i class="fa-solid fa-thumbtack"></i> Fixar</a>
            <a href="#"><i class="fa-solid fa-envelope"></i> Marcar como não lida</a>
            <a href="#"><i class="fa-solid fa-box-archive"></i> Arquivar</a>
          </div>
        </a>`)
    }

    const conversas = document.querySelectorAll('.conversa-item');

      console.log(conversas.length);

      conversas.forEach(conversa => {
          conversa.addEventListener('click', () => {
              console.log('clicou');
              console.log('id do botão:', conversa.id);
              window.location.href=`/chat?di=${conversa.id}`;
          });
      });
}

buscarConversas();