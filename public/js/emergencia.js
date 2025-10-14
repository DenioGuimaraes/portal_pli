// /public/js/emergencia.js
(function () {
  'use strict';

  // ------ mapeamento das 3 listas ------
  const M = {
    '1': { ul: '#emg-lista-geral', vazio: '#emg-g-vazio', load: '#emg-g-loading', erro: '#emg-g-erro' },
    '2': { ul: '#emg-lista-1620', vazio: '#emg-1620-vazio', load: '#emg-1620-loading', erro: '#emg-1620-erro' },
    '3': { ul: '#emg-lista-1640', vazio: '#emg-1640-vazio', load: '#emg-1640-loading', erro: '#emg-1640-erro' }
  };

  const state = {
    sel: null,            // { id, grupo, titulo }
    menuObserver: null
  };

  // ------ helpers básicos ------
  const $ = (sel, root = document) => root.querySelector(sel);
  const show = (el, yes = true) => { if (el) el.hidden = !yes; };
  const clear = (el) => { if (el) el.innerHTML = ''; };

  function setBotaoNovo(enabled) {
    const btnNovo = document.querySelector('.menu-direito .botao-direito[onclick*="emergnovo"]');
    if (!btnNovo) return;
    btnNovo.disabled = !enabled;
  }

  function enableNovoUntilMenuLoads() {
    const menu = document.querySelector('.menu-direito');
    if (!menu) return;
    const btn = document.querySelector('.menu-direito .botao-direito[onclick*="emergnovo"]');
    if (btn) return setBotaoNovo(true);

    const observer = new MutationObserver(() => {
      const b = document.querySelector('.menu-direito .botao-direito[onclick*="emergnovo"]');
      if (b) {
        setBotaoNovo(true);
        observer.disconnect();
      }
    });
    observer.observe(menu, { childList: true, subtree: true });
  }



  function setEstado(grupoId, { carregando = false, erro = false, vazio = false } = {}) {
    const map = M[grupoId]; if (!map) return;
    show($(map.load), carregando);
    show($(map.erro), erro);
    show($(map.vazio), vazio);
  }

  // ====== >>> BOTÃO ACESSAR — onde desabilita/habilita <<< ======
  function findBtnAcessar() {
    // 1) pelo onclick do botão do menu direito
    let b = document.querySelector('.menu-direito .botao-direito[onclick*="emeracessar"]');
    if (b) return b;
    // 2) fallback por texto (caso mude o onclick no futuro)
    const btns = document.querySelectorAll('.menu-direito .botao-direito');
    for (const x of btns) {
      if ((x.textContent || '').trim().toLowerCase() === 'acessar') return x;
    }
    return null;
  }

  function setBtnEnabled(on) {
    const b = findBtnAcessar();
    if (!b) return;
    if (on) {
      b.disabled = false;
      b.removeAttribute('disabled');
      b.classList.remove('is-disabled');
    } else {
      b.disabled = true;                       // ← DESABILITA AQUI
      b.setAttribute('disabled', 'disabled');  // ← e garante o atributo
      b.classList.add('is-disabled');
    }
  }

  function updateBtnAcessar() {
    setBtnEnabled(!!(state.sel && state.sel.id));
  }

  // desabilita logo que o painel abre; se o botão ainda não existir, observa o menu
  function disableAcessarUntilMenuLoads() {
    const menu = document.querySelector('.menu-direito');
    if (!menu) return;
    const btn = findBtnAcessar();
    if (btn) return setBtnEnabled(false);

    if (state.menuObserver) state.menuObserver.disconnect();
    state.menuObserver = new MutationObserver(() => {
      const b = findBtnAcessar();
      if (b) {
        setBtnEnabled(false);
        state.menuObserver.disconnect();
        state.menuObserver = null;
      }
    });
    state.menuObserver.observe(menu, { childList: true, subtree: true });
  }
  // ====== <<< BOTÃO ACESSAR ======

  // ------ seleção e navegação ------
  function setSelecionado(btn) {
    // remove seleção anterior
    document.querySelectorAll('.emg-item.is-selected').forEach(li => li.classList.remove('is-selected'));
    const li = btn.closest('li');
    if (li) li.classList.add('is-selected');

    state.sel = {
      id: Number(btn.dataset.emergenciaId),
      grupo: Number(btn.dataset.grupoId),
      titulo: (btn.querySelector('.emg-item-titulo')?.textContent || '').trim()
    };
    try { localStorage.setItem('emg.sel', JSON.stringify(state.sel)); } catch { }
    updateBtnAcessar(); // ← habilita o botão quando houver seleção
    updateBtnEditar();  // ← idem para o botão Editar
  }

  function acessarSelecionado() {
    if (!(state.sel && state.sel.id)) return;
    if (typeof carregarConteudo === 'function') {
      carregarConteudo('emeracessar?emergencia_id=' + state.sel.id);
    } else {
      location.href = 'index.php?url=emeracessarController';
    }
  }

  // ====== >>> BOTÃO EDITAR — igual ao Acessar, mas para 'emergerenc' ======
  function findBtnEditar() {
    // 1) pelo onclick do botão do menu direito
    let b = document.querySelector('.menu-direito .botao-direito[onclick*="emergerenc"]');
    if (b) return b;
    // 2) fallback por texto
    const btns = document.querySelectorAll('.menu-direito .botao-direito');
    for (const x of btns) {
      if ((x.textContent || '').trim().toLowerCase() === 'editar') return x;
    }
    return null;
  }

  function setBtnEditarEnabled(on) {
    const b = findBtnEditar();
    if (!b) return;
    if (on) {
      b.disabled = false;
      b.removeAttribute('disabled');
      b.classList.remove('is-disabled');
    } else {
      b.disabled = true;
      b.setAttribute('disabled', 'disabled');
      b.classList.add('is-disabled');
    }
  }

  function updateBtnEditar() {
    // habilita quando houver uma emergência selecionada
    setBtnEditarEnabled(!!(state.sel && state.sel.id));
  }

  // desabilita logo que o painel abre; se o botão ainda não existir, observa o menu
  function disableEditarUntilMenuLoads() {
    const menu = document.querySelector('.menu-direito');
    if (!menu) return;
    const btn = findBtnEditar();
    if (btn) return setBtnEditarEnabled(false);

    if (state.menuObserver) state.menuObserver.disconnect();
    state.menuObserver = new MutationObserver(() => {
      const b = findBtnEditar();
      if (b) {
        setBtnEditarEnabled(false);
        state.menuObserver.disconnect();
        state.menuObserver = null;
      }
    });
    state.menuObserver.observe(menu, { childList: true, subtree: true });
  }
  // ====== <<< BOTÃO EDITAR ======


  // ------ render e binds das listas ------
  function bindLista(ul) {
    if (!ul || ul.dataset.bound) return;

    // clique: seleciona
    ul.addEventListener('click', (e) => {
      const btn = e.target.closest('.emg-item-btn');
      if (!btn) return;
      setSelecionado(btn);

    });

    // duplo-clique: seleciona + acessar
    ul.addEventListener('dblclick', (e) => {
      const btn = e.target.closest('.emg-item-btn');
      if (!btn) return;
      setSelecionado(btn);
      acessarSelecionado();
    });

    ul.dataset.bound = '1';
  }

  function renderGrupo(grupoId, itens) {
    const map = M[grupoId]; if (!map) return;
    const ul = $(map.ul); if (!ul) return;

    clear(ul);

    if (!Array.isArray(itens) || itens.length === 0) {
      setEstado(grupoId, { carregando: false, erro: false, vazio: true });
      return;
    }

    const tpl = $('#tpl-emg-item');
    setEstado(grupoId, { carregando: false, erro: false, vazio: false });

    for (const it of itens) {
      const li = tpl.content.firstElementChild.cloneNode(true);
      const btn = li.querySelector('.emg-item-btn');
      const span = li.querySelector('.emg-item-titulo');
      span.textContent = it.titulo ?? ('#' + it.id);
      btn.dataset.emergenciaId = it.id;
      btn.dataset.grupoId = grupoId;
      ul.appendChild(li);
    }

    bindLista(ul);
  }

  // ------ carga inicial das 3 listas ------
  async function carregarListas() {
    // desabilita o botão Acessar ao abrir o painel
    disableAcessarUntilMenuLoads();
    disableEditarUntilMenuLoads();

    setEstado('1', { carregando: true });
    setEstado('2', { carregando: true });
    setEstado('3', { carregando: true });

    try {
      const url = 'index.php?url=EmergenciaController/listarTudo&_=' + Date.now();
      const resp = await fetch(url, { cache: 'no-store' });
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      const data = await resp.json();
      if (!data || data.ok !== true || !data.grupos) throw new Error('Resposta inválida');

      renderGrupo('1', data.grupos['1'] || []);
      renderGrupo('2', data.grupos['2'] || []);
      renderGrupo('3', data.grupos['3'] || []);

      const status = document.getElementById('emg-status');
      if (status) status.textContent = ' ';
    } catch (err) {
      console.error('Falha ao carregar emergências:', err);
      setEstado('1', { carregando: false, erro: true });
      setEstado('2', { carregando: false, erro: true });
      setEstado('3', { carregando: false, erro: true });
      const status = document.getElementById('emg-status');
      if (status) status.textContent = 'Erro ao carregar listas.';
    }
    enableNovoUntilMenuLoads(); // 🔓 habilita "Novo" no painel principal
  }

  // ------ init ------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', carregarListas);
  } else {
    carregarListas();
  }

})();

