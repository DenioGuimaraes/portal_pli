function onibusInit() {
  onibusBuscar("", "turno");
  onibusBuscar("", "administrativo");
}

function onibusBuscar(termo, tipo) {
  fetch(`index.php?url=OnibusController/buscar&termo=${encodeURIComponent(termo)}&tipo=${tipo}`)
    .then(response => response.json())
    .then(dados => {
      const lista = tipo === "turno" ? dados.turno : dados.administrativo;
      const destino = document.querySelector(`.onibus-lista[data-tipo="${tipo}"]`);

      if (!destino) return;
      destino.innerHTML = "";

      if (!lista || lista.length === 0) {
        destino.innerHTML = `<div style="color:#777;font-style:italic;">Nenhum resultado</div>`;
        return;
      }

      lista.forEach(linha => {
        // Filtra localmente caso o Controller não faça
        const matchLinha = linha.linha.toLowerCase().includes(termo.toLowerCase());
        const matchLocal = Object.values(linha.grupos).some(locais =>
          locais.some(local => local.toLowerCase().includes(termo.toLowerCase()))
        );

        if (termo && !matchLinha && !matchLocal) return;

        // Cria acordeão
        const acord = document.createElement("div");
        acord.className = "onibus-acordeao";

        let gruposHtml = "";
        for (const grupo in linha.grupos) {
          gruposHtml += `
            <div class="onibus-grupo">
              <strong>${grupo}:</strong>
              <div class="onibus-locais">
                ${linha.grupos[grupo].join(", ")}
              </div>
            </div>
          `;
        }

        acord.innerHTML = `
          <div class="onibus-titulo">${linha.linha}</div>
          <div class="onibus-conteudo">${gruposHtml}</div>
        `;

        acord.querySelector(".onibus-titulo").addEventListener("click", () => {
          acord.classList.toggle("aberto");
        });

        destino.appendChild(acord);
      });
    })
    .catch(error => console.error("Erro ao buscar ônibus:", error));
}
