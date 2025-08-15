function u1620InstrInit() {
  const campo = document.getElementById("u1620InstrCampoBusca");
  let timeout;

  if (campo) {
    campo.addEventListener("input", () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        u1620InstrBuscar(campo.value);
      }, 300);
    });
  }

  u1620InstrBuscar("");
}

function u1620InstrBuscar(termo) {
  fetch(`index.php?url=U1620InstrController/buscar&termo=${encodeURIComponent(termo)}`)
    .then(response => response.json())
    .then(dados => {
      document.querySelectorAll(".u1620instr-lista").forEach(div => div.innerHTML = "");
      if (!dados || dados.length === 0) {
        document.querySelectorAll(".u1620instr-lista").forEach(div => {
          div.innerHTML = `<div style="color:#777;font-style:italic;">Nenhum resultado</div>`;
        });
        return;
      }

      dados.forEach(grupo => {
        if (grupo.grupo && grupo.itens) {
          const destino = document.querySelector(`.u1620instr-lista[data-grupo="${grupo.grupo}"]`);
          if (destino) {
            grupo.itens.forEach(item => {
              destino.innerHTML += `
                <div class="u1620instr-item">
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

