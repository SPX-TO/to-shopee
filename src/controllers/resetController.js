import db from "../db.js";
import bcrypt from "bcrypt";
import mailgun from "mailgun-js";

const mg = mailgun({
    apiKey: process.env.MAILGUN_KEY,
    domain: process.env.MAILGUN_DOMAIN
});

// Armazena códigos de verificação temporários
const codigos = {};


// ----------------------------------------------------------
// 1 — Enviar código por e-mail
// ----------------------------------------------------------
export function sendCodeEmail(req, res) {
    const { email } = req.body;

    const user = db.prepare("SELECT * FROM users WHERE email=?").get(email);
    if (!user) {
        return res.json({ success: false, message: "Email não encontrado." });
    }

    const codigo = (Math.floor(100000 + Math.random() * 900000)).toString();
    codigos[email] = codigo;

    mg.messages().send({
        from: "TO Shopee <no-reply@mg.dibentto.com.br>",
        to: email,
        subject: "Código para redefinir senha (TO Shopee)",
        text: `Seu código de redefinição é: ${codigo}`
    }, (error, body) => {
        if (error) {
            console.error("Erro ao enviar email:", error);
            return res.json({ success: false, message: "Erro ao enviar e-mail." });
        }

        res.json({ success: true });
    });
}


// ----------------------------------------------------------
// 2 — Validar código
// ----------------------------------------------------------
export function verifyCode(req, res) {
    const { email, codigo } = req.body;

    if (!codigos[email]) {
        return res.json({ success: false, message: "Nenhum código enviado para este email." });
    }

    if (codigos[email] !== codigo) {
        return res.json({ success: false, message: "Código incorreto." });
    }

    res.json({ success: true });
}


// ----------------------------------------------------------
// 3 — Atualizar senha
// ----------------------------------------------------------
export function updatePassword(req, res) {
    const { email, novaSenha } = req.body;

    const hash = bcrypt.hashSync(novaSenha, 10);

    db.prepare("UPDATE users SET senha=? WHERE email=?")
        .run(hash, email);

    // Remove o código após uso
    delete codigos[email];

    res.json({ success: true });
}
