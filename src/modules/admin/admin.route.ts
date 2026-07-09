import { Router } from "express";
import { authAsync } from "../../middleware/auth";
import { Role } from "../../../prisma/generated/prisma/client";
import { adminController } from "./admin.controller";

const router = Router();

router.get("/users", authAsync(Role.ADMIN), adminController.getAllUsers);
router.patch(
  "/users/:id",
  authAsync(Role.ADMIN),
  adminController.updateUserStatus,
);
router.get("/gears", authAsync(Role.ADMIN), adminController.getAllGearListings);
router.get(
  "/rentals",
  authAsync(Role.ADMIN),
  adminController.getAllRentalOrders,
);

export const adminRouter = router;
