<link rel="stylesheet" href="css/u1620.css?v=<?php echo time(); ?>">

<div class="painel-cabecalho">
  <h2 id="u1620-titulo">U-1620</h2>
</div>

<div class="u1620-conteudo">
  <!-- Card 1: Diagramas -->
  <article class="u1620-card">
    <h3 class="u1620-card__head">Diagramas</h3>
    <div class="u1620-card__body">
      <button class="u1620-botao" type="button" onclick="PLI.viewer.exibir('diag-agua-refri.png')">Água de Refrigeração</button>
      <button class="u1620-botao" type="button" onclick="PLI.viewer.exibir('diag-agua-pot.png')">Água Potável</button>
      <button class="u1620-botao" type="button" onclick="PLI.viewer.exibir('diag-parafina.png')">Parafina</button>
      <button class="u1620-botao" type="button" onclick="PLI.viewer.exibir('diag-vbp.png')">VBP</button>
      <button class="u1620-botao" type="button" onclick="PLI.viewer.exibir('diag-vmp.png')">VMP</button>
      <button class="u1620-botao" type="button" onclick="PLI.viewer.exibir('diag-gc.png')">Gás Combustível</button>
      <button class="u1620-botao" type="button" onclick="PLI.viewer.exibir('diag-bfw.png')">BFW</button>
      <button class="u1620-botao" type="button" onclick="PLI.viewer.exibir('diag-energia.png')">Energia Elétrica</button>
      <button class="u1620-botao" type="button" onclick="PLI.viewer.exibir('diag-gn.png')">Gás Natural</button>
      <button class="u1620-botao" type="button" onclick="PLI.viewer.exibir('diag-inerte.png')">Gás Inerte</button>
      <button class="u1620-botao" type="button" onclick="PLI.viewer.exibir('diag-ar-inst.png')">Ar de Instrumento</button>
    </div>
  </article>

  <!-- Card 2: Calculadora RVC -->
  <!-- Card 2: Calculadora RVC -->
  <article class="u1620-card">
    <h3 class="u1620-card__head">Calculadora RVC</h3>
    <div class="u1620-card__body u1620-calc">
      <!-- Entradas -->
      <div class="u1620-row">
        <label for="rvc">RVC</label>
        <input type="number" id="rvc" class="u1620-in" value="5">
      </div>

      <div class="u1620-row">
        <label for="carga">FR-6223</label>
        <input type="number" id="carga" class="u1620-in" value="13345.7">
      </div>

      <!-- Slider -->
      <div class="u1620-slider-wrap">
        <div class="u1620-slider-labels">
          <span>4,0</span>
          <span>FR-6223</span>
          <span>6,5</span>
        </div>
        <div class="u1620-slider-row">
          <button type="button" class="u1620-arrow" id="escLeft">&lt;</button>
          <input type="range" min="4" max="6.5" step="0.1" value="5.8"
            class="u1620-slider" id="escala">
          <button type="button" class="u1620-arrow" id="escRight">&gt;</button>
        </div>
        <div class="u1620-slider-value" id="escalaValor">5,8</div>
      </div>

      <!-- Saídas -->
      <div class="u1620-row">
        <label for="outFRC6205">FR-6205</label>
        <input type="text" id="outFRC6205" class="u1620-in is-output" readonly>
      </div>

      <div class="u1620-row">
        <label for="outFR6216">FR-6216</label>
        <input type="text" id="outFR6216" class="u1620-in is-output" readonly>
      </div>


    </div>
  </article>

  <!-- Card 3: Equipamentos -->
  <article class="u1620-card">
    <h3 class="u1620-card__head">Equipamentos</h3>
    <div class="u1620-card__body">
      <p>Em breve...</p>
    </div>
  </article>
</div>

<script src="js/u1620.js?v=<?php echo time(); ?>"></script>
<script>
  document.addEventListener("DOMContentLoaded", () => {
    if (window.U1620?.init) U1620.init();
  });
</script>
