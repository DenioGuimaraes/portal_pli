<link rel="stylesheet" href="css/u1640psv.css?v=<?php echo time(); ?>">

<div class="painel-cabecalho">
    <h2>U-1640 Válvulas de Segurança (PSV's)</h2>
</div>

<div class="u1640psv-conteudo">

    <!-- Card da tabela -->
    <div class="u1640psv-card">
        <table class="u1640psv-tabela" id="u1640psvTabela">
            <thead>
                <tr>
                    <th>Tag</th>
                    <th>Localização</th>
                    <th>Fluido</th>
                    <th>Alívio</th>
                    <th>Ø Entrada</th>
                    <th>Ø Saída</th>
                    <th>P. Operação</th>
                    <th>Calibre</th>
                    <th>Andaime</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </div>

    <!-- Botões CRUD -->
    <div class="u1640psv-botoes">
        <button onclick="u1640psvNovo()">Novo</button>
        <button id="u1640psvBtnEditar" onclick="u1640psvEditar()" disabled>Editar</button>
        <button id="u1640psvBtnExcluir" onclick="u1640psvExcluir()" disabled>Excluir</button>
    </div>

</div>

<!-- Modal -->
<div id="u1640psvModal" class="u1640psv-modal" style="display:none;">
    <div class="u1640psv-modal-content">
        <h3>Editar Registro</h3>
        <form id="u1640psvForm">

            <!-- Wrapper das duas colunas -->
            <div class="u1640psv-form-grid">
                <!-- Coluna 1 -->
                <div class="u1640psv-form-col">
                    <label for="u1640psv_tag">Tag:</label>
                    <input type="text" id="u1640psv_tag" name="tag" required>

                    <label for="u1640psv_localizacao">Localização:</label>
                    <input type="text" id="u1640psv_localizacao" name="localizacao">

                    <label for="u1640psv_fluido">Fluido:</label>
                    <input type="text" id="u1640psv_fluido" name="fluido">

                    <label for="u1640psv_alivio">Alívio:</label>
                    <input type="text" id="u1640psv_alivio" name="alivio">

                    <label for="u1640psv_diam_entrada">Ø Entrada:</label>
                    <input type="text" id="u1640psv_diam_entrada" name="diam_entrada">
                </div>

                <!-- Coluna 2 -->
                <div class="u1640psv-form-col">
                    <label for="u1640psv_diam_saida">Ø Saída:</label>
                    <input type="text" id="u1640psv_diam_saida" name="diam_saida">

                    <label for="u1640psv_pressao_operacao">P. Operação:</label>
                    <input type="number" step="0.01" id="u1640psv_pressao_operacao" name="pressao_operacao">

                    <label for="u1640psv_calibre">Calibre:</label>
                    <input type="number" step="0.01" id="u1640psv_calibre" name="calibre">

                    <label for="u1640psv_andaime">Andaime:</label>
                    <input type="text" id="u1640psv_andaime" name="andaime">
                </div>
            </div>

            <!-- Botões (fora do grid) -->
            <div class="u1640psv-modal-actions">
                <button class="botao-direito" type="button" onclick="u1640psvSalvar()">Salvar</button>
                <button class="botao-direito" type="button" onclick="u1640psvFecharModal()">Cancelar</button>
            </div>
        </form>
    </div>
</div>

<script src="js/u1640psv.js?v=<?php echo time(); ?>"></script>
<script>
    document.addEventListener("DOMContentLoaded", u1640psvInit);
</script>
