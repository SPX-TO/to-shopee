document.getElementById("loginBtn").addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const error = document.getElementById("error");

    error.textContent = "";

    if (!email || !senha) {
        error.textContent = "Preencha todos os campos.";
        return;
    }

    const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, senha })
});


    const data = await res.json();

    if (!res.ok) {
        error.textContent = data.error || "Erro ao autenticar.";
        return;
    }

    // sucesso → abre painel de TOs
    window.location.href = "index.html";
});
