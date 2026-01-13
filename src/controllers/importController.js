import ExcelJS from "exceljs";
import db from "../db.js";

/*
  Esperado no Excel:

  tipo | cidade | estado | codigo

  estado pode ser vazio quando tipo = 3PL
*/

export async function importExcel(req, res) {
    try {
        if (!req.file) {
            return res.json({ success: false, message: "Nenhum arquivo enviado." });
        }

        const filePath = req.file.path;

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);

        const sheet = workbook.worksheets[0];

        if (!sheet) {
            return res.json({ success: false, message: "Planilha vazia." });
        }

        // Preparar inserção no banco
        const insert = db.prepare(`
            INSERT OR REPLACE INTO tos (tipo, cidade, estado, codigo)
            VALUES (?, ?, ?, ?)
        `);

        let total = 0;

        sheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber === 1) return; // pular o cabeçalho

            const tipo = String(row.getCell(1).value || "").trim().toUpperCase();
            const cidade = String(row.getCell(2).value || "").trim();
            const estado = String(row.getCell(3).value || "").trim();
            const codigo = String(row.getCell(4).value || "").trim().toUpperCase();

            // Ignorar linhas incompletas
            if (!cidade || !codigo || !tipo) return;

            // Remover estado quando é 3PL
            const estadoFinal = tipo === "3PL" ? null : estado || null;

            insert.run(tipo, cidade, estadoFinal, codigo);
            total++;
        });

        res.json({
            success: true,
            message: "Importação concluída.",
            linhas_importadas: total
        });

    } catch (err) {
        console.error("Erro ao importar Excel:", err);
        res.json({
            success: false,
            message: "Erro ao processar o arquivo."
        });
    }
}
