import express from "express";
import { authMiddleware } from "../auth.js";
import { ROLES } from "../roles.js";

import {
  listTos,
  createTo,
  getTo,
  updateTo,
  deleteTo,
  publicSearchTo
} from "../controllers/tosController.js";

const router = express.Router();


// ------------------------------------------------------
// 🌍 ROTA PÚBLICA (BUSCA SEM LOGIN)
// ------------------------------------------------------
// ⚠️ PRECISA VIR ANTES DAS ROTAS COM :id
router.get("/public/search", publicSearchTo);


// ------------------------------------------------------
// 🔒 ROTAS ADMINISTRATIVAS (PROTEGIDAS)
// ------------------------------------------------------
router.get("/", authMiddleware([ROLES.ADMIN, ROLES.SUPER]), listTos);

router.post("/", authMiddleware([ROLES.ADMIN, ROLES.SUPER]), createTo);

router.get("/:id", authMiddleware([ROLES.ADMIN, ROLES.SUPER]), getTo);

router.put("/:id", authMiddleware([ROLES.ADMIN, ROLES.SUPER]), updateTo);

router.delete("/:id", authMiddleware([ROLES.ADMIN, ROLES.SUPER]), deleteTo);


export default router;
