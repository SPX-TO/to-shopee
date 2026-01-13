// ------------------------------------------------------
// LOGOUT
// ------------------------------------------------------
document.getElementById("logoutBtn").addEventListener("click", async () => {
  await fetch("/api/logout", {
    method: "POST",
    credentials: "include"
  });

  window.location.href = "index.html";
});


// ------------------------------------------------------
// VERIFICA LOGIN (PROTEÇÃO DA TELA)
// ------------------------------------------------------
(async function verificarLogin() {
  try {
    const res = await fetch("/api/me", {
      credentials: "include"
    });

    if (!res.ok) {
      window.location.href = "/?login=required";
    }
  } catch {
    window.location.href = "/?login=required";
  }
})();


// ------------------------------------------------------
// IMPORTAR PLANILHA
// ------------------------------------------------------
async function enviarExcel() {
  const input = document.getElementById("excelFile");
  const status = document.getElementById("status");

  status.textContent = "";
  status.style.color = "#555";

  if (!input.files.length) {
    status.textContent = "Selecione um arquivo Excel para importar.";
    status.style.color = "red";
    return;
  }

  const formData = new FormData();
  formData.append("excel", input.files[0]);

  status.textContent = "Importando planilha...";
  status.style.color = "#555";

  try {
    const res = await fetch("/api/import", {
      method: "POST",
      credentials: "include",
      body: formData
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      status.textContent =
        data.error || "Erro ao importar a planilha.";
      status.style.color = "red";
      return;
    }

    status.textContent = "Importação concluída com sucesso!";
    status.style.color = "green";
    input.value = "";

  } catch (err) {
    status.textContent = "Erro de conexão com o servidor.";
    status.style.color = "red";
  }
}

