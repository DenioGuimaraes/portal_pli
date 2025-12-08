function carregarConteudo(painel) {
  const conteudo = document.querySelector('.conteudo-central');
  conteudo.innerHTML = "<p>Carregando...</p>";

   // 🔧 Se for 'emeracessar' OU 'emergerenc' sem emergencia_id, pega da seleção (localStorage)
  (function ensureEmergenciaId() {
    const base = (painel.split('?')[0] || '').toLowerCase();
    const hasId = /(?:^|[?&])emergencia_id=/.test(painel);
    if ((base === 'emeracessar' || base === 'emergerenc') && !hasId) {
      try {
        const sel = JSON.parse(localStorage.getItem('emg.sel') || 'null');
        if (sel && sel.id) {
          painel = base + '?emergencia_id=' + encodeURIComponent(sel.id);
        }
      } catch { }
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
      if (key === 'telefones') {
        if (typeof telInit === 'function') telInit();
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

      // ===== PAINÉIS U-1620 =====

      // H-6201
      if (key === 'h6201') {
        if (typeof h6201Init === 'function') h6201Init();
        else loadJS(base + '/public/js/h6201.js', () => window.h6201Init && h6201Init());
      }

      // U-1620 Instrumentos
      if (key === 'u1620instr') {
        if (typeof u1620InstrInit === 'function') u1620InstrInit();
      }

      // U-1620 Válvulas
      if (key === 'u1620valv') {
        if (typeof u1620valvInit === 'function') u1620valvInit();
      }

      // U-1620 PSV's
      if (key === 'u1620psv') {
        if (typeof u1620psvInit === 'function') u1620psvInit();
      }

      // ===== PAINÉIS U-1640 =====

      // U-1640 Instrumentos
      if (key === 'u1640instr') {
        if (typeof u1640InstrInit === 'function') u1640InstrInit();
      }

      // U-1640 Válvulas
      if (key === 'u1640valv') {
        if (typeof u1640valvInit === 'function') u1640valvInit();
      }

      // U-1640 PSV's
      if (key === 'u1640psv') {
        if (typeof u1640psvInit === 'function') u1640psvInit();
      }

      // ===== PAINÉIS DO MÓDULO EMERGÊNCIA =====

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
