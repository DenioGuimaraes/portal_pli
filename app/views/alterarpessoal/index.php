<div id="conteudo-central" data-secao="dadospessoal">

    <!-- Cabeçalho fixo do painel -->
    <div class="painel-cabecalho">
        <div class="cabecalho-esquerda">
            <h2>Alterar Dados</h2>
        </div>
        <div class="cabecalho-direita">
            <button class="botao-cabecalho" onclick="abrirModalInserir()">Inserir</button>
            <button class="botao-cabecalho" onclick="carregarConteudo('dadospessoal')">Dados de Pessoal</button>
        </div>
    </div>

    <!-- Área de conteúdo rolável -->
    <div class="painel-conteudo">
        <table class="tabela-pessoal">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Chave</th>
                    <th>Matrícula</th>
                    <th>Telefone</th>
                    <th>Transporte</th>
                    <th>Sangue</th>
                    <th>Grupo</th>
                    <th>Cargo</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($dados as $pessoa): ?>
                    <tr>
                        <td><?= htmlspecialchars($pessoa['nome']) ?></td>
                        <td><?= htmlspecialchars($pessoa['chave']) ?></td>
                        <td><?= htmlspecialchars($pessoa['matricula']) ?></td>
                        <td><?= htmlspecialchars($pessoa['telefone']) ?></td>
                        <td><?= htmlspecialchars($pessoa['transporte']) ?></td>
                        <td><?= htmlspecialchars($pessoa['sangue']) ?></td>
                        <td><?= htmlspecialchars($pessoa['grupo']) ?></td>
                        <td><?= htmlspecialchars($pessoa['cargo']) ?></td>
                        <td>
                            <button class="botao-acao" onclick='abrirModalCadastro(<?= htmlspecialchars(json_encode($pessoa), ENT_QUOTES, 'UTF-8') ?>)'>✏️</button>
                            <button class="botao-acao" onclick='excluirRegistro(<?= $pessoa["id"] ?>)'>❌</button>
                        </td>

                    </tr>
                <?php endforeach; ?>

            </tbody>
        </table>


    </div>

</div> <!-- Fim de #conteudo-central -->

<button onclick="abrirModalCadastro()">Abrir Modal</button>

<div id="modalCadastro" class="modal" style="display:none;">
    <div class="modal-conteudo">
        <h3 id="modalTitulo">Novo Registro</h3>

        <input type="hidden" id="campo-id">

        <div class="modal-corpo">
            <div class="coluna-form">
                <div class="campo-form">
                    <label for="campo-nome">Nome:</label>
                    <input type="text" id="campo-nome">
                </div>

                <div class="campo-form">
                    <label for="campo-chave">Chave:</label>
                    <input type="text" id="campo-chave">
                </div>

                <div class="campo-form">
                    <label for="campo-matricula">Matrícula:</label>
                    <input type="text" id="campo-matricula">
                </div>

                <div class="campo-form">
                    <label for="campo-telefone">Telefone:</label>
                    <input type="text" id="campo-telefone">
                </div>
            </div>

            <div class="coluna-form">
                <div class="campo-form">
                    <label for="campo-transporte">Transporte:</label>
                    <input type="text" id="campo-transporte">
                </div>

                <div class="campo-form">
                    <label for="campo-sangue">Sangue:</label>
                    <input type="text" id="campo-sangue">
                </div>

                <div class="campo-form">
                    <label for="campo-grupo">Grupo:</label>
                    <select id="campo-grupo">
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                        <option value="HA">HA</option>
                        <option value="OUTROS">OUTROS</option>
                    </select>
                </div>


                <div class="campo-form">
                    <label for="campo-cargo">Cargo:</label>
                    <select id="campo-cargo">
                        <option value="Operador">Operador</option>
                        <option value="Supervisor">Supervisor</option>
                        <option value="Coordenador">Coordenador</option>
                        <option value="Gerente2">Gerente2</option>
                        <option value="Gerente1">Gerente1</option>
                        <option value="Opman">Opman</option>
                        <option value="CTO">CTO</option>
                        <option value="Administração">Administração</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="botoes-modal">
            <button onclick="salvarRegistro()">Salvar</button>
            <button onclick="fecharModalCadastro()">Cancelar</button>
        </div>


    </div>
</div>




<button onclick="abrirModalCadastro()">Abrir Modal</button>

<div id="modalCadastro" class="modal" style="display:none;">
    <div class="modal-conteudo">
        <h3 id="modalTitulo">Novo Registro</h3>

        <!-- Conteúdo vazio por enquanto -->
        <br><br>

        <button onclick="salvarRegistro()">Salvar</button>
        <button onclick="fecharModalCadastro()">Cancelar</button>
    </div>
</div>