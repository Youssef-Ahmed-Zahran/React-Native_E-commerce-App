// ─── Cart Types ───────────────────────────────────────────────────────────────

import { Product } from "./product.types";

export interface CartItem {
  _id?: string;
  // product can be either the string ID (unpopulated) or the full Product object (populated)
  product: string | Product;
  quantity: number;
  price: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalPrice?: number;
}

export interface CheckoutModalProps {
  visible: boolean;
  onClose: () => void;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  totalAmount: number;
}

export interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "phone-pad" | "email-address";
}

export interface SummaryRowProps {
  label: string;
  value: number;
  bold?: boolean;
}

export interface CartItemProps {
  item: CartItem;
}
