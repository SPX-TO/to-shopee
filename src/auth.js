import db from "./db.js";
import bcrypt from "bcrypt";

export function login(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "Dados inválidos." });
  }

  // Verifica se o usuário existe e está ativo (continua usando o banco)
  const user = db
    .prepare("SELECT * FROM users WHERE email = ? AND active = 1")
    .get(email);

  if (!user) {
    return res.status(401).json({ error: "Usuário não encontrado." });
  }

  // ------------------------------------------------------
  // LOGIN PROVISÓRIO (2 USUÁRIOS COM ROLES)
  // ------------------------------------------------------
  const USERS = [
    {
      email: process.env.ADMIN_EMAIL_1,
      password: process.env.ADMIN_PASSWORD_1,
      role: "SUPER",
    },
    {
      email: process.env.ADMIN_EMAIL_2,
      password: process.env.ADMIN_PASSWORD_2,
      role: "ADMIN",
    },
  ];

  const userConfig = USERS.find(
    (u) => u.email === email && u.password === senha
  );

  if (!userConfig) {
    return res.status(401).json({ error: "Credenciais inválidas." });
  }

  // COOKIE DE SESSÃO
  res.cookie(
    "user",
    JSON.stringify({
      id: user.id,
      role: userConfig.role,
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
