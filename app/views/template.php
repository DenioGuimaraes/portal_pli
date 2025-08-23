<?php require_once __DIR__ . '/../config/config.php'; ?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <title>Portal PL-I</title>
    <link rel="stylesheet" href="<?= BASE_URL ?>/public/css/style.css">
    <link rel="stylesheet" href="<?= BASE_URL ?>/public/css/inicio.css">
    <link rel="stylesheet" href="<?= BASE_URL ?>/public/css/viewer.css">
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
        Direitos reservados Petrobras S.A.
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

            // 1. Carrega o conteúdo central (painel)
            fetch('index.php?url=' + menu + 'Controller')
                .then(res => res.text())
                .then(html => {
                    conteudoCentral.innerHTML = html;

                    // Executa ação específica para a tela de Início
                    if (menu === 'inicio') {
                        setTimeout(() => {
                            if (typeof resumoAtualizarPainel === 'function') {
                                resumoAtualizarPainel();
                            } else {
                                console.warn("⚠️ resumoAtualizarPainel() ainda não disponível.");
                            }

                            if (typeof carregarOperadores === 'function') {
                                carregarOperadores();
                            } else {
                                console.warn("⚠️ carregarOperadores() ainda não disponível.");
                            }
                        }, 100);
                    }

                    // === Novo trecho: carregamento do JS correspondente ===
                    const script = document.createElement('script');

                    // Caminho com BASE_URL
                    const base = "<?= BASE_URL ?>";
                    switch (menu) {
                        case 'inicio':
                            script.src = base + '/public/js/inicio.js';
                            break;
                        case 'administrativo':
                            var s1 = document.createElement('script');
                            s1.src = base + '/public/js/listatelefonica.js';
                            document.body.appendChild(s1);

                            var s2 = document.createElement('script');
                            s2.src = base + '/public/js/radio.js';
                            document.body.appendChild(s2);

                            var s3 = document.createElement('script');
                            s3.src = base + '/public/js/onibus.js';
                            document.body.appendChild(s3);
                            break;
                        case 'u1620':
                            var s4 = document.createElement('script');
                            s4.src = base + '/public/js/u1620instr.js';
                            document.body.appendChild(s4);

                            var s5 = document.createElement('script');
                            s5.src = base + '/public/js/u1620valv.js';
                            document.body.appendChild(s5);

                            var s6 = document.createElement('script');
                            s6.src = base + '/public/js/h6201.js';
                            document.body.appendChild(s6);
                            break;
                        default:
                            script.src = '';
                    }


                    if (script.src !== '') {
                        document.body.appendChild(script);
                    }

                    // 2. Carrega imediatamente o menu lateral
                    fetch(base + '/public/includes/menu-loader.php?menu=' + menu)
                        .then(res => res.text())
                        .then(html => {
                            direita.innerHTML = html;
                        })
                        .catch(err => {
                            direita.innerHTML = "<p>Erro ao carregar o menu.</p>";
                            console.error(err);
                        });
                })
                .catch(err => {
                    conteudoCentral.innerHTML = "<p>Erro ao carregar o conteúdo central.</p>";
                    console.error(err);
                });
        }
    </script>

    <!-- Viewer fora do main, para não ser apagado -->
    <section id="pli-viewer" class="pli-viewer" hidden aria-hidden="true" role="dialog" aria-modal="true">
        <header class="pli-viewer-toolbar">
        <button type="button" data-pli-action="fit">Fit</button>
        <button type="button" data-pli-action="close">Fechar</button>
        </header>
        <div class="pli-viewer-stage">
        <img id="pliViewerImg" alt="" draggable="false" />
        </div>
        <div class="pli-viewer-zoom" aria-live="polite"></div>
    </section>

    <script>
        const BASE_URL = '<?= BASE_URL ?>';
    </script>

    <script src="<?= BASE_URL ?>/public/js/modais.js"></script>
    <script src="<?= BASE_URL ?>/public/js/busca.js"></script>
    <script src="<?= BASE_URL ?>/public/js/scripts.js"></script>
    <script src="<?= BASE_URL ?>/public/js/inicio.js"></script>
    <script src="<?= BASE_URL ?>/public/js/viewer.js"></script>

    <script>
        window.addEventListener('DOMContentLoaded', () => {
            mostrarMenu('inicio');

            // Aguarda DOM da view estar presente antes de chamar a função
            const tentativa = setInterval(() => {
                const el = document.getElementById("painelCargaGn");
                if (typeof resumoAtualizarPainel === 'function' && el && document.getElementById("anotacoesTexto")) {
                    resumoAtualizarPainel();
                    carregarAnotacao();
                    clearInterval(tentativa);
                }
            }, 200); // tenta a cada 200ms
        });
    </script>
</body>

</html>