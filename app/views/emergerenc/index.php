<link rel="stylesheet" href="css/emergerenc.css?v=<?php echo time(); ?>">
<script src="js/emergerenc.js?v=<?php echo time(); ?>"></script>

<?php
// valores default para evitar avisos (serão preenchidos depois)
$proc = $proc ?? ['titulo' => '', 'grupo' => 'geral', 'identificadores' => '', 'causas' => '', 'impacto' => '', 'contatos' => ''];
?>

<!-- Barra superior: Título, Grupo e Fechar -->
<div class="emer-topbar">
    <div class="top-field">
        <label for="emer-titulo">Título</label>
        <input id="emer-titulo" type="text" class="emer-titulo" value="<?= htmlspecialchars($proc['titulo']) ?>" placeholder="Título da emergência">
    </div>

    <div class="top-field top-field--grupo">
        <label for="emer-grupo">Grupo</label>
        <select id="emer-grupo" class="top-select">
            <option value="1" <?= (($proc['grupo'] ?? '') == 1) ? 'selected' : '';  ?>>Geral / LB</option>
            <option value="2" <?= (($proc['grupo'] ?? '') == 2) ? 'selected' : '';  ?>>U-1620</option>
            <option value="3" <?= (($proc['grupo'] ?? '') == 3) ? 'selected' : '';  ?>>U-1640</option>
        </select>
    </div>

</div>

<section class="emerGerenc" aria-label="Emergências - Novo/Editar">
    <!-- Grid 3 colunas (24/36/36) -->
    <div class="emer-grid">

        <!-- Coluna esquerda: 4 cards iguais -->
        <div class="col col--left">
            <article id="card-identificadores" class="card">
                <h3 class="card__head">Identificadores</h3>
                <div class="card__body">
                    <textarea id="fld-identificadores" class="field-text" placeholder="Digite os identificadores..."><?= htmlspecialchars($proc['identificadores']) ?></textarea>
                </div>
            </article>

            <article id="card-causas" class="card">
                <h3 class="card__head">Causas</h3>
                <div class="card__body">
                    <textarea id="fld-causas" class="field-text" placeholder="Digite as causas..."><?= htmlspecialchars($proc['causas']) ?></textarea>
                </div>
            </article>

            <article id="card-impacto" class="card">
                <h3 class="card__head">Impacto</h3>
                <div class="card__body">
                    <textarea id="fld-impacto" class="field-text" placeholder="Descreva o impacto..."><?= htmlspecialchars($proc['impacto']) ?></textarea>
                </div>
            </article>

            <article id="card-contatos" class="card">
                <h3 class="card__head">Contatos</h3>
                <div class="card__body">
                    <textarea id="fld-contatos" class="field-text" placeholder="Contatos úteis..."><?= htmlspecialchars($proc['contatos']) ?></textarea>
                </div>
            </article>
        </div>

        <!-- Coluna central: card + bloco de 6 botões -->
        <div class="col col--center">
            <article id="card-passos" class="card">
                <h3 class="card__head">Sequência de Passos</h3>
                <div id="body-passos" class="card__body">
                    <!-- lista de passos (selecionável) virá aqui depois -->
                </div>
            </article>

            <div class="gerenc-actions">
                <button type="button" class="btn btn-icon" id="btnPassoUp"
                    title="Mover passo para cima" onclick="moverPassoParaCima(passoSelId)" disabled>↑</button>
                <button type="button" class="btn btn-icon" id="btnPassoDown"
                    onclick="moverPassoParaBaixo(passoSelId)" title="Mover passo para baixo" disabled>↓</button>
                <button type="button" class="btn" id="btnNovoProc">Novo</button>
                <button type="button" class="btn" id="btnEditarProc" disabled>Editar</button>
                <button type="button" class="btn" id="btnExcluirProc" disabled>Excluir</button>
                <button type="button" class="btn" id="btnSalvarProc" disabled>Salvar</button>
            </div>
        </div>

        <!-- Coluna direita: detalhes do passo selecionado (read-only por enquanto) -->
        <div class="col col--right">
            <article id="card-acoes" class="card">
                <h3 class="card__head">Detalhes do Passo</h3>
                <div id="body-acoes" class="card__body2">
                    <!-- detalhamento do passo selecionado aparecerá aqui -->
                </div>
            </article>
        </div>

    </div>
</section>

<!-- Modal Editar -->
<div id="modalEditarPasso" class="modal-emergerenc" style="display:none;">
    <div class="modal-emergerenc-content">
        <div class="modal-emergerenc-header">
            <h3>Editar Passo</h3>
        </div>
        <div class="modal-emergerenc-body">
            <label for="inputEditarRotulo">Nome:</label>
            <input type="text" id="inputEditarRotulo" class="field-text">
        </div>
        <div class="modal-emergerenc-actions">
            <button type="button" id="btnOkEditar">OK</button>
            <button type="button" id="btnCancelEditar">Cancelar</button>
        </div>
    </div>
</div>

<!-- Modal Novo -->
<div id="modalNovoPasso" class="modal-emergerenc" style="display:none;">
    <div class="modal-emergerenc-content">
        <div class="modal-emergerenc-header">
            <h3>Novo Passo</h3>
        </div>
        <div class="modal-emergerenc-body">
            <label for="inputNovoRotulo">Nome:</label>
            <input type="text" id="inputNovoRotulo" class="field-text">
        </div>
        <div class="modal-emergerenc-actions">
            <button type="button" id="btnOkNovo">OK</button>
            <button type="button" id="btnCancelNovo">Cancelar</button>
        </div>
    </div>
</div>