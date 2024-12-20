import { Category } from './category';
import { Supplier } from './supplier';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  category?: Category;
  supplierId: string;
  supplier?: Supplier;
}