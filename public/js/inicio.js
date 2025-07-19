// === Script para o painel "Resumo Operacional" ===
// === Local: /public/js/inicio.js ===

// Abrir o modal e preencher os campos com dados do banco
function resumoAbrirModal() {
    resumoPreencherCampos();
    document.getElementById("resumoModalCadastro").style.display = "flex";
}

// Fechar o modal
function resumoFecharModal() {
    document.getElementById("resumoModalCadastro").style.display = "none";
}

// Preencher os campos do modal com dados do banco
function resumoPreencherCampos() {
    fetch('index.php?url=InicioController/buscarResumoOperacional')
        .then(response => response.json())
        .then(data => {
            // Preenchendo campos da U-1620
            document.getElementById('resumoCampoCargaGn').value = data.carga_gn;
            document.getElementById('resumoCampoProducaoH2').value = data.producao_h2;
            document.getElementById('resumoCampoProducaoCo2').value = data.producao_co2;
            document.getElementById('resumoCampoBfw').value = data.bfw;
            document.getElementById('resumoCampoTb').value = data.tb;
            document.getElementById('resumoCampoMea').value = data.mea;
            document.getElementById('resumoCampoU1620para').value = data.u1620para;

            // Preenchendo campos da U-1640
            document.getElementById('resumoCampoCarga1640').value = data.carga1640;
            document.getElementById('resumoCampoTqCarga').value = data.tq_carga;
            document.getElementById('resumoCampoTqProduto').value = data.tq_produto;
            document.getElementById('resumoCampoProducao').value = data.producao;
            document.getElementById('resumoCampoTi69').value = data.ti69;
            document.getElementById('resumoCampoDeltaP').value = data.delta_p;
        })
        .catch(error => {
            console.error('Erro ao buscar dados do resumo operacional:', error);
        });
}

// (Preparado para a próxima etapa)
function resumoSalvarRegistro() {
    const dados = {
        id: document.getElementById("resumoCampoId").value,
        carga_gn: document.getElementById("resumoCampoCargaGn").value,
        producao_h2: document.getElementById("resumoCampoProducaoH2").value,
        producao_co2: document.getElementById("resumoCampoProducaoCo2").value,
        bfw: document.getElementById("resumoCampoBfw").value,
        tb: document.getElementById("resumoCampoTb").value,
        mea: document.getElementById("resumoCampoMea").value,
        u1620para: document.getElementById("resumoCampoU1620para").value,
        carga1640: document.getElementById("resumoCampoCarga1640").value,
        tq_carga: document.getElementById("resumoCampoTqCarga").value,
        tq_produto: document.getElementById("resumoCampoTqProduto").value,
        producao: document.getElementById("resumoCampoProducao").value,
        ti69: document.getElementById("resumoCampoTi69").value,
        delta_p: document.getElementById("resumoCampoDeltaP").value
    };

    // Em breve implementaremos a chamada ao backend para salvar isso
}

function resumoSalvarAlteracoes() {
    const dados = {
        carga_gn: document.getElementById("resumoCampoCargaGn").value,
        producao_h2: document.getElementById("resumoCampoProducaoH2").value,
        producao_co2: document.getElementById("resumoCampoProducaoCo2").value,
        bfw: document.getElementById("resumoCampoBfw").value,
        tb: document.getElementById("resumoCampoTb").value,
        mea: document.getElementById("resumoCampoMea").value,
        u1620para: document.getElementById("resumoCampoU1620para").value,
        carga1640: document.getElementById("resumoCampoCarga1640").value,
        tq_carga: document.getElementById("resumoCampoTqCarga").value,
        tq_produto: document.getElementById("resumoCampoTqProduto").value,
        producao: document.getElementById("resumoCampoProducao").value,
        ti69: document.getElementById("resumoCampoTi69").value,
        delta_p: document.getElementById("resumoCampoDeltaP").value
    };

    fetch('index.php?url=InicioController/salvarResumo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    })
    .then(res => res.json())
    .then(res => {
        if (res.sucesso) {
            alert("Dados salvos com sucesso!");
            resumoFecharModal();
        } else {
            alert("Erro ao salvar os dados.");
        }
    })
    .catch(err => {
        console.error("Erro na requisição:", err);
        alert("Erro de comunicação com o servidor.");
    });
}


function resumoAtualizarPainel() {
    fetch('index.php?url=InicioController/buscarResumoOperacional')
        .then(response => response.json())
        .then(data => {
            const atualizar = (id, valor) => {
                const el = document.getElementById(id);
                if (!el) {
                    console.warn("Elemento não encontrado:", id);
                    return;
                }

                // Se for input ou textarea, usa .value
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.value = valor;
                } else {
                    el.innerText = valor;
                }
            };
            const formatarData = (iso) => {
                if (!iso || !iso.includes("-")) return "--";
                const partes = iso.split("-");
                if (partes.length !== 3) return "--";
                const [ano, mes, dia] = partes;
                return `${dia}/${mes}/${ano.slice(2)}`;
            };

            const formatarHora = (hora) => {
                if (!hora || !hora.includes(":")) return "--";
                return hora.slice(0, 5); // HH:MM
            };

            atualizar("painelCargaGn", data.carga_gn);
            atualizar("painelProducaoH2", data.producao_h2);
            atualizar("painelProducaoCo2", data.producao_co2);
            atualizar("painelBfw", data.bfw);
            atualizar("painelTb", data.tb);
            atualizar("painelMea", data.mea);
            atualizar("painelU1620para", data.u1620para);
            atualizar("painelCarga1640", data.carga1640);
            atualizar("painelTqCarga", data.tq_carga);
            atualizar("painelTqProduto", data.tq_produto);
            atualizar("painelProducao", data.producao);
            atualizar("painelTi69", data.ti69);
            atualizar("painelDeltaP", data.delta_p);
            atualizar("painelDataCarga", formatarData(data.datacarga));
            atualizar("painelHoraCarga", formatarHora(data.horacarga));
            atualizar("painelDataProduto", formatarData(data.dataproduto));
            atualizar("painelHoraProduto", formatarHora(data.horaproduto));
        })
        .catch(error => {
            console.error("Erro ao atualizar painel:", error);
        });
}
