document.addEventListener('DOMContentLoaded', () => {

  const body = document.body;
  const etapas = Array.from(document.querySelectorAll('.etapa'));
  const barraPreenchida = document.querySelector('.progresso-preenchida');
  const progressoTexto = document.querySelector('.progresso-texto');
  const btnVoltar = document.querySelector('.btn-voltar-etapa');
  const btnPular = document.querySelector('.btn-pular-etapa');
  const btnContinuar = document.querySelector('.btn-continuar');
  const btnFechar = document.querySelector('.onboarding-fechar');
  const tituloSobre = document.querySelector('.titulo-sobre');
  const descSobre = document.querySelector('.descricao-sobre');

  let indiceAtual = 0;
  let etapasVisiveis = [];

  function role() {
    return body.dataset.role; // "freelancer" ou "cliente"
  }

  // Decide quais etapas aparecem, de acordo com o papel do usuário
  function calcularEtapasVisiveis() {
    etapasVisiveis = etapas.filter((etapa) => {
      if (etapa.hasAttribute('data-etapa-comum')) return true;
      if (etapa.hasAttribute('data-etapa-freelancer')) return role() === 'freelancer';
      return true;
    });

    // dentro da etapa "Redes Sociais", GitHub/Behance só aparecem pro freelancer
    document.querySelectorAll('.etapa-so-freelancer-inline').forEach((el) => {
      el.style.display = role() === 'freelancer' ? '' : 'none';
    });

    // texto da última etapa muda conforme o papel
    if (tituloSobre && descSobre) {
      if (role() === 'cliente') {
        tituloSobre.textContent = 'Fale um pouco sobre você';
        descSobre.textContent = 'Conte que tipo de projeto você costuma contratar — isso ajuda freelancers a entenderem seu perfil.';
      } else {
        tituloSobre.textContent = 'Fale um pouco sobre você';
        descSobre.textContent = 'Uma breve bio ajuda clientes a te conhecerem antes de contratar.';
      }
    }
  }

  function mostrarEtapa(indice) {
    etapas.forEach((etapa) => { etapa.hidden = true; });
    etapasVisiveis.forEach((etapa, i) => {
      etapa.hidden = (i !== indice);
    });

    const total = etapasVisiveis.length;
    const passoAtual = indice + 1;

    progressoTexto.textContent = `Passo ${passoAtual} de ${total}`;
    barraPreenchida.style.width = `${(passoAtual / total) * 100}%`;

    btnVoltar.disabled = indice === 0;
    if(indice === total - 1){
      btnContinuar.innerHTML = 'Concluir <i class="fa-solid fa-check"></i>';
      btnContinuar.id = 'concluir';
    }else{
      btnContinuar.innerHTML = 'Continuar <i class="fa-solid fa-arrow-right"></i>';
      btnContinuar.id = 'continuar';
    }
  }

  function irPara(indice) {
    indiceAtual = Math.max(0, Math.min(indice, etapasVisiveis.length - 1));
    mostrarEtapa(indiceAtual);
  }

  function avancar() {
    if (indiceAtual >= etapasVisiveis.length - 1) {
      // ultima etapa: "Concluir"
      alert('Perfil atualizado! (em produção, aqui redireciona pra tela inicial)');
      adicionarInformacoes();
      return;
    }
    irPara(indiceAtual + 1);
  }

  btnContinuar.addEventListener('click', avancar);
  btnPular.addEventListener('click', avancar);
  btnVoltar.addEventListener('click', () => irPara(indiceAtual - 1));

  btnFechar.addEventListener('click', () => {
    alert('Onboarding adiado — volta a aparecer no próximo login, já que ainda não foi preenchido. (em produção, redireciona pra tela inicial)');
  });

  // ===== Seletor de prévia (só existe neste protótipo) =====
  document.querySelectorAll('.preview-btn').forEach((botao) => {
    botao.addEventListener('click', () => {
      document.querySelectorAll('.preview-btn').forEach((b) => b.classList.remove('active'));
      botao.classList.add('active');
      body.dataset.role = botao.dataset.previewRole;
      calcularEtapasVisiveis();
      irPara(0);
    });
  });

  calcularEtapasVisiveis();
  irPara(0);
});

const campoInputChips = document.getElementById('inputChips');
const formChips = document.getElementById('form-chips');
let habilidades = [];

