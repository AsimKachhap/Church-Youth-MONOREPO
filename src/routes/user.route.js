import express from "express";
import { addUserDetails } from "../controllers/user.controller.js";

import { multerUpload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/:id/user-details", multerUpload.single("photo"), addUserDetails);

export default router;
