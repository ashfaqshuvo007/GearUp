import { prisma } from "../lib/prisma";
import type { IRentalOrderPayload } from "../modules/rental/rental.interface";

export const buildRentalCreateInput = (
  customerId: string,
  providerId: string,
  payload: {
    total: number;
    orderItemId: string;
    rentFrom: string;
    rentTill: string;
  },
) => {
  const rentFrom = new Date(payload.rentFrom);
  const rentTill = new Date(payload.rentTill);

  if (Number.isNaN(rentFrom.getTime()) || Number.isNaN(rentTill.getTime())) {
    throw new Error("Invalid date format for From Date or To Date.");
  }

  if (rentTill <= rentFrom) {
    throw new Error("To Date must be after From Date.");
  }

  return {
    name: `Rental Order - ${customerId}`,
    customerId,
    providerId,
    total: payload.total,
    orderItemId: payload.orderItemId,
    rentFrom,
    rentTill,
  };
};

export const normalizeRentalOrderPayload = (payload: IRentalOrderPayload) => {
  const orderItemId = payload.orderItemId;
  const rentFrom = payload.rentFrom;
  const rentTill = payload.rentTill;

  if (typeof rentFrom !== "string" || typeof rentTill !== "string") {
    throw new Error("From date and To Date must be strings.");
  }
  const orderQty = payload.orderQty;
  const orderPrice = payload.price;
  const total = orderQty * orderPrice;

  return {
    total,
    orderItemId,
    orderQty,
    orderPrice,
    rentFrom,
    rentTill,
  };
};

export const getRentalOrderWithRelations = async (orderId: string) => {
  return prisma.rentalOrder.findUnique({
    where: { id: orderId },
    include: {
      customer: {
        omit: {
          password: true,
        },
      },
      orderItem: true,
      payment: true,
    },
  });
};
