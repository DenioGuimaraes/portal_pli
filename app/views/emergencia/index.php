<link rel="stylesheet" href="css/emergencia.css?v=<?php echo time(); ?>">

<div class="painel-cabecalho">
  <h2>Emergências</h2>
  <label class="emg-global-busca">
    <span class="sr-only">Buscar em todos os grupos</span>
    <input id="emg-busca" type="search" placeholder="Buscar em todos os grupos..." autocomplete="off">
  </label>
</div>

<?php
// /app/views/emergencia/index.php
?>

<section id="emergencia-painel" class="emg-painel" aria-labelledby="emg-titulo">
  <!-- Grade: 3 colunas, cada uma um grupo -->
  <div class="emg-grid" role="group" aria-label="Listas de emergências por grupo">
    <!-- COLUNA 1 — GERAL/LB -->
    <section class="emg-col" aria-labelledby="emg-g-titulo">
      <header class="emg-col-header">
        <h2 id="emg-g-titulo">Geral/LB</h2>
      </header>
      <div class="emg-col-body">
        <ul id="emg-lista-geral" class="emg-lista" role="listbox" tabindex="0" aria-label="Emergências Geral/LB" data-grupo-id="1"></ul>
        <div id="emg-g-vazio" class="emg-vazio">Nenhuma emergência encontrada.</div>
        <div id="emg-g-loading" class="emg-loading" hidden>Carregando…</div>
        <div id="emg-g-erro" class="emg-erro" hidden>Falha ao carregar a lista.</div>
      </div>
    </section>

    <!-- COLUNA 2 — U-1620 -->
    <section class="emg-col" aria-labelledby="emg-1620-titulo">
      <header class="emg-col-header">
        <h2 id="emg-1620-titulo">U-1620</h2>
      </header>
      <div class="emg-col-body">
        <ul id="emg-lista-1620" class="emg-lista" role="listbox" tabindex="0" aria-label="Emergências U-1620" data-grupo-id="2"></ul>
        <div id="emg-1620-vazio" class="emg-vazio">Nenhuma emergência encontrada.</div>
        <div id="emg-1620-loading" class="emg-loading" hidden>Carregando…</div>
        <div id="emg-1620-erro" class="emg-erro" hidden>Falha ao carregar a lista.</div>
      </div>
    </section>

    <!-- COLUNA 3 — U-1640 -->
    <section class="emg-col" aria-labelledby="emg-1640-titulo">
      <header class="emg-col-header">
        <h2 id="emg-1640-titulo">U-1640</h2>
      </header>
      <div class="emg-col-body">
        <ul id="emg-lista-1640" class="emg-lista" role="listbox" tabindex="0" aria-label="Emergências U-1640" data-grupo-id="3"></ul>
        <div id="emg-1640-vazio" class="emg-vazio">Nenhuma emergência encontrada.</div>
        <div id="emg-1640-loading" class="emg-loading" hidden>Carregando…</div>
        <div id="emg-1640-erro" class="emg-erro" hidden>Falha ao carregar a lista.</div>
      </div>
    </section>
  </div>

  <!-- Status discreto -->
  <footer class="emg-footer" aria-live="polite">
    <span id="emg-status"></span>
  </footer>

  <!-- Template único para itens -->
  <template id="tpl-emg-item">
    <li class="emg-item" role="option">
      <button type="button" class="emg-item-btn">
        <span class="emg-item-titulo"></span>
      </button>
    </li>
  </template>
</section>

<!-- Modal Nova Emergência -->
<div id="modalNovaEmergencia" class="modal-emergerenc" style="display:none;">
  <div class="modal-emergerenc-content">
    <div class="modal-emergerenc-header">
      <h3>Nova Emergência</h3>
    </div>
    <div class="modal-emergerenc-body">
      <div class="form-row">
        <label for="inputNovaEmergenciaTitulo">Nome:</label>
        <input type="text" id="inputNovaEmergenciaTitulo" class="field-text field-wide">
      </div>
      <div class="form-row">
        <label for="selectNovaEmergenciaGrupo">Grupo:</label>
        <select id="selectNovaEmergenciaGrupo" class="field-select">
          <option value="1">Geral/LB</option>
          <option value="2">U-1620</option>
          <option value="3">U-1640</option>
        </select>
      </div>
    </div>
    <div class="modal-emergerenc-actions">
      <button type="button" id="btnOkNovaEmergencia">OK</button>
      <button type="button" id="btnCancelNovaEmergencia">Cancelar</button>
    </div>
  </div>
</div>