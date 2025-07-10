<div id="conteudo-central" data-secao="dadospessoal">

  <!-- Cabeçalho e Campo de Busca -->
  <div class="cabecalho-dados">
    <h2>Dados de Pessoal</h2>
    <input type="text" id="campoBusca" placeholder="Buscar por nome...">
  </div>

  <div id="resultadoBusca"></div>

  <hr>

  <!-- Técnicos -->
  <h3>Técnicos de Operações</h3>
  <div class="grupo-coluna">
    <?php
    $grupos = ['A', 'B', 'C', 'D', 'E'];
    foreach ($grupos as $grupo) {
        echo "<div class='grupo'><strong>Grupo $grupo</strong><br>";
        foreach ($dados as $pessoa) {
            if ($pessoa['cargo'] === 'Técnico em Operações' && strtoupper($pessoa['grupo']) === $grupo) {
                echo "<div class='nome' onclick=\"mostrarModal(" . htmlspecialchars(json_encode($pessoa), ENT_QUOTES) . ")\">{$pessoa['nome']}</div>";
            }
        }
        echo "</div>";
    }
    ?>
  </div>

  <hr>

  <!-- Supervisores -->
  <h3>Supervisores</h3>
  <div class="grupo-coluna">
    <?php
    foreach ($grupos as $grupo) {
        echo "<div class='grupo'><strong>Grupo $grupo:</strong><br>";
        foreach ($dados as $pessoa) {
            if ($pessoa['cargo'] === 'Supervisor' && strtoupper($pessoa['grupo']) === $grupo) {
                echo "<div class='nome' onclick=\"mostrarModal(" . htmlspecialchars(json_encode($pessoa), ENT_QUOTES) . ")\">{$pessoa['nome']}</div>";
            }
        }
        echo "</div>";
    }
    ?>
  </div>

  <hr>

  <!-- Coordenadores de Turno -->
  <h3>Coordenadores de Turno</h3>
  <div class="grupo-coluna">
    <?php
    foreach ($grupos as $grupo) {
        echo "<div class='grupo'><strong>Grupo $grupo:</strong><br>";
        foreach ($dados as $pessoa) {
            if ($pessoa['cargo'] === 'Coordenador de Turno' && strtoupper($pessoa['grupo']) === $grupo) {
                echo "<div class='nome' onclick=\"mostrarModal(" . htmlspecialchars(json_encode($pessoa), ENT_QUOTES) . ")\">{$pessoa['nome']}</div>";
            }
        }
        echo "</div>";
    }
    ?>
  </div>

  <hr>

  <!-- Gerência / Gestão -->
  <h3>Gerência / Gestão</h3>
  <div class="grupo-coluna">
    <?php
    $cargosGestao = ['Gerente 1', 'Gerente 2', 'CTO', 'OPMAN'];
    foreach ($cargosGestao as $cargoGestao) {
        echo "<div class='grupo'><strong>{$cargoGestao}:</strong><br>";
        foreach ($dados as $pessoa) {
            if ($pessoa['cargo'] === $cargoGestao) {
                echo "<a href='#' class='nome' onclick=\"mostrarModal(" . htmlspecialchars(json_encode($pessoa), ENT_QUOTES) . ")\">{$pessoa['nome']}</a>";
            }
        }
        echo "</div>";
    }
    ?>
  </div>

  <!-- Modal de Detalhes -->
  <div id="modalDetalhes" class="modal">
    <h3>Dados completos</h3>
    <dl id="conteudoModal"></dl>
    <button onclick="fecharModal()">Fechar</button>
  </div>

</div> <!-- Fim de #conteudo-central -->
