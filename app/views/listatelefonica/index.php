<div id="conteudo-central" data-secao="listatelefonica">

  <!-- Cabeçalho e Campo de Busca -->
  <div class="cabecalho-dados">
    <h2>Lista Telefônica</h2>
    <input type="text" id="campoBusca" placeholder="Buscar por descrição ou ramal...">
  </div>

  <div id="resultadoBusca"></div>

  <hr>

  <!-- Grupos -->
  <div class="grupo-coluna">
    <?php
    $grupos = ['Utilidades', 'Unidades', 'Administrativos', 'Diversos'];

    foreach ($grupos as $grupo) {
        echo "<div class='grupo'><strong>$grupo</strong><br>";

        foreach ($dados as $item) {
            if ($item['grupo'] === $grupo) {
                echo "<div class='nome'>";
                echo "<strong>{$item['descricao']}</strong>: Ramal {$item['ramal']}";
                echo "</div>";
            }
        }

        echo "</div>";
    }
    ?>
  </div>

</div> <!-- Fim de #conteudo-central -->
