import logout from '/js.utils/logout.js';

const botoesMenu = document.querySelectorAll(".menu-item");

const {usuario} = window.dadosPagina;

console.log(localStorage.getItem('token'));

document.getElementById('sair').addEventListener('click', () => {
    logout();
});

const usuarioRole = document.querySelector(".role-pill");
usuarioRole.innerHTML = usuarioRole.textContent.toUpperCase();


console.log(usuario);

const secoes = document.querySelectorAll(".form-section");

botoesMenu.forEach(botao => {
    botao.addEventListener("click", () => {
        const idSecao = botao.dataset.section;

        botoesMenu.forEach(item => {
            item.classList.remove("ativo");
        });

        secoes.forEach(secao => {
            secao.classList.remove("ativa");
        });

        botao.classList.add("ativo");

        const secao = document.getElementById(idSecao);

        if (secao) {
            secao.classList.add("ativa");
        }
    });
});

const inputFoto = document.querySelector("#inputFoto");

const fotoPerfil = document.querySelector("#fotoPerfil");

inputFoto.addEventListener("change", function () {
    const arquivo = this.files[0];

    if (!arquivo) {
        return;
    }

    if (!arquivo.type.startsWith("image/")) {
        alert("Selecione uma imagem válida.");
        return;
    }

    const imagem = URL.createObjectURL(arquivo);

    fotoPerfil.src = imagem;
});

const alterarSenha =
    document.querySelector("#alterarSenha");

alterarSenha.addEventListener("click", () => {
    alert("Aqui você poderá abrir o formulário de alteração de senha.");
});

const cancelar = document.querySelector("#cancelar");

cancelar.addEventListener("click", () => {

    const confirmar = confirm("Deseja cancelar as alterações?");

    if (confirmar) {
        location.reload();
    }
});

for(let i = 0; i < usuario.redesSociais.length; i++){
  console.log('passando pelo loop');
  switch (usuario.redesSociais[i].site) {
    case "instagram":
        document.getElementById('inp-instagram').value = usuario.redesSociais[i].link;
        console.log('adicionando instagram');
        break;
    case "github": 
        document.getElementById('inp-github').value = usuario.redesSociais[i].link;
        console.log('adicionando github');
        break;
    default:
        break;
    }
}

//Salvar alterações
const campos = document.querySelectorAll('input');  
let camposAlterados = [];

campos.forEach(campo => {
    console.log('id do campo:', campo.id);
})

document.querySelector('.salvar').addEventListener('click', () => {
    campos.forEach(campo => {
        if(campo.id !== "search"){  ;
            switch (campo.id) {
                case "nome":
                    console.log('o campo de nome foi alterado:', usuario.completeName !== campo.value);
                    if(usuario.completeName!== campo.value){
                        camposAlterados.push(campo.id);
                    }
                    break;
                case "username":
                    console.log('o campo de nome foi alterado:', usuario.username !== campo.value);
                    if(usuario.username !== campo.value){
                        camposAlterados.push(campo.id);
                    }
                    break;
                default:
                    break;
            }
        }
    });

    console.log('campos alterados:', camposAlterados);
});


