import db from "../db.js";
import bcrypt from "bcrypt";

export function listUsers(req, res) {
  res.json(
    db.prepare("SELECT id,name,email,role,active FROM users").all()
  );
}

export function createUser(req, res) {
  const { name, email, password, role } = req.body;
  const h = bcrypt.hashSync(password, 10);

  db.prepare(
    "INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,?)"
  ).run(name, email, h, role);

  res.json({ success: true });
}

// 🔴 BOOTSTRAP TEMPORÁRIO — REMOVER DEPOIS
export function bootstrap(req, res) {
  const exists = db
    .prepare("SELECT id FROM users WHERE role = 'SUPER'")
    .get();

  if (exists) {
    return res.status(400).json({ error: "SUPER já existe" });
  }

  const hash = bcrypt.hashSync("admin", 10);

  db.prepare(
    "INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,?)"
  ).run("Admin", "admin@admin.com", hash, "SUPER");

  res.json({ success: true, user: "admin@admin.com", password: "admin" });
}
