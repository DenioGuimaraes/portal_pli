<div id="conteudo-central" data-secao="dadospessoal">

    <!-- Cabeçalho fixo do painel -->
    <div class="painel-cabecalho">
    <div class="cabecalho-esquerda">
        <h2>Alterar Dados</h2>
    </div>
    <div class="cabecalho-direita">
        <button class="botao-cabecalho" onclick="abrirModalInserir()">Inserir</button>
        <button class="botao-cabecalho" onclick="carregarConteudo('dadospessoal')">Voltar</button>
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
                    <td><?= htmlspecialchars($pessoa['nome'] ?? '') ?></td>
                    <td><?= htmlspecialchars($pessoa['chave'] ?? '') ?></td>
                    <td><?= htmlspecialchars($pessoa['matricula'] ?? '') ?></td>
                    <td><?= htmlspecialchars($pessoa['telefone'] ?? '') ?></td>
                    <td><?= htmlspecialchars($pessoa['transporte'] ?? '') ?></td>
                    <td><?= htmlspecialchars($pessoa['sangue'] ?? '') ?></td>
                    <td><?= htmlspecialchars($pessoa['grupo'] ?? '') ?></td>
                    <td><?= htmlspecialchars($pessoa['cargo'] ?? '') ?></td>
                    <td>
                    <button class="botao-acao" onclick="editarPessoa(<?= $pessoa['id'] ?>)">✏️</button>
                    <button class="botao-acao" onclick="excluirPessoa(<?= $pessoa['id'] ?>)">❌</button>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
  </div>

</div> <!-- Fim de #conteudo-central -->
