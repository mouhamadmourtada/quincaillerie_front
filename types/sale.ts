export type PaymentType = 'CASH' | 'CARD' | 'TRANSFER';

export interface SaleItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  saleDate: Date;
  paymentDate: Date | null;
  paymentType: PaymentType;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
}
