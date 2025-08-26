function carregarConteudo(painel) {
    const conteudo = document.querySelector('.conteudo-central');
    conteudo.innerHTML = "<p>Carregando...</p>";

    fetch('index.php?url=' + painel + 'Controller')
        .then(res => res.text())
        .then(html => {
            conteudo.innerHTML = html;

            // 👇 Detecta se carregou a view da Lista Telefônica
            if (painel.toLowerCase() === 'listatelefonica') {
                if (typeof telefoneInit === 'function') {
                    telefoneInit();
                }
            }

            // 👇 Detecta se carregou a view de Radios
            if (painel.toLowerCase() === 'radio') {
                if (typeof onibusInit === 'function') {
                    radioInit();
                }
            }

            // 👇 Detecta se carregou a view de Onibus
            if (painel.toLowerCase() === 'onibus') {
                if (typeof radioInit === 'function') {
                    onibusInit();
                }
            }

            // 👇 Detecta se carregou a view de U1620Instrumentos
            if (painel.toLowerCase() === 'u1620instr') {
                if (typeof u1620InstrInit === 'function') {
                    u1620InstrInit();
                }
            }

            // 👇 Detecta se carregou a view de U1620Válvulas
            if (painel.toLowerCase() === 'u1620valv') {
                if (typeof u1620ValvInit === 'function') {
                    u1620ValvInit();
                }
            }

            // 👇 Detecta se carregou a view de H6201
            if (painel.toLowerCase() === 'h6201') {
                if (typeof h6201Init === 'function') {
                    h6201Init();
                }
                else {
                    const s = document.createElement('script');
                    s.src = BASE_URL + '/public/js/h6201.js?v=10'; // quebra cache
                    s.onload = () => h6201Init();
                    document.body.appendChild(s);
                }
            }
        })
        .catch(err => {
            conteudo.innerHTML = "<p>Erro ao carregar o conteúdo.</p>";
            console.error(err);
        });
}
