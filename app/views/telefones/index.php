<link rel="stylesheet" href="css/telefones.css?v=<?php echo time(); ?>">

<div class="painel-cabecalho">
    <h2>Lista Telefônica</h2>
    <div class="telefone-busca">
        <input type="text" id="telefoneCampoBusca" placeholder="Buscar nome ou ramal..." onkeyup="telFiltrarBusca()">
    </div>
</div>

<div class="telefone-separador">
    <!-- Coluna esquerda -->
    <div class="telefone-col-esq">
        <div class="telefone-card">
            <div class="telefone-card__head">
                <h3>Grupos</h3>
            </div>
            <div class="telefone-card__body">
                <button class="telefone-botao" onclick="telFiltrarGrupo('Agenda')">Agenda</button>
                <button class="telefone-botao" onclick="telFiltrarGrupo('Operacional')">Operacional</button>
                <button class="telefone-botao" onclick="telFiltrarGrupo('Unidades')">Unidades</button>
                <button class="telefone-botao" onclick="telFiltrarGrupo('Administrativos')">Administrativos</button>
                <button class="telefone-botao" onclick="telFiltrarGrupo('Diversos')">Diversos</button>
            </div>
        </div>
    </div>

    <!-- Coluna direita -->
    <div class="telefone-col-dir">
        <div class="telefone-card">
            <div class="telefone-card__head">
                <h3 id="telefoneTituloGrupo">Grupo: Agenda</h3>
            </div>
            <div class="telefone-card__body">
                <table class="telefone-tabela" id="telefoneTabela">
                    <thead>
                        <tr>
                            <th>Descrição</th>
                            <th>Ramal</th>
                        </tr>
                    </thead>
                    <tbody><!-- vazio; o JS preenche --></tbody>
                </table>
            </div>
        </div>

        <!-- Botões CRUD -->
        <div class="telefone-acoes">
            <button class="telefone-botao" id="telefoneBtnNovo" onclick="telAbrirModalNovo()">Novo</button>
            <button class="telefone-botao" id="telefoneBtnEditar" onclick="telEditar()" disabled>Editar</button>
            <button class="telefone-botao" id="telefoneBtnExcluir" onclick="telExcluir()" disabled>Excluir</button>
        </div>
    </div>
</div>

<!-- Modal Telefones -->
<div id="modalTelefone" class="modal-telefone" style="display:none;">
    <div class="modal-telefone-content">

        <!-- Cabeçalho -->
        <div class="modal-telefone-header">
            <h3 id="modalTituloTelefone">Novo / Editar Telefone</h3>
        </div>

        <!-- Corpo -->
        <div class="modal-telefone-body">
            <div class="form-row">
                <label for="modalGrupo">Grupo:</label>
                <select id="telefoneSelectGrupo">
                    <option value="Agenda">Agenda</option>
                    <option value="Operacional">Operacional</option>
                    <option value="Unidades">Unidades</option>
                    <option value="Administrativos">Administrativos</option>
                    <option value="Diversos">Diversos</option>
                </select>
            </div>

            <div class="form-row">
                <label for="modalDescricao">Descrição:</label>
                <input type="text" id="modalDescricao">
            </div>

            <div class="form-row">
                <label for="modalRamal">Ramal:</label>
                <input type="text" id="modalRamal">
            </div>
        </div>

        <!-- Rodapé -->
        <div class="modal-telefone-actions">
            <button type="button" id="btnModalTelefoneOk" onclick="telSalvar()">Salvar</button>
            <button type="button" id="btnModalTelefoneCancel" onclick="telFecharModal()">Cancelar</button>
        </div>

    </div>
</div>

<!-- Só depois roda o guard -->
<script>
  (function esperarPainelCarregado() {
      const tentativa = setInterval(() => {
          const el = document.getElementById("telefoneTabela");
          if (typeof telRenderTabela === 'function' && el) {
              telCarregarDoServidor().then(() => {
                  console.log("🚀 Render inicial de Agenda");
                  telRenderTabela("Agenda");
              });
              clearInterval(tentativa);
          }
      }, 100);
  })();
</script>
