import { Router } from "express";
import { authAsync } from "../../middleware/auth";
import { Role } from "../../../prisma/generated/prisma/enums";
import { providerController } from "./provider.controller";

const router = Router();

router.post("/gears", authAsync(Role.PROVIDER), providerController.addGear);
router.get(
  "/gears",
  authAsync(Role.PROVIDER),
  providerController.getProviderGears,
);
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
  authAsync(Role.PROVIDER, Role.ADMIN),
  providerController.updateOrderStatus,
);

router.patch(
  "/gears/:id",
  authAsync(Role.PROVIDER, Role.ADMIN),
  providerController.updateGearStatus,
);

export const providerRouter = router;
