export interface Category {
  id: string;
  name: string;
  description?: string;
  status?: string;
  createdAt?: string;
  productsCount?: number;
  totalValue?: number;
  averagePrice?: number;
  lastUpdated?: string;
  level?: string;
}