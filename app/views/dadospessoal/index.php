<div id="conteudo-central" data-secao="dadospessoal">

  <!-- Cabeçalho fixo do painel -->
  <div class="painel-cabecalho">
    <h2>Dados de Pessoal</h2>
    <button class="botao-cabecalho" onclick="carregarConteudo('alterarpessoal')">Alterar Dados</button>
  </div>

  <!-- Área de conteúdo rolável -->
  <div class="painel-conteudo">
    <!-- Técnicos -->
    <h3>Técnicos de Operações</h3>
    <div class="grupo-coluna">
      <?php
      $grupos = ['A', 'B', 'C', 'D', 'E'];
      foreach ($grupos as $grupo) {
          echo "<div class='grupo'><strong>Grupo $grupo</strong><hr>";
          foreach ($dados as $pessoa) {
              if ($pessoa['cargo'] === 'Operador' && strtoupper($pessoa['grupo']) === $grupo) {
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
          echo "<div class='grupo'><strong>Grupo $grupo:</strong><hr>";
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
          echo "<div class='grupo'><strong>Grupo $grupo:</strong><hr>";
          foreach ($dados as $pessoa) {
              if ($pessoa['cargo'] === 'Coordenador' && strtoupper($pessoa['grupo']) === $grupo) {
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
      $cargosGestao = ['Gerente1', 'Gerente2', 'CTO', 'OPMAN', 'Administração'];
      foreach ($cargosGestao as $cargoGestao) {
          echo "<div class='grupo'><strong>{$cargoGestao}:</strong><hr>";
          foreach ($dados as $pessoa) {
              if ($pessoa['cargo'] === $cargoGestao) {
                  echo "<a href='#' class='nome' onclick=\"mostrarModal(" . htmlspecialchars(json_encode($pessoa), ENT_QUOTES) . ")\">{$pessoa['nome']}</a>";
              }
          }
          echo "</div>";
      }
      ?>
    </div>

    <!-- Modal -->
    <div id="modalDetalhes" class="modal">
      <h3>Dados completos</h3>
      <dl id="conteudoModal"></dl>
      <button onclick="fecharModal()">Fechar</button>
    </div>

  </div> <!-- Fim de .painel-conteudo -->

</div> <!-- Fim de #conteudo-central -->
