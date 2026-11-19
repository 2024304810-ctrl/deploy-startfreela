import logout from '/js.utils/logout.js';

console.log(localStorage.getItem('token'));

document.getElementById('sair').addEventListener('click', () => { logout() });

const usuarioRole = document.querySelector(".role-pill");
usuarioRole.innerHTML = usuarioRole.textContent.toUpperCase();

const botaoConversa = document.querySelector('.btn-editar');
botaoConversa.addEventListener('click', () => {
    console.log('id do botão:', botaoConversa.id);
    window.location.href=`/chat?di=${botaoConversa.id}`;
})