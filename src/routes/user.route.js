import express from "express";
import {
  addUserDetails,
  getAllUsers,
  getUserById,
  getUserDetailsById,
} from "../controllers/user.controller.js";

import { multerUpload } from "../middlewares/multer.middleware.js";
import { protectRoute, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/:id/user-details",
  protectRoute,
  multerUpload.single("photo"),
  addUserDetails
);
router.get("/:id/user-details", getUserDetailsById);
router.get("/", getAllUsers);
router.get("/:id", getUserById);

export default router;
