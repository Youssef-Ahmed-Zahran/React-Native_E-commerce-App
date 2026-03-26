// ─── User Model ────────────────────────────────────────────────────────────────

export interface User {
  _id: string;
  name: string;
  email: string;
  imageUrl?: string;
  role: "user" | "admin";
  addresses?: Address[];
  wishlist?: string[];
}

export interface Address {
  _id?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}
