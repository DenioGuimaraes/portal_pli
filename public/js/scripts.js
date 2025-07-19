function carregarConteudo(painel) {
    const conteudo = document.querySelector('.conteudo-central');
    conteudo.innerHTML = "<p>Carregando...</p>";

    // Carrega o conteúdo HTML do painel
    fetch('index.php?url=' + painel + 'Controller')
        .then(res => res.text())
        .then(html => {
            conteudo.innerHTML = html;
        })
        .catch(err => {
            conteudo.innerHTML = "<p>Erro ao carregar o conteúdo.</p>";
            console.error(err);
        });
}
