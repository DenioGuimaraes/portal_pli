<link rel="stylesheet" href="css/administrativo.css?v=<?php echo time(); ?>">

<div class="painel-cabecalho">
  <h2 id="admin-titulo">Geral / Administrativo</h2>
</div>

<div class="admin-conteudo">
  <!-- Card 1: Diagramas -->
  <article class="admin-card">
    <h3 class="admin-card__head">Diagramas</h3>
    <div class="admin-card__body">
      <button class="admin-botao" type="button" onclick="PLI.viewer.exibir('diag-agua-refri.png')">Água de Refrigeração</button>
      <button class="admin-botao" type="button" onclick="PLI.viewer.exibir('diag-agua-pot.png')">Água Potável</button>
      <button class="admin-botao" type="button" onclick="PLI.viewer.exibir('diag-parafina.png')">Parafina</button>
      <button class="admin-botao" type="button" onclick="PLI.viewer.exibir('diag-vbp.png')">VBP</button>
      <button class="admin-botao" type="button" onclick="PLI.viewer.exibir('diag-vmp.png')">VMP</button>
      <button class="admin-botao" type="button" onclick="PLI.viewer.exibir('diag-gc.jpg')">Gás Combustível</button>
      <button class="admin-botao" type="button" onclick="PLI.viewer.exibir('diag-bfw.png')">BFW</button>
      <button class="admin-botao" type="button" onclick="PLI.viewer.exibir('diag-energia.png')">Energia Elétrica</button>
      <button class="admin-botao" type="button" onclick="PLI.viewer.exibir('diag-gn.png')">Gás Natural</button>
      <button class="admin-botao" type="button" onclick="PLI.viewer.exibir('diag-inerte.png')">Gás Inerte</button>
      <button class="admin-botao" type="button" onclick="PLI.viewer.exibir('diag-ar-inst.png')">Ar de Instrumento</button>
    </div>
  </article>

  <!-- Card 2: Ferramentas -->
  <article class="admin-card">
    <h3 class="admin-card__head">Ferramentas</h3>
    <div class="admin-card__body">
      <p>Em breve...</p>
    </div>
  </article>

  <!-- Card 3: Equipamentos -->
  <article class="admin-card">
    <h3 class="admin-card__head">Equipamentos</h3>
    <div class="admin-card__body">
      <p>Em breve...</p>
    </div>
  </article>
</div>

<script src="js/administrativo.js?v=<?php echo time(); ?>"></script>
