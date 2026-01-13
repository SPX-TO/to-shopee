// ======================================================
// PROTEÇÃO DE ACESSO — SE NÃO ESTIVER LOGADO, VOLTA HOME
// ======================================================
(async function verificarLogin() {
  try {
    const res = await fetch("/api/me", { credentials: "include" });
    const data = await res.json();

    if (!data.logged) {
      window.location.href = "/?login=required";
    }
  } catch {
    window.location.href = "/?login=required";
  }
})();

// ======================================================
// LOGOUT
// ======================================================
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await fetch("/api/logout", {
    method: "POST",
    credentials: "include"
  });
  window.location.href = "index.html";
});

// ======================================================
// ELEMENTOS GLOBAIS
// ======================================================
const tosList = document.getElementById("tos-list");
const listaWrapper = document.getElementById("listaWrapper");
const buscaInput = document.getElementById("buscaInput");
const buscaMsg = document.getElementById("buscaAdminMsg");

// ======================================================
// MENSAGENS (UX)
// ======================================================
function showMsg(texto, tipo = "success") {
  buscaMsg.textContent = texto;
  buscaMsg.style.color = tipo === "error" ? "red" : "green";

  setTimeout(() => {
    buscaMsg.textContent = "";
  }, 4000);
}

// ======================================================
// BUSCA ADMIN (2+ caracteres)
// ======================================================
buscaInput.addEventListener("input", async () => {
  const termo = buscaInput.value.trim();

  // menos de 2 caracteres → não busca nada
  if (termo.length < 2) {
    listaWrapper.classList.add("hidden");
    tosList.innerHTML = "";

    if (termo.length === 1) {
      buscaMsg.textContent = "Digite pelo menos 2 caracteres.";
      buscaMsg.style.color = "red";
    } else {
      buscaMsg.textContent = "";
    }
    return;
  }

  buscaMsg.textContent = "Buscando...";
  buscaMsg.style.color = "#555";

  const res = await fetch(
    `/api/tos/public/search?q=${encodeURIComponent(termo)}`
  );
  const tos = await res.json();

  tosList.innerHTML = "";

  if (!tos.length) {
    listaWrapper.classList.remove("hidden");
    buscaMsg.textContent = "Nenhuma TO encontrada.";
    buscaMsg.style.color = "#000";
    return;
  }

  buscaMsg.textContent = "";
  listaWrapper.classList.remove("hidden");

  tos.forEach(t => {
    const tipoClass = t.tipo === "3PL" ? "t3pl" : t.tipo.toLowerCase();

    tosList.innerHTML += `
      <div class="to-item">
        <div class="to-left">
          <span class="badge ${tipoClass}">${t.tipo}</span>
          <strong>${t.cidade}</strong>
          <span>
            ${t.codigo}${t.estado ? " (" + t.estado + ")" : ""}
          </span>
        </div>

        <div class="to-actions">
          <button onclick="abrirModalEditarTO(${t.id})">Editar</button>
          <button class="btn-delete" onclick="excluirTo(${t.id})">
            Excluir
          </button>
        </div>
      </div>
    `;
  });
});

// ======================================================
// MODAL CRIAR TO
// ======================================================
window.abrirModalCriarTO = function () {
  document.getElementById("modalCriarTO").classList.remove("hidden");
};

window.fecharModalCriarTO = function () {
  document.getElementById("modalCriarTO").classList.add("hidden");
};

// ======================================================
// CRIAR TO
// ======================================================
window.salvarNovaTO = async function () {
  const tipo = document.getElementById("novoTipo").value;
  const cidade = document.getElementById("novoCidade").value.trim();
  const estado = document.getElementById("novoEstado").value.trim().toUpperCase();
  const codigo = document.getElementById("novoCodigo").value.trim().toUpperCase();

  if (!cidade || !codigo) {
    showMsg("Preencha cidade e código.", "error");
    return;
  }

  const res = await fetch("/api/tos", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tipo,
      cidade,
      estado: tipo === "3PL" ? null : estado,
      codigo
    })
  });

  if (!res.ok) {
    showMsg("Erro ao criar TO.", "error");
    return;
  }

  showMsg("TO criada com sucesso!");
  fecharModalCriarTO();

  // limpa campos
  document.getElementById("novoCidade").value = "";
  document.getElementById("novoEstado").value = "";
  document.getElementById("novoCodigo").value = "";

  // NÃO listar tudo automaticamente
  buscaInput.value = "";
  tosList.innerHTML = "";
  listaWrapper.classList.add("hidden");
};

// ======================================================
// MODAL EDITAR
// ======================================================
window.abrirModalEditarTO = async function (id) {
  const res = await fetch(`/api/tos/${id}`, {
    credentials: "include"
  });
  const to = await res.json();

  document.getElementById("editToId").value = to.id;
  document.getElementById("editTipo").value = to.tipo;
  document.getElementById("editCidade").value = to.cidade;
  document.getElementById("editEstado").value = to.estado || "";
  document.getElementById("editCodigo").value = to.codigo;

  document.getElementById("modalEditTO").classList.remove("hidden");
};

window.fecharModalTO = function () {
  document.getElementById("modalEditTO").classList.add("hidden");
};

// ======================================================
// SALVAR EDIÇÃO
// ======================================================
window.salvarEdicaoTO = async function () {
  const id = document.getElementById("editToId").value;

  const res = await fetch(`/api/tos/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tipo: document.getElementById("editTipo").value,
      cidade: document.getElementById("editCidade").value.trim(),
      estado: document.getElementById("editEstado").value.trim().toUpperCase(),
      codigo: document.getElementById("editCodigo").value.trim().toUpperCase()
    })
  });

  if (!res.ok) {
    showMsg("Erro ao salvar alterações.", "error");
    return;
  }

  showMsg("TO atualizada com sucesso!");
  fecharModalTO();
};

// ======================================================
// EXCLUIR TO
// ======================================================
window.excluirTo = async function (id) {
  if (!confirm("Tem certeza que deseja excluir esta TO?")) return;

  const res = await fetch(`/api/tos/${id}`, {
    method: "DELETE",
    credentials: "include"
  });

  if (!res.ok) {
    showMsg("Erro ao excluir TO.", "error");
    return;
  }

  showMsg("TO excluída com sucesso!");
};
