import express from "express";
import { sendCodeEmail, verifyCode, updatePassword } from "../controllers/resetController.js";

const router = express.Router();

router.post("/send-code", sendCodeEmail);
router.post("/verify-code", verifyCode);
router.put("/update-password", updatePassword);

export default router;
