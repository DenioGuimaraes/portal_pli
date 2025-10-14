(() => {
    if (window.U1620?.__loaded_main) return;
    window.U1620 = window.U1620 || {};
    window.U1620.__loaded_main = true;

    // ===== Constantes do processo =====
    const LMIN = 9205;
    const LMAX = 14956;
    const ESC_MIN = 4.0;
    const ESC_MAX = 6.5;

    // Pontos de referência (RVC 5 e 6)
    const VMIN_RVC5 = 41.57, VMIN_RVC6 = 57.32;
    const VMAX_RVC5 = 67.55, VMAX_RVC6 = 93.15;
    // FR-6216:  carga 9205 -> 998.0   |   carga LMAX -> 1197.6 (linear)
    const FR6216_MIN = 998.0;
    const FR6216_MAX = 1197.6;


    // ===== Helpers =====
    const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
    const round1 = x => Math.round(x * 10) / 10;
    const round2 = x => Math.round(x * 100) / 100;
    const fmt1 = x => Number.isFinite(x) ? round1(x).toFixed(1).replace('.', ',') : '';
    const fmt2 = x => Number.isFinite(x) ? round2(x).toFixed(2).replace('.', ',') : '';

    const getNum = el => {
        if (!el) return NaN;
        const n = el.valueAsNumber;
        return Number.isFinite(n) ? n : parseFloat(String(el.value || '').replace(',', '.'));
    };

    const vminFromRVC = rvc => VMIN_RVC5 + (VMIN_RVC6 - VMIN_RVC5) * (rvc - 5);
    const vmaxFromRVC = rvc => VMAX_RVC5 + (VMAX_RVC6 - VMAX_RVC5) * (rvc - 5);

    // escala ↔ carga
    const escalaToCarga = esc => LMIN + ((esc - ESC_MIN) / (ESC_MAX - ESC_MIN)) * (LMAX - LMIN);
    const cargaToEscala = carga => ESC_MIN + ((carga - LMIN) / (LMAX - LMIN)) * (ESC_MAX - ESC_MIN);

    const endpoint = path => {
        const base = window.BASE_URL || '';
        return base ? `${base}/index.php?url=${path}` : `index.php?url=${path}`;
    };

    // ===== Cálculo principal =====
    function recalcular() {
        const rvc   = getNum(document.getElementById('rvc'));
        const carga = getNum(document.getElementById('carga'));
        const frcEl = document.getElementById('outFRC6205');
        const fr6216El = document.getElementById('outFR6216');

        // Limpa se faltar dado
        if (!Number.isFinite(rvc) || !Number.isFinite(carga)) {
            if (frcEl)    frcEl.value    = '';
            if (fr6216El) fr6216El.value = '';
            return;
        }

        // vmin/vmax pelo RVC
        const vmin = VMIN_RVC5 + (VMIN_RVC6 - VMIN_RVC5) * (rvc - 5);
        const vmax = VMAX_RVC5 + (VMAX_RVC6 - VMAX_RVC5) * (rvc - 5);

        // Fator de posição da carga (0..1)
        const t = clamp((carga - LMIN) / (LMAX - LMIN), 0, 1);

        // FR-6205 (duas casas)
        const frc = vmin + t * (vmax - vmin);
        if (frcEl) frcEl.value = fmt2(frc);

        // FR-6216 (uma casa) — linear entre 998.0 e 1197.6
        const fr6216 = FR6216_MIN + t * (FR6216_MAX - FR6216_MIN);
        if (fr6216El) fr6216El.value = fmt1(fr6216);
    }


    // ===== Autosave (debounce) =====
    let saveTimer = null;
    function scheduleSave() {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => {
            const rvc = getNum(document.getElementById('rvc'));
            const carga = getNum(document.getElementById('carga'));
            if (!Number.isFinite(rvc) || !Number.isFinite(carga)) return;

            fetch(endpoint('U1620Controller/salvar'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rvc, carga })
            }).then(r => r.json()).then(j => {
                if (!j?.ok) console.warn('Falha ao salvar', j);
            }).catch(err => console.error('Erro ao salvar:', err));
        }, 800); // 0,8s após parar de mexer
    }

    // ===== Sync slider <-> inputs =====
    function syncFromEscala() {
        const escEl = document.getElementById('escala');
        const cargaEl = document.getElementById('carga');
        const escValEl = document.getElementById('escalaValor');

        const esc = getNum(escEl);
        if (!Number.isFinite(esc)) return;

        const carga = round1(escalaToCarga(esc)); // BD guarda 1 casa
        if (cargaEl) cargaEl.valueAsNumber = carga;

        if (escValEl) escValEl.textContent = fmt1(esc); // mostra 1 casa com vírgula

        recalcular();
        scheduleSave();
    }

    function syncFromCarga() {
        const escEl = document.getElementById('escala');
        const cargaEl = document.getElementById('carga');
        const escValEl = document.getElementById('escalaValor');

        const carga = getNum(cargaEl);
        if (!Number.isFinite(carga)) return;

        const esc = clamp(cargaToEscala(carga), ESC_MIN, ESC_MAX);
        if (escEl) escEl.value = String(round1(esc)); // “encaixa” no passo 0.1
        if (escValEl) escValEl.textContent = fmt1(esc);

        recalcular();
        scheduleSave();
    }

    function stepEscala(delta) {
        const escEl = document.getElementById('escala');
        if (!escEl) return;
        const ESC_MIN = 4.0, ESC_MAX = 6.5;
        let v = getNum(escEl);
        if (!Number.isFinite(v)) v = ESC_MIN;
        v = Math.min(ESC_MAX, Math.max(ESC_MIN, Math.round((v + delta) * 10) / 10));
        escEl.value = String(v);
        // reaproveita o fluxo já existente
        const e = new Event('input', { bubbles: true });
        escEl.dispatchEvent(e);
    }


    // ===== Init =====
    window.U1620.init = function () {
        const rvcEl = document.getElementById('rvc');
        const cargaEl = document.getElementById('carga');
        const escEl = document.getElementById('escala');
        // 1) carrega do BD
        fetch(endpoint('U1620Controller/estado'))
            .then(r => r.json())
            .then(j => {
                if (j?.ok) {
                    if (rvcEl) rvcEl.valueAsNumber = round1(j.rvc);
                    if (cargaEl) cargaEl.valueAsNumber = round1(j.carga);
                    // posiciona o slider conforme a carga
                    syncFromCarga();
                } else {
                    // se falhou, ainda tenta recalcular
                    recalcular();
                }
            })
            .catch(err => { console.error('Falha ao carregar estado U-1620:', err); recalcular(); });

        // 2) listeners
        ['input', 'change'].forEach(evt => {
            rvcEl?.addEventListener(evt, () => { recalcular(); scheduleSave(); });
            cargaEl?.addEventListener(evt, syncFromCarga);
            escEl?.addEventListener(evt, syncFromEscala);
            document.getElementById('escLeft')?.addEventListener('click', () => stepEscala(-0.1));
            document.getElementById('escRight')?.addEventListener('click', () => stepEscala(+0.1));
        });
    };
})();
