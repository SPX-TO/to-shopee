// -----------------------------------------
// Logout
// -----------------------------------------
document.getElementById("logoutBtn").addEventListener("click", () => {
    fetch("/api/logout", { method: "POST" })
        .then(() => window.location.href = "/login.html");
});


// -----------------------------------------
// Carregar usuários
// -----------------------------------------
async function loadUsers() {
    const res = await fetch("/api/users");
    const data = await res.json();

    const tbody = document.querySelector("#usersTable tbody");
    tbody.innerHTML = "";

    data.forEach(u => {
        tbody.innerHTML += `
            <tr>
                <td>${u.nome}</td>
                <td>${u.email}</td>
                <td>${u.role}</td>
                <td>${u.ativo ? "Ativo" : "Inativo"}</td>
                <td>
                    <button class="btn-small" onclick="resetSenha('${u.email}')">Resetar Senha</button>
                    <button class="btn-small" onclick="toggleUser('${u.email}', ${u.ativo})">
                        ${u.ativo ? "Desativar" : "Ativar"}
                    </button>
                </td>
            </tr>
        `;
    });
}

loadUsers();


// -----------------------------------------
// Criar novo usuário
// -----------------------------------------
document.getElementById("btnNovo").addEventListener("click", () => {
    const nome = prompt("Nome do usuário:");
    if (!nome) return;

    const email = prompt("Email do usuário:");
    if (!email) return;

    const role = prompt("Função (ADMIN / EDITOR):").toUpperCase();
    if (!["ADMIN", "EDITOR"].includes(role)) {
        alert("Função inválida!");
        return;
    }

    fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, role })
    })
        .then(r => r.json())
        .then(() => {
            alert("Usuário criado!");
            loadUsers();
        })
        .catch(() => alert("Erro ao criar usuário."));
});


// -----------------------------------------
// Reset de senha (envia código no email)
// -----------------------------------------
async function resetSenha(email) {
    if (!confirm(`Enviar código de redefinição para ${email}?`)) return;

    const res = await fetch("/api/reset/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    });

    if (res.ok) {
        alert("Código enviado por e-mail!");
    } else {
        alert("Erro ao enviar código.");
    }
}


// -----------------------------------------
// Ativar / desativar usuário
// -----------------------------------------
async function toggleUser(email, statusAtual) {
    const novoStatus = !statusAtual;

    const res = await fetch("/api/users/toggle", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, ativo: novoStatus })
    });

    if (res.ok) {
        alert("Status atualizado!");
        loadUsers();
    } else {
        alert("Erro ao alterar status.");
    }
}
