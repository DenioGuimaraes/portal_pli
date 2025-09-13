<link rel="stylesheet" href="css/u1620valv.css?v=<?php echo time(); ?>">

<div class="painel-cabecalho">
    <h2>U-1620 - Válvulas</h2>
    <div class="u1620valv-busca">
        <input type="text" id="u1620valvCampoBusca" placeholder="Buscar nome ou tag..." onkeyup="u1620valvFiltrarBusca()">
    </div>
</div>

<div class="u1620valv-separador">
    <!-- Coluna esquerda -->
    <div class="u1620valv-col-esq">
        <div class="u1620valv-card">
            <div class="u1620valv-card__head">
                <h3>Grupos</h3>
            </div>
            <div class="u1620valv-card__body">
                <button class="u1620valv-botao" onclick="u1620valvFiltrarGrupo('Temperatura')">Temperatura</button>
                <button class="u1620valv-botao" onclick="u1620valvFiltrarGrupo('Pressão')">Pressão</button>
                <button class="u1620valv-botao" onclick="u1620valvFiltrarGrupo('Vazão')">Vazão</button>
                <button class="u1620valv-botao" onclick="u1620valvFiltrarGrupo('Nível')">Nível</button>
            </div>
        </div>
    </div>

    <!-- Coluna direita -->
    <div class="u1620valv-col-dir">
        <div class="u1620valv-card">
            <div class="u1620valv-card__head">
                <h3 id="u1620valvTituloGrupo">Grupo: Temperatura</h3>
            </div>
            <div class="u1620valv-card__body">
                <table class="u1620valv-tabela" id="u1620valvTabela">
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
        <div class="u1620valv-acoes">
            <button class="u1620valv-botao" id="u1620valvBtnNovo" onclick="u1620valvAbrirModalNovo()">Novo</button>
            <button class="u1620valv-botao" id="u1620valvBtnEditar" onclick="u1620valvEditar()" disabled>Editar</button>
            <button class="u1620valv-botao" id="u1620valvBtnExcluir" onclick="u1620valvExcluir()" disabled>Excluir</button>
        </div>
    </div>
</div>

<!-- Modal u1620valv -->
<div id="modalu1620valv" class="modal-u1620valv" style="display:none;">
    <div class="modal-u1620valv-content">

        <!-- Cabeçalho -->
        <div class="modal-u1620valv-header">
            <h3 id="modalTitulou1620valv">Novo / Editar Válvula</h3>
        </div>

        <!-- Corpo -->
        <div class="modal-u1620valv-body">
            <div class="form-row">
                <label for="u1620valvSelectGrupo">Grupo:</label>
                <select id="u1620valvSelectGrupo">
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
        <div class="modal-u1620valv-actions">
            <button type="button" id="btnModalu1620valvOk" onclick="u1620valvSalvar()">Salvar</button>
            <button type="button" id="btnModalu1620valvCancel" onclick="u1620valvFecharModal()">Cancelar</button>
        </div>

    </div>
</div>

<!-- Só depois roda o guard -->
<script>
    (function esperarPainelCarregado() {
        const tentativa = setInterval(() => {
            const el = document.getElementById("u1620valvTabela");
            if (typeof u1620valvRenderTabela === 'function' && el) {
                u1620valvCarregarDoServidor().then(() => {
                    console.log("🚀 Render inicial de Temperatura");
                    u1620valvRenderTabela("Temperatura");
                });
                clearInterval(tentativa);
            }
        }, 100);
    })();
</script>