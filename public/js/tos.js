// ======================================================
// BUSCA PÚBLICA DE TOs (HOME)
// ======================================================

const buscaInput = document.getElementById("buscaInput");
const resultadosDiv = document.getElementById("resultados");
const erroDiv = document.getElementById("erro");

let timeoutBusca = null;

if (buscaInput) {
  buscaInput.addEventListener("input", () => {
    const termo = buscaInput.value.trim();

    // limpa tudo
    resultadosDiv.innerHTML = "";
    erroDiv.textContent = "";

    // evita busca com menos de 2 caracteres
    if (termo.length < 2) {
      if (termo.length === 1) {
        erroDiv.textContent =
          "Digite pelo menos 2 caracteres para buscar.";
        erroDiv.style.color = "red";
      }
      return;
    }

    clearTimeout(timeoutBusca);

    timeoutBusca = setTimeout(() => {
      buscarTosPublicas(termo);
    }, 300);
  });
}

async function buscarTosPublicas(termo) {
  try {
    const res = await fetch(
      `/api/tos/public/search?q=${encodeURIComponent(termo)}`
    );

    const tos = await res.json();
    resultadosDiv.innerHTML = "";

    if (!Array.isArray(tos) || tos.length === 0) {
      erroDiv.textContent = "Nenhuma TO encontrada.";
      erroDiv.style.color = "#555";
      return;
    }

    tos.forEach(t => {
      const tipoClass =
        t.tipo === "3PL" ? "t3pl" : t.tipo.toLowerCase();

      resultadosDiv.innerHTML += `
        <div class="to-item">
          <span class="badge ${tipoClass}">${t.tipo}</span>

          <div class="to-info">
            <strong>${t.cidade}</strong>
            <span class="to-codigo">${t.codigo}</span>
          </div>
        </div>
      `;
    });

  } catch (err) {
    erroDiv.textContent = "Erro ao buscar TOs.";
    erroDiv.style.color = "red";
  }
}

// ======================================================
// LOGIN MODAL (HOME)
// ======================================================

function abrirLoginModal() {
  document.getElementById("loginModal").classList.remove("hidden");

  // foca no email (UX)
  const email = document.getElementById("loginEmail");
  if (email) email.focus();
}

function fecharLoginModal() {
  document.getElementById("loginModal").classList.add("hidden");
}

async function loginModal() {
  const email = document.getElementById("loginEmail").value.trim();
  const senha = document.getElementById("loginSenha").value.trim();
  const errorDiv = document.getElementById("loginModalError");

  errorDiv.textContent = "";

  if (!email || !senha) {
    errorDiv.textContent = "Preencha e-mail e senha.";
    return;
  }

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });

    const data = await res.json();

    if (!res.ok) {
      errorDiv.textContent =
        data.error || "Erro ao autenticar.";
      return;
    }

    // sucesso → vai para admin
    window.location.href = "tos-admin.html";

  } catch {
    errorDiv.textContent =
      "Erro de conexão com o servidor.";
  }
}

// ======================================================
// ABRIR MODAL AUTOMATICAMENTE SE VEIO DO ADM
// ======================================================

(function () {
  const params = new URLSearchParams(window.location.search);

  if (params.get("login") === "required") {
    abrirLoginModal();

    if (erroDiv) {
      erroDiv.textContent =
        "Para acessar o administrativo é necessário estar logado.";
      erroDiv.style.color = "red";
    }

    // limpa a URL
    window.history.replaceState({}, document.title, "/");
  }
})();
