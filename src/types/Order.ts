import { CartItem } from "./CartItem";
import { Cookie } from "./Cookie";

// src/types/Order.ts
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentId?: string;
  createdAt: Date;
  shippingAddress?: string;
}

export interface OrderItem {
  cookieId?: string;
  name: string;
  price: number;
  quantity: number;
  cookie?: Cookie;
}