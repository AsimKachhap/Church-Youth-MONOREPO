import express from "express";
import {
  addUserDetails,
  getAllUsers,
  getUserById,
  getUserDetailsById,
  getMyProfile,
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

router.get("/me", getMyProfile); // !!! The order of the route matters. By placin the .../users/me route before .../users/:id  "me" will not be treated as an id
router.get("/:id", getUserById);

export default router;
