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
            <!-- Conteúdo central será carregado dinamicamente -->
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

            // Mostra mensagem de carregamento no menu da direita
            direita.innerHTML = "<p>Carregando menu...</p>";

            // Remove destaques anteriores
            document.querySelectorAll('.botao-menu').forEach(btn => {
                btn.classList.remove('ativo');
                btn.classList.remove('emergencia-ativa');
            });

            // Destaca o botão clicado
            const botaoClicado = document.querySelector(`.botao-menu[onclick*="${menu}"]`);
            if (botaoClicado) {
                botaoClicado.classList.add('ativo');
            }

            // Carrega o menu lateral direito via include
            fetch(BASE_URL + '/public/includes/menu-loader.php?menu=' + menu)
                .then(res => res.text())
                .then(html => {
                    direita.innerHTML = html;
                })
                .catch(err => {
                    direita.innerHTML = "<p>Erro ao carregar o menu.</p>";
                    console.error(err);
                });

            // Carrega o conteúdo central via Controller (MVC)
            fetch('index.php?url=' + menu + 'Controller')
                .then(res => res.text())
                .then(html => {
                    conteudoCentral.innerHTML = html;
                })
                .catch(err => {
                    conteudoCentral.innerHTML = "<p>Erro ao carregar o conteúdo central.</p>";
                    console.error(err);
                });
        }

    </script>

    <script>
        const BASE_URL = '<?= BASE_URL ?>';
    </script>

    <script src="<?= BASE_URL ?>/public/js/modais.js"></script>

    <script src="<?= BASE_URL ?>/public/js/busca.js"></script>

    <script src="<?= BASE_URL ?>/public/js/scripts.js"></script>

    <script>
        // Executa ao carregar a página
        window.addEventListener('DOMContentLoaded', () => {
            mostrarMenu('inicio');
        });
    </script>


</body>

</html>