// H-6201 – v0.4 (robusto: cache → modal por ID; spans de data; init idempotente)
(function () {
  // ====== VARS GERAIS =====================================================
  let manutCacheArr = [];                 // array das linhas do BD
  let manutCacheMap = new Map();          // Map<number, item> para lookup rápido
  let idSelecionado = null;

  // Refs do modal
  let modalEl, modalIdEl, selectQueimador, selectPiloto, btnSalvar, btnCancelar, inputData;

  // ====== HELPERS VISUAIS =================================================
  function aplicarEstado(el, queimador, piloto) {
    el.classList.remove(
      'is-burner-aceso', 'is-burner-apagado', 'is-burner-manutencao',
      'is-pilot-aceso', 'is-pilot-apagado', 'is-pilot-manutencao'
    );
    el.classList.add('is-burner-' + (queimador || 'apagado'));
    el.classList.add('is-pilot-' + (piloto || 'apagado'));
  }

  function lerEstadoDoElemento(el) {
    const get = (prefix) => (
      el.classList.contains(prefix + 'aceso') ? 'aceso' :
        el.classList.contains(prefix + 'manutencao') ? 'manutencao' : 'apagado'
    );
    return { queimador: get('is-burner-'), piloto: get('is-pilot-') };
  }

  function isoParaBr2(iso) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${String(y).slice(2)}`;
  }

  function setSelectValueSafe(selectEl, value, fallback = 'apagado') {
    if (!selectEl) return;
    const ok = Array.from(selectEl.options).some(o => o.value === value);
    selectEl.value = ok ? value : fallback;
  }

  // ====== BACKEND / CACHE =================================================
  // Normaliza várias formas de payload: {ok,itens}, array puro, {data:[...]}
  function normalizarItens(json) {
    if (Array.isArray(json)) return json;
    if (json && Array.isArray(json.itens)) return json.itens;
    if (json && Array.isArray(json.data)) return json.data;
    return [];
  }

  function repovoarCache(itens) {
    manutCacheArr = Array.isArray(itens) ? itens : [];
    manutCacheMap.clear();
    for (const it of manutCacheArr) {
      const idNum = Number(it.id);
      if (!Number.isNaN(idNum)) manutCacheMap.set(idNum, it);
    }
  }

  async function carregarEstados() {
    try {
      const resp = await fetch('index.php?url=H6201Controller/carregar', { cache: 'no-store' });
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      const json = await resp.json();

      // Mesmo que não venha "ok", seguimos em frente
      const itens = normalizarItens(json);

      // Cache
      repovoarCache(itens);

      // Pintar estados por ID
      for (const item of itens) {
        const el = document.getElementById('q' + item.id);
        if (el) aplicarEstado(el, item.queimador, item.piloto);
      }

      // Preencher badges de data
      document.querySelectorAll('.h6201-manut-badge').forEach(span => {
        const id = Number(span.dataset.id);
        const it = manutCacheMap.get(id);
        span.textContent = isoParaBr2(it?.manutencao_data || '');
        // opcional: ocultar quando vazio:
        // span.style.visibility = it?.manutencao_data ? 'visible' : 'hidden';
      });

    } catch (err) {
      console.error('H-6201: erro ao carregar estados:', err);
      // Em erro, zera cache p/ modal não herdar valores antigos
      repovoarCache([]);
      document.querySelectorAll('.h6201-manut-badge').forEach(span => { span.textContent = ''; });
    }
  }

  // ====== MODAL ===========================================================
  function pegarRefsModal() {
    modalEl = document.getElementById('h6201Modal');
    modalIdEl = document.getElementById('h6201ModalId');
    selectQueimador = document.getElementById('h6201Queimador');
    selectPiloto = document.getElementById('h6201Piloto');
    btnSalvar = document.getElementById('h6201Salvar');
    btnCancelar = document.getElementById('h6201Cancelar');
    inputData = document.getElementById('manutencaoData');
  }

  function abrirModal(id, estadoDOM) {
    idSelecionado = id;
    if (modalIdEl) modalIdEl.textContent = '#' + id;

    // 1) BD (cache) primeiro; se faltar, DOM como fallback
    const it = manutCacheMap.get(Number(id));
    const queimador = it?.queimador ?? estadoDOM?.queimador ?? 'apagado';
    const piloto = it?.piloto ?? estadoDOM?.piloto ?? 'apagado';

    setSelectValueSafe(selectQueimador, queimador, 'apagado');
    setSelectValueSafe(selectPiloto, piloto, 'apagado');

    // 2) Data SEMPRE setada para não herdar valor anterior
    if (inputData) inputData.value = it?.manutencao_data ?? '';

    // 3) Exibe modal
    if (modalEl) {
      modalEl.style.display = 'flex';
      if (selectQueimador) selectQueimador.focus();
    }
  }

  function fecharModal() {
    idSelecionado = null;
    if (modalEl) modalEl.style.display = 'none';
  }

  async function salvarEstado() {
    if (!idSelecionado) return;

    const payload = {
      id: idSelecionado,
      queimador: selectQueimador?.value ?? 'apagado',
      piloto: selectPiloto?.value ?? 'apagado',
    };

    // Data opcional
    if (inputData) {
      const v = (inputData.value || '').trim();
      payload.manutencao_data = /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : (v === '' ? null : null);
    }

    if (btnSalvar) btnSalvar.disabled = true;
    try {
      const resp = await fetch('index.php?url=H6201Controller/salvar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await resp.json();
      if (!resp.ok || (data && data.ok === false)) {
        console.error('H-6201: falha ao salvar.', data);
        return;
      }

      // Fecha modal e repinta a partir do BD (atualiza cache e UI)
      fecharModal();
      await carregarEstados();

    } catch (e) {
      console.error('H-6201: erro na requisição de salvar:', e);
    } finally {
      if (btnSalvar) btnSalvar.disabled = false;
    }
  }

  // ====== MODO MANUTENÇÃO (mostra/oculta badges) ==========================
  // Implementação única (sem chamadas cruzadas/recursão)
  function h6201ToggleManutencao() {
    const painel = document.getElementById('h6201Painel');
    if (!painel) return;

    const on = !painel.classList.contains('manut-on');
    painel.classList.toggle('manut-on', on);

    const btn = document.getElementById('btnManutencaoToggle');
    if (btn) btn.setAttribute('aria-pressed', on ? 'true' : 'false');

    // Fallback JS: garante efeito mesmo se o CSS não recarregar
    painel.querySelectorAll('.h6201-manut-badge')
      .forEach(b => { b.style.display = on ? 'inline-block' : 'none'; });
  }

  // Alias opcional para compatibilidade interna (se em algum ponto chamarem toggleManutencao)
  const toggleManutencao = h6201ToggleManutencao;

  // ===== Auto-scale do miolo (forno + painel) =====
  function h6201Autoscale() {
    const stage = document.getElementById('h6201Stage');
    const wrap = document.getElementById('h6201Wrap');
    if (!stage || !wrap) return;

    // zera para medir tamanho "natural"
    wrap.style.setProperty('--ui-scale', '1');

    // medidas base (sem escala)
    const baseW = wrap.offsetWidth || 1;
    const baseH = wrap.offsetHeight || 1;

    // área disponível
    const rect = stage.getBoundingClientRect();
    const availW = stage.clientWidth || rect.width;
    const availH = stage.clientHeight || (window.innerHeight - rect.top - 20);

    // fator de escala (limite superior opcional)
    const scale = Math.min(availW / baseW, availH / baseH);

    // aplica
    wrap.style.setProperty('--ui-scale', String(scale));
  }

  // recalcula ao abrir e quando redimensionar
  window.addEventListener('resize', h6201Autoscale);
  document.addEventListener('DOMContentLoaded', h6201Autoscale);

  // se seu h6201Init já roda no DOMContentLoaded, chame depois do init também:
  /*const _origInit = window.h6201Init;
  window.h6201Init = function() {
    const ok = _origInit ? _origInit() : true;
    h6201Autoscale();
    return ok;
  };*/


  // ====== GC: Helpers de formatação e localização de inputs ===============
  const gcSaveTimers = new Map(); // Map<HTMLInputElement, number>

  function gcFmtVisor(v) {
    if (v === null || v === undefined || v === '') return '';
    const n = Number(v);
    if (!Number.isFinite(n)) return '';
    return n.toFixed(2).replace('.', ','); // exibe com vírgula
  }

  function gcParseValor(txt) {
    if (txt == null) return null;
    const s = String(txt).trim();
    if (s === '') return null;
    // aceita 12,34 ou 12.34
    const norm = s.replace(',', '.');
    return Number.isFinite(parseFloat(norm)) ? parseFloat(norm) : null;
  }

  function gcFindInput(plataforma, lado /* 'oeste' | 'leste' */) {
    const p = Number(plataforma);
    const l = String(lado).toLowerCase();
    const candidates = [
      `#gc_p${p}_${l}`,
      `#p${p}_${l}`,
      `#gc-p${p}-${l}`,
      `input[name="gc_p${p}_${l}"]`,
      `input[name="p${p}_${l}"]`,
      `[data-gc="${p}_${l}"]`
    ];
    for (const sel of candidates) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  }

  function gcSetSavingState(input, state /* 'idle'|'saving'|'saved'|'error' */) {
    input.classList.toggle('gc-saving', state === 'saving');
    input.classList.toggle('gc-saved', state === 'saved');
    input.classList.toggle('gc-error', state === 'error');
  }

  async function carregarGC() {
    try {
      const resp = await fetch('index.php?url=H6201Controller/carregargc', { cache: 'no-store' });
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      const json = await resp.json();

      // aceita dois formatos: mapa {1:{oeste,leste}} OU array [{plataforma,lado,valor}]
      let mapa = null;

      if (json && json.pressoes && typeof json.pressoes === 'object' && !Array.isArray(json.pressoes)) {
        // formato mapa esperado
        mapa = json.pressoes;
      } else if (Array.isArray(json)) {
        // array direto
        mapa = {};
        for (const r of json) {
          const p = Number(r.plataforma);
          const lado = (String(r.lado).toUpperCase() === 'O') ? 'oeste' : 'leste';
          if (!mapa[p]) mapa[p] = { oeste: null, leste: null };
          mapa[p][lado] = r.valor == null ? null : Number(r.valor);
        }
      } else if (json && Array.isArray(json.data)) {
        // {data:[...]} defensivo
        mapa = {};
        for (const r of json.data) {
          const p = Number(r.plataforma);
          const lado = (String(r.lado).toUpperCase() === 'O') ? 'oeste' : 'leste';
          if (!mapa[p]) mapa[p] = { oeste: null, leste: null };
          mapa[p][lado] = r.valor == null ? null : Number(r.valor);
        }
      } else if (json && Array.isArray(json.pressoes)) {
        // {pressoes:[...]} como array
        mapa = {};
        for (const r of json.pressoes) {
          const p = Number(r.plataforma);
          const lado = (String(r.lado).toUpperCase() === 'O') ? 'oeste' : 'leste';
          if (!mapa[p]) mapa[p] = { oeste: null, leste: null };
          mapa[p][lado] = r.valor == null ? null : Number(r.valor);
        }
      }

      if (!mapa) {
        console.warn('H-6201: formato inesperado de carregargc', json);
        return;
      }

      const lados = ['oeste', 'leste'];
      for (let p = 1; p <= 4; p++) {
        for (const l of lados) {
          const el = gcFindInput(p, l);
          if (!el) continue;
          const val = mapa[p] ? mapa[p][l] : null;
          el.value = gcFmtVisor(val);
        }
      }
    } catch (e) {
      console.error('H-6201: erro ao carregar GC:', e);
    }
  }
  async function gcSalvarValor(el) {
    const p = Number(el.dataset.plataforma || el.getAttribute('data-plataforma') || el.dataset.p || el.getAttribute('data-p') || el.id?.match(/\d+/)?.[0] || 0);
    const lado = (el.dataset.lado || el.getAttribute('data-lado') || (el.id?.includes('leste') ? 'leste' : (el.id?.includes('oeste') ? 'oeste' : (el.name?.includes('leste') ? 'leste' : 'oeste')))).toLowerCase();
    if (![1, 2, 3, 4].includes(p) || !['oeste', 'leste'].includes(lado)) return;

    const valor = gcParseValor(el.value);
    gcSetSavingState(el, 'saving');

    try {
      const resp = await fetch('index.php?url=H6201Controller/salvar_gc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plataforma: p, lado, valor: (valor === null ? '' : String(valor)) })
      });
      const data = await resp.json();

      if (!resp.ok || data?.ok === false) {
        console.error('H-6201: falha ao salvar GC', data);
        gcSetSavingState(el, 'error');
        return;
      }

      // normaliza exibição
      el.value = gcFmtVisor(data?.valor ?? valor);
      gcSetSavingState(el, 'saved');
      setTimeout(() => gcSetSavingState(el, 'idle'), 800);

    } catch (e) {
      console.error('H-6201: erro salvar_gc:', e);
      gcSetSavingState(el, 'error');
    }
  }

  function gcBindInputs() {
    const lados = ['oeste', 'leste'];
    for (let p = 1; p <= 4; p++) {
      for (const l of lados) {
        const el = gcFindInput(p, l);
        if (!el) continue;

        // armazena metadados para salvar_gc()
        el.dataset.plataforma = String(p);
        el.dataset.lado = l;

        // evita bind duplo
        if (el.dataset.gcBound === '1') continue;
        el.dataset.gcBound = '1';

        // Enter salva
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            gcSalvarValor(el);
          }
        });

        // blur salva
        el.addEventListener('blur', () => {
          gcSalvarValor(el);
        });

        // digitação com debounce (600 ms)
        el.addEventListener('input', () => {
          if (gcSaveTimers.has(el)) clearTimeout(gcSaveTimers.get(el));
          const t = setTimeout(() => gcSalvarValor(el), 600);
          gcSaveTimers.set(el, t);
        });
      }
    }
  }

  // --- Bind do botão "Queimadores" (acima do h6201Init) ---
  function hqBindQueimadores() {
    const trigger = document.getElementById('btnMassQueimadores');
    const modal = document.getElementById('h6201ModalQueimadores');
    if (!trigger || !modal) return;           // se ainda não estiver no DOM, sai
    if (trigger.dataset.bound === '1') return; // evita duplicar listeners

    trigger.addEventListener('click', () => {
      modal.style.display = 'block';
      (modal.querySelector('button') || modal).focus?.();
    });

    trigger.dataset.bound = '1';
  }

  function abrirModalById(id) { const el = document.getElementById(id); if (el) el.style.display = 'block'; }
  function fecharModalById(id) { const el = document.getElementById(id); if (el) el.style.display = 'none'; }

  // Liga o Cancelar e clique no fundo do modal de Ação em Massa — Queimadores
  function hqBindMassModal() {
    const modal = document.getElementById('h6201ModalQueimadores');
    if (!modal || modal.dataset.bound === '1') return;

    const btnCancelar = document.getElementById('hq-cancelar');
    btnCancelar?.addEventListener('click', () => fecharModalById('h6201ModalQueimadores'));

    // opcional: clicar no fundo fecha
    modal.addEventListener('click', (e) => { if (e.target === modal) fecharModalById('h6201ModalQueimadores'); });

    modal.dataset.bound = '1';
  }

  async function h6201MassUpdate(alvo /* 'queimador' | 'piloto' */, valor /* 'aceso'|'apagado'|'manutencao' */) {
    // 1) Confirmação
    const msg = `Isso vai aplicar "${valor.toUpperCase()}" para TODOS os ${alvo}s.\n` +
      `O status atual será perdido. Deseja continuar?`;
    if (!window.confirm(msg)) return;

    const modal = document.getElementById('h6201ModalQueimadores');
    const btnOn = document.getElementById('hq-acender');
    const btnOff = document.getElementById('hq-apagar');
    [btnOn, btnOff].forEach(b => b && (b.disabled = true));

    try {
      const resp = await fetch('index.php?url=H6201Controller/salvar_massa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alvo, valor })
      });

      // 2) Em vez de parsear direto, leio como texto e tento JSON
      const text = await resp.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('H-6201: servidor não retornou JSON. Resposta bruta:', text);
        alert('Falha ao salvar: servidor retornou uma resposta inesperada.\nVeja o console para detalhes.');
        return;
      }

      if (!resp.ok || data?.ok === false) {
        console.error('H-6201: salvar_massa retornou erro', data);
        alert('Falha ao salvar a ação em massa.');
        return;
      }

      // sucesso
      if (modal) modal.style.display = 'none';
      await carregarEstados();

    } catch (e) {
      console.error('H-6201: erro de rede/salvar_massa', e);
      alert('Erro de rede ao salvar.');
    } finally {
      [btnOn, btnOff].forEach(b => b && (b.disabled = false));
    }
  }

  // === PILOTOS: ação em massa (fora do H6201Init) ===
  async function h6201UpdatePilotos(valor /* 'aceso' | 'apagado' | 'manutencao' */) {
    const alvo = 'piloto';

    // 1) Confirmação
    const msg = `Isso vai aplicar "${valor.toUpperCase()}" para TODOS os pilotos.\n` +
      `O status atual será perdido. Deseja continuar?`;
    if (!window.confirm(msg)) return;

    // referencias do modal/botões DOS PILOTOS
    const modal = document.getElementById('h6201ModalPilotos');
    const btnOn = document.getElementById('hp-acender');
    const btnOff = document.getElementById('hp-apagar');
    [btnOn, btnOff].forEach(b => b && (b.disabled = true));

    try {
      const resp = await fetch('index.php?url=H6201Controller/salvar_massa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alvo, valor })
      });

      // lê como texto e tenta JSON (protege contra HTML/Warnings)
      const text = await resp.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('H-6201: servidor não retornou JSON. Resposta bruta:', text);
        alert('Falha ao salvar: servidor retornou uma resposta inesperada.\nVeja o console para detalhes.');
        return;
      }

      if (!resp.ok || data?.ok === false) {
        console.error('H-6201: salvar_massa (pilotos) retornou erro', data);
        alert('Falha ao salvar a ação em massa (pilotos).');
        return;
      }

      // sucesso
      if (modal) modal.style.display = 'none';
      await carregarEstados();

    } catch (e) {
      console.error('H-6201: erro de rede/salvar_massa (pilotos)', e);
      alert('Erro de rede ao salvar.');
    } finally {
      [btnOn, btnOff].forEach(b => b && (b.disabled = false));
    }
  }

  // === PILOTOS: abrir modal pelo botão do painel
  function hpBindPilotos() {
    const btn = document.getElementById('btnMassPilotos');
    const modal = document.getElementById('h6201ModalPilotos');
    if (!btn || !modal || modal.dataset.boundOpen === '1') return;

    btn.addEventListener('click', () => { modal.style.display = 'block'; });
    modal.dataset.boundOpen = '1';
  }

  // === PILOTOS: cancelar/overlay fecham o modal
  function hpBindMassModal() {
    const modal = document.getElementById('h6201ModalPilotos');
    if (!modal || modal.dataset.boundClose === '1') return;

    const btnCancelar = document.getElementById('hp-cancelar');
    btnCancelar?.addEventListener('click', () => { modal.style.display = 'none'; });

    // clicar no fundo fecha
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

    modal.dataset.boundClose = '1';
  }

  // Copiar "Oeste" -> "Leste" e DISPARAR o autosave
  function gcBindCopyButtons() {
    // cada "=" tem class="gc-copy" e data-src / data-dst (ex.: p4_oeste -> p4_leste)
    document.querySelectorAll('.gc-copy').forEach((btn) => {
      if (btn.dataset.gcCopyBound === '1') return;

      btn.addEventListener('click', () => {
        const srcKey = btn.dataset.src;   // ex.: "p4_oeste"
        const dstKey = btn.dataset.dst;   // ex.: "p4_leste"

        // tenta achar pelo id (#gc_...) ou pelo data-gc (ambos aparecem no seu HTML)
        const src = document.querySelector(`#gc_${srcKey}, [data-gc="${srcKey}"]`);
        const dst = document.querySelector(`#gc_${dstKey}, [data-gc="${dstKey}"]`);
        if (!src || !dst) {
          console.warn('GC copy: input não encontrado', { srcKey, dstKey, src, dst });
          return;
        }

        const valor = (src.value || '').trim();
        if (!valor) { src.focus(); return; }

        // 1) cola o valor
        dst.value = valor;

        // 2) dispara os mesmos eventos que seu autosave costuma escutar
        ['input', 'change'].forEach((type) =>
          dst.dispatchEvent(new Event(type, { bubbles: true }))
        );
        // 3) (opcional) força um blur — alguns autosaves disparam nisso
        setTimeout(() => dst.dispatchEvent(new Event('blur', { bubbles: true })), 0);

        // proteção contra duplo clique frenético
        btn.disabled = true;
        setTimeout(() => (btn.disabled = false), 300);
      });

      btn.dataset.gcCopyBound = '1';
    });
  }



  // ====== INIT ============================================================
  function h6201Init() {
    const root = document.getElementById('h6201Painel');
    if (!root) return false;
    if (root.dataset.jsBound === '1') return true;  // já iniciado
    root.dataset.jsBound = '1';

    pegarRefsModal();

    // Delegação: clique nos bicos
    root.addEventListener('click', (ev) => {
      const bico = ev.target.closest('.h6201-bico');
      if (!bico) return;

      const dataId = bico.getAttribute('data-id');
      const id = dataId ? Number(dataId) : parseInt(bico.id.replace(/^q/, ''), 10);
      if (!id || Number.isNaN(id)) return;

      const estado = lerEstadoDoElemento(bico);
      abrirModal(id, estado);
    });

    // Bind dos botões do modal (se existir modal)
    if (modalEl && selectQueimador && selectPiloto && btnSalvar && btnCancelar) {
      btnSalvar.addEventListener('click', salvarEstado);
      btnCancelar.addEventListener('click', fecharModal);
      modalEl.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') fecharModal();
        if (e.key === 'Enter') salvarEstado();
      });
    } else {
      // Mesmo que o modal não exista, mantém a tela pintada
      console.warn('H-6201: modal incompleto — init parcial.');
    }

    // === binds do modal "Ação em Massa — Queimadores"
    const btnMassOn = document.getElementById('hq-acender');
    const btnMassOff = document.getElementById('hq-apagar');

    btnMassOn?.addEventListener('click', () => h6201MassUpdate('queimador', 'aceso'));
    btnMassOff?.addEventListener('click', () => h6201MassUpdate('queimador', 'apagado'));


    // Primeira pintura (estados + datas)
    carregarEstados();

    // GC: ligar inputs e carregar valores
    gcBindInputs();
    gcBindCopyButtons();
    carregarGC();
    h6201Autoscale();

    hqBindQueimadores(); // já abre o modal de massa
    hqBindMassModal();   // garante que o "Cancelar" dele fecha

    // === binds do modal "Ação em Massa — Pilotos"
    hpBindPilotos();   // abre o modal de pilotos
    hpBindMassModal(); // fecha pelo Cancelar e pelo fundo

    const btnPilOn = document.getElementById('hp-acender');
    const btnPilOff = document.getElementById('hp-apagar');

    btnPilOn?.addEventListener('click', () => h6201UpdatePilotos('aceso'));
    btnPilOff?.addEventListener('click', () => h6201UpdatePilotos('apagado'));

    return true;
  }

  // Exposição global necessária (compatível com HTML atual)
  window.h6201Init = h6201Init;
  window.h6201ToggleManutencao = h6201ToggleManutencao;

  // Opcional: auto-init
  document.addEventListener('DOMContentLoaded', h6201Init);
  window.debugGC = { carregarGC, gcBindInputs };

  /* Auto-init robusto: funciona mesmo se o script for carregado depois do DOM pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', h6201Init);
  } else {
    // DOM já está pronto; inicia imediatamente
    setTimeout(h6201Init, 0);
  }*/

})();

