import type { ActiveStatus } from "../../../prisma/generated/prisma/enums";

export interface IAddGearItemPayload {
  name: string;
  description: string;
  price: string;
  quantity: string;
  categoryName: string;
  brand: string;
  status?: ActiveStatus;
}

export interface IUpdateGearItemPayload {
  name?: string;
  description?: string;
  price?: string;
  quantity?: string;
  categoryName?: string;
  brand?: string;
  status?: string;
}
