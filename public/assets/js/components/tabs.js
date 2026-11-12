// sistema de abas genérico
// uso: botões com [data-tab="chave"] dentro de .fc-tabs
// conteúdos com [data-content="chave"] como irmãos logo depois
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.fc-tabs').forEach((tabGroup) => {
    const botoes = tabGroup.querySelectorAll('.fc-tab');
    const painel = tabGroup.parentElement;

    botoes.forEach((botao) => {
      botao.addEventListener('click', () => {
        const alvo = botao.dataset.tab;

        // troca o botão ativo
        botoes.forEach((b) => b.classList.remove('active'));
        botao.classList.add('active');

        // mostra só o conteúdo correspondente
        painel.querySelectorAll('.fc-tab-content').forEach((conteudo) => {
          conteudo.hidden = conteudo.dataset.content !== alvo;
        });
      });
    });
  });
});
