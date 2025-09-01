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
