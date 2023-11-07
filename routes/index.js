import express from "express";

const router = express.Router();

import {
  loginController,
  registerController,
  userController,
  refreshController,
} from "../controller/index.js";
import auth from "../middleware/auth.js";

router.post("/register", registerController.register);
router.post("/login", loginController.login);
router.post("/logout", auth, loginController.logout);

router.get("/me", auth, userController.me);
router.post("/refresh", refreshController.refresh);

export default router;
