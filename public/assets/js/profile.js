import logout from '/js.utils/logout.js';

const {usuario} = window.dadosPagina;

console.log('usuario do handlebars:', usuario);

console.log(localStorage.getItem('token'));

document.getElementById('sair').addEventListener('click', () => {
    logout();
});

document.getElementById('btn-editProfile').addEventListener('click', () => {
    window.location.href='/edit.profile';
});

const usuarioRole = document.querySelector(".role-pill");
usuarioRole.innerHTML = usuarioRole.textContent.toUpperCase();

document.querySelector('.card-add-projeto').addEventListener('click', () => {
    window.location.href='/add.project'
});

/////////////Adicionando Habilidades////////////////
const {habilidades} = usuario;
console.log('quantidade de habilidades:', habilidades.length);

for(let i = 0; i < habilidades.length; i++){
  document.querySelector('.chips').insertAdjacentHTML('beforeend', `
    <span class="chip">${habilidades[i]}</span>
  `);
}
///////////////////////////////////////////////////

console.log('site da rede social 1:', usuario.redesSociais[0].site);

////////////Adicionando Links//////////////////////
for(let i = 0; i < usuario.redesSociais.length; i++){

  console.log('passando pelo loop');
  switch (usuario.redesSociais[i].site) {
  case "instagram":
    document.querySelector('.perfil-links').insertAdjacentHTML('beforeend', `
      <a href="${usuario.redesSociais[i].link}" target="_blank" class="link-externo"><i class="fa-brands fa-instagram"></i> Instagram</a>
    `);
    console.log('adicionando instagram');
    break;
  case "github": 
    document.querySelector('.perfil-links').insertAdjacentHTML('beforeend', `
      <a href="${usuario.redesSociais[i].link}" target="_blank" class="link-externo"><i class="fa-brands fa-github"></i> GitHub</a>
    `);
    console.log('adicionando github');
    break;
  default:
    break;
}
}
///////////////////////////////////////////////////

async function buscarProjetos() {
  const resposta = await fetch('/api/buscarProjetos');

  const dados = await resposta.json();

  console.log(dados[0]);

  console.log('quantidade de habilidades desse projeto:', dados[0].habilidades.length);

  const divProjetos = document.querySelector('.grid-portfolio');

    for(let i = 0; i <= dados.length-1; i++){

        divProjetos.insertAdjacentHTML('beforeend', `
           <div class="card-projeto">
            <img src="${dados[i].imagemCapa}" alt="Portal E-commerce">
            <div class="info-projeto">
              <h4>${dados[i].titulo}</h4>
              <div class="tags" id="project_tags-${dados[i].idUser}">
              </div>
              <a href="#" class="link-projeto"><i class="fa-solid fa-link"></i> Ver link</a>
            </div>
          </div> 
        `);

          const divTags = document.querySelector(`#project_tags-${dados[0].idUser}`);
          const habilidades = dados[0].habilidades;

          for(let j = 0; j <= habilidades.length-1; j++){
              divTags.insertAdjacentHTML('beforeend', `
                <span class="tag">${habilidades[j]}</span>
              `);
          }

    }
}

buscarProjetos();

document.getElementById('btn-addInfo').addEventListener('click', () => {
  window.location.href='/additional.information'
})