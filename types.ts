export type UserRole = 'manager' | 'seller';

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
}

export interface Product {
  id: number;
  name: string;
  code: string;
  category: string;
  brand: string;
  price: number;
  promo_price?: number;
  status: 'active' | 'inactive';
}

export interface Variant {
  id: number;
  product_id: number;
  size: string;
  color: string;
  stock_quantity: number;
}

export interface ProductWithVariants extends Product {
  variants: Variant[];
}

export interface CartItem {
  variant_id: number;
  product_id: number;
  name: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
}

export interface CashRegister {
  id: number;
  user_id: string;
  opening_balance: number;
  closing_balance?: number;
  status: 'open' | 'closed';
  opened_at: string;
  closed_at?: string;
  notes?: string;
}

export type PaymentMethod = 'money' | 'credit' | 'debit' | 'pix' | 'mixed';