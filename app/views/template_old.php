<?php require_once __DIR__ . '/../config/config.php'; ?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <title>Portal PL-I</title>
    <link rel="stylesheet" href="<?= BASE_URL ?>/public/css/style.css">
</head>

<body>

    <header class="top-bar">
        <h2 class="header-titles">Portal de Informações U-1620 / U-1640</h2>
    </header>

    <div class="main-layout">
        <aside class="menu-esquerdo">
            <button class="botao-menu" onclick="mostrarMenu('inicio')">Início</button>
            <button class="botao-menu" onclick="mostrarMenu('admin')">Administrativo</button>
            <button class="botao-menu" onclick="mostrarMenu('u1620')">U-1620</button>
            <button class="botao-menu" onclick="mostrarMenu('u1640')">U-1640</button>
            <button class="botao-menu emergencia" onclick="mostrarMenu('emergencia')">Emergência</button>
        </aside>

        <main class="conteudo-central">
            <?php require_once __DIR__ . '/' . $conteudo; ?>
        </main>

        <aside class="menu-direito">
            <!-- Submenu correspondente -->
        </aside>
    </div>

    <footer class="rodape">
        Direitos reservados Patrobras S.A.
    </footer>

    <script>
        function mostrarMenu(secao) {
            // Esconder todos os menus direitos
            const menus = document.querySelectorAll('.menu-direito');
            menus.forEach(menu => menu.style.display = 'none');

            // Mostrar o menu correspondente
            const menuSelecionado = document.getElementById('menu-' + secao);
            if (menuSelecionado) {
                menuSelecionado.style.display = 'block';
            }

            // Definir o caminho da view
            let caminho;
            if (secao === 'inicio') {
                caminho = '<?= BASE_URL ?>/public/includes/inicio.php';
            } else {
                caminho = '<?= BASE_URL ?>/public/views/' + secao + '.php';
            }

            // Carregar o conteúdo na área central
            fetch(caminho)
                .then(res => res.text())
                .then(html => {
                document.querySelector('.conteudo-central').innerHTML = html;
                })
                .catch(err => {
                document.querySelector('.conteudo-central').innerHTML = "<p>Erro ao carregar a seção.</p>";
                console.error(err);
                });
            }



        function carregarConteudo(pagina) {
            const conteudo = document.querySelector('.conteudo-central');
            conteudo.innerHTML = "<p>Carregando...</p>";

            fetch('<?= BASE_URL ?>/public/includes/conteudo-loader.php?pagina=' + pagina)
                .then(res => res.text())
                .then(html => {
                    conteudo.innerHTML = html;
                })
                .catch(err => {
                    conteudo.innerHTML = "<p>Erro ao carregar conteúdo.</p>";
                    console.error(err);
                });
        }

        window.addEventListener('load', () => {
            mostrarMenu('inicio');
        });
    </script>

    <script>
        // Executa ao carregar a página
        window.addEventListener('DOMContentLoaded', () => {
            mostrarMenu('inicio');
        });
    </script>

    <script>
        const BASE_URL = '<?= BASE_URL ?>';
    </script>
    <script src="<?= BASE_URL ?>/public/js/modais.js"></script>
    <script src="js/busca.js"></script>


</body>

</html>