export interface Review {
  _id: string;
  productId: string;
  userId: { _id: string; name: string; email: string };
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CreateReviewPayload {
  productId: string;
  rating: number;
  comment: string;
}
