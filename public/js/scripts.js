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
        })
        .catch(err => {
            conteudo.innerHTML = "<p>Erro ao carregar o conteúdo.</p>";
            console.error(err);
        });
}
