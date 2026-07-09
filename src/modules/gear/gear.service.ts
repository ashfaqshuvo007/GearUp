import { prisma } from "../../lib/prisma";
import { buildQueryFilter } from "../../utils/queryFilter";

const getAllGears = async (query: Record<string, unknown>) => {
  const where = buildQueryFilter(query, {
    category: {
      field: "category",
      type: "equals",
      nestedField: "name",
      transform: (value) => value,
    },
    brand: {
      field: "brand",
      type: "equals",
      transform: (value) => value,
    },
    price: {
      field: "price",
      parser: (value) => {
        const explicitMatch = value.match(/^(gte|lte)\s*:\s*(\d+(?:\.\d+)?)$/i);

        if (explicitMatch?.[1] && explicitMatch[2]) {
          return {
            operator: explicitMatch[1].toLowerCase(),
            value: Number(explicitMatch[2]),
          };
        }

        const numericMatch = value.match(/^\d+(?:\.\d+)?$/);

        if (numericMatch) {
          return {
            operator: "gte",
            value: Number(value),
          };
        }

        return undefined;
      },
    },
  });

  return await prisma.gearItem.findMany({
    ...(where ? { where } : {}),
    include: {
      category: true,
    },
  });
};

const getGearItem = async (id: string) => {
  return await prisma.gearItem.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });
};

const addReview = async (
  gearId: string,
  userId: string,
  rating: number,
  content: string,
) => {
  const gearItem = await prisma.gearItem.findUnique({
    where: { id: gearId },
  });

  if (!gearItem) {
    throw new Error("Gear item not found.");
  }

  const review = await prisma.review.create({
    data: {
      itemId: gearId,
      customerId: userId,
      rating,
      content,
    },
  });

  return review;
};

export const gearService = {
  getAllGears,
  getGearItem,
  addReview,
};
