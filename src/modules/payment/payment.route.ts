import { Router } from "express";
import { paymentController } from "./payment.controller";
import { authAsync } from "../../middleware/auth";
import { Role } from "../../../prisma/generated/prisma/client";

const router = Router();

router.post(
  "/checkout",
  authAsync(Role.CUSTOMER, Role.PROVIDER, Role.ADMIN),
  paymentController.createCheckoutSession,
);

export const paymentRouter = router;
