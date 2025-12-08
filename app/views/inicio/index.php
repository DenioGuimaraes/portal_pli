<div class="inicio-pagina-inicio">
  <!-- Área de 80% para informações operacionais -->
  <div class="inicio-painel-operacional">
    <!-- Cabeçalho -->
    <div class="inicio-cabecalho-operacional" style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div class="inicio-titulo">RESUMO OPERACIONAL</div>
        <div class="inicio-info-auxiliar">Status das unidades U-1620 e U-1640</div>
      </div>
      <button class="botao-cabecalho" style="min-width: 150px;" onclick="resumoAbrirModal()">Alterar</button>
    </div>
    <!-- Corpo com as duas unidades -->
    <div class="inicio-corpo-operacional">
      <div class="inicio-painel-u1620">
        <h3>U-1620</h3>
        <hr />
        <div class="inicio-bloco-linha">
          <label class="inicio-rotulo">CARGA (GN):</label>
          <input id="painelCargaGn" class="inicio-dado" type="text" value="--" />
          <span class="inicio-unidade">m³/d</span>
        </div>
        <div class="inicio-bloco-linha">
          <label class="inicio-rotulo">PROD. H₂:</label>
          <input id="painelProducaoH2" class="inicio-dado" type="text" value="--" />
          <span class="inicio-unidade">m³/d</span>
        </div>
        <div class="inicio-bloco-linha">
          <label class="inicio-rotulo">PROD. CO₂:</label>
          <input id="painelProducaoCo2" class="inicio-dado" type="text" value="--" />
          <span class="inicio-unidade">m³/h</span>
        </div>
        <hr>
        <div class="inicio-bloco-linha">
          <label class="inicio-rotulo">T.B. (N₂):</label>
          <input id="painelTb" class="inicio-dado" type="text" value="--" />
          <span class="inicio-unidade">"</span>
        </div>
        <div class="inicio-bloco-linha">
          <label class="inicio-rotulo">MEA:</label>
          <input id="painelMea" class="inicio-dado" type="text" value="--" />
          <span class="inicio-unidade">Tamb</span>
        </div>
        <div class="inicio-bloco-linha">
          <label class="inicio-rotulo">BFW:</label>
          <input id="painelBfw" class="inicio-dado" type="text" value="--" />
          <span class="inicio-unidade">kgf/cm²</span>
        </div>
        <hr />
        <div class="inicio-linha-dado inicio-alinhado-direita">
          <span class="inicio-rotulo">U-1620 ➜</span>
          <input id="painelU1620para" class="inicio-dado" style="width: 200px; margin-left: -50px;" type="text" value="--" />
        </div>
        </hr>
      </div>
      <div class="inicio-painel-u1640">
        <h3>U-1640</h3>
        <hr />
        <div class="inicio-linha-destaque">
          <span class="inicio-rotulo">CARGA:</span>
          <span class="inicio-valor inicio-destaque" id="painelCarga1640">-</span>
        </div>
        <br />
        <div class="inicio-tq-container">
          <div class="inicio-tq-bloco">
            <div class="inicio-tq-titulo">TQ CARGA</div>
            <div id="painelTqCarga" class="inicio-tq-valor">--</div>
            <input id="painelDataCarga" class=inicio-tq-info type="text" value="--" />
            <input id="painelHoraCarga" class=inicio-tq-info type="text" value="--" />
          </div>
          <div class="inicio-historico">
            <div class="inicio-tq-seta">➡️</div>
            <button class="botao-historico" title="Histórico" onclick="abrirModalHistorico()">...</button>
          </div>
          <div class="inicio-tq-bloco">
            <div class="inicio-tq-titulo">TQ PROD.</div>
            <div id="painelTqProduto" class="inicio-tq-valor">--</div>
            <input id="painelDataProduto" class=inicio-tq-info type="text" value="--" />
            <input id="painelHoraProduto" class=inicio-tq-info type="text" value="--" />
          </div>
        </div>
        <hr />
        <div class="inicio-bloco-linha">
          <label class="inicio-rotulo">PRODUÇÃO:</label>
          <input id="painelProducao" class="inicio-dado" type="text" value="--" />
          <span class="inicio-unidade">m³/d</span>
        </div>
        <div class="inicio-bloco-linha">
          <label class="inicio-rotulo">TI-69:</label>
          <input id="painelTi69" class="inicio-dado" type="text" value="--" />
          <span class="inicio-unidade">°C</span>
        </div>
        <div class="inicio-bloco-linha">
          <label class="inicio-rotulo">Delta-P:</label>
          <input id="painelDeltaP" class="inicio-dado" type="text" value="--" />
          <span class="inicio-unidade">kgf/cm²</span>
        </div>
      </div>
    </div>
  </div>
  <!-- Painel lateral de pessoal -->
  <div class="inicio-pessoal">
    <div class="inicio-pessoal-grupo" id="grupo-A">
      <div class="coluna-grupo">A</div>
      <div class="coluna-nomes"></div>
    </div>
    <div class="inicio-pessoal-grupo" id="grupo-B">
      <div class="coluna-grupo">B</div>
      <div class="coluna-nomes"></div>
    </div>
    <div class="inicio-pessoal-grupo" id="grupo-C">
      <div class="coluna-grupo">C</div>
      <div class="coluna-nomes"></div>
    </div>
    <div class="inicio-pessoal-grupo" id="grupo-D">
      <div class="coluna-grupo">D</div>
      <div class="coluna-nomes"></div>
    </div>
    <div class="inicio-pessoal-grupo" id="grupo-E">
      <div class="coluna-grupo">E</div>
      <div class="coluna-nomes"></div>
    </div>

    <div class="inicio-pessoal-grupo-duplo" id="grupo-ferias">
      <div class="coluna-grupo-duplo">Férias</div>
      <div class="coluna-nomes"></div>
    </div>
    <div class="inicio-pessoal-grupo-duplo" id="grupo-outros">
      <div class="coluna-grupo-duplo">Outros</div>
      <div class="coluna-nomes"></div>
    </div>

  </div>
