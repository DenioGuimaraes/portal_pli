<h2>Dados de Pessoal</h2>

<input type="text" id="campoBusca" class="busca-pessoal" placeholder="Buscar por nome..." onkeyup="buscarNome()" />

<div id="resultadoBusca"></div>

<hr>

<!-- Técnicos -->
<h3>Técnicos de Operação</h3>
<div class="grupo-coluna">
    <?php
    $grupos = ['A', 'B', 'C', 'D', 'E'];
    foreach ($grupos as $grupo) {
        echo "<div><strong>Grupo $grupo</strong><br>";

        foreach ($dados as $pessoa) {
            if ($pessoa['cargo'] === 'Técnico em Operações' && strtoupper($pessoa['grupo']) === $grupo) {
                echo "<div class='nome-clicavel' onclick=\"mostrarModal(" . htmlspecialchars(json_encode($pessoa), ENT_QUOTES) . ")\">" . $pessoa['nome'] . "</div>";
            }
        }

        echo "</div>";
    }
    ?>
</div>

<hr>

<!-- Supervisores -->
<h3>Supervisores</h3>
<?php
foreach ($grupos as $grupo) {
    foreach ($dados as $pessoa) {
        if ($pessoa['cargo'] === 'Supervisor' && strtoupper($pessoa['grupo']) === $grupo) {
            echo "<div class='grupo-linha'><strong>Grupo $grupo:</strong> <span class='nome-clicavel' onclick=\"mostrarModal(" . htmlspecialchars(json_encode($pessoa), ENT_QUOTES) . ")\">" . $pessoa['nome'] . "</span></div>";
        }
    }
}
?>

<!-- Coordenadores -->
<hr>
<h3>Coordenadores de Turno</h3>
<?php
foreach ($grupos as $grupo) {
    foreach ($dados as $pessoa) {
        if ($pessoa['cargo'] === 'Coordenador de Turno' && strtoupper($pessoa['grupo']) === $grupo) {
            echo "<div class='grupo-linha'><strong>Grupo $grupo:</strong> <span class='nome-clicavel' onclick=\"mostrarModal(" . htmlspecialchars(json_encode($pessoa), ENT_QUOTES) . ")\">" . $pessoa['nome'] . "</span></div>";
        }
    }
}
?>

<!-- Gerência/Gestão -->
<hr>
<h3>Gerência / Gestão</h3>
<?php
    $cargosGestao = ['Gerente 1', 'Gerente 2', 'CTO', 'OPMAN'];

    foreach ($cargosGestao as $cargoGestao) {
        foreach ($dados as $pessoa) {
            if ($pessoa['cargo'] === $cargoGestao) {
                echo "<div><strong>{$cargoGestao}:</strong> <span class='nome-clicavel' onclick=\"mostrarModal(" . htmlspecialchars(json_encode($pessoa), ENT_QUOTES) . ")\">{$pessoa['nome']}</span></div>";
            }
        }
    }
?>
<hr>

<!-- Modal -->
<div id="modalDetalhes" class="modal">
    <h3>Dados completos</h3>
    <div id="conteudoModal"></div>
    <button onclick="fecharModal()">Fechar</button>
</div>

<script>
function buscarNome() {
    let termo = document.getElementById('campoBusca').value;

    if (termo.length < 2) {
        document.getElementById('resultadoBusca').innerHTML = '';
        return;
    }

    fetch('<?= BASE_URL ?>/public/index.php?url=DadosPessoalController/buscar&termo=' + encodeURIComponent(termo))
        .then(res => res.json())
        .then(res => {
            let html = '<h3>Resultados da Busca</h3>';
            res.forEach(pessoa => {
                html += `<div class='nome-clicavel' onclick='mostrarModal(${JSON.stringify(pessoa)})'>${pessoa.nome}</div>`;
            });
            document.getElementById('resultadoBusca').innerHTML = html;
        });
}

function mostrarModal(pessoa) {
    let conteudo = `
        <p><strong>Nome:</strong> ${pessoa.nome}</p>
        <p><strong>Chave:</strong> ${pessoa.chave}</p>
        <p><strong>Matrícula:</strong> ${pessoa.matricula}</p>
        <p><strong>Telefone:</strong> ${pessoa.telefone}</p>
        <p><strong>Email:</strong> ${pessoa.email}</p>
        <p><strong>Ramal:</strong> ${pessoa.ramal}</p>
        <p><strong>Sangue:</strong> ${pessoa.sangue}</p>
        <p><strong>Transporte:</strong> ${pessoa.transporte}</p>
        <p><strong>Grupo:</strong> ${pessoa.grupo}</p>
        <p><strong>Cargo:</strong> ${pessoa.cargo}</p>
        <p><strong>Lotação:</strong> ${pessoa.lotacao}</p>
    `;
    document.getElementById('conteudoModal').innerHTML = conteudo;
    document.getElementById('modalDetalhes').style.display = 'block';
}

function fecharModal() {
    document.getElementById('modalDetalhes').style.display = 'none';
}
</script>
