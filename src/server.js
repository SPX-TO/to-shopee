import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";

import { login, authMiddleware } from "./auth.js";
import { ROLES } from "./roles.js";
import {
  listTos,
  createTo,
  getTo,
  updateTo,
  deleteTo,
  publicSearchTo,
  usageReport
} from "./controllers/tosController.js";



import {
  listUsers,
  createUser
} from "./controllers/userController.js";

import { importExcel } from "./controllers/importController.js";

const app = express();
const upload = multer({ dest: "src/uploads/" });

// ------------------------------------------------------
// MIDDLEWARES BÁSICOS
// ------------------------------------------------------
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

// ------------------------------------------------------
// LOGIN / LOGOUT
// ------------------------------------------------------
app.post("/api/login", login);

app.post("/api/logout", (req, res) => {
  res.clearCookie("user");
  res.json({ success: true });
});

// ------------------------------------------------------
// STATUS DE LOGIN (PING DE SESSÃO)
// ------------------------------------------------------
app.get("/api/me", (req, res) => {
  const user = req.cookies.user;

  if (!user) {
    return res.status(401).json({ logged: false });
  }

  try {
    const parsed = typeof user === "string" ? JSON.parse(user) : user;
    return res.json({ logged: true, user: parsed });
  } catch {
    return res.status(401).json({ logged: false });
  }
});

// ------------------------------------------------------
// USUÁRIOS (somente SUPER)
// ------------------------------------------------------
app.get("/api/users", authMiddleware([ROLES.SUPER]), listUsers);
app.post("/api/users", authMiddleware([ROLES.SUPER]), createUser);

// ------------------------------------------------------
// BUSCA PÚBLICA DE TOs (SEM LOGIN)
// ------------------------------------------------------
app.get("/api/tos/public/search", publicSearchTo);

// ------------------------------------------------------
// TOs (ADMIN / SUPER)
// ------------------------------------------------------
app.get("/api/tos", authMiddleware([ROLES.ADMIN, ROLES.SUPER]), listTos);
app.post("/api/tos", authMiddleware([ROLES.ADMIN, ROLES.SUPER]), createTo);
app.get("/api/tos/:id", authMiddleware([ROLES.ADMIN, ROLES.SUPER]), getTo);
app.put("/api/tos/:id", authMiddleware([ROLES.ADMIN, ROLES.SUPER]), updateTo);
app.delete("/api/tos/:id", authMiddleware([ROLES.ADMIN, ROLES.SUPER]), deleteTo);

// ------------------------------------------------------
// RELATÓRIO DE USO (SOMENTE SUPER)
// ------------------------------------------------------
app.get(
  "/api/relatorio/uso",
  authMiddleware([ROLES.SUPER]),
  usageReport
);
// ------------------------------------------------------
// IMPORTAÇÃO EXCEL (ADMIN / SUPER)
// ------------------------------------------------------
app.post(
  "/api/import",
  authMiddleware([ROLES.ADMIN, ROLES.SUPER]),
  upload.single("excel"),
  importExcel
);

// ------------------------------------------------------
// SERVIDOR
// ------------------------------------------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🔥 TO Shopee Server rodando na porta", PORT);
});

// (rota de teste removida)
