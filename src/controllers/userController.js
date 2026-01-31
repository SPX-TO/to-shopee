import db from "../db.js";
import bcrypt from "bcrypt";

export function listUsers(req, res) {
  res.json(
    db.prepare(
      "SELECT id, name, email, role, active FROM users"
    ).all()
  );
}

export function createUser(req, res) {
  const { name, email, password, role } = req.body;

  const hash = bcrypt.hashSync(password, 10);

  db.prepare(
    "INSERT INTO users (name, email, password_hash, role) VALUES (?,?,?,?)"
  ).run(name, email, hash, role);

  res.json({ success: true });
}
 // oi  nada foi alterado?
 // sdfsdfsdfsdfsdf 