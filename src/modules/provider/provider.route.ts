import { Router } from "express";
import { authAsync } from "../../middleware/auth";
import { Role } from "../../../prisma/generated/prisma/enums";
import { providerController } from "./provider.controller";

const router = Router();

router.post("/gears", authAsync(Role.PROVIDER), providerController.addGear);
router.put(
  "/gears/:id",
  authAsync(Role.PROVIDER),
  providerController.updateGear,
);
router.delete(
  "/gears/:id",
  authAsync(Role.PROVIDER),
  providerController.deleteGear,
);
router.get(
  "/orders",
  authAsync(Role.PROVIDER),
  providerController.getProviderOrders,
);
router.patch(
  "/orders/:id",
  authAsync(Role.PROVIDER),
  providerController.updateOrderStatus,
);

export const providerRouter = router;
