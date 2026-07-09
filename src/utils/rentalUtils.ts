import { prisma } from "../lib/prisma";
import type {
  IRentalItemPayload,
  IRentalOrderPayload,
} from "../modules/rental/rental.interface";

export const buildRentalCreateInput = (
  customerId: string,
  payload: {
    total: number;
    items: Array<{ itemId: string; orderQty: number; price: number }>;
    rentFrom: string;
    rentTill: string;
  },
) => {
  const rentFrom = new Date(payload.rentFrom);
  const rentTill = new Date(payload.rentTill);

  if (Number.isNaN(rentFrom.getTime()) || Number.isNaN(rentTill.getTime())) {
    throw new Error("Invalid date format for rentFrom or rentTill.");
  }

  if (rentTill <= rentFrom) {
    throw new Error("rentTill must be after rentFrom.");
  }

  return {
    name: `Rental Order - ${customerId}`,
    customerId,
    total: payload.total,
    rentFrom,
    rentTill,
  };
};

export const normalizeRentalOrderPayload = (payload: IRentalOrderPayload) => {
  const items = payload.items;
  const rentFrom = payload.rentFrom;
  const rentTill = payload.rentTill;

  if (!Array.isArray(items)) {
    throw new Error("items must be an array.");
  }

  if (typeof rentFrom !== "string" || typeof rentTill !== "string") {
    throw new Error("rentFrom and rentTill must be strings.");
  }

  const normalizedItems = items.map((item) => {
    if (typeof item !== "object" || item === null) {
      throw new Error("Each item must be an object.");
    }

    const record = item as IRentalItemPayload;
    const itemId = record.itemId;
    const orderQty = record.orderQty;
    const price = record.price;

    if (typeof itemId !== "string" || !itemId.trim()) {
      throw new Error("Each item must have a valid itemId.");
    }

    if (!Number.isFinite(Number(orderQty))) {
      throw new Error("Each item must have a valid orderQty.");
    }

    if (!Number.isFinite(Number(price))) {
      throw new Error("Each item must have a valid price.");
    }

    return {
      itemId,
      orderQty: Number(orderQty),
      price: Number(price),
    };
  });

  const total = normalizedItems.reduce(
    (sum, item) => sum + item.orderQty * item.price,
    0,
  );

  return {
    total,
    items: normalizedItems,
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
      orderItems: true,
      payment: true,
    },
  });
};
