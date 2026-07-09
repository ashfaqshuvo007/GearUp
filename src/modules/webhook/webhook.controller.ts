import type { Request, Response, NextFunction } from "express";
import Stripe from "stripe";
import { stripeClient } from "../../lib/stripe";
import config from "../../config";
import httpStatus from "http-status";
import sendResponse from "../../utils/sendReponse";
import { prisma } from "../../lib/prisma";

const handleStripeWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const signature = req.headers["stripe-signature"]!;

  // Handle the webhook event
  let event;

  try {
    event = stripeClient.webhooks.constructEvent(
      req.body, // raw Buffer — see route setup
      signature,
      config.stripe_webhook_secret as string,
    );
  } catch (error: any) {
    console.error("Webhook signature verification failed:", error);
    return res
      .status(httpStatus.BAD_REQUEST)
      .send("Webhook signature verification failed.");
  }
  console.log(event);

  switch (event.type) {
    case "checkout.session.completed": {
      try {
        const session = event.data.object as Stripe.Checkout.Session;
        const rentalOrderId = session.metadata?.rentalOrderId;

        if (!rentalOrderId) {
          console.error("No rentalOrderId in session metadata");
          break;
        }

        await prisma.$transaction([
          prisma.payment.update({
            where: { transactionId: session.id },
            data: {
              status: "COMPLETED",
            },
          }),
          prisma.rentalOrder.update({
            where: { id: rentalOrderId },
            data: { status: "CONFIRMED" },
          }),
        ]);
      } catch (error) {
        console.error("Failed to process checkout.session.completed:", error);
      }

      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      const rentalOrderId = session.metadata?.rentalOrderId;

      if (!rentalOrderId) break;

      await prisma.$transaction([
        prisma.payment.update({
          where: { transactionId: session.id },
          data: { status: "FAILED" },
        }),
        prisma.rentalOrder.update({
          where: { id: rentalOrderId },
          data: { status: "FAILED" },
        }),
      ]);
      break;
    }
    default:
      break;
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rental order updated after payment successfully!",
    data: { received: true },
  });
};

export const webhookController = {
  handleStripeWebhook,
};
