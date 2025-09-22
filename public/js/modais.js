function buscarNome() {
  let termo = document.getElementById('campoBusca').value;

  if (termo.length < 2) {
    document.getElementById('resultadoBusca').innerHTML = '';
    return;
  }

  fetch(BASE_URL + '/public/index.php?url=DadosPessoalController/buscar&termo=' + encodeURIComponent(termo))
    .then(res => res.json())
    .then(res => {
      let html = '<h3>Resultados da Busca</h3>';
      res.forEach(pessoa => {
        html += `<div class='nome-clicavel' onclick='mostrarModal(${JSON.stringify(pessoa)})'>${pessoa.nome}</div>`;
      });
      document.getElementById('resultadoBusca').innerHTML = html;
    });
}

function mostrarModal(pessoa) {
  let conteudo = `
        <p><strong>Nome (Apelido):</strong> ${pessoa.nome ?? ''}</p>
        <p><strong>Nome Completo:</strong> ${pessoa.nometodo ?? ''}</p>
        <p><strong>Chave:</strong> ${pessoa.chave ?? ''}</p>
        <p><strong>Matrícula:</strong> ${pessoa.matricula ?? ''}</p>
        <p><strong>Telefone:</strong> ${pessoa.telefone ?? ''}</p>
        <p><strong>Email:</strong> ${pessoa.email ?? ''}</p>
        <p><strong>Sangue:</strong> ${pessoa.sangue ?? ''}</p>
        <p><strong>Transporte:</strong> ${pessoa.transporte ?? ''}</p>
        <p><strong>Grupo:</strong> ${pessoa.grupo ?? ''}</p>
        <p><strong>Cargo:</strong> ${pessoa.cargo ?? ''}</p>
    `;

  document.getElementById('conteudoModal').innerHTML = conteudo;
  document.getElementById('modalDetalhes').style.display = 'block';
}


function fecharModal() {
  document.getElementById('modalDetalhes').style.display = 'none';
}

function carregarConteudoMenuDireito(pagina, botao) {
  fetch('app/views/' + pagina + '.php')
    .then(res => res.text())
    .then(html => {
      document.getElementById('conteudo-central').innerHTML = html;
    });

  // Agora limpa apenas os botões do menu direito
  const botoes = document.querySelectorAll('.botao-direito');
  botoes.forEach(btn => btn.classList.remove('ativo'));

  // Marca o botão clicado
  botao.classList.add('ativo');
}

document.addEventListener("DOMContentLoaded", function () {
  const campoBusca = document.getElementById("buscaNome");
  const grupos = document.querySelectorAll(".grupo");

  if (campoBusca) {
    campoBusca.addEventListener("input", function () {
      const termo = campoBusca.value.toLowerCase();

      grupos.forEach(grupo => {
        const nomes = grupo.querySelectorAll(".nome");
        let grupoVisivel = false;

        nomes.forEach(nome => {
          if (nome.textContent.toLowerCase().includes(termo)) {
            nome.style.display = "block";
            grupoVisivel = true;
          } else {
            nome.style.display = "none";
          }
        });

        grupo.style.display = grupoVisivel ? "block" : "none";
      });
    });
  }
});

function abrirModalCadastro(pessoa = null) {
  document.getElementById('modalCadastro').style.display = 'flex';
  document.getElementById('modalTitulo').innerText = pessoa ? 'Editar Registro' : 'Novo Registro';
  document.getElementById('campo-id').value = pessoa?.id || '';
  document.getElementById('campo-nome').value = pessoa?.nome || '';
  document.getElementById('campo-nometodo').value = pessoa?.nometodo || '';
  document.getElementById('campo-chave').value = pessoa?.chave || '';
  document.getElementById('campo-matricula').value = pessoa?.matricula || '';
  document.getElementById('campo-telefone').value = pessoa?.telefone || '';
  document.getElementById('campo-email').value = pessoa?.email || '';
  document.getElementById('campo-transporte').value = pessoa?.transporte || '';
  document.getElementById('campo-sangue').value = pessoa?.sangue || '';
  document.getElementById('campo-grupo').value = pessoa?.grupo || '';
  document.getElementById('campo-cargo').value = pessoa?.cargo || '';

  // avatar não dá para preencher no input type=file
  /* mas podemos exibir preview se já existir
  if (pessoa?.avatar) {
    const preview = document.createElement('img');
    preview.src = 'public/images/pessoal/' + pessoa.avatar;
    preview.style.maxWidth = "120px";
    preview.style.maxHeight = "120px";
    document.getElementById('campo-avatar').insertAdjacentElement('afterend', preview);
  }*/
}

function fecharModalCadastro() {
  document.getElementById('modalCadastro').style.display = 'none';
}

function salvarRegistro() {
  const formData = new FormData();
  formData.append("id", document.getElementById('campo-id').value);
  formData.append("nome", document.getElementById('campo-nome').value);
  formData.append("nometodo", document.getElementById('campo-nometodo').value);
  formData.append("chave", document.getElementById('campo-chave').value);
  formData.append("matricula", document.getElementById('campo-matricula').value);
  formData.append("telefone", document.getElementById('campo-telefone').value);
  formData.append("email", document.getElementById('campo-email').value);
  formData.append("transporte", document.getElementById('campo-transporte').value);
  formData.append("sangue", document.getElementById('campo-sangue').value);
  formData.append("grupo", document.getElementById('campo-grupo').value);
  formData.append("cargo", document.getElementById('campo-cargo').value);

  const avatarFile = document.getElementById('campo-avatar').files[0];
  if (avatarFile) {
    formData.append("avatar", avatarFile);
  }

  fetch('includes/salvar.php', {
    method: 'POST',
    body: formData
  })
    .then(async (res) => {
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        return json;
      } catch (e) {
        console.error('Resposta não-JSON do salvar.php:', text);
        throw new Error('Resposta não-JSON do backend');
      }
    })
    .then(res => {
      alert(res.mensagem);
      if (res.sucesso) {
        fecharModalCadastro();
        carregarConteudo('alterarpessoal');
      }
    })
    .catch(err => {
      console.error('Erro ao salvar:', err);
      alert('Erro ao salvar os dados.');
    });
}

function abrirModalInserir() {
  // Primeiro, limpa o modal e define como 'Novo Registro'
  abrirModalCadastro(null);

  // Depois, busca o próximo ID disponível no banco
  fetch('includes/proximo_id.php')
    .then(res => res.json())
    .then(json => {
      document.getElementById('campo-id').value = json.proximo_id;
    })
    .catch(err => {
      console.error('Erro ao buscar próximo ID:', err);
      document.getElementById('campo-id').value = ''; // Fallback em caso de erro
    });
}

function excluirRegistro(id) {
  if (!confirm("Deseja realmente excluir este registro?")) {
    return;
  }

  fetch('includes/excluir.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id: id })
  })
    .then(res => res.json())
    .then(res => {
      alert(res.mensagem);
      if (res.sucesso) {
        carregarConteudo('alterarpessoal');
      }
    })
    .catch(err => {
      console.error('Erro ao excluir:', err);
      alert('Erro ao excluir o registro.');
    });
}

