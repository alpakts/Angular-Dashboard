import { StockReason } from "../product-detail/product-detail.component";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  reorderPoint: number;
  expiryDate?: string;
  stockAdjustments?: StockAdjustment[];
}

export interface StockAdjustment {
  date: string;
  quantity: number;
  reason: string;
}
