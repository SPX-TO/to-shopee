import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

// ------------------------------------------------------
// GARANTE EXISTÊNCIA DA PASTA data/
// ------------------------------------------------------
const dataDir = path.join(process.cwd(), "data");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// ------------------------------------------------------
// ABERTURA DO BANCO
// ------------------------------------------------------
const dbPath = path.join(dataDir, "database.sqlite");
const db = new Database(dbPath);

// ------------------------------------------------------
// TABELA DE USUÁRIOS (NECESSÁRIA PARA LOGIN)
// ------------------------------------------------------
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL,
    active INTEGER DEFAULT 1
  );
`);

// ------------------------------------------------------
// TABELA DE TOs
// ------------------------------------------------------
db.exec(`
  CREATE TABLE IF NOT EXISTS tos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT NOT NULL,      -- SOC / HUB / 3PL
    cidade TEXT NOT NULL,
    estado TEXT,             -- vazio para 3PL
    codigo TEXT NOT NULL UNIQUE
  );
`);
db.exec(`
  CREATE TABLE IF NOT EXISTS usage_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    tipo_busca TEXT NOT NULL,
    termo TEXT NOT NULL
  );
`);


export default db;
