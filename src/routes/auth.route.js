import express from "express";

import { registerUser, login, logout } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", login);
router.post("/logout", logout);

export default router;
