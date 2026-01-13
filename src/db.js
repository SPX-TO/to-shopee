import Database from "better-sqlite3";
import bcrypt from "bcrypt";

const db = new Database("./data/database.sqlite");

// Tabela de usuários já existia — mantida

// NOVA tabela de TOs
db.exec(`
    CREATE TABLE IF NOT EXISTS tos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo TEXT NOT NULL,     -- SOC / HUB / 3PL
        cidade TEXT NOT NULL,
        estado TEXT,            -- vazio para 3PL
        codigo TEXT NOT NULL UNIQUE
    );
`);

export default db;
