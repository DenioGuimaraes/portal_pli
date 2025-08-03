function telefoneInit() {
  const campo = document.getElementById("telefoneCampoBusca");
  let timeout;

  if (campo) {
    campo.addEventListener("input", () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        telefoneBuscar(campo.value);
      }, 300);
    });
  }

  telefoneBuscar("");
}

function telefoneBuscar(termo) {
  fetch(`index.php?url=ListaTelefonicaController/buscar&termo=${encodeURIComponent(termo)}`)
    .then(response => response.json())
    .then(dados => {
      document.querySelectorAll(".telefone-lista").forEach(div => div.innerHTML = "");
      if (!dados || dados.length === 0) {
        document.querySelectorAll(".telefone-lista").forEach(div => {
          div.innerHTML = `<div style="color:#777;font-style:italic;">Nenhum resultado</div>`;
        });
        return;
      }

      dados.forEach(grupo => {
        if (grupo.grupo && grupo.itens) {
          const destino = document.querySelector(`.telefone-lista[data-grupo="${grupo.grupo}"]`);
          if (destino) {
            grupo.itens.forEach(item => {
              destino.innerHTML += `
                <div class="telefone-item">
                  <span class="descricao">${item.descricao}</span>
                  <span class="ramal">${item.ramal}</span>
                </div>
              `;
            });
          }
        }
      });
    })
    .catch(error => console.error("Erro ao buscar:", error));
}
