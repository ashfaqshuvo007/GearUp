import { prisma } from "../../lib/prisma";
import {
  buildRentalCreateInput,
  getRentalOrderWithRelations,
  normalizeRentalOrderPayload,
} from "../../utils/rentalUtils";
import type { IRentalOrderPayload } from "./rental.interface";

const createRentalOrder = async (
  customerId: string,
  payload: IRentalOrderPayload,
) => {
  const normalizedPayload = normalizeRentalOrderPayload(payload);

  const rentalData = buildRentalCreateInput(customerId, normalizedPayload);

  return await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.rentalOrder.create({
      data: rentalData,
    });

    await Promise.all(
      normalizedPayload.items.map((item) =>
        tx.gearItem.update({
          where: { id: item.itemId },
          data: {
            rentalOrderId: createdOrder.id,
          },
        }),
      ),
    );

    const order = await tx.rentalOrder.findUnique({
      where: { id: createdOrder.id },
      include: {
        customer: {
          omit: { password: true },
        },
        orderItems: true,
        payment: true,
      },
    });

    if (!order) {
      throw new Error("Failed to retrieve the created rental order.");
    }

    return order;
  });
};

const getUserRentalOrders = async (customerId: string) => {
  const orders = await prisma.rentalOrder.findMany({
    where: { customerId },
    include: {
      customer: {
        omit: { password: true },
      },
      payment: true,
    },
  });

  const ordersWithItems = await Promise.all(
    orders.map(async (order) => {
      const orderItems = await prisma.gearItem.findMany({
        where: { rentalOrderId: order.id },
      });

      return {
        ...order,
        orderItems,
      };
    }),
  );

  return ordersWithItems;
};

const getRentalOrderDetails = async (id: string) => {
  const order = await getRentalOrderWithRelations(id);

  if (!order) {
    throw new Error("Rental order not found.");
  }

  const orderItems = await prisma.gearItem.findMany({
    where: { rentalOrderId: order.id },
  });

  return {
    ...order,
    orderItems,
  };
};

export const rentalService = {
  createRentalOrder,
  getUserRentalOrders,
  getRentalOrderDetails,
};
