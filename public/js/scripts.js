function carregarConteudo(painel) {
  const conteudo = document.querySelector('.conteudo-central');
  conteudo.innerHTML = "<p>Carregando...</p>";

  // 🔧 Se for 'emeracessar' sem emergencia_id, pega da seleção (localStorage)
  (function ensureEmergenciaId() {
    const base = (painel.split('?')[0] || '').toLowerCase();
    const hasId = /(?:^|[?&])emergencia_id=/.test(painel);
    if (base === 'emeracessar' && !hasId) {
      try {
        const sel = JSON.parse(localStorage.getItem('emg.sel') || 'null');
        if (sel && sel.id) {
          painel = 'emeracessar?emergencia_id=' + encodeURIComponent(sel.id);
        }
      } catch {}
    }
  })();

  // permite 'painel?param=...' sem quebrar
  const [basePane, qs] = painel.split('?');
  const url = 'index.php?url=' + basePane + 'Controller' + (qs ? '&' + qs : '');

  fetch(url)
    .then(res => res.text())
    .then(html => {
      conteudo.innerHTML = html;

      // helper p/ carregar JS sob demanda (com cache-buster)
      const base = (typeof BASE_URL !== 'undefined') ? BASE_URL : '';
      function loadJS(src, onload) {
        const s = document.createElement('script');
        s.src = src + (src.includes('?') ? '&' : '?') + 'v=' + Date.now();
        s.onload = onload || null;
        s.onerror = e => console.error('Falha ao carregar', src, e);
        document.body.appendChild(s);
      }

      const key = (basePane || painel).toLowerCase();

      // Lista Telefônica
      if (key === 'listatelefonica') {
        if (typeof telefoneInit === 'function') telefoneInit();
        else loadJS(base + '/public/js/listatelefonica.js', () => window.telefoneInit && telefoneInit());
      }

      // Radios
      if (key === 'radio') {
        if (typeof radioInit === 'function') radioInit();
        else loadJS(base + '/public/js/radio.js', () => window.radioInit && radioInit());
      }

      // Ônibus
      if (key === 'onibus') {
        if (typeof onibusInit === 'function') onibusInit();
        else loadJS(base + '/public/js/onibus.js', () => window.onibusInit && onibusInit());
      }

      // U-1620 Instrumentos
      if (key === 'u1620instr') {
        if (typeof u1620InstrInit === 'function') u1620InstrInit();
        else loadJS(base + '/public/js/u1620instr.js', () => window.u1620InstrInit && u1620InstrInit());
      }

      // U-1620 Válvulas
      if (key === 'u1620valv') {
        if (typeof u1620ValvInit === 'function') u1620ValvInit();
        else loadJS(base + '/public/js/u1620valv.js', () => window.u1620ValvInit && u1620ValvInit());
      }

      // H-6201
      if (key === 'h6201') {
        if (typeof h6201Init === 'function') h6201Init();
        else loadJS(base + '/public/js/h6201.js', () => window.h6201Init && h6201Init());
      }

      // ===== NOVOS PAINÉIS DO MÓDULO EMERGÊNCIA =====

      // Painel "Acessar" (execução — em construção)
      if (key === 'emeracessar') {
        if (typeof emerAcessarInit === 'function') emerAcessarInit();
        else loadJS(base + '/public/js/emeracessar.js', () => window.emerAcessarInit && emerAcessarInit());
      }

      // Painel "Gerenciar" (CRUD)
      if (key === 'emergerenc') {
        if (typeof emerGerencInit === 'function') emerGerencInit();
        else loadJS(base + '/public/js/emergerenc.js', () => window.emerGerencInit && emerGerencInit());
      }
    })
    .catch(err => {
      conteudo.innerHTML = "<p>Erro ao carregar o conteúdo.</p>";
      console.error(err);
    });
}
