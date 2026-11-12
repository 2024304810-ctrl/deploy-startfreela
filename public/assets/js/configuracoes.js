import logout from '/js.utils/logout.js';
import parseJwt from '/js.utils/parseJwt.js';


console.log(localStorage.getItem('token'));

document.getElementById('sair').addEventListener('click', () => {
    logout();
});

const {usuario} = window.dadosPagina;

console.log('dados do usuário na página:', usuario);

const usuarioRole = document.querySelector(".role-pill");
usuarioRole.innerHTML = usuarioRole.textContent.toUpperCase();

const options = document.querySelectorAll(
    ".settings-option"
);

const sections = document.querySelectorAll(
    ".settings-section"
);

options.forEach(option => {
    option.addEventListener("click", () => {
        const sectionId = option.dataset.section;

        options.forEach(item => {
            item.classList.remove("active");
        });

        option.classList.add("active");

        sections.forEach(section => {
            section.classList.remove("active");
        });

        const section = document.getElementById(sectionId);

        if (section) {
            section.classList.add("active");
        }
    });
});

function formatarNumeroDeTelefone(num){
    return num
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})\d+?$/, '$1'); 
}

document.getElementById('telefone').textContent = formatarNumeroDeTelefone(usuario.contato.phone);

const passwordModal = document.querySelector("#passwordModal");

const changePassword = document.querySelector("#changePassword");

const closePasswordModal = document.querySelector("#closePasswordModal");

function openModal(button, modal){
    button.addEventListener("click", () => {
        modal.classList.add("show");
    });
}

const messageError = document.getElementById('message-error');

closePasswordModal.addEventListener("click", () => {
    passwordModal.classList.remove("show");
    messageError.textContent = "";
});


//Mudar Senha - Modal
openModal(changePassword, passwordModal);
//removeModal(passwordModal);

passwordModal.addEventListener("click", event => {
    if (event.target === passwordModal) {
        passwordModal.classList.remove("show");
        messageError.textContent = "";
    }
});

const savePassword = document.getElementById("savePassword");

savePassword.addEventListener("click", () => {
    const inputs = passwordModal.querySelectorAll("input");
    const atual = inputs[0].value;
    const nova = inputs[1].value;
    const confirmar = inputs[2].value;

    if (!atual || !nova || !confirmar) {
        messageError.textContent = "Preencha todos os campos.";
        return;
    }

    if (nova !== confirmar) {
        messageError.textContent = "As novas senhas não são iguais.";
        return;
    }

    if (nova.length < 6) {
        messageError.textContent = "A nova senha precisa ter pelo menos 6 caracteres.";
        return;
    }

    alert("Senha alterada com sucesso!");
    messageError.textContent = "";
    inputs.forEach(input => {
        input.value = "";
    });

    passwordModal.classList.remove("show");
});

//Analisar Sessões Ativas da Conta
const activeSessionsModal = document.querySelector('#activeSessionsModal');

/*SESSÕES ATIVAS*/
openModal(document.querySelector('#div-activeSessions'), activeSessionsModal);

const closeActiveSessionsModal = document.querySelector("#closeActiveSessionsModal");
closeActiveSessionsModal.addEventListener('click', () => {
    activeSessionsModal.classList.remove("show");
});

const editAccount = document.querySelector("#editAccount");

editAccount.addEventListener("click", () => {
    window.location.href='/edit.profile'
});

const userAgent = navigator.userAgent;
console.log('userAgent:', userAgent);

let sistema = "Sistema Não Identificável";
let navegador = "Navegador Não Identificável";

if(/Windows/.test(userAgent)){
    sistema = "Windows";
}else if(/Macintosh|Mac OS X/.test(userAgent)){
    sistema = "MacOS";
}else if(/Linux/.test(userAgent)){
    sistema = 'Linux';
}else if(/Android/.test(userAgent)){
    sistema = 'Android';
}else if(/like Mac OS X/.test(userAgent)){
    sistema = 'IOS';
}

if (userAgent.indexOf("Firefox") > -1) {
  navegador = "Mozilla Firefox";
} else if (userAgent.indexOf("SamsungBrowser") > -1) {
  navegador = "Samsung Internet";
} else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
  navegador = "Opera";
} else if (userAgent.indexOf("Trident") > -1) {
  navegador = "Internet Explorer";
} else if (userAgent.indexOf("Edge") > -1) {
  navegador = "Microsoft Edge";
} else if (userAgent.indexOf("Chrome") > -1) {
  navegador = "Google Chrome";
} else if (userAgent.indexOf("Safari") > -1) {
  navegador = "Apple Safari";
}

console.log('Sistema:', sistema, "| Navegador:", navegador);

console.log('conectado com a internet:', navigator.onLine);

const darkMode = document.querySelector("#darkMode");

darkMode.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode", darkMode.checked);
});

const deleteAccount = document.querySelector("#deleteAccount");

deleteAccount.addEventListener("click", () => {
    const confirmation = confirm("Tem certeza que deseja excluir sua conta?\n\nEssa ação não poderá ser desfeita.");

    if (confirmation) {
        alert("A conta seria excluída aqui.");
    }
});