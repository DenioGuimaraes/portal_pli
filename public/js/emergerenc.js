alert('Atualização Carregada!');
// /public/js/emergerenc.js
function emerGerencInit() {
    'use strict';

    // ====== Seletores conforme HTML/CSS já existente ======
    const SEL = {
        titulo: '#emer-titulo',
        grupo: '#emer-grupo',
        ident: '#fld-identificadores',
        causas: '#fld-causas',
        impacto: '#fld-impacto',
        contatos: '#fld-contatos',
        listaPassos: '#body-passos', // onde será injetada a UL de passos
        detalhes: '#body-acoes'      // onde será montado o card de detalhes
    };

    // Helpers
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

    // Estado
    let emergenciaId = null;
    let passos = [];
    let passoSelId = null;

    try {
        emergenciaId = JSON.parse(localStorage.getItem('emg.sel') || 'null')?.id ?? null;
    } catch { }

    if (!emergenciaId) {
        console.warn('emergerenc: nenhuma emergência selecionada.');
        pintarDetalheVazio('Nenhuma emergência selecionada.');
        return;
    }

    // ====== Carregar dados da emergência ======
    (async function carregar() {
        try {
            const url = 'index.php?url=EmergerencController/detalhes'
                + '&emergencia_id=' + encodeURIComponent(emergenciaId)
                + '&_=' + Date.now();

            const resp = await fetch(url, { cache: 'no-store' });
            if (!resp.ok) throw new Error('HTTP ' + resp.status);

            const data = await resp.json();
            if (!data || data.ok !== true) throw new Error('Resposta inválida');

            // Preenche cabeçalho/topbar
            setValue(SEL.titulo, data.emergencia?.titulo ?? '');
            setValue(SEL.grupo, data.emergencia?.grupo ?? 'geral');
            setValue(SEL.ident, data.emergencia?.identificadores ?? '');
            setValue(SEL.causas, data.emergencia?.causas ?? '');
            setValue(SEL.impacto, data.emergencia?.impacto ?? '');
            setValue(SEL.contatos, data.emergencia?.contatos ?? '');

            // Renderiza lista de passos (coluna central)
            passos = Array.isArray(data.passos) ? data.passos.slice().sort((a, b) => a.ordem - b.ordem) : [];
            renderListaPassos(passos);

            // Card de detalhes começa vazio
            pintarDetalheVazio('Selecione um passo à esquerda para ver os detalhes.');

            // Setas começam desabilitadas
            $('#btnPassoUp').disabled = true;
            $('#btnPassoDown').disabled = true;
        } catch (err) {
            console.error('Falha ao carregar emergência:', err);
            pintarDetalheVazio('Erro ao carregar dados.');
        }
    })();

    // ====== Funções de movimentação ======
    function atualizarOrdem() {
        passos.forEach((p, i) => p.ordem = i + 1);
    }

    function moverPassoParaCima(id) {
        const idx = passos.findIndex(p => p.id === id);
        if (idx > 0) {
            [passos[idx - 1], passos[idx]] = [passos[idx], passos[idx - 1]];
            atualizarOrdem();
            renderListaPassos(passos);
            selecionarPasso(id); // mantém selecionado
        }
    }

    function moverPassoParaBaixo(id) {
        const idx = passos.findIndex(p => p.id === id);
        if (idx < passos.length - 1) {
            [passos[idx + 1], passos[idx]] = [passos[idx], passos[idx + 1]];
            atualizarOrdem();
            renderListaPassos(passos);
            selecionarPasso(id); // mantém selecionado
        }
    }

    // Expor no window para os botões onclick
    window.moverPassoParaCima = moverPassoParaCima;
    window.moverPassoParaBaixo = moverPassoParaBaixo;

    // ====== Salvar alterações no banco ======
    (function initSalvar() {
        const btnSalvar = document.getElementById('btnSalvarProc');
        if (!btnSalvar) return;

        btnSalvar.addEventListener('click', async () => {
            if (!emergenciaId) {
                alert('Nenhuma emergência selecionada.');
                return;
            }

            try {
                // Captura os valores atuais dos cards da esquerda
                const emergencia = {
                    identificadores: document.querySelector(SEL.ident)?.value || '',
                    causas: document.querySelector(SEL.causas)?.value || '',
                    impacto: document.querySelector(SEL.impacto)?.value || '',
                    contatos: document.querySelector(SEL.contatos)?.value || ''
                };

                // Monta o payload completo
                const payload = {
                    emergencia_id: emergenciaId,
                    emergencia: emergencia,
                    passos: passos.map(p => ({
                        id: p.id,
                        rotulo: p.rotulo,
                        detalhe: p.detalhe || '',
                        ordem: p.ordem
                    }))
                };

                const resp = await fetch('index.php?url=EmergerencController/emergerencSalvar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await resp.json();
                if (data && data.ok) {
                    alert('Alterações salvas com sucesso!');
                } else {
                    throw new Error(data?.msg || 'Erro desconhecido ao salvar');
                }
            } catch (err) {
                console.error('Falha ao salvar:', err);
                alert('Erro ao salvar as alterações: ' + err.message);
            }
        });

    })();


    // ====== Funções auxiliares ======
    function setValue(sel, value) {
        const el = $(sel);
        if (!el) return;
        if ('value' in el) el.value = value;
        else el.textContent = value;
    }

    function pintarDetalheVazio(msg) {
        const box = $(SEL.detalhes);
        if (!box) return;
        box.innerHTML = `<div class="muted">${msg || 'Selecione um passo...'}</div>`;
    }

    function pintarDetalhePasso(p) {
        const box = $(SEL.detalhes);
        if (!box) return;
        box.innerHTML = '';

        if (!p) {
            pintarDetalheVazio();
            return;
        }

        // campo título (rotulo)
        const titulo = document.createElement('input');
        titulo.type = 'text';
        titulo.className = 'field-text';
        titulo.value = p.rotulo || '';
        titulo.id = 'det-rotulo';
        titulo.disabled = true; // 👈 deixa apenas leitura

        // Atualiza em tempo real
        titulo.addEventListener('input', (e) => {
            p.rotulo = e.target.value;
        });

        // campo detalhe (multilinha)
        const texto = document.createElement('textarea');
        texto.className = 'field-text';
        texto.rows = 10;
        texto.id = 'det-detalhe';
        texto.value = p.detalhe || '';

        // Atualiza em tempo real
        texto.addEventListener('input', (e) => {
            p.detalhe = e.target.value;
        });

        box.appendChild(titulo);
        box.appendChild(texto);
    }


    function renderListaPassos(lista) {
        const body = $(SEL.listaPassos);
        if (!body) return;
        body.innerHTML = '';

        const ul = document.createElement('ul');
        ul.className = 'lista-passos';

        for (const it of lista) {
            const li = document.createElement('li');
            const btn = document.createElement('button');
            li.className = 'passo-item';
            btn.className = 'passo-btn';
            btn.type = 'button';
            btn.dataset.passoId = it.id;
            btn.textContent = (it.ordem != null ? it.ordem + ' — ' : '') + (it.rotulo || ('#' + it.id));
            btn.dataset.detalhe = it.detalhe || '';
            btn.onclick = () => selecionarPasso(it.id);

            li.appendChild(btn);
            ul.appendChild(li);
        }

        body.appendChild(ul);
    }

    function selecionarPasso(id) {
        passoSelId = id;

        // marca visual no botão selecionado
        $$(SEL.listaPassos + ' .passo-btn').forEach(b => {
            const on = Number(b.dataset.passoId) === Number(id);
            b.classList.toggle('is-selected', on);
            b.style.fontWeight = on ? '700' : '400';
        });

        const p = passos.find(x => Number(x.id) === Number(id));
        pintarDetalhePasso(p);

        // habilita setas só quando há seleção
        $('#btnPassoUp').disabled = !id;
        $('#btnPassoDown').disabled = !id;
        $('#btnEditarProc').disabled = !id;
        $('#btnExcluirProc').disabled = !id;
        window.passoSelId = id; // mantém o id selecionado acessível globalmente
    }

    // ====== Edição / Criação com DOIS modais ======

    // Utilitário: fechar modal por id
    function fecharModalById(modalId, inputId) {
        const modal = document.getElementById(modalId);
        const input = document.getElementById(inputId);
        if (modal) modal.style.display = 'none';
        if (input) input.value = '';
    }

    // ------- EDITAR -------
    (function initModalEditar() {
        const btnEditar = document.getElementById('btnEditarProc');
        const modalId = 'modalEditarPasso';
        const inputId = 'inputEditarRotulo';
        const okId = 'btnOkEditar';
        const cancelId = 'btnCancelEditar';

        const modal = document.getElementById(modalId);
        const input = document.getElementById(inputId);
        const btnOk = document.getElementById(okId);
        const btnCancel = document.getElementById(cancelId);

        if (!btnEditar || !modal || !input || !btnOk || !btnCancel) return;

        // abrir modal Editar
        btnEditar.addEventListener('click', () => {
            if (!passoSelId) return;
            const passo = passos.find(p => Number(p.id) === Number(passoSelId));
            if (!passo) return;

            input.value = passo.rotulo || '';
            modal.style.display = 'flex';
            input.focus();
        });

        // OK Editar
        btnOk.addEventListener('click', () => {
            const texto = (input.value || '').trim();
            if (!texto) { alert('Digite um nome para o passo.'); input.focus(); return; }

            const passo = passos.find(p => Number(p.id) === Number(passoSelId));
            if (passo) {
                passo.rotulo = texto;
                renderListaPassos(passos);
                selecionarPasso(passo.id);
            }
            fecharModalById(modalId, inputId);
        });

        // Cancelar Editar
        btnCancel.addEventListener('click', () => fecharModalById(modalId, inputId));
    })();

    // ------- NOVO -------
    (function initModalNovo() {
        const btnNovo = document.getElementById('btnNovoProc');
        const modalId = 'modalNovoPasso';
        const inputId = 'inputNovoRotulo';
        const okId = 'btnOkNovo';
        const cancelId = 'btnCancelNovo';

        const modal = document.getElementById(modalId);
        const input = document.getElementById(inputId);
        const btnOk = document.getElementById(okId);
        const btnCancel = document.getElementById(cancelId);

        if (!btnNovo || !modal || !input || !btnOk || !btnCancel) return;

        // abrir modal Novo
        btnNovo.addEventListener('click', () => {
            input.value = '';
            modal.style.display = 'flex';
            input.focus();
        });

        // OK Novo
        btnOk.addEventListener('click', () => {
            const texto = (input.value || '').trim();
            if (!texto) { alert('Digite um nome para o passo.'); input.focus(); return; }

            const maxId = passos.length ? Math.max(...passos.map(p => Number(p.id))) : 0;
            const novo = {
                id: maxId + 1,
                rotulo: texto,
                detalhe: '',
                ordem: passos.length + 1
            };

            passos.push(novo);
            renderListaPassos(passos);
            selecionarPasso(novo.id);

            fecharModalById(modalId, inputId);
        });

        // Cancelar Novo
        btnCancel.addEventListener('click', () => fecharModalById(modalId, inputId));
    })();

} // <== fim de emerGerencInit
