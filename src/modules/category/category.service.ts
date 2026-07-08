import { prisma } from "../../lib/prisma";

const getAllCategories = async () => {
  return await prisma.category.findMany({
    include: {
      gearItems: true,
    },
  });
};

export const categoryService = {
  getAllCategories,
};
