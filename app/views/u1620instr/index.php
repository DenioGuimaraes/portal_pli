<link rel="stylesheet" href="css/u1620instr.css?v=<?php echo time(); ?>">

<div class="painel-cabecalho">
    <h2>U-1620 - Instrumentos</h2>
    <div class="u1620instr-busca">
        <input type="text" id="u1620instrCampoBusca" placeholder="Buscar nome ou tag..." onkeyup="u1620instrFiltrarBusca()">
    </div>
</div>

<div class="u1620instr-separador">
    <!-- Coluna esquerda -->
    <div class="u1620instr-col-esq">
        <div class="u1620instr-card">
            <div class="u1620instr-card__head">
                <h3>Grupos</h3>
            </div>
            <div class="u1620instr-card__body">
                <button class="u1620instr-botao" onclick="u1620instrFiltrarGrupo('Temperatura')">Temperatura</button>
                <button class="u1620instr-botao" onclick="u1620instrFiltrarGrupo('Pressão')">Pressão</button>
                <button class="u1620instr-botao" onclick="u1620instrFiltrarGrupo('Vazão')">Vazão</button>
                <button class="u1620instr-botao" onclick="u1620instrFiltrarGrupo('Nível')">Nível</button>
            </div>
        </div>
    </div>

    <!-- Coluna direita -->
    <div class="u1620instr-col-dir">
        <div class="u1620instr-card">
            <div class="u1620instr-card__head">
                <h3 id="u1620instrTituloGrupo">Grupo: Temperatura</h3>
            </div>
            <div class="u1620instr-card__body">
                <table class="u1620instr-tabela" id="u1620instrTabela">
                    <thead>
                        <tr>
                            <th>Tag</th>
                            <th>Descrição</th>
                        </tr>
                    </thead>
                    <tbody><!-- vazio; o JS preenche --></tbody>
                </table>
            </div>
        </div>

        <!-- Botões CRUD -->
        <div class="u1620instr-acoes">
            <button class="u1620instr-botao" id="u1620instrBtnNovo" onclick="u1620instrAbrirModalNovo()">Novo</button>
            <button class="u1620instr-botao" id="u1620instrBtnEditar" onclick="u1620instrEditar()" disabled>Editar</button>
            <button class="u1620instr-botao" id="u1620instrBtnExcluir" onclick="u1620instrExcluir()" disabled>Excluir</button>
        </div>
    </div>
</div>

<!-- Modal u1620instr -->
<div id="modalu1620instr" class="modal-u1620instr" style="display:none;">
    <div class="modal-u1620instr-content">

        <!-- Cabeçalho -->
        <div class="modal-u1620instr-header">
            <h3 id="modalTitulou1620instr">Novo / Editar Instrumento</h3>
        </div>

        <!-- Corpo -->
        <div class="modal-u1620instr-body">
            <div class="form-row">
                <label for="u1620instrSelectGrupo">Grupo:</label>
                <select id="u1620instrSelectGrupo">
                    <option value="Temperatura">Temperatura</option>
                    <option value="Pressão">Pressão</option>
                    <option value="Vazão">Vazão</option>
                    <option value="Nível">Nível</option>
                </select>
            </div>

            <div class="form-row">
                <label for="modalTag">Tag:</label>
                <input type="text" id="modalTag">
            </div>

            <div class="form-row">
                <label for="modalDescricao">Descrição:</label>
                <input type="text" id="modalDescricao">
            </div>

        </div>

        <!-- Rodapé -->
        <div class="modal-u1620instr-actions">
            <button type="button" id="btnModalu1620instrOk" onclick="u1620instrSalvar()">Salvar</button>
            <button type="button" id="btnModalu1620instrCancel" onclick="u1620instrFecharModal()">Cancelar</button>
        </div>

    </div>
</div>

<!-- Só depois roda o guard -->
<script>
    (function esperarPainelCarregado() {
        const tentativa = setInterval(() => {
            const el = document.getElementById("u1620instrTabela");
            if (typeof u1620instrRenderTabela === 'function' && el) {
                u1620instrCarregarDoServidor().then(() => {
                    console.log("🚀 Render inicial de Temperatura");
                    u1620instrRenderTabela("Temperatura");
                });
                clearInterval(tentativa);
            }
        }, 100);
    })();
</script>