// H-6201 – v0.3 (só ler e pintar estados)
(function () {
  // aplica classes de cor conforme o estado vindo do BD
  function aplicarEstado(el, queimador, piloto) {
    el.classList.remove(
      'is-burner-aceso','is-burner-apagado','is-burner-manutencao',
      'is-pilot-aceso','is-pilot-apagado','is-pilot-manutencao'
    );
    el.classList.add('is-burner-' + queimador); // fundo do círculo maior
    el.classList.add('is-pilot-' + piloto);     // pontinho (::after)
  }

  async function carregarEstados() {
    try {
      const resp = await fetch('index.php?url=H6201Controller/carregar', { cache: 'no-store' });
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      const data = await resp.json();
      if (!data.ok) throw new Error('API retornou ok=false');

      (data.itens || []).forEach(item => {
        // seus elementos no DOM são #q1, #q2, ..., #q40
        const el = document.getElementById('q' + item.id);
        if (el) aplicarEstado(el, item.queimador, item.piloto);
      });
    } catch (err) {
      console.error('H-6201: erro ao carregar estados:', err);
    }
  }

  // (adicione dentro do IIFE onde já está seu código)

let modalEl, selectQueimador, selectPiloto, modalIdEl, btnSalvar, btnCancelar;
let idSelecionado = null;

// pega os refs do modal (chame isso dentro do init)
function pegarRefsModal() {
  modalEl = document.getElementById('h6201Modal');
  selectQueimador = document.getElementById('h6201Queimador');
  selectPiloto = document.getElementById('h6201Piloto');
  modalIdEl = document.getElementById('h6201ModalId');
  btnSalvar = document.getElementById('h6201Salvar');
  btnCancelar = document.getElementById('h6201Cancelar');
}

function abrirModal(id, estadoAtual) {
  selectQueimador.focus()
  idSelecionado = id;
  modalIdEl.textContent = '#' + id;
  // preenche selects com o que está pintado na tela
  selectQueimador.value = estadoAtual.queimador;
  selectPiloto.value = estadoAtual.piloto;
  modalEl.style.display = 'block';
}

function fecharModal() {
  idSelecionado = null;
  modalEl.style.display = 'none';
}

// extrai do DOM o estado atual daquele bico (com base nas classes já aplicadas)
function lerEstadoDoElemento(el) {
  const get = (prefix) => (
    el.classList.contains(prefix + 'aceso') ? 'aceso' :
    el.classList.contains(prefix + 'manutencao') ? 'manutencao' : 'apagado'
  );
  return {
    queimador: get('is-burner-'),
    piloto:    get('is-pilot-')
  };
}

// salva no backend
async function salvarEstado() {
  if (!idSelecionado) return;

  const payload = {
    id: idSelecionado,
    queimador: selectQueimador.value,
    piloto: selectPiloto.value
  };

  const resp = await fetch('index.php?url=H6201Controller/salvar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await resp.json();
  if (!resp.ok || !data.ok) {
    console.error('Falha ao salvar');
    return;
  }

  fecharModal();
  // repinta todos a partir do BD (garante consistência)
  carregarEstados();
}

// === Ajustes no init existente ===
function h6201Init() {
  const root = document.getElementById('h6201Painel');
  if (!root) return false;
  if (root.dataset.jsBound === '1') return true;  // já iniciado
  root.dataset.jsBound = '1';

  pegarRefsModal();
  if (!modalEl || !selectQueimador || !selectPiloto || !btnSalvar || !btnCancelar) {
    console.warn('H-6201: modal incompleto — init parcial.');
    carregarEstados();
    return true;
  }

    // abre modal no clique do bico
  root.addEventListener('click', (ev) => {
    const bico = ev.target.closest('.h6201-bico');
    if (!bico) return;
    const id = parseInt(bico.id.replace(/^q/, ''), 10);
    const estado = lerEstadoDoElemento(bico);
    abrirModal(id, estado);
  });

  // botões do modal
  btnSalvar.addEventListener('click', salvarEstado);
  btnCancelar.addEventListener('click', fecharModal);
   
    modalEl.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') fecharModal();
    if (e.key === 'Enter')  salvarEstado();
  });

  // primeira pintura
  carregarEstados();
  return true;
}

  window.h6201Init = h6201Init;
})();