</div>

<!-- Modal Resumo Operacional -->
<div class="resumo-modal-cadastro" id="resumoModalCadastro" style="display: none;">
  <div class="resumo-modal-conteudo">
    <input id="resumoCampoId" type="hidden" />
    <div class="resumo-modal-corpo">
      <!-- Coluna U-1620 -->
      <div class="resumo-coluna-form">
        <h4>U-1620</h4>
        <div class="resumo-campo-form">
          <label for="resumoCampoCargaGn">Carga (GN):</label>
          <input id="resumoCampoCargaGn" step="0.01" type="number" />
        </div>
        <div class="resumo-campo-form">
          <label for="resumoCampoProducaoH2">Produção (H2):</label>
          <input id="resumoCampoProducaoH2" step="0.01" type="number" />
        </div>
        <div class="resumo-campo-form">
          <label for="resumoCampoProducaoCo2">Produção de CO₂:</label>
          <input id="resumoCampoProducaoCo2" step="0.01" type="number" />
        </div>
        <div class="resumo-campo-form">
          <label for="resumoCampoBfw">BFW:</label>
          <input id="resumoCampoBfw" step="0.01" type="number" />
        </div>
        <div class="resumo-campo-form">
          <label for="resumoCampoTb">TB:</label>
          <input id="resumoCampoTb" step="1" type="number" />
        </div>
        <div class="resumo-campo-form">
          <label for="resumoCampoMea">MEA:</label>
          <input id="resumoCampoMea" step="1" type="number" />
        </div>
        <div class="resumo-campo-form">
          <label for="resumoCampoU1620para">Campo U-1620:</label>
          <select id="resumoCampoU1620para">
            <option value="U-1540">U-1540</option>
            <option value="U-1740">U-1740</option>
            <option value="U-1540 / U-1740">U-1540 / U-1740</option>
            <option value="Header">Header</option>
            <option value="Flare">Flare</option>
          </select>
        </div>
      </div>
      <!-- Coluna U-1640 -->
      <div class="resumo-coluna-form">
        <h4>U-1640</h4>
        <div class="resumo-campo-form">
          <label for="resumoCampoCarga1640">Carga:</label>
          <select id="resumoCampoCarga1640">
            <option value="SPINDLE">SPINDLE</option>
            <option value="NEUTRO LEVE">NEUTRO LEVE</option>
            <option value="NEUTRO MÉDIO VELA">NEUTRO MÉDIO VELA</option>
            <option value="BRIGHT STOCK">BRIGHT STOCK</option>
          </select>
        </div>
        <!-- TQ de Carga (linha 1) -->
        <div class="resumo-campo-form">
          <label for="resumoCampoTqCarga">TQ de Carga:</label>
          <input id="resumoCampoTqCarga" type="number" min="6601" max="6616" step="1" />
        </div>

        <!-- Data e Hora da Carga (linha 2) -->
        <div class="resumo-subcampos">
          <div>
            <label for="resumoCampoDataCarga">Data:</label>
            <input id="resumoCampoDataCarga" type="date" />
          </div>
          <div>
            <label for="resumoCampoHoraCarga">Hora:</label>
            <input id="resumoCampoHoraCarga" type="time" />
          </div>
        </div>

        <!-- TQ de Produto (linha 1) -->
        <div class="resumo-campo-form">
          <label for="resumoCampoTqProduto">TQ de Produto:</label>
          <input id="resumoCampoTqProduto" type="number" min="6601" max="6616" step="1" />
        </div>

        <!-- Data e Hora do Produto (linha 2) -->
        <div class="resumo-subcampos">
          <div>
            <label for="resumoCampoDataProduto">Data:</label>
            <input id="resumoCampoDataProduto" type="date" />
          </div>
          <div>
            <label for="resumoCampoHoraProduto">Hora:</label>
            <input id="resumoCampoHoraProduto" type="time" />
          </div>
        </div>

        <div class="resumo-campo-form">
          <label for="resumoCampoProducao">Produção:</label>
          <input id="resumoCampoProducao" step="0.01" type="number" />
        </div>
        <div class="resumo-campo-form">
          <label for="resumoCampoTi69">TI-69:</label>
          <input id="resumoCampoTi69" step="0.01" type="number" />
        </div>
        <div class="resumo-campo-form">
          <label for="resumoCampoDeltaP">Delta-P:</label>
          <input id="resumoCampoDeltaP" step="0.1" type="number" />
        </div>
      </div>
    </div>
    <div class="resumo-botoes-modal">
      <button onclick="resumoSalvarAlteracoes()">Salvar</button>
      <button onclick="resumoFecharModal()">Cancelar</button>
    </div>
  </div>
