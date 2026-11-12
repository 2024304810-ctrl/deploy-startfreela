// dropdown do avatar (header)
document.addEventListener('DOMContentLoaded', () => {
  const avatarWrap = document.querySelector('.avatar-wrap');
  const dropdown = document.querySelector('.avatar-dropdown');

  if (!avatarWrap || !dropdown) return;

  avatarWrap.addEventListener('click', (e) => {
    e.stopPropagation(); // impede que o clique "vaze" pro document e feche na hora
    dropdown.classList.toggle('open');
  });

  // fecha se clicar em qualquer lugar fora do menu
  document.addEventListener('click', (e) => {
    if (!avatarWrap.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  });

  // fecha com a tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdown.classList.remove('open');
    }
  });
});
