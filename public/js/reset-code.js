document.getElementById("verifyBtn").addEventListener("click", async () => {
    const code = document.getElementById("code").value.trim();
    const err = document.getElementById("error");

    const email = localStorage.getItem("reset_email");

    if (!email) {
        err.textContent = "Sessão expirada. Solicite novamente.";
        return;
    }

    const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code })
    });

    if (!res.ok) {
        err.textContent = "Código inválido ou expirado.";
        return;
    }

    window.location.href = "reset-newpass.html";
});
