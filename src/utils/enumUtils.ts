import { ActiveStatus } from "../../prisma/generated/prisma/client";

export const isValidStatus = (status: string): status is ActiveStatus => {
  return Object.values(ActiveStatus).includes(status as ActiveStatus);
};
