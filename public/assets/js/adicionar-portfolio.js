import logout from '/js.utils/logout.js';

console.log(localStorage.getItem('token'));
import parseJwt from '/js.utils/parseJwt.js';

const token = localStorage.getItem('token');
const usuario = parseJwt(token);

document.getElementById('sair').addEventListener('click', () => {
    logout();
});

const usuarioRole = document.querySelector(".role-pill");
usuarioRole.innerHTML = usuarioRole.textContent.toUpperCase();

document.addEventListener('DOMContentLoaded', () => {

  // ============ CAPA ============
  const capaUpload = document.getElementById('capaUpload');
  const capaInput = document.getElementById('capaInput');

  capaInput.addEventListener('change', () => {
    const arquivo = capaInput.files[0];
    if (!arquivo) return;

    const leitor = new FileReader();
    leitor.onload = (e) => {
      const placeholder = capaUpload.querySelector('.capa-placeholder');
      const preview = capaUpload.querySelector('.capa-preview');
      const trocar = capaUpload.querySelector('.capa-trocar');

      preview.src = e.target.result;
      preview.hidden = false;
      placeholder.hidden = true;
      trocar.hidden = false;
      capaUpload.classList.add('tem-imagem');
    };
    leitor.readAsDataURL(arquivo);
  });

  // ============ CARROSSEL DE IMAGENS ============
  const carrosselImagens = document.getElementById('carrosselImagens');
  const btnAdicionarImagem = document.getElementById('btnAdicionarImagem');

  function criarItemCarrossel() {
    const item = document.createElement('div');
    item.className = 'carrossel-item';
    item.innerHTML = `
      <label class="carrossel-slot">
        <input type="file" accept="image/*" class="carrossel-input" hidden>
        <i class="fa-solid fa-plus"></i>
        <img class="carrossel-preview" hidden alt="">
        <button type="button" class="carrossel-remover"><i class="fa-solid fa-xmark"></i></button>
      </label>
      <input type="text" class="field campo-legenda" placeholder="Descreva esta imagem...">
    `;
    ativarItemCarrossel(item);
    return item;
  }

  function ativarItemCarrossel(item) {
    const input = item.querySelector('.carrossel-input');
    const icone = item.querySelector('.carrossel-slot > i');
    const preview = item.querySelector('.carrossel-preview');

    input.addEventListener('change', () => {
      const arquivo = input.files[0];
      if (!arquivo) return;

      const leitor = new FileReader();
      leitor.onload = (e) => {
        preview.src = e.target.result;
        preview.hidden = false;
        icone.hidden = true;
      };
      leitor.readAsDataURL(arquivo);
    });

    item.querySelector('.carrossel-remover').addEventListener('click', (e) => {
      e.preventDefault();  // nao abre o seletor de arquivo
      e.stopPropagation();
      item.remove();       // apaga o card inteiro (imagem + legenda)
    });
  }

  // ativa os itens de exemplo que ja vem prontos no HTML
  document.querySelectorAll('#carrosselImagens .carrossel-item:not(.carrossel-add)').forEach(ativarItemCarrossel);

  // botao "Adicionar": cria um novo item antes do proprio botao
  btnAdicionarImagem.addEventListener('click', () => {
    const novoItem = criarItemCarrossel();
    carrosselImagens.insertBefore(novoItem, btnAdicionarImagem);

    // abre o seletor de arquivo direto, ja economizando um clique
    novoItem.querySelector('.carrossel-input').click();

    // rola o carrossel ate o final pra mostrar o item novo
    carrosselImagens.scrollTo({ left: carrosselImagens.scrollWidth, behavior: 'smooth' });
  });

  // ============ ANEXOS ============
  const anexoInput = document.getElementById('anexoInput');
  const listaAnexos = document.getElementById('listaAnexos');

  function formatarTamanho(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function iconePorTipo(nomeArquivo) {
    const ext = nomeArquivo.split('.').pop().toLowerCase();
    if (['pdf'].includes(ext)) return 'fa-file-pdf';
    if (['doc', 'docx'].includes(ext)) return 'fa-file-word';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'fa-file-image';
    if (['zip', 'rar'].includes(ext)) return 'fa-file-zipper';
    return 'fa-file';
  }

  anexoInput.addEventListener('change', () => {
    Array.from(anexoInput.files).forEach((arquivo) => {
      const item = document.createElement('div');
      item.className = 'anexo-item';
      item.innerHTML = `
        <i class="fa-solid ${iconePorTipo(arquivo.name)}"></i>
        <span class="anexo-nome">${arquivo.name}</span>
        <span class="anexo-tamanho">${formatarTamanho(arquivo.size)}</span>
        <button type="button" class="anexo-remover" title="Remover"><i class="fa-solid fa-xmark"></i></button>
      `;
      item.querySelector('.anexo-remover').addEventListener('click', () => item.remove());
      listaAnexos.appendChild(item);
    });

    anexoInput.value = ''; // permite anexar o mesmo arquivo de novo se remover e re-adicionar
  });

});



const inputHabTec = document.getElementById('inputHabTec')
const divChips = document.getElementById('div-chips')

console.log('Adicionar Projeto');

const habilidades = [];

inputHabTec.addEventListener('keydown', (event)=>{

  if (event.key === 'Enter') {
 
    event.preventDefault(); 
    
    const textoChip = inputHabTec.value.trim(); 
    
    if (textoChip !== '') {
      console.log('Debug')
      
      habilidades.push(textoChip);
      divChips.innerHTML += `<span class="chip">${textoChip}<i class="fa-solid fa-xmark apagar"></i></span>`;
      
      inputHabTec.value = ''; 
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

document.querySelector('#salvar-projeto').addEventListener('click', async(e) => {
  console.log('clicou');

  e.preventDefault();

  const imagemCapa = document.getElementById('capaInput');
  const tituloProjeto = document.getElementById('tituloInput').value;
  const categoria = document.getElementById('categoriaSelect').value;
  const dataConclusao = document.getElementById('dataConclusao').value;
  const descricao = document.getElementById('descricao').value;
  const links = document.querySelectorAll('.link');

  const formData = new FormData();

  console.log('habilidades:', habilidades);

  formData.append('idUser', usuario.id);
  formData.append('imagemCapa', imagemCapa.files[0]);
  formData.append('titulo', tituloProjeto);
  formData.append('categoria', categoria);
  formData.append('dataConclusao', dataConclusao);
  formData.append('descricao', descricao);
  formData.append('habilidades', habilidades)
  //formData.append('links', links);

  const obj = Object.fromEntries(formData);

  console.log(obj);

  const resposta = await fetch('/api/add.project', {
    method: "POST",
    body: formData
  })

  const dados = await resposta.json();

  console.log(dados);

  if(dados.success){
    window.location.href='/profile'
  }else{
    console.log('deu errado!');
  }
  
});
