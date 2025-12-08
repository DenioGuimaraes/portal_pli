<?php require_once __DIR__ . '/../config/config.php'; ?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <title>Portal PL-I</title>
    <link rel="stylesheet" href="<?= BASE_URL ?>/public/css/style.css">
    <link rel="stylesheet" href="<?= BASE_URL ?>/public/css/inicio.css?v=2">
    <link rel="stylesheet" href="<?= BASE_URL ?>/public/css/viewer.css">
</head>

<body>

    <header class="top-bar">
        <h2 class="header-titles">Portal de Informações U-1620 / U-1640</h2>
    </header>

    <div class="main-layout">
        <aside class="menu-esquerdo">
            <button class="botao-menu" type="button" onclick="location.href='<?= BASE_URL ?>/public/'">Início</button>
            <button class="botao-menu" onclick="mostrarMenu('administrativo')">Geral / Admin</button>
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

                    // helper global para carregar (ou recarregar) scripts de painel
                    function loadPanelScript(key, srcAbs, onload) {
                        // remove <script> anterior desse painel (se existir)
                        document.querySelectorAll(`script[data-panel="${key}"]`).forEach(s => s.remove());

                        // (opcional) limpa o namespace global do painel
                        if (key.toUpperCase() === 'U1620') delete window.U1620;

                        const s = document.createElement('script');
                        // cache-buster: força buscar a versão nova em cada clique (no dev)
                        s.src = srcAbs + (srcAbs.includes('?') ? '&' : '?') + 'v=' + Date.now();
                        s.dataset.panel = key; // marca esse script pra remoção futura
                        s.async = false; // preserva ordem caso encadeie mais de um
                        s.onload = onload || null;
                        s.onerror = e => console.error('Falha ao carregar', srcAbs, e);
                        document.body.appendChild(s);
                        return s;
                    }
                    // Caminho com BASE_URL
                    const base = "<?= BASE_URL ?>";
                    switch (menu) {
                        case 'inicio':
                            script.src = base + '/public/js/inicio.js';
                            break;

                        case 'administrativo':                            
                            var s1 = document.createElement('script');
                            s1.src = base + '/public/js/telefones.js';
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
                            s4.src = base + '/public/js/u1620instr.js?v=2';
                            document.body.appendChild(s4);

                            var s5 = document.createElement('script');
                            s5.src = base + '/public/js/u1620valv.js';
                            document.body.appendChild(s5);

                            var s6 = document.createElement('script');
                            s6.src = base + '/public/js/h6201.js';
                            document.body.appendChild(s6);

                            var s7 = document.createElement('script');
                            s7.src = base + '/public/js/u1620.js?v=5'; // ?v=1 evita cache
                            document.body.appendChild(s7);
                            if (menu === 'u1620') {
                                setTimeout(() => {
                                    if (window.U1620 && typeof window.U1620.init === 'function') {
                                        window.U1620.init();
                                    }
                                }, 50);
                            }

                            var s13 = document.createElement('script');
                            s13.src = base + '/public/js/u1620psv.js';
                            document.body.appendChild(s13);
                            break;

                        case 'u1640':
                            var s11 = document.createElement('script');
                            s11.src = base + '/public/js/u1640valv.js?v=2'; // ?v=1 evita cache
                            document.body.appendChild(s11);

                            var s12 = document.createElement('script');
                            s12.src = base + '/public/js/u1640instr.js?v=2'; // ?v=1 evita cache
                            document.body.appendChild(s12);

                            var s14 = document.createElement('script');
                            s14.src = base + '/public/js/u1640psv.js?v=2'; // ?v=1 evita cache
                            document.body.appendChild(s14);

                            var s15 = document.createElement('script');
                            s15.src = base + '/public/js/u1640steam.js?v=2'; // ?v=1 evita cache
                            document.body.appendChild(s15);
                            
                            break;
                        case 'emergencia':
                            document.querySelectorAll('script[src*="/public/js/emergencia.js"]').forEach(s => s.remove());
                            var s8 = document.createElement('script');
                            s8.src = base + '/public/js/emergencia.js?v=' + Date.now(); // cache-buster real
                            document.body.appendChild(s8);
                            break;
                        case 'emeracessar':
                            document.querySelectorAll('script[src*="/public/js/emeracessar.js"]').forEach(s => s.remove());
                            var s9 = document.createElement('script');
                            s9.src = base + '/public/js/emeracessar.js?v=' + Date.now();
                            document.body.appendChild(s9);
                            break;
                        case 'emergerenc':
                            document.querySelectorAll('script[src*="/public/js/emergerenc.js"]').forEach(s => s.remove());
                            var s10 = document.createElement('script');
                            s10.src = base + '/public/js/emergerenc.js?v=' + Date.now();
                            document.body.appendChild(s10);
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

    <!-- Overlay cobre a tela toda, transparente -->
    <div id="pli-overlay" hidden aria-hidden="true">

        <!-- Viewer (mesmo código de antes, preservado) -->
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

    </div>


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