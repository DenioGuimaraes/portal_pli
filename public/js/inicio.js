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
      document.getElementById('resumoCampoDataCarga').value = data.datacarga;
      document.getElementById('resumoCampoHoraCarga').value = data.horacarga;
      document.getElementById('resumoCampoDataProduto').value = data.dataproduto;
      document.getElementById('resumoCampoHoraProduto').value = data.horaproduto;
    })
    .catch(error => {
      console.error('Erro ao buscar dados do resumo operacional:', error);
    });
}

async function resumoSalvarAlteracoes() {

  // ============================================================
  // 1) CAPTURAR TODOS OS DADOS (já existia)
  // ============================================================
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
    delta_p: document.getElementById("resumoCampoDeltaP").value,
    datacarga: document.getElementById("resumoCampoDataCarga").value,
    horacarga: document.getElementById("resumoCampoHoraCarga").value,
    dataproduto: document.getElementById("resumoCampoDataProduto").value,
    horaproduto: document.getElementById("resumoCampoHoraProduto").value
  };

  // ============================================================
  // 2) BUSCAR O ÚLTIMO REGISTRO DO HISTÓRICO
  // ============================================================
  let ultimoHistorico = null;

  try {
    const resp = await fetch("index.php?url=InicioController/buscarUltimoHistorico");
    ultimoHistorico = await resp.json();  // pode ser null
  } catch (e) {
    console.error("Erro ao buscar histórico:", e);
  }

  // ============================================================
  // 3) MONTAR OS CAMPOS RELEVANTES PARA COMPARAÇÃO
  // ============================================================
  const novoHistorico = {
    carga1640: dados.carga1640,
    tq_carga: dados.tq_carga,
    datacarga: dados.datacarga,
    horacarga: dados.horacarga,
    tq_produto: dados.tq_produto,
    dataproduto: dados.dataproduto,
    horaproduto: dados.horaproduto
  };

  let houveMudanca = false;

  if (!ultimoHistorico) {
    // nenhum histórico → grava automaticamente
    houveMudanca = true;
  } else {
    // compara campo a campo
    for (let campo in novoHistorico) {
      if (novoHistorico[campo] != ultimoHistorico[campo]) {
        houveMudanca = true;
        break;
      }
    }
  }

  // ============================================================
  // 4) SE HOUVE MUDANÇA, SALVAR NO HISTÓRICO
  // ============================================================
  if (houveMudanca) {
    try {
      await fetch('index.php?url=InicioController/inserirHistorico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoHistorico)
      });
    } catch (e) {
      console.error("Erro ao salvar histórico:", e);
    }
  }

  // ============================================================
  // 5) SALVAR O RESUMO OPERACIONAL (parte original)
  // ============================================================
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
        resumoAtualizarPainel();
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

function carregarOperadores() {
  fetch('index.php?url=InicioController/buscarOperadores')
    .then(response => response.json())
    .then(dados => {
      // Limpa os nomes existentes em cada grupo
      ['A', 'B', 'C', 'D', 'E', 'Férias', 'Outros'].forEach(grupo => {
        const container = document.querySelector(`#grupo-${grupo.replace(" ", "-")} .coluna-nomes`);
        if (container) container.innerHTML = '';
      });

      dados.forEach(pessoa => {
        const grupo = (pessoa.grupo || '').toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        let idGrupo;
        if (["A", "B", "C", "D", "E"].includes(grupo)) {
          idGrupo = grupo;
        } else if (grupo === "FERIAS") {
          idGrupo = "ferias";
        } else {
          idGrupo = "outros";
        }

        const container = document.querySelector(`#grupo-${idGrupo} .coluna-nomes`);
        if (container) {
          const nomeDiv = document.createElement('div');
          nomeDiv.classList.add('pessoal-nome');
          nomeDiv.textContent = pessoa.nome;


          container.appendChild(nomeDiv);

        }
      });

    })
    .catch(err => {
      console.error("Erro ao carregar operadores:", err);
    });
}

function salvarAnotacao() {
  const texto = document.getElementById("anotacoesTexto").value;

  fetch('index.php?url=InicioController/salvarAnotacao', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ texto: texto })
  })
    .then(response => response.json())
    .then(res => {
      if (res.sucesso) {
        alert("Anotação salva com sucesso!");
      } else {
        alert("Erro ao salvar anotação: " + (res.erro || ""));
      }
    })
    .catch(error => {
      console.error("Erro ao salvar anotação:", error);
      alert("Erro de comunicação com o servidor.");
    });
}

function carregarAnotacao() {
  fetch('index.php?url=InicioController/buscarAnotacao')
    .then(response => response.json())
    .then(data => {
      document.getElementById("anotacoesTexto").value = data.texto || "";
    })
    .catch(error => {
      console.error("Erro ao carregar anotação:", error);
    });
}

function abrirModalHistorico() {
    document.getElementById("modalHistorico").style.display = "flex";
    carregarHistorico();
}

function fecharModalHistorico() {
    document.getElementById("modalHistorico").style.display = "none";
}

