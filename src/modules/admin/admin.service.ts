import type { ActiveStatus } from "../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const updateUserStatus = async (id: string, status: ActiveStatus) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new Error("User not found.");
  }

  return await prisma.user.update({
    where: { id },
    data: { status },
    omit: {
      password: true,
    },
  });
};

const getAllGearListings = async () => {
  return await prisma.gearItem.findMany({
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

const getAllRentalOrders = async () => {
  return await prisma.rentalOrder.findMany({
    include: {
      customer: {
        omit: { password: true },
      },
      orderItem: true,
      payment: true,
    },
  });
};

export const adminService = {
  getAllUsers,
  updateUserStatus,
  getAllGearListings,
  getAllRentalOrders,
};
