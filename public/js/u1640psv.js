// ----------------- Variáveis globais -----------------
let u1640psvDados = [];
let u1640psvSelecionadoId = null;

// ----------------- Inicialização -----------------
function u1640psvInit() {
    u1640psvSelecionadoId = null;
    u1640psvCarregarDoServidor();
    u1640psvAtualizarBotoes(); // garante estado inicial
}

// ----------------- Coloca botões ativo/inativo -----------------
function u1640psvAtualizarBotoes() {
    const btnEditar = document.getElementById("u1640psvBtnEditar");
    const btnExcluir = document.getElementById("u1640psvBtnExcluir");

    if (u1640psvSelecionadoId) {
        btnEditar.disabled = false;
        btnExcluir.disabled = false;
    } else {
        btnEditar.disabled = true;
        btnExcluir.disabled = true;
    }
}

// ----------------- Carregar dados -----------------
function u1640psvCarregarDoServidor() {
    fetch('index.php?url=U1640PsvController/listar')
        .then(res => res.json())
        .then(data => {
            u1640psvDados = data;
            u1640psvRenderTabela();
        })
        .catch(err => console.error('Erro ao carregar PSV:', err));
}

// ----------------- Renderizar tabela -----------------
function u1640psvRenderTabela() {
    const tbody = document.querySelector("#u1640psvTabela tbody");
    tbody.innerHTML = "";

    u1640psvDados.forEach(item => {
        const tr = document.createElement("tr");
        tr.onclick = () => u1640psvSelecionar(item.id);

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

        if (item.id == u1640psvSelecionadoId) {
            tr.classList.add("selected");
        }

        tbody.appendChild(tr);
    });
}

// ----------------- Selecionar registro -----------------
function u1640psvSelecionar(id) {
    u1640psvSelecionadoId = id;
    u1640psvRenderTabela();
    u1640psvAtualizarBotoes();
}

// ----------------- Novo registro -----------------
function u1640psvNovo() {
    u1640psvSelecionadoId = null;
    document.getElementById("u1640psvForm").reset();
    document.getElementById("u1640psvModal").style.display = "block";
}

// ----------------- Editar registro -----------------
function u1640psvEditar() {
    if (!u1640psvSelecionadoId) {
        alert("Selecione um registro primeiro!");
        return;
    }

    const registro = u1640psvDados.find(r => r.id == u1640psvSelecionadoId);
    if (!registro) {
        alert("Registro não encontrado!");
        return;
    }

    // preencher o formulário
    for (let campo in registro) {
        if (document.getElementById("u1640psv_" + campo)) {
            document.getElementById("u1640psv_" + campo).value = registro[campo];
        }
    }

    document.getElementById("u1640psvModal").style.display = "block";
}

// ----------------- Salvar (create/update) -----------------
function u1640psvSalvar() {
    // Confirmação antes de prosseguir
    if (!confirm("Confirma salvar este registro?")) {
        return; // se o usuário clicar em Cancelar, sai da função
    }

    const form = document.getElementById("u1640psvForm");
    const formData = new FormData(form);

    let url = "index.php?url=U1640PsvController/criar";
    if (u1640psvSelecionadoId) {
        formData.append("id", u1640psvSelecionadoId);
        url = "index.php?url=U1640PsvController/atualizar";
    }

    fetch(url, {
        method: "POST",
        body: formData
    })
        .then(res => res.json())
        .then(resp => {
            if (resp.status === "success") {
                u1640psvCarregarDoServidor();
                document.getElementById("u1640psvModal").style.display = "none";
            } else {
                alert("Erro ao salvar registro!");
            }
        });
}

// ----------------- Excluir -----------------
function u1640psvExcluir() {
    if (!u1640psvSelecionadoId) {
        alert("Selecione um registro primeiro!");
        return;
    }

    if (!confirm("Confirma a exclusão?")) return;

    const formData = new FormData();
    formData.append("id", u1640psvSelecionadoId);

    fetch("index.php?url=U1640PsvController/deletar", {
        method: "POST",
        body: formData
    })
        .then(res => res.json())
        .then(resp => {
            if (resp.status === "success") {
                u1640psvCarregarDoServidor();
                u1640psvSelecionadoId = null;
                u1640psvAtualizarBotoes(); // garante desabilitar de novo
            } else {
                alert("Erro ao excluir registro!");
            }
        });
}

// ----------------- Fechar modal -----------------
function u1640psvFecharModal() {
    document.getElementById("u1640psvModal").style.display = "none";
    u1640psvSelecionadoId = null;
    u1640psvAtualizarBotoes();
}