</div>

<!-- ============================== -->
<!--     MODAL HISTÓRICO U-1640     -->
<!-- ============================== -->
<div id="modalHistorico" class="modal-hist">
  <div class="modal-hist-content">

    <!-- Cabeçalho -->
    <div class="modal-hist-header">
      <h2>Histórico de Carga / Produto – U-1640</h2>
      <button class="btn-fechar-hist" onclick="fecharModalHistorico()">✕</button>
    </div>

    <!-- Conteúdo principal -->
    <div class="modal-hist-tabela-container">
      <table class="modal-hist-table">
        <thead>
          <tr>
            <th>Carga</th>
            <th>TQ Carga</th>
            <th>Data</th>
            <th>Hora</th>
            <th>TQ Produto</th>
            <th>Data</th>
            <th>Hora</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody id="tabelaHistorico">
          <!-- linhas virão via JS -->
        </tbody>
      </table>
    </div>

  </div>
</div>

<!-- ========== MODAL EDITAR HISTÓRICO 1640 (PADRÃO INSTITUCIONAL) ========== -->
<div id="historico_editar_modal" class="historico_editar_modal" style="display:none;">
  <div class="historico_editar_content">

    <!-- Cabeçalho -->
    <div class="historico_editar_header">
      <h3>Editar Registro – U-1640</h3>
      <button class="historico_editar_fechar" onclick="u1640_editar_fechar()">✕</button>
    </div>

    <!-- Corpo -->
    <div class="historico_editar_body">

      <!-- LINHA 1 – CARGA -->
      <div class="historico_editar_campo">
        <label for="historico_editar_carga">Carga:</label>
        <select id="historico_editar_carga">
          <option value="SPINDLE">SPINDLE</option>
          <option value="NEUTRO LEVE">NEUTRO LEVE</option>
          <option value="NEUTRO MÉDIO VELA">NEUTRO MÉDIO VELA</option>
          <option value="BRIGHT STOCK">BRIGHT STOCK</option>
        </select>
      </div>

      <!-- LINHA 2 – TQ CARGA / DATA / HORA -->
      <div class="historico_editar_linha3">
        <div class="historico_editar_campo">
          <label for="historico_editar_tq_carga">TQ de Carga:</label>
          <input id="historico_editar_tq_carga" type="number">
        </div>

        <div class="historico_editar_campo">
          <label for="historico_editar_data_carga">Data:</label>
          <input id="historico_editar_data_carga" type="date">
        </div>

        <div class="historico_editar_campo">
          <label for="historico_editar_hora_carga">Hora:</label>
          <input id="historico_editar_hora_carga" type="time">
        </div>
      </div>

      <!-- LINHA 3 – TQ PRODUTO / DATA / HORA -->
      <div class="historico_editar_linha3">
        <div class="historico_editar_campo">
          <label for="historico_editar_tq_produto">TQ de Produto:</label>
          <input id="historico_editar_tq_produto" type="number">
        </div>

        <div class="historico_editar_campo">
          <label for="historico_editar_data_produto">Data:</label>
          <input id="historico_editar_data_produto" type="date">
        </div>

        <div class="historico_editar_campo">
          <label for="historico_editar_hora_produto">Hora:</label>
          <input id="historico_editar_hora_produto" type="time">
        </div>
      </div>

    </div>

    <!-- Rodapé -->
    <div class="historico_editar_footer">
      <button class="historico_editar_btn historico_editar_cancelar" onclick="u1640_editar_fechar()">Cancelar</button>
      <button class="historico_editar_btn historico_editar_salvar" onclick="u1640_editar_salvar()">Salvar</button>
    </div>

  </div>
</div>
<!-- ================================================================ -->



<script>
  (function esperarPainelCarregado() {
    const tentativa = setInterval(() => {
      const el = document.getElementById("painelCargaGn");
      if (typeof resumoAtualizarPainel === 'function' && el) {
        console.log("⏱ Executando resumoAtualizarPainel após view carregada.");
        resumoAtualizarPainel();
        clearInterval(tentativa);
      }
    }, 100);
  })();
</script>