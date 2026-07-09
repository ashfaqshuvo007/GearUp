import { prisma } from "../../lib/prisma";
import {
  buildRentalCreateInput,
  getRentalOrderWithRelations,
  normalizeRentalOrderPayload,
} from "../../utils/rentalUtils";
import { paymentService } from "../payment/payment.service";
import type { IRentalOrderPayload } from "./rental.interface";

const createRentalOrder = async (
  customerId: string,
  payload: IRentalOrderPayload,
) => {
  const orderItemId = payload.orderItemId;

  const orderItem = await prisma.gearItem.findUnique({
    where: { id: orderItemId },
  });

  if (!orderItem) {
    throw new Error("Order item not found.");
  }

  if (orderItem.quantity < payload.orderQty) {
    throw new Error(
      `Insufficient quantity available. Requested: ${payload.orderQty}, Available: ${orderItem.quantity}`,
    );
  }

  const providerId = orderItem.providerId;

  const normalizedPayload = normalizeRentalOrderPayload(payload);
  const rentalData = buildRentalCreateInput(
    customerId,
    providerId,
    normalizedPayload,
  );

  // Step 1: create the order
  const createdOrder = await prisma.$transaction(async (tx) => {
    const order = await tx.rentalOrder.create({
      data: {
        ...rentalData,
        status: "PENDING_PAYMENT",
      },
    });
    return order;
  });

  // Step 2: call Stripe OUTSIDE the DB transaction (network call, don't hold a DB tx open for it)
  let session;
  try {
    session = await paymentService.createCheckoutSession(
      customerId,
      createdOrder.id,
      normalizedPayload,
    );
  } catch (err) {
    // Stripe call failed — release the reservation and mark order failed
    await prisma.$transaction([
      prisma.rentalOrder.update({
        where: { id: createdOrder.id },
        data: { status: "FAILED" },
      }),
    ]);
    throw err;
  }

  const totalAmount = normalizedPayload.orderQty * normalizedPayload.orderPrice;

  const orderItemDetails = await prisma.gearItem.findUnique({
    where: { id: normalizedPayload.orderItemId },
  });

  if (!orderItemDetails) {
    throw new Error("Order item not found.");
  }

  // Step 3: persist the payment record now that we have the session id
  await prisma.payment.create({
    data: {
      userid: customerId,
      stripeCustomerId: customerId,
      method: "card",
      provider: orderItemDetails.providerId,
      rentalOrderid: createdOrder.id,
      transactionId: session.id,
      amount: Math.round(totalAmount * 100),
      paidAt: new Date(Date.now()),
      currency: "BDT",
      status: "PENDING",
    },
  });

  const order = await prisma.rentalOrder.findUnique({
    where: { id: createdOrder.id },
    include: {
      customer: { omit: { password: true } },
      orderItem: true,
      payment: true,
    },
  });

  if (!order) {
    throw new Error("Failed to retrieve the created rental order.");
  }

  return {
    order,
    checkoutUrl: session.url,
  };
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
        where: { id: order.orderItemId },
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

  return order;
};

export const rentalService = {
  createRentalOrder,
  getUserRentalOrders,
  getRentalOrderDetails,
};
