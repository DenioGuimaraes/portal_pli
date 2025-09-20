// ----------------- Variáveis globais -----------------
let u1620psvDados = [];
let u1620psvSelecionadoId = null;

// ----------------- Inicialização -----------------
function u1620psvInit() {
    u1620psvSelecionadoId = null;
    u1620psvCarregarDoServidor();
    u1620psvAtualizarBotoes(); // garante estado inicial
}

// ----------------- Coloca botões ativo/inativo -----------------
function u1620psvAtualizarBotoes() {
    const btnEditar = document.getElementById("u1620psvBtnEditar");
    const btnExcluir = document.getElementById("u1620psvBtnExcluir");

    if (u1620psvSelecionadoId) {
        btnEditar.disabled = false;
        btnExcluir.disabled = false;
    } else {
        btnEditar.disabled = true;
        btnExcluir.disabled = true;
    }
}

// ----------------- Carregar dados -----------------
function u1620psvCarregarDoServidor() {
    fetch('index.php?url=U1620PsvController/listar')
        .then(res => res.json())
        .then(data => {
            u1620psvDados = data;
            u1620psvRenderTabela();
        })
        .catch(err => console.error('Erro ao carregar PSV:', err));
}

// ----------------- Renderizar tabela -----------------
function u1620psvRenderTabela() {
    const tbody = document.querySelector("#u1620psvTabela tbody");
    tbody.innerHTML = "";

    u1620psvDados.forEach(item => {
        const tr = document.createElement("tr");
        tr.onclick = () => u1620psvSelecionar(item.id);

        tr.innerHTML = `
            <td>${item.tag}</td>
            <td>${item.localizacao}</td>
            <td>${item.fluido}</td>
            <td>${item.alivio}</td>
            <td>${item.diam_entrada}</td>
            <td>${item.diam_saida}</td>
            <td>${item.pressao_operacao ?? ''}</td>
            <td>${item.calibre ?? ''}</td>
            <td>${item.andaime}</td>
        `;

        if (item.id == u1620psvSelecionadoId) {
            tr.classList.add("selected");
        }

        tbody.appendChild(tr);
    });
}

// ----------------- Selecionar registro -----------------
function u1620psvSelecionar(id) {
    u1620psvSelecionadoId = id;
    u1620psvRenderTabela();
    u1620psvAtualizarBotoes();
}

// ----------------- Novo registro -----------------
function u1620psvNovo() {
    u1620psvSelecionadoId = null;
    document.getElementById("u1620psvForm").reset();
    document.getElementById("u1620psvModal").style.display = "block";
}

// ----------------- Editar registro -----------------
function u1620psvEditar() {
    if (!u1620psvSelecionadoId) {
        alert("Selecione um registro primeiro!");
        return;
    }

    const registro = u1620psvDados.find(r => r.id == u1620psvSelecionadoId);
    if (!registro) {
        alert("Registro não encontrado!");
        return;
    }

    // preencher o formulário
    for (let campo in registro) {
        if (document.getElementById("u1620psv_" + campo)) {
            document.getElementById("u1620psv_" + campo).value = registro[campo];
        }
    }

    document.getElementById("u1620psvModal").style.display = "block";
}

// ----------------- Salvar (create/update) -----------------
function u1620psvSalvar() {
    // Confirmação antes de prosseguir
    if (!confirm("Confirma salvar este registro?")) {
        return; // se o usuário clicar em Cancelar, sai da função
    }

    const form = document.getElementById("u1620psvForm");
    const formData = new FormData(form);

    let url = "index.php?url=U1620PsvController/criar";
    if (u1620psvSelecionadoId) {
        formData.append("id", u1620psvSelecionadoId);
        url = "index.php?url=U1620PsvController/atualizar";
    }

    fetch(url, {
        method: "POST",
        body: formData
    })
        .then(res => res.json())
        .then(resp => {
            if (resp.status === "success") {
                u1620psvCarregarDoServidor();
                document.getElementById("u1620psvModal").style.display = "none";
            } else {
                alert("Erro ao salvar registro!");
            }
        });
}


// ----------------- Excluir -----------------
function u1620psvExcluir() {
    if (!u1620psvSelecionadoId) {
        alert("Selecione um registro primeiro!");
        return;
    }

    if (!confirm("Confirma a exclusão?")) return;

    const formData = new FormData();
    formData.append("id", u1620psvSelecionadoId);

    fetch("index.php?url=U1620PsvController/deletar", {
        method: "POST",
        body: formData
    })
        .then(res => res.json())
        .then(resp => {
            if (resp.status === "success") {
                u1620psvCarregarDoServidor();
                u1620psvSelecionadoId = null;
                u1620psvAtualizarBotoes(); // garante desabilitar de novo
            } else {
                alert("Erro ao excluir registro!");
            }
        });
}

// ----------------- Fechar modal -----------------
function u1620psvFecharModal() {
    document.getElementById("u1620psvModal").style.display = "none";
    u1620psvSelecionadoId = null;
    u1620psvAtualizarBotoes();
}