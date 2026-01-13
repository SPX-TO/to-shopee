import db from "../db.js";

// Lista ADM
export function listTos(req, res) {
    const tos = db.prepare("SELECT * FROM tos ORDER BY cidade ASC").all();
    res.json(tos);
}

// Criar TO
export function createTo(req, res) {
    const { tipo, cidade, estado, codigo } = req.body;

    db.prepare(`
        INSERT INTO tos (tipo, cidade, estado, codigo)
        VALUES (?, ?, ?, ?)
    `).run(tipo, cidade, estado || null, codigo);

    res.json({ success: true });
}

// Obter único
export function getTo(req, res) {
    const to = db.prepare("SELECT * FROM tos WHERE id = ?").get(req.params.id);
    res.json(to);
}

// Atualizar
export function updateTo(req, res) {
    const { tipo, cidade, estado, codigo } = req.body;

    db.prepare(`
        UPDATE tos SET tipo=?, cidade=?, estado=?, codigo=? WHERE id=?
    `).run(tipo, cidade, estado || null, codigo, req.params.id);

    res.json({ success: true });
}

// Deletar
export function deleteTo(req, res) {
    db.prepare("DELETE FROM tos WHERE id = ?").run(req.params.id);
    res.json({ success: true });
}

// Busca pública
export function publicSearchTo(req, res) {
  const q = (req.query.q || "").toUpperCase();
  const like = `%${q}%`;

  const results = db.prepare(`
    SELECT * FROM tos
    WHERE
      UPPER(cidade) LIKE ?
      OR UPPER(codigo) LIKE ?
      OR UPPER(tipo) LIKE ?
    ORDER BY cidade ASC
  `).all(like, like, like);

  res.json(results);
}




