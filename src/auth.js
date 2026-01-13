import db from "./db.js";
import bcrypt from "bcrypt";

export function login(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "Dados inválidos." });
  }

  const user = db
    .prepare("SELECT * FROM users WHERE email = ? AND active = 1")
    .get(email);

  if (!user) {
    return res.status(401).json({ error: "Usuário não encontrado." });
  }

  // LOGIN PROVISÓRIO (DESENVOLVIMENTO)
  if (senha !== "admin123") {
    return res.status(401).json({ error: "Senha incorreta." });
  }

  // COOKIE DE SESSÃO (STRING JSON)
  res.cookie(
    "user",
    JSON.stringify({
      id: user.id,
      role: user.role,
    }),
    {
      httpOnly: true,
      sameSite: "lax",
    }
  );

  res.json({ success: true });
}

export function authMiddleware(roles = []) {
  return (req, res, next) => {
    if (!req.cookies.user) {
      return res.status(401).json({ error: "Não autenticado." });
    }

    let user;
    try {
      user = JSON.parse(req.cookies.user);
      user.role = user.role.toUpperCase();
    } catch {
      return res.status(401).json({ error: "Sessão inválida." });
    }

    if (roles.length && !roles.includes(user.role)) {
      return res.status(403).json({ error: "Sem permissão." });
    }

    req.user = user;
    next();
  };
}
