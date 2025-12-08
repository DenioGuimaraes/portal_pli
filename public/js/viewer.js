// viewer.js — com autodetecção de BASE_URL e robusto a re-render
(() => {
  window.PLI = window.PLI || {};

  // --- BASE detector ---------------------------------------------------------
  function computeBase() {
    // 1) se o template definiu, usa
    if (typeof window.BASE_URL === "string" && window.BASE_URL.trim()) {
      return window.BASE_URL.replace(/\/$/, "");
    }

    // 2) tenta descobrir pela URL do próprio script viewer.js
    //    .../Portal_PLI/public/js/viewer.js  => base = .../Portal_PLI
    const scripts = Array.from(document.scripts);
    const me = scripts.find(s => s.src && /\/public\/js\/viewer\.js(\?.*)?$/.test(s.src));
    if (me) {
      const u = new URL(me.src, window.location.origin);
      return u.href.replace(/\/public\/js\/.*$/, "");
    }

    // 3) fallback amigável: tenta achar "/Portal_PLI" no caminho atual
    const { origin, pathname } = window.location;
    const m = pathname.match(/^(.*\/Portal_PLI)\b/);
    if (m) return origin + m[1];

    // 4) último recurso: só a origem (pode falhar se o app não estiver na raiz)
    return origin;
  }
  const BASE = computeBase();
  // console.log("[PLI.viewer] BASE =", BASE);

  // --- helpers ---------------------------------------------------------------
  function getEls() {
    const viewer = document.getElementById("pli-viewer");
    return {
      viewer,
      img: document.getElementById("pliViewerImg"),
      stage: viewer ? viewer.querySelector(".pli-viewer-stage") : null,
      zoomBadge: viewer ? viewer.querySelector("#pliViewerZoom") : null,
    };
  }

  function setVisible(v) {
    const { viewer } = getEls();
    const overlay = document.getElementById("pli-overlay");
    if (!viewer || !overlay) return;

    overlay.hidden = !v; // mostra/esconde overlay inteiro
    viewer.hidden = !v;  // mostra/esconde viewer dentro dele

    overlay.setAttribute("aria-hidden", v ? "false" : "true");
    viewer.setAttribute("aria-hidden", v ? "false" : "true");
  }


  function applyScale(scale) {
    const { img, zoomBadge } = getEls();
    if (!img) return;
    img.style.transform = `translate(-50%, -50%) scale(${scale})`;
    if (zoomBadge) zoomBadge.textContent = `${Math.round(scale * 100)}%`;
  }

  function computeFitScale() {
    const { img, stage } = getEls();
    if (!img || !stage) return 1;
    const r = stage.getBoundingClientRect();
    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;
    if (!w || !h || !r.width || !r.height) return 1;
    return Math.max(0.01, Math.min(r.width / w, r.height / h));
  }

  // --- API pública -----------------------------------------------------------
  PLI.viewer = {
    exibir(nomeArquivo) {
      const { viewer, img } = getEls();
      if (!viewer || !img) {
        console.warn("[PLI.viewer] viewer/img não encontrados no DOM.");
        return;
      }

      const srcBase = `${BASE}/public/images/${nomeArquivo}`;
      const src = `${srcBase}?v=${Date.now()}`; // cache-bust em dev

      img.onerror = () => {
        console.error("[PLI.viewer] Imagem não encontrada:", srcBase);
        alert("Imagem não disponível, aguarde atualizações.");
        img.removeAttribute("src"); // garante que não "abra" vazio
      };

      img.onload = () => {
        img.style.transform = "translate(-50%, -50%) scale(1)";
        setVisible(true);
        PLI.viewer.fit();
        console.log("[PLI.viewer] exibindo:", srcBase);
      };

      img.src = src; // só depois dos handlers

    },

    fechar() {
      const { img } = getEls();
      setVisible(false);
      if (img) img.removeAttribute("src");
      console.log("[PLI.viewer] fechado");
    },

    fit() {
      const s = computeFitScale(); applyScale(s); return s;
    },
  };

  // --- eventos globais (delegação) ------------------------------------------
  document.addEventListener("click", (e) => {
    const closeBtn = e.target.closest("[data-pli-action='close']");
    if (closeBtn) {
      e.preventDefault();
      PLI.viewer.fechar();
      return;
    }
    const fitBtn = e.target.closest("[data-pli-action='fit']");
    if (fitBtn) {
      e.preventDefault();
      PLI.viewer.fit();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") PLI.viewer.fechar();
  });
  // sincroniza estado ao fechar
  const oldClose = PLI.viewer.fechar;
  PLI.viewer.fechar = () => {
    oldClose();
    scale = 1;
    offsetX = 0;
    offsetY = 0;
    if (img) img.style.cursor = "grab";
  };

})();

// --- Interação de zoom e pan ------------------------------------
(() => {
  const { img, stage } = (function getEls() {
    return {
      img: document.getElementById("pliViewerImg"),
      stage: document.querySelector(".pli-viewer-stage"),
    };
  })();

  if (!img || !stage) return;

  let scale = 1;       // fator de zoom atual
  let isDragging = false;
  let startX, startY;
  let offsetX = 0, offsetY = 0;

  // aplica transform (pan + zoom)
  function updateTransform() {
    img.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(${scale})`;
  }

  // zoom com scroll
  stage.addEventListener("wheel", (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1.1 : 0.9; // zoom in/out
    scale = Math.max(0.1, Math.min(scale * delta, 10)); // limite de 0.1x a 10x
    updateTransform();
  });

  // início do arraste
  img.addEventListener("mousedown", (e) => {
    e.preventDefault();
    isDragging = true;
    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
    img.style.cursor = "grabbing";
  });

  // movimento
  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    offsetX = e.clientX - startX;
    offsetY = e.clientY - startY;
    updateTransform();
  });

  // fim do arraste
  document.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    img.style.cursor = "grab";
  });

  // reset para "Fit" já existente
  const oldFit = PLI.viewer.fit;
  PLI.viewer.fit = () => {
    scale = oldFit();  // pega o fit scale
    offsetX = 0;
    offsetY = 0;
    updateTransform();

  };
})();