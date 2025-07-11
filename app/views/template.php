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
            <button class="botao-menu" onclick="mostrarMenu('administrativo')">Administrativo</button>
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
        function mostrarMenu(menu) {
            const direita = document.querySelector('.menu-direito');
            const conteudoCentral = document.querySelector('.conteudo-central');

            // Mensagem de carregamento para o menu direito
            direita.innerHTML = "<p>Carregando...</p>";

            // Remove destaque de todos os botões
            document.querySelectorAll('.botao-menu').forEach(btn => {
                btn.classList.remove('ativo');
            });

            // Adiciona destaque ao botão clicado
            const botaoClicado = document.querySelector(`.botao-menu[onclick*="${menu}"]`);
            if (botaoClicado) {
                botaoClicado.classList.add('ativo');
            }

            // Carrega o menu direito correspondente
            fetch('<?= BASE_URL ?>/public/includes/menu-loader.php?menu=' + menu)
                .then(res => res.text())
                .then(html => {
                    direita.innerHTML = html;
                })
                .catch(err => {
                    direita.innerHTML = "<p>Erro ao carregar o menu.</p>";
                    console.error(err);
                });

            // Carrega o conteúdo central correspondente
            fetch('<?= BASE_URL ?>/app/views/' + menu + '.php')
                .then(res => res.text())
                .then(html => {
                    conteudoCentral.innerHTML = html;
                })
                .catch(err => {
                    conteudoCentral.innerHTML = "<p>Erro ao carregar o conteúdo central.</p>";
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

    <script>
        // Quando a página carregar, executa automaticamente o menu "inicio"
        document.addEventListener('DOMContentLoaded', function () {
            mostrarMenu('inicio');
        });
    </script>

</body>

</html>