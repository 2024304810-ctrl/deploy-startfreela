(() => {
  'use strict';

  /* =========================================================
     CONTEÚDO DAS JANELAS DE AJUDA
     (textos de exemplo: ajuste conforme as regras reais da plataforma)
     ========================================================= */
  const AJUDA = {
    conta: {
      titulo: 'Conta e Perfil',
      icone: 'fa-user',
      intro: 'Dúvidas sobre cadastro, dados pessoais e configurações da sua conta.',
      itens: [
        { p: 'Como edito meu perfil?',
          r: 'Abra o menu do seu avatar, clique em "Ver perfil" e use o botão de edição para atualizar foto, descrição, localização e demais informações.' },
        { p: 'Como altero minha senha ou meu e-mail?',
          r: 'Acesse "Configurações da Conta" no menu do avatar. Por segurança, podemos pedir que você confirme sua identidade antes de salvar a alteração.' },
        { p: 'Esqueci minha senha. E agora?',
          r: 'Na tela de login, clique em "Esqueci minha senha" e informe o e-mail cadastrado. Enviaremos um link para você criar uma nova senha.' },
        { p: 'Como desativo ou excluo minha conta?',
          r: 'Em "Configurações da Conta" você encontra as opções de desativar ou excluir. Contratos em andamento precisam ser concluídos ou encerrados antes.' }
      ]
    },

    pagamentos: {
      titulo: 'Pagamentos e Recebimentos',
      icone: 'fa-wallet',
      intro: 'Tudo sobre pagar um projeto, receber pelo seu trabalho e acompanhar valores.',
      itens: [
        { p: 'Quando eu recebo pelo trabalho entregue?',
          r: 'O valor é liberado depois que o cliente aprova a entrega ou quando o prazo de análise termina. Você acompanha o status pelo contrato.' },
        { p: 'Quais formas de pagamento são aceitas?',
          r: 'As formas disponíveis aparecem na hora de contratar. Mantenha seus dados de pagamento atualizados para evitar atrasos.' },
        { p: 'Meu pagamento não aparece. O que faço?',
          r: 'Confira o status no contrato e aguarde o tempo de compensação da forma escolhida. Se continuar sem aparecer, reporte o problema com o comprovante anexado.' },
        { p: 'Existem taxas sobre os valores?',
          r: 'As taxas da plataforma são exibidas antes da confirmação de cada contrato, para que você saiba exatamente quanto vai pagar ou receber.' }
      ]
    },

    contratos: {
      titulo: 'Contratos e Prazos',
      icone: 'fa-file-contract',
      intro: 'Como funcionam contratos, entregas, prorrogações e cancelamentos.',
      itens: [
        { p: 'Como funciona um contrato na plataforma?',
          r: 'Depois que o cliente aceita uma proposta, o contrato é criado com valor, escopo e prazo. Todo o andamento fica registrado e vale como histórico para ambos.' },
        { p: 'Como peço mais prazo para entregar?',
          r: 'Abra o contrato e envie uma solicitação de prorrogação com o motivo. A nova data só vale depois que a outra parte aceitar.' },
        { p: 'Posso cancelar um contrato?',
          r: 'Sim, mas as condições dependem da etapa em que o projeto está. Sempre que possível, combine o encerramento pelo chat para ficar registrado.' },
        { p: 'O que acontece se o prazo vencer?',
          r: 'O contrato é sinalizado e ambas as partes são avisadas. Você pode combinar um novo prazo ou abrir uma disputa com nossa equipe.' }
      ]
    },

    seguranca: {
      titulo: 'Segurança e Verificação',
      icone: 'fa-shield-halved',
      intro: 'Proteja sua conta, entenda os selos e saiba como evitar golpes.',
      itens: [
        { p: 'Como verifico minha identidade?',
          r: 'Envie seus documentos pela área de verificação. Nossa equipe analisa as informações e, quando aprovadas, o selo "Verificado" aparece no seu perfil.' },
        { p: 'O que significa o selo "Verificado"?',
          r: 'Ele indica que a identidade da pessoa foi validada pela equipe StartFreela. É um sinal de confiança, mas não substitui o bom senso ao negociar.' },
        { p: 'Como evito golpes?',
          r: 'Negocie e pague sempre dentro da plataforma, desconfie de pedidos para sair do chat e nunca compartilhe senhas ou códigos recebidos por e-mail ou SMS.' },
        { p: 'Suspeito que minha conta foi invadida.',
          r: 'Troque sua senha imediatamente em "Configurações da Conta" e reporte o ocorrido para que nossa equipe analise a atividade da conta.' }
      ]
    },

    avaliacoes: {
      titulo: 'Avaliações e Reputação',
      icone: 'fa-star',
      intro: 'Entenda como as notas funcionam e como construir uma boa reputação.',
      itens: [
        { p: 'Quem pode me avaliar?',
          r: 'Apenas quem concluiu um contrato com você na plataforma. Por isso todas as avaliações têm o selo de contrato verificado.' },
        { p: 'Como minha nota média é calculada?',
          r: 'Ela é a média das notas recebidas em contratos concluídos e é atualizada automaticamente a cada nova avaliação.' },
        { p: 'Posso editar ou apagar uma avaliação?',
          r: 'As avaliações não podem ser editadas nem removidas pelo perfil avaliado, para manter a credibilidade do histórico.' },
        { p: 'Recebi uma avaliação injusta ou ofensiva.',
          r: 'Se ela foge da realidade do contrato ou contém ofensas, reporte o problema indicando o contrato relacionado e nossa equipe fará a análise.' }
      ]
    }
  };

  /* Palavras extras para a busca da página (a janela de denúncia não usa a lista acima) */
  const BUSCA_DENUNCIA = 'denuncia denúncias disputas reportar problema golpe fraude assédio abuso conflito';

  /* =========================================================
     HELPERS
     ========================================================= */
  const $ = (seletor, raiz = document) => raiz.querySelector(seletor);
  const $$ = (seletor, raiz = document) => Array.from(raiz.querySelectorAll(seletor));
  const normalizar = (t) => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const ovFaq = $('#modal-faq');
  const ovDenuncia = $('#modal-denuncia');
  let focoAnterior = null;

  /* =========================================================
     ABRIR / FECHAR JANELAS
     ========================================================= */
  function abrir(overlay) {
    if (!overlay) return;
    focoAnterior = document.activeElement;
    overlay.classList.add('aberto');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-aberto');
    setTimeout(() => $('.modal-fechar', overlay)?.focus(), 60);
  }

  function fechar(overlay) {
    if (!overlay) return;
    overlay.classList.remove('aberto');
    overlay.setAttribute('aria-hidden', 'true');
    if (!$('.modal-overlay.aberto')) {
      document.body.classList.remove('modal-aberto');
      focoAnterior?.focus?.();
    }
  }

  function abrirAjuda(chave) {
    const dados = AJUDA[chave];
    if (!dados) return;

    $('#faq-titulo').textContent = dados.titulo;
    $('#faq-intro').textContent = dados.intro;
    $('#faq-icone').innerHTML = `<i class="fa-solid ${dados.icone}"></i>`;

    const lista = $('#faq-lista');
    lista.innerHTML = '';
    dados.itens.forEach((item, i) => {
      const id = `faq-${chave}-${i}`;
      const bloco = document.createElement('div');
      bloco.className = 'faq-item';

      const botao = document.createElement('button');
      botao.type = 'button';
      botao.className = 'faq-pergunta';
      botao.setAttribute('aria-expanded', 'false');
      botao.setAttribute('aria-controls', id);
      const texto = document.createElement('span');
      texto.textContent = item.p;
      botao.append(texto, Object.assign(document.createElement('i'), { className: 'fa-solid fa-chevron-down' }));

      const resposta = document.createElement('div');
      resposta.className = 'faq-resposta';
      resposta.id = id;
      resposta.hidden = true;
      resposta.textContent = item.r;

      botao.addEventListener('click', () => {
        const abrindo = resposta.hidden;
        resposta.hidden = !abrindo;
        bloco.classList.toggle('aberto', abrindo);
        botao.setAttribute('aria-expanded', String(abrindo));
      });

      bloco.append(botao, resposta);
      lista.append(bloco);
    });

    $('.modal-corpo', ovFaq).scrollTop = 0;
    abrir(ovFaq);
  }

  function abrirDenuncia() {
    // se veio de dentro da janela de ajuda, fecha ela primeiro
    const focoOriginal = ovFaq.classList.contains('aberto') ? focoAnterior : document.activeElement;
    ovFaq.classList.remove('aberto');
    ovFaq.setAttribute('aria-hidden', 'true');
    abrir(ovDenuncia);
    focoAnterior = focoOriginal;
  }

  function abrirPorChave(chave) {
    if (chave === 'denuncia') abrirDenuncia();
    else abrirAjuda(chave);
  }

  document.addEventListener('click', (e) => {
    const gatilho = e.target.closest('[data-modal]');
    if (gatilho) {
      abrirPorChave(gatilho.dataset.modal);
      return;
    }
    if (e.target.closest('[data-fechar]')) {
      fechar(e.target.closest('.modal-overlay'));
      return;
    }
    // clique no fundo desfocado fecha a janela
    if (e.target.classList?.contains('modal-overlay')) fechar(e.target);
  });

  document.addEventListener('keydown', (e) => {
    const aberto = $('.modal-overlay.aberto');
    if (!aberto) return;

    if (e.key === 'Escape') {
      fechar(aberto);
      return;
    }

    // mantém o foco dentro da janela
    if (e.key === 'Tab') {
      const focaveis = $$('button, [href], input:not([type="file"]), select, textarea, label.area-upload, [tabindex]:not([tabindex="-1"])', aberto)
        .filter((el) => !el.disabled && el.offsetParent !== null);
      if (!focaveis.length) return;
      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      if (e.shiftKey && document.activeElement === primeiro) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primeiro.focus();
      }
    }
  });

  /* =========================================================
     BUSCA DE AJUDA (filtra os cards de categoria)
     ========================================================= */
  const campoBusca = $('#busca-ajuda');
  const cards = $$('#categorias .card-categoria');
  const semResultado = $('#sem-resultado');

  const indice = {};
  Object.entries(AJUDA).forEach(([chave, d]) => {
    indice[chave] = normalizar([d.titulo, d.intro, ...d.itens.flatMap((i) => [i.p, i.r])].join(' '));
  });
  indice.denuncia = normalizar('Denúncias e Disputas ' + BUSCA_DENUNCIA);

  campoBusca?.addEventListener('input', () => {
    const termo = normalizar(campoBusca.value.trim());
    let visiveis = 0;
    cards.forEach((card) => {
      const bate = !termo || (indice[card.dataset.modal] || '').includes(termo);
      card.hidden = !bate;
      if (bate) visiveis++;
    });
    semResultado.hidden = visiveis > 0;
  });

  /* =========================================================
     FORMULÁRIO DE DENÚNCIA
     ========================================================= */
  const form = $('#form-denuncia');
  const tipo = $('#tipo-problema');
  const descricao = $('#descricao');
  const contador = $('#contador');
  const inputArquivos = $('#evidencias');
  const listaArquivos = $('#lista-arquivos');
  const erroArquivos = $('#erro-arquivos');
  const areaUpload = $('#area-upload');
  const sucesso = $('#denuncia-sucesso');

  const MAX_ARQUIVOS = 5;
  const MAX_BYTES = 5 * 1024 * 1024;
  let arquivos = [];

  descricao.addEventListener('input', () => {
    contador.textContent = descricao.value.length;
  });

  [tipo, descricao].forEach((campo) =>
    campo.addEventListener('input', () => campo.closest('.campo').classList.remove('com-erro'))
  );

  function desenharArquivos() {
    listaArquivos.innerHTML = '';
    arquivos.forEach((arq, i) => {
      const li = document.createElement('li');
      const nome = document.createElement('span');
      nome.textContent = `${arq.name} (${(arq.size / 1024 / 1024).toFixed(1)} MB)`;
      const remover = document.createElement('button');
      remover.type = 'button';
      remover.setAttribute('aria-label', `Remover ${arq.name}`);
      remover.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      remover.addEventListener('click', () => {
        arquivos.splice(i, 1);
        desenharArquivos();
      });
      li.append(nome, remover);
      listaArquivos.append(li);
    });
  }

  function adicionarArquivos(novos) {
    const todos = arquivos.concat(Array.from(novos));
    const invalido = todos.length > MAX_ARQUIVOS || todos.some((a) => a.size > MAX_BYTES);
    erroArquivos.closest('.campo').classList.toggle('com-erro', invalido);
    if (invalido) return;
    arquivos = todos;
    desenharArquivos();
  }

  inputArquivos.addEventListener('change', (e) => {
    adicionarArquivos(e.target.files);
    e.target.value = '';
  });

  ['dragenter', 'dragover'].forEach((ev) =>
    areaUpload.addEventListener(ev, (e) => { e.preventDefault(); areaUpload.classList.add('sobre'); })
  );
  ['dragleave', 'drop'].forEach((ev) =>
    areaUpload.addEventListener(ev, (e) => { e.preventDefault(); areaUpload.classList.remove('sobre'); })
  );
  areaUpload.addEventListener('drop', (e) => adicionarArquivos(e.dataTransfer.files));

  function validar() {
    const regras = [
      [tipo, !!tipo.value],
      [descricao, descricao.value.trim().length >= 20]
    ];
    let ok = true;
    regras.forEach(([campo, valido]) => {
      campo.closest('.campo').classList.toggle('com-erro', !valido);
      if (!valido) ok = false;
    });
    return ok;
  }

  function limparFormulario() {
    form.reset();
    arquivos = [];
    desenharArquivos();
    contador.textContent = '0';
    $$('.com-erro', form).forEach((c) => c.classList.remove('com-erro'));
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validar()) {
      (tipo.value ? descricao : tipo).focus();
      return;
    }

    const dados = new FormData();
    dados.append('tipo', tipo.value);
    dados.append('contrato', $('#contrato').value);
    dados.append('usuario', $('#denunciado').value.trim());
    dados.append('descricao', descricao.value.trim());
    dados.append('anonima', $('#anonimo').checked);
    arquivos.forEach((a) => dados.append('evidencias', a));

    const botao = $('button[type="submit"]', form);
    botao.disabled = true;
    let protocolo = 'DN-' + Date.now().toString().slice(-8);

    /* TODO: troque pelo endpoint real do seu back-end
    try {
      const res = await fetch('/api/denuncias', { method: 'POST', body: dados });
      if (!res.ok) throw new Error('Falha ao enviar');
      protocolo = (await res.json()).protocolo;
    } catch (erro) {
      alert('Não foi possível enviar a denúncia. Tente novamente.');
      botao.disabled = false;
      return;
    }
    */

    $('#protocolo').textContent = 'Protocolo ' + protocolo;
    form.hidden = true;
    sucesso.hidden = false;
    botao.disabled = false;
    $('.modal-corpo', ovDenuncia).scrollTop = 0;
  });

  $('#outra-denuncia').addEventListener('click', () => {
    limparFormulario();
    sucesso.hidden = true;
    form.hidden = false;
    tipo.focus();
  });

  // ao fechar a janela, volta o formulário ao estado inicial
  new MutationObserver(() => {
    if (!ovDenuncia.classList.contains('aberto') && !sucesso.hidden) {
      limparFormulario();
      sucesso.hidden = true;
      form.hidden = false;
    }
  }).observe(ovDenuncia, { attributes: true, attributeFilter: ['class'] });
})();


import logout from '/js.utils/logout.js';

console.log(localStorage.getItem('token'));

document.getElementById('sair').addEventListener('click', () => { logout() });

const usuarioRole = document.querySelector(".role-pill");
usuarioRole.innerHTML = usuarioRole.textContent.toUpperCase();
