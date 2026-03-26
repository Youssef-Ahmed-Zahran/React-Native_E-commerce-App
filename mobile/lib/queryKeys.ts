// ─── All React Query Keys centralised here ─────────────────────────────────────

export const QUERY_KEYS = {
  // ── Auth ──────────────────────────────────────────────────────────────────
  AUTH_USER: ["auth", "me"] as const,

  // ── Products ──────────────────────────────────────────────────────────────
  PRODUCTS: ["products"] as const,
  PRODUCT: (id: string) => ["products", id] as const,
  PRODUCTS_SEARCH: (query: string) => ["products", "search", query] as const,

  // ── Categories ────────────────────────────────────────────────────────────
  CATEGORIES: ["categories"] as const,
  CATEGORY: (id: string) => ["categories", id] as const,

  // ── Cart ──────────────────────────────────────────────────────────────────
  CART: ["cart"] as const,

  // ── Wishlist ──────────────────────────────────────────────────────────────
  WISHLIST: ["wishlist"] as const,

  // ── Addresses ─────────────────────────────────────────────────────────────
  ADDRESSES: ["addresses"] as const,

  // ── Orders ────────────────────────────────────────────────────────────────
  ORDERS: ["orders"] as const,
  ORDER: (id: string) => ["orders", id] as const,

  // ── Users / Profile ───────────────────────────────────────────────────────
  USER_PROFILE: (id: string) => ["users", id] as const,

  // ── Reviews ───────────────────────────────────────────────────────────────
  PRODUCT_REVIEWS: (productId: string) => ["reviews", "product", productId] as const,
  MY_REVIEWS: ["reviews", "me"] as const,
} as const;
