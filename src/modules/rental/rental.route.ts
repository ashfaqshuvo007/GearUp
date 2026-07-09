import { Router } from "express";
import { authAsync } from "../../middleware/auth";
import { Role } from "../../../prisma/generated/prisma/enums";
import { rentalController } from "./rental.controller";

const router = Router();

router.post("/", authAsync(Role.CUSTOMER), rentalController.createRentalOrder);
router.get("/", authAsync(Role.CUSTOMER), rentalController.getUserRentalOrders);
router.get("/:id", authAsync(Role.CUSTOMER), rentalController.getRentalOrderDetails);

export const rentalRouter = router;
