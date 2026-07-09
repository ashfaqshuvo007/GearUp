import {
  ActiveStatus,
  OrderStatus,
} from "../../prisma/generated/prisma/client";

export const isValidStatus = (status: string): status is ActiveStatus => {
  return Object.values(ActiveStatus).includes(status as ActiveStatus);
};

export const isValidOrderStatus = (status: string): status is OrderStatus => {
  return Object.values(OrderStatus).includes(status as OrderStatus);
};
