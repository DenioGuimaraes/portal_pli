// ----------------- Função de busca -----------------
function u1640steamFiltrarBusca() {
    const input = document.getElementById("u1640steamCampoBusca");
    const termo = input.value.toLowerCase();

    const cards = document.querySelectorAll(".u1640steam-card");

    cards.forEach(card => {
        const linhas = card.querySelectorAll("table tr");
        let algumMatch = false;

        linhas.forEach((linha, idx) => {
            // mantém cabeçalho sempre visível
            if (idx === 0) {
                linha.style.display = "";
                return;
            }

            const textoLinha = linha.innerText.toLowerCase();

            if (termo === "" || textoLinha.includes(termo)) {
                linha.style.display = "";
                algumMatch = true;
            } else {
                linha.style.display = "none";
            }
        });

        // se não houver nenhuma linha visível (só cabeçalho), some com o card
        if (algumMatch) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
}


