import { Router } from "express";
import { paymentController } from "./payment.controller";
import { authAsync } from "../../middleware/auth";
import { Role } from "../../../prisma/generated/prisma/client";

const router = Router();

router.get(
  "/",
  authAsync(Role.CUSTOMER, Role.PROVIDER, Role.ADMIN),
  paymentController.getUsersAllPayments,
);

router.get(
  "/:id",
  authAsync(Role.CUSTOMER, Role.PROVIDER, Role.ADMIN),
  paymentController.getPaymentDetailsById,
);

export const paymentRouter = router;
