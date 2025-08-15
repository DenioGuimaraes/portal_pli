function u1620ValvInit() {
  const campo = document.getElementById("u1620ValvCampoBusca");
  let timeout;

  if (campo) {
    campo.addEventListener("input", () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        u1620ValvBuscar(campo.value);
      }, 300);
    });
  }

  u1620ValvBuscar("");
}

function u1620ValvBuscar(termo) {
  fetch(`index.php?url=U1620ValvController/buscar&termo=${encodeURIComponent(termo)}`)
    .then(response => response.json())
    .then(dados => {
      document.querySelectorAll(".u1620valv-lista").forEach(div => div.innerHTML = "");
      if (!dados || dados.length === 0) {
        document.querySelectorAll(".u1620valv-lista").forEach(div => {
          div.innerHTML = `<div style="color:#777;font-style:italic;">Nenhum resultado</div>`;
        });
        return;
      }

      dados.forEach(grupo => {
        if (grupo.grupo && grupo.itens) {
          const destino = document.querySelector(`.u1620valv-lista[data-grupo="${grupo.grupo}"]`);
          if (destino) {
            grupo.itens.forEach(item => {
              destino.innerHTML += `
                <div class="u1620valv-item">
                  <span class="tag">${item.tag}</span>
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

