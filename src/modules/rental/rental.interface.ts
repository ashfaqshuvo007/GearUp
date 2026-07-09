export interface IRentalOrderPayload {
  rentFrom: string;
  rentTill: string;
  orderItemId: string;
  orderQty: number;
  price: number;
}

export interface INormalizeRentalOrderPayload {
  total: number;
  orderItemId: string;
  orderQty: number;
  orderPrice: number;
  rentFrom: string;
  rentTill: string;
}