// ===== Abertura/fechamento — escopo global =====
window.h6201AbrirModal = function(id) {
  const el = document.getElementById(id);
  if (!el) { alert('[DEBUG] modal não encontrado: ' + id); return; }
  el.style.display = 'flex';
  el.style.zIndex = '99999';
  el.removeAttribute('hidden');
  el.setAttribute('aria-hidden', 'false');
  const f = el.querySelector('input, select, button');
  if (f) f.focus();
};

window.h6201FecharModal = function(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = 'none';
  el.setAttribute('aria-hidden', 'true');
};

// ===== Ação em Massa — QUEIMADORES (global) =====
window.h6201AbrirQueimadores = function () {
  h6201AbrirModalFix('h6201ModalQueimadores');
};

// ===== Utilitários globais de modal =====
window.h6201AbrirModalFix = function (id) {
  const el = document.getElementById(id);
  if (!el) { alert('[DEBUG] modal não encontrado: ' + id); return; }

  // 1) Reanexar no <body> para escapar de stacking/overflow/transform do pai
  if (!el.__attachedToBody) {
    document.body.appendChild(el);
    el.__attachedToBody = true;
  }

  // 2) Forçar estilo inline completo (ignora CSS problemático do contexto atual)
  Object.assign(el.style, {
    position: 'fixed',
    inset: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,.35)',
    zIndex: String(2147483647) // "topo do topo"
  });

  el.removeAttribute('hidden');
  el.setAttribute('aria-hidden', 'false');

  // 3) Garantir que a caixa interna apareça com um visual mínimo
  const box = el.querySelector('.h6201-modal-box');
  if (box) {
    Object.assign(box.style, {
      background: '#fff',
      borderRadius: '10px',
      padding: '16px 18px',
      maxWidth: '680px',
      width: 'min(680px, 92vw)',
      boxShadow: '0 8px 30px rgba(0,0,0,.25)'
    });
  }

  // 4) Foco
  const focusable = el.querySelector('input, select, button');
  if (focusable) focusable.focus();
};

window.h6201FecharModal = function (id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.display = 'none';
  el.setAttribute('aria-hidden', 'true');
};

// ===== Ação em Massa — PILOTOS (global) =====



/*Função que reinicializa o h6201.js
window.reloadH6201 = function(){
  const nodes=[...document.querySelectorAll('script[src*="h6201.js"]')];
  nodes.forEach(n=>n.remove());
  const s=document.createElement('script');
  s.src=(nodes[0]? nodes[0].src.split('?')[0] : 'js/h6201.js')+'?v='+Date.now();
  s.onload=()=>{ if (window.h6201Init) h6201Init(); }; // opcional
  document.head.appendChild(s);
};
*/

// ===== Ação em Massa — PILOTOS (global) =====
window.h6201AbrirPilotos = function () {
  // alert('[DEBUG] h6201AbrirPilotos() chamado'); // opcional
  h6201AbrirModalFix('h6201ModalPilotos');
};


