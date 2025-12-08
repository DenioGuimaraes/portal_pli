<link rel="stylesheet" href="css/u1640instr.css?v=<?php echo time(); ?>">

<div class="painel-cabecalho">
    <h2>U-1640 - Instrumentos</h2>
    <div class="u1640instr-busca">
        <input type="text" id="u1640instrCampoBusca" placeholder="Buscar nome ou tag..." onkeyup="u1640instrFiltrarBusca()">
    </div>
</div>

<div class="u1640instr-separador">
    <!-- Coluna esquerda -->
    <div class="u1640instr-col-esq">
        <div class="u1640instr-card">
            <div class="u1640instr-card__head">
                <h3>Grupos</h3>
            </div>
            <div class="u1640instr-card__body">
                <button class="u1640instr-botao" onclick="u1640instrFiltrarGrupo('Temperatura')">Temperatura</button>
                <button class="u1640instr-botao" onclick="u1640instrFiltrarGrupo('Pressão')">Pressão</button>
                <button class="u1640instr-botao" onclick="u1640instrFiltrarGrupo('Vazão')">Vazão</button>
                <button class="u1640instr-botao" onclick="u1640instrFiltrarGrupo('Nível')">Nível</button>
            </div>
        </div>
    </div>

    <!-- Coluna direita -->
    <div class="u1640instr-col-dir">
        <div class="u1640instr-card">
            <div class="u1640instr-card__head">
                <h3 id="u1640instrTituloGrupo">Grupo: Temperatura</h3>
            </div>
            <div class="u1640instr-card__body">
                <table class="u1640instr-tabela" id="u1640instrTabela">
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
        <div class="u1640instr-acoes">
            <button class="u1640instr-botao" id="u1640instrBtnNovo" onclick="u1640instrAbrirModalNovo()">Novo</button>
            <button class="u1640instr-botao" id="u1640instrBtnEditar" onclick="u1640instrEditar()" disabled>Editar</button>
            <button class="u1640instr-botao" id="u1640instrBtnExcluir" onclick="u1640instrExcluir()" disabled>Excluir</button>
        </div>
    </div>
</div>

<!-- Modal u1640instr -->
<div id="modalu1640instr" class="modal-u1640instr" style="display:none;">
    <div class="modal-u1640instr-content">

        <!-- Cabeçalho -->
        <div class="modal-u1640instr-header">
            <h3 id="modalTitulou1640instr">Novo / Editar Instrumento</h3>
        </div>

        <!-- Corpo -->
        <div class="modal-u1640instr-body">
            <div class="form-row">
                <label for="u1640instrSelectGrupo">Grupo:</label>
                <select id="u1640instrSelectGrupo">
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
        <div class="modal-u1640instr-actions">
            <button type="button" id="btnModalu1640instrOk" onclick="u1640instrSalvar()">Salvar</button>
            <button type="button" id="btnModalu1640instrCancel" onclick="u1640instrFecharModal()">Cancelar</button>
        </div>

    </div>
</div>

<!-- Só depois roda o guard -->
<script>
    (function esperarPainelCarregado() {
        const tentativa = setInterval(() => {
            const el = document.getElementById("u1640instrTabela");
            if (typeof u1640instrRenderTabela === 'function' && el) {
                u1640instrCarregarDoServidor().then(() => {
                    console.log("🚀 Render inicial de Temperatura");
                    u1640instrRenderTabela("Temperatura");
                });
                clearInterval(tentativa);
            }
        }, 100);
    })();
</script>