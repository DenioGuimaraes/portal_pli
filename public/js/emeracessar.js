function mostrarDetalhe(el) {
  // limpa seleção anterior
  document.querySelectorAll('.passo-item.is-selected')
    .forEach(li => li.classList.remove('is-selected'));

  el.classList.add('is-selected');

  // pega detalhe multilinha
  const detalhe = el.dataset.detalhe || "";
  const linhas = detalhe.split("\n");

  let html = "<ul class='etapas-passo'>";
  for (const l of linhas) {
    if (l.trim() !== "") {
      html += "<li>" + l + "</li>";
    }
  }
  html += "</ul>";

  document.getElementById("body-acoes").innerHTML = html;
}

// 🔹 helper para habilitar/desabilitar
function setBotaoNovo(enabled) {
  const btnNovo = document.querySelector('.menu-direito .botao-direito[onclick*="emergnovo"]');
  if (!btnNovo) return;
  btnNovo.disabled = !enabled;
}

// 🔹 garante que o botão "Novo" será desabilitado
function disableNovoUntilMenuLoads() {
  const menu = document.querySelector('.menu-direito');
  if (!menu) return;

  const btn = document.querySelector('.menu-direito .botao-direito[onclick*="emergnovo"]');
  if (btn) return setBotaoNovo(false);

  const observer = new MutationObserver(() => {
    const b = document.querySelector('.menu-direito .botao-direito[onclick*="emergnovo"]');
    if (b) {
      setBotaoNovo(false);
      observer.disconnect();
    }
  });
  observer.observe(menu, { childList: true, subtree: true });
}

// 🔹 chama logo na carga do painel
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', disableNovoUntilMenuLoads);
} else {
  disableNovoUntilMenuLoads();
}
