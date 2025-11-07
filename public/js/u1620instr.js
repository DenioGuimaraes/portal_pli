// === Script do painel "u1620instrs" ===
// === Padrão: prefixo u1620instr ===

let u1620instrDados = [];
let u1620instrSelecionadoId = null;
let u1620instrGrupoAtual = "Temperatura";
let u1620instrModo = "novo"; // ou "editar"

// ----------------- Modal -----------------
function u1620instrAbrirModalNovo() {
  const m = document.getElementById("modalu1620instr");
  if (m) {
    // limpa campos
    document.getElementById("u1620instrSelectGrupo").value = "Temperatura";
    document.getElementById("modalTag").value = "";
    document.getElementById("modalDescricao").value = "";
    document.getElementById("modalTitulou1620instr").innerText = "Novo Instrumento";
    u1620instrModo = "novo";
    m.style.display = "flex";
  }
}

function u1620instrFecharModal() {
  const m = document.getElementById("modalu1620instr");
  if (m) m.style.display = "none";
}

function u1620instrSalvar() {
  const grupo = document.getElementById("u1620instrSelectGrupo").value;
  const descricao = document.getElementById("modalDescricao").value.trim();
  const tag = document.getElementById("modalTag").value.trim();

  if (!descricao || !tag) {
    alert("Por favor, preencha Descrição e Tag.");
    return;
  }

  if (u1620instrModo === "novo") {
    fetch("index.php?url=U1620InstrController/u1620instrCreate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grupo, tag, descricao }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Instrumento salvo com sucesso!");
          u1620instrFecharModal();
          u1620instrCarregarDoServidor().then(() =>
            u1620instrRenderTabela(u1620instrGrupoAtual)
          );
        } else {
          alert("Erro ao salvar: " + (data.message || "Tente novamente."));
        }
      })
      .catch(err => {
        console.error("Erro no fetch:", err);
        alert("Erro de comunicação com o servidor.");
      });
  } else if (u1620instrModo === "editar") {
    fetch("index.php?url=U1620InstrController/u1620instrUpdate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: u1620instrSelecionadoId, grupo, tag, descricao }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Instrumento atualizado com sucesso!");
          u1620instrFecharModal();
          u1620instrCarregarDoServidor().then(() =>
            u1620instrRenderTabela(u1620instrGrupoAtual)
          );
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
function u1620instrEditar() {
  if (!u1620instrSelecionadoId) {
    alert("Selecione um registro primeiro.");
    return;
  }

  const registro = u1620instrDados.find(r => r.id == u1620instrSelecionadoId);
  if (!registro) {
    alert("Registro não encontrado!");
    return;
  }

  const m = document.getElementById("modalu1620instr");
  if (m) {
    document.getElementById("u1620instrSelectGrupo").value = registro.u1620instr_grupo;
    document.getElementById("modalDescricao").value = registro.u1620instr_descricao;
    document.getElementById("modalTag").value = registro.u1620instr_tag;
    document.getElementById("modalTitulou1620instr").innerText = "Editar Instrumento";

    u1620instrModo = "editar";
    m.style.display = "flex";
  }
}

function u1620instrExcluir() {
  if (!u1620instrSelecionadoId) {
    alert("Selecione um registro primeiro.");
    return;
  }
  if (!confirm("Confirma excluir este instrumento?")) return;

  fetch("index.php?url=U1620InstrController/u1620instrDelete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: u1620instrSelecionadoId }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        u1620instrCarregarDoServidor().then(() =>
          u1620instrRenderTabela(u1620instrGrupoAtual)
        );
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
async function u1620instrCarregarDoServidor() {
  const url = "index.php?url=U1620InstrController/u1620instrListarJson&ts=" + Date.now();
  try {
    const resp = await fetch(url);
    // pega resposta bruta
    const texto = await resp.text();
    // tenta converter manualmente
    let data;
    try {
      data = JSON.parse(texto);
    } catch (parseErr) {
      return;
    }
    // só salva se for array
    u1620instrDados = Array.isArray(data) ? data : [];
  } catch (e) {
    u1620instrDados = [];
  }
}


// ----------------- Renderização -----------------
function u1620instrAtualizarBotoesCrud() {
  const btnEditar = document.getElementById("u1620instrBtnEditar");
  const btnExcluir = document.getElementById("u1620instrBtnExcluir");
  const ativo = !!u1620instrSelecionadoId;

  if (btnEditar) btnEditar.disabled = !ativo;
  if (btnExcluir) btnExcluir.disabled = !ativo;
}

function u1620instrSelecionarRegistro(tr) {
  document
    .querySelectorAll("#u1620instrTabela tbody tr")
    .forEach(el => el.classList.remove("is-selected"));

  tr.classList.add("is-selected");
  u1620instrSelecionadoId = tr.dataset.id || null;
  u1620instrAtualizarBotoesCrud();
}

function u1620instrRenderTabela(grupo = "", termoBusca = "") {
  const tb = document.querySelector("#u1620instrTabela tbody");
  const titulo = document.getElementById("u1620instrTituloGrupo");
  if (!tb || !titulo) return;

  tb.innerHTML = "";

  let registros = u1620instrDados.slice();

  if (termoBusca && termoBusca.trim() !== "") {
    const termo = termoBusca.toLowerCase();
    registros = registros.filter(
      t =>
        (t.u1620instr_descricao || "").toLowerCase().includes(termo) ||
        (t.u1620instr_tag || "").toLowerCase().includes(termo)
    );
    titulo.textContent = "Resultado da Busca";
  } else if (grupo && grupo.trim() !== "") {
    registros = registros.filter(
      t =>
        (t.u1620instr_grupo || "").trim().toLowerCase() ===
        grupo.trim().toLowerCase()
    );
    titulo.textContent = `Grupo: ${grupo}`;
  }

  // 🔹 ORDENAR POR TAG ANTES DE EXIBIR
  registros.sort((a, b) => {
    const tagA = (a.u1620instr_tag || "").toLowerCase();
    const tagB = (b.u1620instr_tag || "").toLowerCase();
    return tagA.localeCompare(tagB, "pt-BR", { numeric: true });
  });

  if (registros.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 2;
    td.textContent = "Nenhum instrumento encontrado.";
    td.style.textAlign = "center";
    tr.appendChild(td);
    tb.appendChild(tr);
    u1620instrSelecionadoId = null;
    u1620instrAtualizarBotoesCrud();
    return;
  }

  registros.forEach(t => {
    const tr = document.createElement("tr");
    tr.dataset.id = t.id;

    const tdTag = document.createElement("td");
    const tdDesc = document.createElement("td");
    tdTag.textContent = t.u1620instr_tag || "";
    tdDesc.textContent = t.u1620instr_descricao || "";
    tdTag.style.textAlign = "left";
    tdDesc.style.textAlign = "right";

    tr.appendChild(tdTag);
    tr.appendChild(tdDesc);

    tr.setAttribute("onclick", "u1620instrSelecionarRegistro(this)");
    tb.appendChild(tr);
  });

  u1620instrSelecionadoId = null;
  u1620instrAtualizarBotoesCrud();
}

// ----------------- Filtros -----------------
function u1620instrFiltrarGrupo(grupo) {
  u1620instrGrupoAtual = grupo;

  const selectGrupo = document.getElementById("u1620instrSelectGrupo");
  if (selectGrupo && selectGrupo.value !== grupo) {
    selectGrupo.value = grupo;
  }

  // 🔹 limpar o campo de busca sempre que trocar de grupo
  const busca = document.getElementById("u1620instrCampoBusca");
  if (busca) busca.value = "";

  // agora renderiza sem filtro
  u1620instrRenderTabela(grupo);
}

function u1620InstrInit() {
  u1620instrCarregarDoServidor().then(() =>
    u1620instrRenderTabela("Temperatura")
  );
}

function u1620instrFiltrarBusca() {
  const campo = document.getElementById("u1620instrCampoBusca");
  if (!campo) return;

  const termo = campo.value.trim();

  if (termo === "") {
    u1620instrRenderTabela(u1620instrGrupoAtual);
  } else {
    u1620instrRenderTabela("", termo); // busca global em todos os grupos
  }
}
