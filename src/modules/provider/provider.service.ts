import type { OrderStatus } from "../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import {
  buildGearCreateInput,
  buildGearUpdateInput,
  normalizeOrderStatus,
} from "../../utils/providerUtils";
import type {
  IAddGearItemPayload,
  IUpdateGearItemPayload,
} from "./provider.interface";

const addGear = async (providerId: string, payload: IAddGearItemPayload) => {
  const data = buildGearCreateInput(providerId, payload);

  const category = await prisma.category.findUnique({
    where: { name: data.categoryName },
  });

  if (!category) {
    await prisma.category.create({
      data: {
        name: data.categoryName,
      },
    });
  }

  return await prisma.gearItem.create({
    data,
    include: {
      category: true,
      provider: {
        omit: {
          password: true,
        },
      },
    },
  });
};

const updateGear = async (id: string, payload: IUpdateGearItemPayload) => {
  const existingGear = await prisma.gearItem.findUnique({ where: { id } });

  if (!existingGear) {
    throw new Error("Gear not found.");
  }

  const data = buildGearUpdateInput(payload);

  if (data.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId as string },
    });

    if (!category) {
      throw new Error("Category not found.");
    }
  }

  return await prisma.gearItem.update({
    where: { id },
    data,
    include: {
      category: true,
      provider: {
        omit: {
          password: true,
        },
      },
    },
  });
};

const deleteGear = async (id: string) => {
  const existingGear = await prisma.gearItem.findUnique({ where: { id } });

  if (!existingGear) {
    throw new Error("Gear not found.");
  }

  return await prisma.gearItem.delete({
    where: { id },
    include: { category: true },
  });
};

const getProviderOrders = async (providerId: string) => {
  return await prisma.rentalOrder.findMany({
    where: {
      providerId: providerId,
      status: {
        not: "CANCELED",
      },
    },
  });
};

//TODO: Need to work on this after Order
const updateOrderStatus = async (id: string, status: OrderStatus) => {
  const existingOrder = await prisma.rentalOrder.findUnique({ where: { id } });

  if (!existingOrder) {
    throw new Error("Order not found.");
  }

  return await prisma.rentalOrder.update({
    where: { id },
    data: {
      status: normalizeOrderStatus(status),
    },
  });
};

export const providerService = {
  addGear,
  updateGear,
  deleteGear,
  getProviderOrders,
  updateOrderStatus,
};
