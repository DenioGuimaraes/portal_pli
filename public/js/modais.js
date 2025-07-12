function buscarNome() {
    let termo = document.getElementById('campoBusca').value;

    if (termo.length < 2) {
        document.getElementById('resultadoBusca').innerHTML = '';
        return;
    }

    fetch(BASE_URL + '/public/index.php?url=DadosPessoalController/buscar&termo=' + encodeURIComponent(termo))
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
    const conteudo = `
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
    `;
    document.getElementById('conteudoModal').innerHTML = conteudo;
    document.getElementById('modalDetalhes').style.display = 'block';
}

function fecharModal() {
    document.getElementById('modalDetalhes').style.display = 'none';
}

function carregarConteudoMenuDireito(pagina, botao) {
  fetch('app/views/' + pagina + '.php')
    .then(res => res.text())
    .then(html => {
      document.getElementById('conteudo-central').innerHTML = html;
    });

  // Agora limpa apenas os botões do menu direito
  const botoes = document.querySelectorAll('.botao-direito');
  botoes.forEach(btn => btn.classList.remove('ativo'));

  // Marca o botão clicado
  botao.classList.add('ativo');
}

document.addEventListener("DOMContentLoaded", function () {
  const campoBusca = document.getElementById("buscaNome");
  const grupos = document.querySelectorAll(".grupo");

  if (campoBusca) {
    campoBusca.addEventListener("input", function () {
      const termo = campoBusca.value.toLowerCase();

      grupos.forEach(grupo => {
        const nomes = grupo.querySelectorAll(".nome");
        let grupoVisivel = false;

        nomes.forEach(nome => {
          if (nome.textContent.toLowerCase().includes(termo)) {
            nome.style.display = "block";
            grupoVisivel = true;
          } else {
            nome.style.display = "none";
          }
        });

        grupo.style.display = grupoVisivel ? "block" : "none";
      });
    });
  }
});
