// === Script do painel "u1640instrs" ===
// === Padrão: prefixo u1640instr ===

let u1640instrDados = [];
let u1640instrSelecionadoId = null;
let u1640instrGrupoAtual = "Temperatura";
let u1640instrModo = "novo"; // ou "editar"

// ----------------- Modal -----------------
function u1640instrAbrirModalNovo() {
  const m = document.getElementById("modalu1640instr");
  if (m) {
    // limpa campos
    document.getElementById("u1640instrSelectGrupo").value = "Temperatura";
    document.getElementById("modalTag").value = "";
    document.getElementById("modalDescricao").value = "";
    document.getElementById("modalTitulou1640instr").innerText = "Novo Instrumento";
    u1640instrModo = "novo";
    m.style.display = "flex";
  }
}

function u1640instrFecharModal() {
  const m = document.getElementById("modalu1640instr");
  if (m) m.style.display = "none";
}

function u1640instrSalvar() {
  const grupo = document.getElementById("u1640instrSelectGrupo").value;
  const descricao = document.getElementById("modalDescricao").value.trim();
  const tag = document.getElementById("modalTag").value.trim();

  if (!descricao || !tag) {
    alert("Por favor, preencha Descrição e Tag.");
    return;
  }

  if (u1640instrModo === "novo") {
    fetch("index.php?url=U1640InstrController/u1640instrCreate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grupo, tag, descricao }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Instrumento salvo com sucesso!");
          u1640instrFecharModal();
          u1640instrCarregarDoServidor().then(() =>
            u1640instrRenderTabela(u1640instrGrupoAtual)
          );
        } else {
          alert("Erro ao salvar: " + (data.message || "Tente novamente."));
        }
      })
      .catch(err => {
        console.error("Erro no fetch:", err);
        alert("Erro de comunicação com o servidor.");
      });
  } else if (u1640instrModo === "editar") {
    fetch("index.php?url=U1640InstrController/u1640instrUpdate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: u1640instrSelecionadoId, grupo, tag, descricao }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Instrumento atualizado com sucesso!");
          u1640instrFecharModal();
          u1640instrCarregarDoServidor().then(() =>
            u1640instrRenderTabela(u1640instrGrupoAtual)
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
function u1640instrEditar() {
  if (!u1640instrSelecionadoId) {
    alert("Selecione um registro primeiro.");
    return;
  }

  const registro = u1640instrDados.find(r => r.id == u1640instrSelecionadoId);
  if (!registro) {
    alert("Registro não encontrado!");
    return;
  }

  const m = document.getElementById("modalu1640instr");
  if (m) {
    document.getElementById("u1640instrSelectGrupo").value = registro.u1640instr_grupo;
    document.getElementById("modalDescricao").value = registro.u1640instr_descricao;
    document.getElementById("modalTag").value = registro.u1640instr_tag;
    document.getElementById("modalTitulou1640instr").innerText = "Editar Instrumento";

    u1640instrModo = "editar";
    m.style.display = "flex";
  }
}

function u1640instrExcluir() {
  if (!u1640instrSelecionadoId) {
    alert("Selecione um registro primeiro.");
    return;
  }
  if (!confirm("Confirma excluir este instrumento?")) return;

  fetch("index.php?url=U1640InstrController/u1640instrDelete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: u1640instrSelecionadoId }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        u1640instrCarregarDoServidor().then(() =>
          u1640instrRenderTabela(u1640instrGrupoAtual)
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
async function u1640instrCarregarDoServidor() {
  const url = "index.php?url=U1640InstrController/u1640instrListarJson&ts=" + Date.now();
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
    u1640instrDados = Array.isArray(data) ? data : [];
  } catch (e) {
    u1640instrDados = [];
  }
}


// ----------------- Renderização -----------------
function u1640instrAtualizarBotoesCrud() {
  const btnEditar = document.getElementById("u1640instrBtnEditar");
  const btnExcluir = document.getElementById("u1640instrBtnExcluir");
  const ativo = !!u1640instrSelecionadoId;

  if (btnEditar) btnEditar.disabled = !ativo;
  if (btnExcluir) btnExcluir.disabled = !ativo;
}

function u1640instrSelecionarRegistro(tr) {
  document
    .querySelectorAll("#u1640instrTabela tbody tr")
    .forEach(el => el.classList.remove("is-selected"));

  tr.classList.add("is-selected");
  u1640instrSelecionadoId = tr.dataset.id || null;
  u1640instrAtualizarBotoesCrud();
}

function u1640instrRenderTabela(grupo = "", termoBusca = "") {
  const tb = document.querySelector("#u1640instrTabela tbody");
  const titulo = document.getElementById("u1640instrTituloGrupo");
  if (!tb || !titulo) return;

  tb.innerHTML = "";

  let registros = u1640instrDados.slice();

  if (termoBusca && termoBusca.trim() !== "") {
    const termo = termoBusca.toLowerCase();
    registros = registros.filter(
      t =>
        (t.u1640instr_descricao || "").toLowerCase().includes(termo) ||
        (t.u1640instr_tag || "").toLowerCase().includes(termo)
    );
    titulo.textContent = "Resultado da Busca";
  } else if (grupo && grupo.trim() !== "") {
    registros = registros.filter(
      t =>
        (t.u1640instr_grupo || "").trim().toLowerCase() ===
        grupo.trim().toLowerCase()
    );
    titulo.textContent = `Grupo: ${grupo}`;
  }

  if (registros.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 2;
    td.textContent = "Nenhum instrumento encontrado.";
    td.style.textAlign = "center";
    tr.appendChild(td);
    tb.appendChild(tr);
    u1640instrSelecionadoId = null;
    u1640instrAtualizarBotoesCrud();
    return;
  }

  registros.forEach(t => {
    const tr = document.createElement("tr");
    tr.dataset.id = t.id;

    const tdTag = document.createElement("td");
    const tdDesc = document.createElement("td");
    tdTag.textContent = t.u1640instr_tag || "";
    tdDesc.textContent = t.u1640instr_descricao || "";
    tdTag.style.textAlign = "left";
    tdDesc.style.textAlign = "right";

    tr.appendChild(tdTag);
    tr.appendChild(tdDesc);

    tr.setAttribute("onclick", "u1640instrSelecionarRegistro(this)");
    tb.appendChild(tr);
  });

  u1640instrSelecionadoId = null;
  u1640instrAtualizarBotoesCrud();
}

// ----------------- Filtros -----------------
function u1640instrFiltrarGrupo(grupo) {
  u1640instrGrupoAtual = grupo;

  const selectGrupo = document.getElementById("u1640instrSelectGrupo");
  if (selectGrupo && selectGrupo.value !== grupo) {
    selectGrupo.value = grupo;
  }

  // 🔹 limpar o campo de busca sempre que trocar de grupo
  const busca = document.getElementById("u1640instrCampoBusca");
  if (busca) busca.value = "";

  // agora renderiza sem filtro
  u1640instrRenderTabela(grupo);
}

function u1640InstrInit() {
  u1640instrCarregarDoServidor().then(() =>
    u1640instrRenderTabela("Temperatura")
  );
}

function u1640instrFiltrarBusca() {
  const campo = document.getElementById("u1640instrCampoBusca");
  if (!campo) return;

  const termo = campo.value.trim();

  if (termo === "") {
    u1640instrRenderTabela(u1640instrGrupoAtual);
  } else {
    u1640instrRenderTabela("", termo); // busca global em todos os grupos
  }
}
