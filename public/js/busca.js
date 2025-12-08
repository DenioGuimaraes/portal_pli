document.addEventListener("DOMContentLoaded", function () {
  const campoBusca = document.getElementById("campoBusca");

  if (campoBusca) {
    campoBusca.addEventListener("input", function () {
      const termo = campoBusca.value.trim();
      const secao = document.body.dataset.secao; // precisa estar definido na view

      fetch(`index.php?url=${secao}/buscar&termo=${encodeURIComponent(termo)}`)
        .then((res) => res.json())
        .then((dados) => {
          const container = document.getElementById("resultadoBusca");
          container.innerHTML = ""; // limpa resultado anterior

          dados.forEach((item) => {
            const div = document.createElement("div");
            div.className = "item-busca";
            div.textContent = item.nome || item.descricao || "Sem nome";
            container.appendChild(div);
          });
        });
    });
  }
});

// Tabela genérica baseada no controller
function gerarTabela(controller, dados) {
  switch (controller) {
    case "dadospessoal":
      return gerarTabelaDadosPessoal(dados);
    case "listatelefonica":
      return gerarTabelaListaTelefonica(dados);
    default:
      return "<p>Nenhum formato de exibição definido para este módulo.</p>";
  }
}

function gerarTabelaDadosPessoal(dados) {
  let html = "<table><tr><th>Nome</th><th>Cargo</th><th>Grupo</th></tr>";
  dados.forEach(pessoa => {
    html += `<tr><td>${pessoa.nome}</td><td>${pessoa.cargo}</td><td>${pessoa.grupo}</td></tr>`;
  });
  html += "</table>";
  return html;
}

function gerarTabelaListaTelefonica(dados) {
  let html = "<table><tr><th>Grupo</th><th>Descrição</th><th>Ramal</th></tr>";
  dados.forEach(item => {
    html += `<tr><td>${item.grupo}</td><td>${item.descricao}</td><td>${item.ramal}</td></tr>`;
  });
  html += "</table>";
  return html;
}
