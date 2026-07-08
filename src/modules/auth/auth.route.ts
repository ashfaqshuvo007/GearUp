import { Router } from "express";
import { authController } from "./auth.controller";
import { authAsync } from "../../middleware/auth";
import { Role } from "../../../prisma/generated/prisma/enums";

const router = Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.get(
  "/me",
  authAsync(Role.ADMIN, Role.CUSTOMER, Role.PROVIDER),
  authController.loggedInUser,
);

router.post("/refresh-token", authController.refreshToken);

export const authRouter = router;
