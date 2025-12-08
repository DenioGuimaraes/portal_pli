// === Script do painel "u1640valvs" ===
// === Padrão: prefixo u1640valv ===

let u1640valvDados = [];
let u1640valvSelecionadoId = null;
let u1640valvGrupoAtual = "Temperatura";
let u1640valvModo = "novo"; // ou "editar"

// ----------------- Modal -----------------
function u1640valvAbrirModalNovo() {
  const m = document.getElementById("modalu1640valv");
  if (m) {
    // limpa campos
    document.getElementById("u1640valvSelectGrupo").value = "Temperatura";
    document.getElementById("modalTag").value = "";
    document.getElementById("modalDescricao").value = "";
    document.getElementById("modalTitulou1640valv").innerText = "Novo Instrumento";
    u1640valvModo = "novo";
    m.style.display = "flex";
  }
}

function u1640valvFecharModal() {
  const m = document.getElementById("modalu1640valv");
  if (m) m.style.display = "none";
}

function u1640valvSalvar() {
  const grupo = document.getElementById("u1640valvSelectGrupo").value;
  const descricao = document.getElementById("modalDescricao").value.trim();
  const tag = document.getElementById("modalTag").value.trim();

  if (!descricao || !tag) {
    alert("Por favor, preencha Descrição e Tag.");
    return;
  }

  if (u1640valvModo === "novo") {
    fetch("index.php?url=U1640valvController/u1640valvCreate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grupo, tag, descricao }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Instrumento salvo com sucesso!");
          u1640valvFecharModal();
          u1640valvCarregarDoServidor().then(() =>
            u1640valvRenderTabela(u1640valvGrupoAtual)
          );
        } else {
          alert("Erro ao salvar: " + (data.message || "Tente novamente."));
        }
      })
      .catch(err => {
        console.error("Erro no fetch:", err);
        alert("Erro de comunicação com o servidor.");
      });
  } else if (u1640valvModo === "editar") {
    fetch("index.php?url=U1640valvController/u1640valvUpdate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: u1640valvSelecionadoId, grupo, tag, descricao }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Instrumento atualizado com sucesso!");
          u1640valvFecharModal();
          u1640valvCarregarDoServidor().then(() =>
            u1640valvRenderTabela(u1640valvGrupoAtual)
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
function u1640valvEditar() {
  if (!u1640valvSelecionadoId) {
    alert("Selecione um registro primeiro.");
    return;
  }

  const registro = u1640valvDados.find(r => r.id == u1640valvSelecionadoId);
  if (!registro) {
    alert("Registro não encontrado!");
    return;
  }

  const m = document.getElementById("modalu1640valv");
  if (m) {
    document.getElementById("u1640valvSelectGrupo").value = registro.u1640valv_grupo;
    document.getElementById("modalDescricao").value = registro.u1640valv_descricao;
    document.getElementById("modalTag").value = registro.u1640valv_tag;
    document.getElementById("modalTitulou1640valv").innerText = "Editar Instrumento";

    u1640valvModo = "editar";
    m.style.display = "flex";
  }
}

function u1640valvExcluir() {
  if (!u1640valvSelecionadoId) {
    alert("Selecione um registro primeiro.");
    return;
  }
  if (!confirm("Confirma excluir este Instrumento?")) return;

  fetch("index.php?url=U1640valvController/u1640valvDelete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: u1640valvSelecionadoId }),
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        u1640valvCarregarDoServidor().then(() =>
          u1640valvRenderTabela(u1640valvGrupoAtual)
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
async function u1640valvCarregarDoServidor() {
  const url = "index.php?url=U1640valvController/u1640valvListarJson&ts=" + Date.now();
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
    u1640valvDados = Array.isArray(data) ? data : [];
  } catch (e) {
    u1640valvDados = [];
  }
}


// ----------------- Renderização -----------------
function u1640valvAtualizarBotoesCrud() {
  const btnEditar = document.getElementById("u1640valvBtnEditar");
  const btnExcluir = document.getElementById("u1640valvBtnExcluir");
  const ativo = !!u1640valvSelecionadoId;

  if (btnEditar) btnEditar.disabled = !ativo;
  if (btnExcluir) btnExcluir.disabled = !ativo;
}

function u1640valvSelecionarRegistro(tr) {
  document
    .querySelectorAll("#u1640valvTabela tbody tr")
    .forEach(el => el.classList.remove("is-selected"));

  tr.classList.add("is-selected");
  u1640valvSelecionadoId = tr.dataset.id || null;
  u1640valvAtualizarBotoesCrud();
}

function u1640valvRenderTabela(grupo = "", termoBusca = "") {
  const tb = document.querySelector("#u1640valvTabela tbody");
  const titulo = document.getElementById("u1640valvTituloGrupo");
  if (!tb || !titulo) return;

  tb.innerHTML = "";

  let registros = u1640valvDados.slice();

  if (termoBusca && termoBusca.trim() !== "") {
    const termo = termoBusca.toLowerCase();
    registros = registros.filter(
      t =>
        (t.u1640valv_descricao || "").toLowerCase().includes(termo) ||
        (t.u1640valv_tag || "").toLowerCase().includes(termo)
    );
    titulo.textContent = "Resultado da Busca";
  } else if (grupo && grupo.trim() !== "") {
    registros = registros.filter(
      t =>
        (t.u1640valv_grupo || "").trim().toLowerCase() ===
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
    u1640valvSelecionadoId = null;
    u1640valvAtualizarBotoesCrud();
    return;
  }

  registros.forEach(t => {
    const tr = document.createElement("tr");
    tr.dataset.id = t.id;

    const tdTag = document.createElement("td");
    const tdDesc = document.createElement("td");
    tdTag.textContent = t.u1640valv_tag || "";
    tdDesc.textContent = t.u1640valv_descricao || "";
    tdTag.style.textAlign = "left";
    tdDesc.style.textAlign = "right";

    tr.appendChild(tdTag);
    tr.appendChild(tdDesc);

    tr.setAttribute("onclick", "u1640valvSelecionarRegistro(this)");
    tb.appendChild(tr);
  });

  u1640valvSelecionadoId = null;
  u1640valvAtualizarBotoesCrud();
}

// ----------------- Filtros -----------------
function u1640valvFiltrarGrupo(grupo) {
  u1640valvGrupoAtual = grupo;

  const selectGrupo = document.getElementById("u1640valvSelectGrupo");
  if (selectGrupo && selectGrupo.value !== grupo) {
    selectGrupo.value = grupo;
  }

  // 🔹 limpar o campo de busca sempre que trocar de grupo
  const busca = document.getElementById("u1640valvCampoBusca");
  if (busca) busca.value = "";

  // agora renderiza sem filtro
  u1640valvRenderTabela(grupo);
}

function u1640valvInit() {
  u1640valvCarregarDoServidor().then(() =>
    u1640valvRenderTabela("Temperatura")
  );
}

function u1640valvFiltrarBusca() {
  const campo = document.getElementById("u1640valvCampoBusca");
  if (!campo) return;

  const termo = campo.value.trim();

  if (termo === "") {
    u1640valvRenderTabela(u1640valvGrupoAtual);
  } else {
    u1640valvRenderTabela("", termo); // busca global em todos os grupos
  }
}
