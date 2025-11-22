<link rel="stylesheet" href="css/administrativo.css?v=<?php echo time(); ?>">

<div class="painel-cabecalho">
  <h2 id="admin-titulo">Geral / Administrativo</h2>
</div>

<div class="admin-conteudo">
  <!-- Card 1: Diagramas -->
  <article class="admin-card">
    <h3 class="admin-card__head">Diagramas</h3>
    <div class="admin-card__body">
      <button class="admin-botao" type="button" onclick="PLI.viewer.exibir('diag-gc.jpg')">Gás Combustível</button>
      <button class="admin-botao" type="button" onclick="PLI.viewer.exibir('diag-bfw.jpg')">BFW - Água de Caldeira</button>
      <button class="admin-botao" type="button" onclick="PLI.viewer.exibir('diag-gn.jpg')">GN - Gás Natural</button>
      <button class="admin-botao" type="button" onclick="PLI.viewer.exibir('diag-n2.jpg')">N2 - Nitrogênio</button>
      <button class="admin-botao" type="button" onclick="PLI.viewer.exibir('diag-vap.jpg')">VAP - Vap. Alta Pressão</button>
      <button class="admin-botao" type="button" onclick="PLI.viewer.exibir('diag-vmp.jpg')">VMP - Vap. Média Pressão</button>
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
