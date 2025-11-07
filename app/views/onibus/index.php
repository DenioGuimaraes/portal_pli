<link rel="stylesheet" href="css/onibus.css?v=5">

<div class="painel-cabecalho">
    <h2>Itinerários de Ônibus</h2>
</div>

<div class="onibus-container">
  <!-- Coluna Turno -->
  <div class="onibus-coluna">
    <div class="onibus-header">
      <h3>Ônibus de Turno</h3>
    </div>
    <div class="onibus-lista" id="onibusListaTurno" data-tipo="turno">
      <!-- Conteúdo dinâmico via onibus.js -->
    </div>
  </div>

  <!-- Coluna Administrativo -->
  <div class="onibus-coluna">
    <div class="onibus-header">
      <h3>Ônibus de HA</h3>
    </div>
    <div class="onibus-lista" id="onibusListaAdmin" data-tipo="administrativo">
      <!-- Conteúdo dinâmico via onibus.js -->
    </div>
  </div>
</div>

<script>
  onibusInit();
</script>


<script src="<?= BASE_URL ?>/public/js/onibus.js"></script>
<script> onibusInit(); </script>

