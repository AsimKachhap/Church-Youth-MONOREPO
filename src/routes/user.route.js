import express from "express";
import { addUserDetails, getAllUsers } from "../controllers/user.controller.js";

import { multerUpload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/:id/user-details", multerUpload.single("photo"), addUserDetails);
router.get("/", getAllUsers);

export default router;
