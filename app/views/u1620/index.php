<link rel="stylesheet" href="css/u1620.css?v=1">

<div class="painel-cabecalho">
  <h2>U-1620</h2>
</div>

<div class="u1620-layout">
  <div class="u1620-col-esq">
    <section class="u1620-card">
      <div class="u1620-card-head">
        <h3>Parâmetros da Unidade</h3>
      </div>

      <div class="u1620-form-grid">
        <label class="u1620-lbl">RVC</label>
        <input id="rvc" class="u1620-in" type="number" step="0.1" min="0" max="10" inputmode="decimal">

        <label class="u1620-lbl">FR-6205</label>
        <input id="outFRC6205" class="u1620-in is-output" type="text" readonly>

        <label class="u1620-lbl">FR-6223</label>
        <input id="carga" class="u1620-in" type="number" step="0.1" min="0" inputmode="decimal">

        <label class="u1620-lbl">FR-6216</label>
        <input id="outFR6216" class="u1620-in is-output" type="text" readonly>
      </div>

      <!-- Slider full-width com setas -->
      <div class="u1620-slider-wrap">
        <div class="u1620-slider-labels">
          <span>4,0</span>
          <span>FR-6223</span>
          <span>6,5</span>
        </div>

        <div class="u1620-slider-row">
          <button id="escLeft"  type="button" class="u1620-arrow" aria-label="Diminuir escala">◀</button>
          <input id="escala" class="u1620-slider" type="range" min="4" max="6.5" step="0.1">
          <button id="escRight" type="button" class="u1620-arrow" aria-label="Aumentar escala">▶</button>
        </div>

        <div class="u1620-slider-value">
          <span id="escalaValor">—</span>
        </div>
      </div>
    </section>
  </div>

  <div class="u1620-col-dir"><!-- reservado --></div>
</div>
