import { prisma } from "../../lib/prisma";
import { stripeClient } from "../../lib/stripe";
import config from "../../config";
import type { INormalizeRentalOrderPayload } from "../rental/rental.interface";
import type Stripe from "stripe";

const createCheckoutSession = async (
  customerId: string,
  rentalOrderId: string,
  normalizedPayload: INormalizeRentalOrderPayload,
): Promise<Stripe.Checkout.Session> => {
  return await stripeClient.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "BDT",
          product_data: {
            name: `Gear rental - ${normalizedPayload.orderItemId}`,
          },
          unit_amount: Math.round(normalizedPayload.orderPrice * 100),
        },
        quantity: normalizedPayload.orderQty,
      },
    ],
    metadata: {
      rentalOrderId,
      customerId,
    },
    success_url: `${config.app_url}${config.base_url}/checkout/${rentalOrderId}?status=success`,
    cancel_url: `${config.app_url}${config.base_url}/checkout/${rentalOrderId}?status=cancelled`,
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 min expiry
  });
};

const getUsersAllPayments = async (customerId: string) => {
  const payments = await prisma.payment.findMany({
    where: { userid: customerId },
  });
  return payments;
};

const getPaymentDetailsById = async (paymentId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
  });

  if (!payment) {
    throw new Error("Payment not found.");
  }

  return payment;
};

export const paymentService = {
  createCheckoutSession,
  getUsersAllPayments,
  getPaymentDetailsById,
};
