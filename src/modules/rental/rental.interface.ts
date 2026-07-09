export interface IRentalItemPayload {
  itemId: string;
  orderQty: number;
  price: number;
}

export interface IRentalOrderPayload {
  rentFrom: string;
  rentTill: string;
  items: IRentalItemPayload[];
}
