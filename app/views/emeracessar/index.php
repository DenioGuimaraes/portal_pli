<link rel="stylesheet" href="css/emeracessar.css?v=<?php echo time(); ?>">

<?php
// garante que $dados exista mesmo se não vier nada
$dados  = $dados  ?? ['titulo' => '', 'identificadores' => '', 'causas' => '', 'impacto' => '', 'contatos' => ''];
$passos = $passos ?? [];
?>

<div class="painel-cabecalho">
  <h2 id="titulo-emergencia">
    <?= htmlspecialchars($dados['titulo'] ?: 'Emergências - Acessar') ?>
  </h2>
</div>

<section class="emerAcessar" aria-label="Emergências - Acessar">
  <div class="emer-grid">

    <!-- COLUNA ESQUERDA (24%) -->
    <div class="col col--left">
      <article id="card-identificadores" class="card">
        <h3 class="card__head">Identificadores</h3>
        <div id="body-identificadores" class="card__body">
          <?= nl2br(htmlspecialchars($dados['identificadores'])) ?>
        </div>
      </article>

      <article id="card-causas" class="card">
        <h3 class="card__head">Causas</h3>
        <div id="body-causas" class="card__body">
          <?= nl2br(htmlspecialchars($dados['causas'])) ?>
        </div>
      </article>

      <article id="card-impacto" class="card">
        <h3 class="card__head">Impacto</h3>
        <div id="body-impacto" class="card__body">
          <?= nl2br(htmlspecialchars($dados['impacto'])) ?>
        </div>
      </article>

      <article id="card-contatos" class="card">
        <h3 class="card__head">Contatos</h3>
        <div id="body-contatos" class="card__body">
          <?= nl2br(htmlspecialchars($dados['contatos'])) ?>
        </div>
      </article>
    </div>

    <!-- COLUNA CENTRAL (36%) -->
    <div class="col col--center">
      <article id="card-passos" class="card">
        <h3 class="card__head">Sequência de Passos</h3>
        <div id="body-passos" class="card__body">
          <?php if (empty($passos)): ?>
            <p><em>Nenhum passo cadastrado.</em></p>
          <?php else: ?>
            <ul class="lista-passos">
              <?php foreach ($passos as $p): ?>
                <li class="passo-item"
                  data-detalhe="<?= htmlspecialchars($p['detalhe']) ?>"
                  onclick="mostrarDetalhe(this)">
                  <?= (int)$p['ordem'] ?>. <?= htmlspecialchars($p['rotulo']) ?>
                </li>
              <?php endforeach; ?>
            </ul>
          <?php endif; ?>
        </div>
      </article>
    </div>

    <div class="col col--right">
      <article id="card-acoes" class="card">
        <h3 class="card__head">Detalhes do Passo</h3>
        <div id="body-acoes" class="card__body">
          <?php if (!empty($passos)): ?>
            <?php
            $linhas = explode("\n", $passos[0]['detalhe']);
            echo '<ul class="etapas-passo">';
            foreach ($linhas as $linha) {
              $linha = trim($linha);
              if ($linha !== '') {
                echo '<li>' . htmlspecialchars($linha) . '</li>';
              }
            }
            echo '</ul>';
            ?>
          <?php else: ?>
            <em>Selecione um passo para ver detalhes.</em>
          <?php endif; ?>
        </div>

      </article>
    </div>
  </div>
</section>