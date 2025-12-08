function radioInit() {
  const campo = document.getElementById("radioCampoBusca");
  let timeout;

  if (campo) {
    campo.addEventListener("input", () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        radioBuscar(campo.value);
      }, 300);
    });
  }

  radioBuscar("");
}

function radioBuscar(termo) {
  fetch(`index.php?url=RadioController/buscar&termo=${encodeURIComponent(termo)}`)
    .then(response => response.json())
    .then(dados => {
      document.querySelectorAll(".radio-lista").forEach(div => div.innerHTML = "");
      if (!dados || dados.length === 0) {
        document.querySelectorAll(".radio-lista").forEach(div => {
          div.innerHTML = `<div style="color:#777;font-style:italic;">Nenhum resultado</div>`;
        });
        return;
      }

      dados.forEach(grupo => {
        if (grupo.grupo && grupo.itens) {
          const destino = document.querySelector(`.radio-lista[data-grupo="${grupo.grupo}"]`);
          if (destino) {
            grupo.itens.forEach(item => {
              destino.innerHTML += `
                <div class="radio-item">
                  <span class="faixa">${item.faixa}</span>
                  <span class="descricao">${item.descricao}</span>
                </div>
              `;
            });
          }
        }
      });
    })
    .catch(error => console.error("Erro ao buscar:", error));
}

