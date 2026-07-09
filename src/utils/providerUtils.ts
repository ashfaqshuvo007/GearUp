import { ActiveStatus, OrderStatus } from "../../prisma/generated/prisma/enums";
import type {
  IAddGearItemPayload,
  IUpdateGearItemPayload,
} from "../modules/provider/provider.interface";

const normalizeEnumValue = <T extends Record<string, string>>(
  value: unknown,
  enumObject: T,
  fallback: T[keyof T],
): T[keyof T] => {
  if (typeof value !== "string") {
    return fallback;
  }

  const normalized = value.trim().toUpperCase();
  const matchedKey = Object.keys(enumObject).find(
    (key) => key === normalized,
  ) as keyof T | undefined;

  if (matchedKey) {
    return enumObject[matchedKey];
  }

  return fallback;
};

const normalizeNumber = (value: unknown, fieldName: string) => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error(`${fieldName} must be a valid number.`);
  }

  return parsed;
};

export const buildGearCreateInput = (
  userId: string,
  payload: IAddGearItemPayload,
) => {
  const name = payload.name;
  const description = payload.description;
  const brand = payload.brand;
  const categoryName = payload.categoryName;
  const providerId = userId;
  const quantity = payload.quantity;
  const price = payload.price;
  const status = payload.status;

  if (typeof name !== "string" || !name.trim()) {
    throw new Error("Name is required.");
  }

  if (typeof description !== "string" || !description.trim()) {
    throw new Error("Description is required.");
  }

  if (typeof brand !== "string" || !brand.trim()) {
    throw new Error("Brand is required.");
  }

  if (typeof categoryName !== "string" || !categoryName.trim()) {
    throw new Error("categoryId is required.");
  }

  return {
    name: name.trim(),
    description: description.trim(),
    brand: brand.trim(),
    categoryName: categoryName.trim(),
    providerId: providerId.trim(),
    quantity: normalizeNumber(quantity, "quantity"),
    price: normalizeNumber(price, "price"),
    status: normalizeEnumValue(status, ActiveStatus, ActiveStatus.ACTIVE),
  };
};

export const buildGearUpdateInput = (payload: IUpdateGearItemPayload) => {
  const data: Record<string, unknown> = {};

  if (typeof payload.name === "string" && payload.name.trim()) {
    data.name = payload.name.trim();
  }

  if (typeof payload.description === "string" && payload.description.trim()) {
    data.description = payload.description.trim();
  }

  if (typeof payload.brand === "string" && payload.brand.trim()) {
    data.brand = payload.brand.trim();
  }

  if (typeof payload.categoryName === "string" && payload.categoryName.trim()) {
    data.categoryName = payload.categoryName.trim();
  }

  if (payload.quantity !== undefined) {
    data.quantity = normalizeNumber(payload.quantity, "quantity");
  }

  if (payload.price !== undefined) {
    data.price = normalizeNumber(payload.price, "price");
  }

  if (payload.status !== undefined) {
    data.status = normalizeEnumValue(
      payload.status,
      ActiveStatus,
      ActiveStatus.ACTIVE,
    );
  }

  return data;
};

export const normalizeOrderStatus = (status: unknown) => {
  return normalizeEnumValue(status, OrderStatus, OrderStatus.PENDING_PAYMENT);
};
