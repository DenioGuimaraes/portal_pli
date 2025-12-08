<link rel="stylesheet" href="css/u1620psv.css?v=<?php echo time(); ?>">

<div class="painel-cabecalho">
    <h2>U-1620 Válvulas de Segurança (PSV's)</h2>
</div>

<div class="u1620psv-conteudo">

    <!-- Card da tabela -->
    <div class="u1620psv-card">
        <table class="u1620psv-tabela" id="u1620psvTabela">
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
    <div class="u1620psv-botoes">
        <button onclick="u1620psvNovo()">Novo</button>
        <button id="u1620psvBtnEditar" onclick="u1620psvEditar()" disabled>Editar</button>
        <button id="u1620psvBtnExcluir" onclick="u1620psvExcluir()" disabled>Excluir</button>
    </div>

</div>

<!-- Modal -->
<div id="u1620psvModal" class="u1620psv-modal" style="display:none;">
    <div class="u1620psv-modal-content">
        <h3>Editar Registro</h3>
        <form id="u1620psvForm">

            <!-- Wrapper das duas colunas -->
            <div class="u1620psv-form-grid">
                <!-- Coluna 1 -->
                <div class="u1620psv-form-col">
                    <label for="u1620psv_tag">Tag:</label>
                    <input type="text" id="u1620psv_tag" name="tag" required>

                    <label for="u1620psv_localizacao">Localização:</label>
                    <input type="text" id="u1620psv_localizacao" name="localizacao">

                    <label for="u1620psv_fluido">Fluido:</label>
                    <input type="text" id="u1620psv_fluido" name="fluido">

                    <label for="u1620psv_alivio">Alívio:</label>
                    <input type="text" id="u1620psv_alivio" name="alivio">

                    <label for="u1620psv_diam_entrada">Ø Entrada:</label>
                    <input type="text" id="u1620psv_diam_entrada" name="diam_entrada">
                </div>

                <!-- Coluna 2 -->
                <div class="u1620psv-form-col">
                    <label for="u1620psv_diam_saida">Ø Saída:</label>
                    <input type="text" id="u1620psv_diam_saida" name="diam_saida">

                    <label for="u1620psv_pressao_operacao">P. Operação:</label>
                    <input type="number" step="0.01" id="u1620psv_pressao_operacao" name="pressao_operacao">

                    <label for="u1620psv_calibre">Calibre:</label>
                    <input type="number" step="0.01" id="u1620psv_calibre" name="calibre">

                    <label for="u1620psv_andaime">Andaime:</label>
                    <input type="text" id="u1620psv_andaime" name="andaime">
                </div>
            </div>

            <!-- Botões (fora do grid) -->
            <div class="u1620psv-modal-actions">
                <button class="botao-direito" type="button" onclick="u1620psvSalvar()">Salvar</button>
                <button class="botao-direito" type="button" onclick="u1620psvFecharModal()">Cancelar</button>
            </div>
        </form>
    </div>
</div>


<script src="js/u1620psv.js?v=<?php echo time(); ?>"></script>
<script>
    document.addEventListener("DOMContentLoaded", u1620psvInit);
</script>