function carregarHistorico() {
    fetch("index.php?url=InicioController/listarHistorico")
        .then(res => res.json())
        .then(lista => {
            window.listaHistorico1640 = lista;
            let tbody = document.getElementById("tabelaHistorico");
            tbody.innerHTML = "";

            lista.forEach(item => {

                let tr = document.createElement("tr");

                tr.innerHTML = `
                    <td>${item.carga1640}</td>
                    <td>${item.tq_carga}</td>
                    <td>${item.datacarga}</td>
                    <td>${item.horacarga}</td>
                    <td>${item.tq_produto}</td>
                    <td>${item.dataproduto}</td>
                    <td>${item.horaproduto}</td>

                    <td>
                        <span class="acao-icone icone-editar" onclick="editarHistorico(${item.id})">✏️</span>
                        <span class="acao-icone icone-excluir" onclick="excluirHistorico(${item.id})">🗑</span>
                    </td>
                `;

                tbody.appendChild(tr);
            });
        })
        .catch(err => {
            console.error("Erro ao carregar histórico:", err);
        });
}

function editarHistorico(id) {

    console.log("Editar ID recebido:", id);

    // 1. Encontrar o registro correspondente
    const registro = window.listaHistorico1640.find(item => Number(item.id) === Number(id));

    console.log("Registro encontrado:", registro);

    if (!registro) {
        alert("Erro: registro não encontrado na lista.");
        return;
    }

    // 2. Guardar para eventual uso posterior
    window.registroEditando = registro;

    // 3. Preencher os campos do modal
    document.getElementById("historico_editar_carga").value = registro.carga1640;

    document.getElementById("historico_editar_tq_carga").value = registro.tq_carga;
    document.getElementById("historico_editar_data_carga").value = registro.datacarga;
    document.getElementById("historico_editar_hora_carga").value = registro.horacarga;

    document.getElementById("historico_editar_tq_produto").value = registro.tq_produto;
    document.getElementById("historico_editar_data_produto").value = registro.dataproduto;
    document.getElementById("historico_editar_hora_produto").value = registro.horaproduto;

    // 4. Abrir o modal novo (ID correto)
    document.getElementById("historico_editar_modal").style.display = "flex";
}

function u1640_editar_fechar() {
    document.getElementById("historico_editar_modal").style.display = "none";
}

function u1640_editar_salvar() {
    if (!window.registroEditando) {
        alert("Erro: nenhum registro selecionado.");
        return;
    }

    const payload = {
        id: window.registroEditando.id,
        carga1640: document.getElementById("historico_editar_carga").value,
        tq_carga: document.getElementById("historico_editar_tq_carga").value,
        datacarga: document.getElementById("historico_editar_data_carga").value,
        horacarga: document.getElementById("historico_editar_hora_carga").value,
        tq_produto: document.getElementById("historico_editar_tq_produto").value,
        dataproduto: document.getElementById("historico_editar_data_produto").value,
        horaproduto: document.getElementById("historico_editar_hora_produto").value
    };

    fetch("index.php?url=InicioController/editarHistorico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(resp => {

        if (resp.sucesso) {
            alert("Registro atualizado com sucesso!");
            u1640_editar_fechar();

            // Recarrega a tabela do modal de histórico
            carregarHistorico();

        } else {
            alert("Erro ao atualizar: " + (resp.erro || "desconhecido"));
        }
    })
    .catch(err => {
        alert("Falha na conexão com o servidor.");
        console.error("ERRO AO SALVAR:", err);
    });
}

function excluirHistorico(id) {
    if (!confirm("Confirma excluir este registro do histórico?")) {
        return;
    }

    fetch("index.php?url=InicioController/excluirHistorico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
    })
    .then(res => res.json())
    .then(resp => {
        if (resp.sucesso) {
            carregarHistorico(); // atualiza tabela
        } else {
            alert("Erro ao excluir: " + (resp.erro || "desconhecido"));
        }
    })
    .catch(err => {
        alert("Falha na conexão com o servidor.");
        console.error("ERRO EXCLUIR:", err);
    });
}


(function esperarNomesCarregados() {
  const tentativa = setInterval(() => {
    const tooltip = document.getElementById("avatar-tooltip");
    const nomes = document.querySelectorAll(".pessoal-nome");

    if (tooltip && nomes.length > 0) {
      clearInterval(tentativa);
      console.log("✅ Avatar hover habilitado");

      document.addEventListener("mouseover", function (e) {
        if (e.target.classList.contains("pessoal-nome") && e.target.dataset.avatar) {
          tooltip.innerHTML = `<img src="images/pessoal/${e.target.dataset.avatar}" alt="Avatar">`;
          tooltip.style.display = "block";
        }
      });

      document.addEventListener("mousemove", (e) => {
        if (tooltip.style.display === "block") {
          tooltip.style.left = e.pageX + 15 + "px"; // 15px à direita do mouse
          tooltip.style.top = e.pageY + "px";
        }
      });

      document.addEventListener("mouseout", function (e) {
        if (e.target.classList.contains("pessoal-nome")) {
          tooltip.style.display = "none";
        }
      });
    }
  }, 200);
})();


