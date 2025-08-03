<link rel="stylesheet" href="css/telefone.css?v=2">

<div class="painel-cabecalho">
    <h2>Lista Telefônica</h2>

    <div class="telefone-busca">
        <input type="text" id="telefoneCampoBusca" placeholder="Buscar nome ou ramal...">
    </div>
</div>

<!-- Container principal -->
<div class="telefone-grupo-coluna">
    <div class="telefone-grupo">
        <strong>Operação</strong>
        <div class="telefone-lista" data-grupo="Operação"></div>
    </div>
    <div class="telefone-grupo">
        <strong>Unidades</strong>
        <div class="telefone-lista" data-grupo="Unidades"></div>
    </div>
    <div class="telefone-grupo">
        <strong>Administrativos</strong>
        <div class="telefone-lista" data-grupo="Administrativos"></div>
    </div>
    <div class="telefone-grupo">
        <strong>Outros</strong>
        <div class="telefone-lista" data-grupo="Outros"></div>
    </div>
</div>

<script src="js/listatelefonica.js"></script>
<script> telefoneInit(); </script>