campoInputChips.addEventListener('blur', () => {
  if(campoInputChips.value.trim() !== ""){
    formChips.submit();
  }
});

formChips.addEventListener('submit', (e) => {
  e.preventDefault();

  const habilidade = campoInputChips.value;
  habilidades.push(habilidade);

});

//CEP
const inputCEP = document.getElementById('inputCEP');
inputCEP.addEventListener('input', (e)=>{
  let value = e.target.value;
  value = value.replace(/\D/g, "");
  value = value.replace(/^(\d{5})(\d)/, "$1-$2");
  e.target.value = value.slice(0,9);  

  if(value.length === 9){
    buscarCEP(value);
  }
})

async function buscarCEP(cep){
  const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`)

  const dados = await resposta.json();

  console.log(dados);

  const selectPais = document.getElementById('pais');
  const selectEstado = document.getElementById('estado');
  const selectCidade = document.getElementById('cidade');

  selectPais.innerHTML="";
  selectEstado.innerHTML="";
  selectCidade.innerHTML="";

  const pais = "Brasil";
  const estado = dados.estado;
  const cidade = dados.localidade;

  console.log('país:', pais);
  console.log('estado:', estado);
  console.log('cidade:', cidade);
  
  const dadosCep = [pais, estado, cidade];
  const selects = [selectPais, selectEstado, selectCidade];

  console.log('adicionando...');
  for(let i = 0; i < 3; i++){
    let opcao = document.createElement('option');
    opcao.value = dadosCep[i];
    opcao.text = dadosCep[i];

    selects[i].value = dadosCep[i];

    console.log('valor:', selects[i].value);

    if(dadosCep[i] === undefined){
      opcao.text = "Não Identificado";
    }

    selects[i].appendChild(opcao);

    selects[i].disabled = false;
  }

}

//HABILIDADES
const inputChips = document.getElementById('inputChips')
const divChips = document.getElementById('div-chips')

inputChips.addEventListener('keydown', (event)=>{

  if (event.key === 'Enter') {
 
    event.preventDefault(); 
    
    const textoChip = inputChips.value.trim(); 
    
    if (textoChip !== '') {
      console.log('Debug')
   
      divChips.innerHTML += `<span class="chip">${textoChip}<i class="fa-solid fa-xmark apagar"></i></span>`;
      habilidades.push(textoChip);
      inputChips.value = ''; 
    }
  }
})

divChips.addEventListener('click', (event) => {
 
  if (event.target.classList.contains('apagar')) {
   
    const chip = event.target.closest('.chip');
    chip.remove();
    habilidades.pop();
  }
});

const inputQuantia = document.querySelector('.inputQuantia');
inputQuantia.addEventListener('input', (event) => {
  const e = event.target;
  let valor = e.value.replace(/\D/g, "");

  const valorDecimal = (Number(valor) / 100).toFixed(2);

  e.value = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valorDecimal);
});

import parseJwt from '/js.utils/parseJwt.js';

const token = localStorage.getItem('token');
const usuario = parseJwt(token);

//Adicionar Informações do usuário
async function adicionarInformacoes() {
  const localidade = {
    pais: document.getElementById('pais').value,
    estado: document.getElementById('estado').value,
    cidade: document.getElementById('cidade').value
  };
  const profissao = document.querySelector('#profissao').value;
  const quantia = {
    valor: inputQuantia.value,
    per: document.querySelector('.selectQuantia').value
  };

  let redesSociais = [];

  let inputsRedesSociais = document.querySelectorAll('#input-redesocial');

  console.log('quantidade de inputs:', inputsRedesSociais.length);

  inputsRedesSociais.forEach(redeSocial => {
    if(redeSocial.value !== ""){
      console.log('texto do input:', redeSocial.value);
      redesSociais.push({
        site: redeSocial.name,
        link: redeSocial.value
      });
    }
  });

  const sobreMim = document.querySelector('#sobre-mim').value;

  const dadosParaEnviar = {
    idUser: usuario.id,
    localidade: localidade,
    profissao: profissao,
    habilidades: habilidades,
    quantia: quantia,
    redesSociais: redesSociais,
    sobreMim: sobreMim
  }

  console.log(dadosParaEnviar);

  const resposta = await fetch('/api/informacoesAdicionais', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dadosParaEnviar)
  });

  const dados = await resposta.json();

  if(dados.success){
    window.location.href='/profile';
  }else{
    console.log('deu errado');
  }
  
}