function abrirModalNovaEmergencia() {
  const modal = document.getElementById('modalNovaEmergencia');
  const input = document.getElementById('inputNovaEmergenciaTitulo');
  const select = document.getElementById('selectNovaEmergenciaGrupo');

  if (!modal || !input || !select) {
    console.error("Modal de nova emergência não encontrado.");
    return;
  }

  input.value = '';
  select.value = 'geral'; // default
  modal.style.display = 'flex';
  input.focus();
}

// cancelar/fechar modal
document.getElementById('btnCancelNovaEmergencia')?.addEventListener('click', () => {
  document.getElementById('modalNovaEmergencia').style.display = 'none';
});

// confirmar
document.getElementById('btnOkNovaEmergencia')?.addEventListener('click', async () => {
  const input = document.getElementById('inputNovaEmergenciaTitulo');
  const select = document.getElementById('selectNovaEmergenciaGrupo');
  const titulo = (input.value || '').trim();
  const grupo = Number(select.value);

  if (!titulo) {
    alert('Digite um nome para a emergência.');
    input.focus();
    return;
  }

  const payload = {
    titulo: titulo,
    grupo_id: grupo,
    identificadores: 'Texto padrão de identificadores',
    causas: 'Texto padrão de causas',
    impacto: 'Texto padrão de impacto',
    contatos: 'Texto padrão de contatos',
    passos: [
      { rotulo: 'Passo inicial', detalhe: 'Detalhe padrão', ordem: 1 }
    ]
  };

  try {
    const resp = await fetch('index.php?url=EmergenciaController/novaEmergencia', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await resp.json();

    if (data && data.ok) {
      alert('Nova emergência criada com sucesso!');

      // 🔹 salva seleção no localStorage (para o Editar saber qual carregar)
      try {
        localStorage.setItem('emg.sel', JSON.stringify({ id: data.id, grupo: grupo, titulo: titulo }));
      } catch (e) {
        console.warn('Não foi possível salvar em localStorage:', e);
      }

      // 🔹 fecha modal
      document.getElementById('modalNovaEmergencia').style.display = 'none';

      // 🔹 redireciona para o painel Editar (emergerenc)
      if (typeof carregarConteudo === 'function') {
        carregarConteudo('emergerenc?emergencia_id=' + data.id);
      } else {
        window.location.href = 'index.php?url=emergerencController&emergencia_id=' + data.id;
      }

    } else {
      alert('Erro ao criar emergência: ' + (data?.msg || 'desconhecido'));
    }
  } catch (err) {
    console.error('Falha na criação da emergência:', err);
    alert('Erro ao criar emergência: ' + err.message);
  }
});
