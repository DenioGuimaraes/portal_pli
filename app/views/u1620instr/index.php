<link rel="stylesheet" href="css/u1620instr.css?v=2">

<div class="painel-cabecalho">
    <h2>U-1620 - Instrumentos</h2>

    <div class="u1620instr-busca">
        <input type="text" style="background-color: white;" id="u1620InstrCampoBusca" placeholder="Buscar instrumento...">
    </div>
</div>

<!-- Container principal -->
<div class="u1620instr-grupo-coluna">
    <div class="u1620instr-grupo">
        <strong>Temperatura</strong>
        <div class="u1620instr-lista" data-grupo="temperatura"></div>
    </div>
    <div class="u1620instr-grupo">
        <strong>Vazão</strong>
        <div class="u1620instr-lista" data-grupo="vazao"></div>
    </div>
    <div class="u1620instr-grupo">
        <strong>Pressão</strong>
        <div class="u1620instr-lista" data-grupo="pressao"></div>
    </div>
    <div class="u1620instr-grupo">
        <strong>Segurança</strong>
        <div class="u1620instr-lista" data-grupo="seguranca"></div>
    </div>
</div>

<script src="js/u1620instr.js"></script>
<script> u1620instrInit(); </script>
