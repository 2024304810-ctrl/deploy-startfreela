// accordion genérico (usado no FAQ)
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.faq-item').forEach((item) => {
    const pergunta = item.querySelector('.faq-pergunta');
    pergunta.addEventListener('click', () => {
      const jaAberto = item.classList.contains('open');

      // fecha os outros itens do mesmo grupo (accordion "exclusivo")
      const grupo = item.closest('.faq-lista');
      grupo.querySelectorAll('.faq-item.open').forEach((aberto) => {
        if (aberto !== item) aberto.classList.remove('open');
      });

      item.classList.toggle('open', !jaAberto);
    });
  });
});
