import express from "express";
import { collectUserDetails } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/:id/user-details", collectUserDetails);

export default router;
