let emailTemp = "";

// -----------------------------------------------
// PASSO 1 — Enviar código
// -----------------------------------------------
async function enviarCodigo() {
    const email = document.getElementById("email").value.trim();
    const msg = document.getElementById("msg1");

    msg.textContent = "Enviando...";

    const res = await fetch("/api/reset/send-code", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email })
    });

    const data = await res.json();

    if (data.success) {
        emailTemp = email; 
        msg.textContent = "Código enviado! Verifique seu e-mail.";
        msg.style.color = "green";
        document.getElementById("step1").style.display = "none";
        document.getElementById("step2").style.display = "block";
    } else {
        msg.textContent = data.message || "Erro ao enviar código.";
        msg.style.color = "red";
    }
}


// -----------------------------------------------
// PASSO 2 — Validar código
// -----------------------------------------------
async function validarCodigo() {
    const codigo = document.getElementById("codigo").value.trim();
    const msg = document.getElementById("msg2");

    const res = await fetch("/api/reset/verify-code", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email: emailTemp, codigo })
    });

    const data = await res.json();

    if (data.success) {
        msg.textContent = "Código validado!";
        msg.style.color = "green";
        document.getElementById("step2").style.display = "none";
        document.getElementById("step3").style.display = "block";
    } else {
        msg.textContent = "Código incorreto.";
        msg.style.color = "red";
    }
}


// -----------------------------------------------
// PASSO 3 — Salvar nova senha
// -----------------------------------------------
async function salvarSenha() {
    const s1 = document.getElementById("senha1").value.trim();
    const s2 = document.getElementById("senha2").value.trim();
    const msg = document.getElementById("msg3");

    if (s1.length < 4) {
        msg.textContent = "A senha deve ter pelo menos 4 caracteres.";
        msg.style.color = "red";
        return;
    }

    if (s1 !== s2) {
        msg.textContent = "As senhas não coincidem.";
        msg.style.color = "red";
        return;
    }

    const res = await fetch("/api/reset/update-password", {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            email: emailTemp,
            novaSenha: s1
        })
    });

    const data = await res.json();

    if (data.success) {
        msg.textContent = "Senha alterada com sucesso!";
        msg.style.color = "green";
        setTimeout(() => {
            window.location.href = "/login.html";
        }, 1500);
    } else {
        msg.textContent = "Erro ao atualizar senha.";
        msg.style.color = "red";
    }
}
