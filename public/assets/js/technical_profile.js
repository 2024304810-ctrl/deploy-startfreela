
import logout from '/js.utils/logout.js';

document.addEventListener('DOMContentLoaded', () => {

    console.log('Perfil público carregado.');

    // Sair da conta
    const botaoSair = document.getElementById('sair');

    if (botaoSair) {
        botaoSair.addEventListener('click', event => {
            event.preventDefault();
            logout();
        });
    }

    // Converter o tipo de usuário para maiúsculo
    const usuarioRole = document.querySelector('.role-pill');

    if (usuarioRole) {
        usuarioRole.textContent =
            usuarioRole.textContent.trim().toUpperCase();
    }

    // Abrir conversa
    const botaoConversa = document.querySelector('.btn-editar');

    if (botaoConversa) {
        botaoConversa.addEventListener('click', () => {

            const idPerfil = botaoConversa.id;

            if (!idPerfil) {
                console.error('ID do perfil não encontrado.');
                return;
            }

            window.location.href =
                `/chat?di=${encodeURIComponent(idPerfil)}`;
        });
    }

});
