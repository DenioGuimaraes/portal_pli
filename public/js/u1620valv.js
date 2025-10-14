// === Script do painel "u1620valvs" ===
// === Padrão: prefixo u1620valv ===

let u1620valvDados = [];
let u1620valvSelecionadoId = null;
let u1620valvGrupoAtual = "Temperatura";
let u1620valvModo = "novo"; // ou "editar"

// ----------------- Modal -----------------
function u1620valvAbrirModalNovo() {
  const m = document.getElementById("modalu1620valv");
  if (m) {
    // limpa campos
    document.getElementById("u1620valvSelectGrupo").value = "Temperatura";
    document.getElementById("modalTag").value = "";
    document.getElementById("modalDescricao").value = "";
    document.getElementById("modalTitulou1620valv").innerText = "Novo Instrumento";
    u1620valvModo = "novo";
    m.style.display = "flex";
  }
}

function u1620valvFecharModal() {
  const m = document.getElementById("modalu1620valv");
  if (m) m.style.display = "none";
}

function u1620valvSalvar() {
  const grupo = document.getElementById("u1620valvSelectGrupo").value;
  const descricao = document.getElementById("modalDescricao").value.trim();
  const tag = document.getElementById("modalTag").value.trim();

  if (!descricao || !tag) {
    alert("Por favor, preencha Descrição e Tag.");
    return;
  }

  if (u1620valvModo === "novo") {
    fetch("index.php?url=U1620valvController/u1620valvCreate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grupo, tag, descricao }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Instrumento salvo com sucesso!");
          u1620valvFecharModal();
          u1620valvCarregarDoServidor().then(() =>
            u1620valvRenderTabela(u1620valvGrupoAtual)
          );
        } else {
          alert("Erro ao salvar: " + (data.message || "Tente novamente."));
        }
      })
      .catch(err => {
        console.error("Erro no fetch:", err);
        alert("Erro de comunicação com o servidor.");
      });
  } else if (u1620valvModo === "editar") {
    fetch("index.php?url=U1620valvController/u1620valvUpdate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: u1620valvSelecionadoId, grupo, tag, descricao }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Instrumento atualizado com sucesso!");
          u1620valvFecharModal();
          u1620valvCarregarDoServidor().then(() =>
            u1620valvRenderTabela(u1620valvGrupoAtual)
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
function u1620valvEditar() {
  if (!u1620valvSelecionadoId) {
    alert("Selecione um registro primeiro.");
    return;
  }

  const registro = u1620valvDados.find(r => r.id == u1620valvSelecionadoId);
  if (!registro) {
    alert("Registro não encontrado!");
    return;
  }

  const m = document.getElementById("modalu1620valv");
  if (m) {
    document.getElementById("u1620valvSelectGrupo").value = registro.u1620valv_grupo;
    document.getElementById("modalDescricao").value = registro.u1620valv_descricao;
    document.getElementById("modalTag").value = registro.u1620valv_tag;
    document.getElementById("modalTitulou1620valv").innerText = "Editar Instrumento";

    u1620valvModo = "editar";
    m.style.display = "flex";
  }
}

function u1620valvExcluir() {
  if (!u1620valvSelecionadoId) {
    alert("Selecione um registro primeiro.");
    return;
  }
  if (!confirm("Confirma excluir este Instrumento?")) return;

  fetch("index.php?url=U1620valvController/u1620valvDelete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: u1620valvSelecionadoId }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        u1620valvCarregarDoServidor().then(() =>
          u1620valvRenderTabela(u1620valvGrupoAtual)
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
async function u1620valvCarregarDoServidor() {
  const url = "index.php?url=U1620valvController/u1620valvListarJson&ts=" + Date.now();
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
    u1620valvDados = Array.isArray(data) ? data : [];
  } catch (e) {
    u1620valvDados = [];
  }
}


// ----------------- Renderização -----------------
function u1620valvAtualizarBotoesCrud() {
  const btnEditar = document.getElementById("u1620valvBtnEditar");
  const btnExcluir = document.getElementById("u1620valvBtnExcluir");
  const ativo = !!u1620valvSelecionadoId;

  if (btnEditar) btnEditar.disabled = !ativo;
  if (btnExcluir) btnExcluir.disabled = !ativo;
}

function u1620valvSelecionarRegistro(tr) {
  document
    .querySelectorAll("#u1620valvTabela tbody tr")
    .forEach(el => el.classList.remove("is-selected"));

  tr.classList.add("is-selected");
  u1620valvSelecionadoId = tr.dataset.id || null;
  u1620valvAtualizarBotoesCrud();
}

function u1620valvRenderTabela(grupo = "", termoBusca = "") {
  const tb = document.querySelector("#u1620valvTabela tbody");
  const titulo = document.getElementById("u1620valvTituloGrupo");
  if (!tb || !titulo) return;

  tb.innerHTML = "";

  let registros = u1620valvDados.slice();

  if (termoBusca && termoBusca.trim() !== "") {
    const termo = termoBusca.toLowerCase();
    registros = registros.filter(
      t =>
        (t.u1620valv_descricao || "").toLowerCase().includes(termo) ||
        (t.u1620valv_tag || "").toLowerCase().includes(termo)
    );
    titulo.textContent = "Resultado da Busca";
  } else if (grupo && grupo.trim() !== "") {
    registros = registros.filter(
      t =>
        (t.u1620valv_grupo || "").trim().toLowerCase() ===
        grupo.trim().toLowerCase()
    );
    titulo.textContent = `Grupo: ${grupo}`;
  }

  if (registros.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 2;
    td.textContent = "Nenhum Instrumento encontrado.";
    td.style.textAlign = "center";
    tr.appendChild(td);
    tb.appendChild(tr);
    u1620valvSelecionadoId = null;
    u1620valvAtualizarBotoesCrud();
    return;
  }

  registros.forEach(t => {
    const tr = document.createElement("tr");
    tr.dataset.id = t.id;

    const tdTag = document.createElement("td");
    const tdDesc = document.createElement("td");
    tdTag.textContent = t.u1620valv_tag || "";
    tdDesc.textContent = t.u1620valv_descricao || "";
    tdTag.style.textAlign = "left";
    tdDesc.style.textAlign = "right";

    tr.appendChild(tdTag);
    tr.appendChild(tdDesc);

    tr.setAttribute("onclick", "u1620valvSelecionarRegistro(this)");
    tb.appendChild(tr);
  });

  u1620valvSelecionadoId = null;
  u1620valvAtualizarBotoesCrud();
}

// ----------------- Filtros -----------------
function u1620valvFiltrarGrupo(grupo) {
  u1620valvGrupoAtual = grupo;

  const selectGrupo = document.getElementById("u1620valvSelectGrupo");
  if (selectGrupo && selectGrupo.value !== grupo) {
    selectGrupo.value = grupo;
  }

  // 🔹 limpar o campo de busca sempre que trocar de grupo
  const busca = document.getElementById("u1620valvCampoBusca");
  if (busca) busca.value = "";

  // agora renderiza sem filtro
  u1620valvRenderTabela(grupo);
}

function u1620valvInit() {
  u1620valvCarregarDoServidor().then(() =>
    u1620valvRenderTabela("Temperatura")
  );
}

function u1620valvFiltrarBusca() {
  const campo = document.getElementById("u1620valvCampoBusca");
  if (!campo) return;

  const termo = campo.value.trim();

  if (termo === "") {
    u1620valvRenderTabela(u1620valvGrupoAtual);
  } else {
    u1620valvRenderTabela("", termo); // busca global em todos os grupos
  }
}
