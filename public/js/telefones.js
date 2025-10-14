// === Script do painel "Telefones" ===
// === Padrão: prefixo tel ===

let telDados = [];
let telSelecionadoId = null;
let telGrupoAtual = "Agenda";
let telModo = "novo"; // ou "editar"

// ----------------- Modal -----------------
function telAbrirModalNovo() {
  const m = document.getElementById("modalTelefone");
  if (m) {
    // limpa campos
    document.getElementById("telefoneSelectGrupo").value = "Agenda";
    document.getElementById("modalDescricao").value = "";
    document.getElementById("modalRamal").value = "";
    document.getElementById("modalTituloTelefone").innerText = "Novo Telefone"; // título claro
    m.style.display = "flex";
  }
}


function telFecharModal() {
  const m = document.getElementById("modalTelefone");
  if (m) m.style.display = "none";
}

function telSalvar() {
  const grupo = document.getElementById("telefoneSelectGrupo").value;
  const descricao = document.getElementById("modalDescricao").value.trim();
  const ramal = document.getElementById("modalRamal").value.trim();

  if (!descricao || !ramal) {
    alert("Por favor, preencha Descrição e Ramal.");
    return;
  }

  if (telModo === "novo") {
    // mesma lógica do telSalvarNovo()
    fetch("index.php?url=TelefonesController/telCreate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grupo, descricao, ramal }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Telefone salvo com sucesso!");
          telFecharModal();
          telCarregarDoServidor().then(() => telRenderTabela(telGrupoAtual));
        } else {
          alert("Erro ao salvar: " + (data.message || "Tente novamente."));
        }
      })
      .catch(err => {
        console.error("Erro no fetch:", err);
        alert("Erro de comunicação com o servidor.");
      });
  } else if (telModo === "editar") {
    // lógica UPDATE
    fetch("index.php?url=TelefonesController/telUpdate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: telSelecionadoId, grupo, descricao, ramal }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Telefone atualizado com sucesso!");
          telFecharModal();
          telCarregarDoServidor().then(() => telRenderTabela(telGrupoAtual));
        } else {
          alert("Erro ao atualizar: " + (data.message || "Tente novamente."));
        }
      })
      .catch(err => {
        console.error("Erro no fetch:", err);
        alert("Erro de comunicação com o servidor.");
      });
  }
}


// ----------------- CRUD extra -----------------
function telEditar() {
  if (!telSelecionadoId) {
    alert("Selecione um registro primeiro.");
    return;
  }

  // pega os dados do item selecionado (do array em memória ou da tabela)
  const registro = telDados.find(r => r.id == telSelecionadoId);
  if (!registro) {
    alert("Registro não encontrado!");
    return;
  }

  const m = document.getElementById("modalTelefone");
  if (m) {
    document.getElementById("telefoneSelectGrupo").value = registro.tel_grupo;
    document.getElementById("modalDescricao").value = registro.tel_descricao;
    document.getElementById("modalRamal").value = registro.tel_ramal;
    document.getElementById("modalTituloTelefone").innerText = "Editar Telefone";

    telModo = "editar"; // muda modo
    m.style.display = "flex";
  }
}


function telExcluir() {
  if (!telSelecionadoId) {
    alert("Selecione um registro primeiro.");
    return;
  }
  if (!confirm("Confirma excluir este telefone?")) return;

  fetch("index.php?url=TelefonesController/telDelete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: telSelecionadoId }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        telCarregarDoServidor().then(() => telRenderTabela(telGrupoAtual));
      } else {
        alert("Erro ao excluir.");
      }
    })
    .catch(err => {
      console.error("Erro ao excluir:", err);
      alert("Erro de comunicação com o servidor.");
    });
}

// ----------------- Dados -----------------
async function telCarregarDoServidor() {
  try {
    const resp = await fetch("index.php?url=TelefonesController/telListarJson&ts=" + Date.now());
    const data = await resp.json();
    telDados = Array.isArray(data) ? data : [];
  } catch (e) {
    console.error("❌ Erro ao carregar JSON:", e);
    telDados = [];
  }
}

// ----------------- Renderização -----------------
function telAtualizarBotoesCrud() {
  const btnEditar = document.getElementById("telefoneBtnEditar");
  const btnExcluir = document.getElementById("telefoneBtnExcluir");
  const ativo = !!telSelecionadoId;

  if (btnEditar) btnEditar.disabled = !ativo;
  if (btnExcluir) btnExcluir.disabled = !ativo;
}

function telSelecionarRegistro(tr) {
  document
    .querySelectorAll("#telefoneTabela tbody tr")
    .forEach(el => el.classList.remove("is-selected"));

  tr.classList.add("is-selected");
  telSelecionadoId = tr.dataset.id || null;
  telAtualizarBotoesCrud();
}

function telRenderTabela(grupo = "Agenda", termoBusca = "") {
  const tb = document.querySelector("#telefoneTabela tbody");
  const titulo = document.getElementById("telefoneTituloGrupo");
  const selectGrupo = document.getElementById("telefoneSelectGrupo");
  if (!tb || !titulo) return;

  tb.innerHTML = "";

  let registros = telDados.slice();

  if (termoBusca && termoBusca.trim() !== "") {
    const termo = termoBusca.toLowerCase();
    registros = registros.filter(
      t =>
        (t.tel_descricao || "").toLowerCase().includes(termo) ||
        (t.tel_ramal || "").toLowerCase().includes(termo)
    );
    titulo.textContent = "Resultado da Busca";
  } else {
    registros = registros.filter(t =>
      (t.tel_grupo || "").trim().toLowerCase() === grupo.trim().toLowerCase()
    );
    titulo.textContent = `Grupo: ${grupo}`;
  }

  if (registros.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 2;
    td.textContent = "Nenhum telefone encontrado.";
    td.style.textAlign = "center";
    tr.appendChild(td);
    tb.appendChild(tr);
    telSelecionadoId = null;
    telAtualizarBotoesCrud();
    return;
  }

  registros.forEach(t => {
    const tr = document.createElement("tr");
    tr.dataset.id = t.id;

    const tdDesc = document.createElement("td");
    const tdRamal = document.createElement("td");
    tdDesc.textContent = t.tel_descricao || "";
    tdRamal.textContent = t.tel_ramal || "";
    tdDesc.style.textAlign = "left";
    tdRamal.style.textAlign = "right";

    tr.appendChild(tdDesc);
    tr.appendChild(tdRamal);

    tr.setAttribute("onclick", "telSelecionarRegistro(this)");
    tb.appendChild(tr);
  });

  telSelecionadoId = null;
  telAtualizarBotoesCrud();
}

// ----------------- Filtros -----------------
function telFiltrarGrupo(grupo) {
  telGrupoAtual = grupo;

  const selectGrupo = document.getElementById("telefoneSelectGrupo");
  if (selectGrupo && selectGrupo.value !== grupo) {
    selectGrupo.value = grupo;
  }

  // 🔹 limpar o campo de busca sempre que trocar de grupo
  const busca = document.getElementById("telefoneCampoBusca");
  if (busca) busca.value = "";

  // agora renderiza sem filtro
  telRenderTabela(grupo);
}


function telInit() {
  telCarregarDoServidor().then(() => telRenderTabela("Agenda"));
}

function telFiltrarBusca() {
  const campo = document.getElementById("telefoneCampoBusca");
  if (!campo) return;

  const termo = campo.value.trim();

  if (termo === "") {
    telRenderTabela(telGrupoAtual);
  } else {
    telRenderTabela("Agenda", termo); // "Agenda" = busca em todos
  }
}
