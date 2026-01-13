document.getElementById("saveBtn").addEventListener("click", async () => {
    const senha = document.getElementById("senha").value.trim();
    const email = localStorage.getItem("reset_email");

    const err = document.getElementById("error");
    const ok = document.getElementById("success");

    err.textContent = "";
    ok.textContent = "";

    if (!senha) {
        err.textContent = "Digite uma senha.";
        return;
    }

    const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
    });

    if (!res.ok) {
        err.textContent = "Erro ao redefinir senha.";
        return;
    }

    ok.textContent = "Senha redefinida com sucesso!";

    setTimeout(() => {
        localStorage.removeItem("reset_email");
        window.location.href = "login.html";
    }, 1500);
});
