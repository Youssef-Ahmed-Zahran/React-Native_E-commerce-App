// ─── Home Types ─────────────────────────────────────────────────────────────

export interface Category {
  _id: string;
  name: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoriesResponse {
  categories: Category[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CategoryListProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}
