<link rel="stylesheet" href="css/u1640valv.css?v=<?php echo time(); ?>">

<div class="painel-cabecalho">
    <h2>U-1640 - Válvulas</h2>
    <div class="u1640valv-busca">
        <input type="text" id="u1640valvCampoBusca" placeholder="Buscar nome ou tag..." onkeyup="u1640valvFiltrarBusca()">
    </div>
</div>

<div class="u1640valv-separador">
    <!-- Coluna esquerda -->
    <div class="u1640valv-col-esq">
        <div class="u1640valv-card">
            <div class="u1640valv-card__head">
                <h3>Grupos</h3>
            </div>
            <div class="u1640valv-card__body">
                <button class="u1640valv-botao" onclick="u1640valvFiltrarGrupo('Temperatura')">Temperatura</button>
                <button class="u1640valv-botao" onclick="u1640valvFiltrarGrupo('Pressão')">Pressão</button>
                <button class="u1640valv-botao" onclick="u1640valvFiltrarGrupo('Vazão')">Vazão</button>
                <button class="u1640valv-botao" onclick="u1640valvFiltrarGrupo('Nível')">Nível</button>
            </div>
        </div>
    </div>

    <!-- Coluna direita -->
    <div class="u1640valv-col-dir">
        <div class="u1640valv-card">
            <div class="u1640valv-card__head">
                <h3 id="u1640valvTituloGrupo">Grupo: Temperatura</h3>
            </div>
            <div class="u1640valv-card__body">
                <table class="u1640valv-tabela" id="u1640valvTabela">
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
        <div class="u1640valv-acoes">
            <button class="u1640valv-botao" id="u1640valvBtnNovo" onclick="u1640valvAbrirModalNovo()">Novo</button>
            <button class="u1640valv-botao" id="u1640valvBtnEditar" onclick="u1640valvEditar()" disabled>Editar</button>
            <button class="u1640valv-botao" id="u1640valvBtnExcluir" onclick="u1640valvExcluir()" disabled>Excluir</button>
        </div>
    </div>
</div>

<!-- Modal u1640valv -->
<div id="modalu1640valv" class="modal-u1640valv" style="display:none;">
    <div class="modal-u1640valv-content">

        <!-- Cabeçalho -->
        <div class="modal-u1640valv-header">
            <h3 id="modalTitulou1640valv">Novo / Editar Válvula</h3>
        </div>

        <!-- Corpo -->
        <div class="modal-u1640valv-body">
            <div class="form-row">
                <label for="u1640valvSelectGrupo">Grupo:</label>
                <select id="u1640valvSelectGrupo">
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
        <div class="modal-u1640valv-actions">
            <button type="button" id="btnModalu1640valvOk" onclick="u1640valvSalvar()">Salvar</button>
            <button type="button" id="btnModalu1640valvCancel" onclick="u1640valvFecharModal()">Cancelar</button>
        </div>

    </div>
</div>

<!-- Só depois roda o guard -->
<script>
    (function esperarPainelCarregado() {
        const tentativa = setInterval(() => {
            const el = document.getElementById("u1640valvTabela");
            if (typeof u1640valvRenderTabela === 'function' && el) {
                u1640valvCarregarDoServidor().then(() => {
                    console.log("🚀 Render inicial de Temperatura");
                    u1640valvRenderTabela("Temperatura");
                });
                clearInterval(tentativa);
            }
        }, 100);
    })();
</script>