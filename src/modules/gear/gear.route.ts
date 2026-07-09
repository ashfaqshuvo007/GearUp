import { Router } from "express";
import { gearController } from "./gear.controller";
import { authAsync } from "../../middleware/auth";
import { Role } from "../../../prisma/generated/prisma/client";

const router = Router();

router.get("/", gearController.getAllGears);
router.get("/:id", gearController.getSingleGearItem);
router.post("/reviews", authAsync(Role.CUSTOMER), gearController.addReview);

export const gearRouter = router;
