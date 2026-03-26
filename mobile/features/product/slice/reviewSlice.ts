import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../lib/axios";
import { QUERY_KEYS } from "../../../lib/queryKeys";
import type {
  Review,
  ReviewsResponse,
  CreateReviewPayload,
} from "../../../types/review.types";

// *********************************** ((API Functions)) **************************************** //

const fetchProductReviews = async (
  productId: string,
  page = 1,
  limit = 10
): Promise<ReviewsResponse> => {
  const response = await axiosInstance.get(`/reviews/product/${productId}`, {
    params: { page, limit },
  });
  return response.data.data;
};

const createReview = async (payload: CreateReviewPayload): Promise<Review> => {
  const response = await axiosInstance.post("/reviews", payload);
  return response.data.data;
};

const deleteReview = async (reviewId: string): Promise<void> => {
  await axiosInstance.delete(`/reviews/${reviewId}`);
};

// *********************************** ((React-Query Hooks)) **************************************** //

export const useProductReviews = (productId: string, page = 1, limit = 10) => {
  return useQuery<ReviewsResponse>({
    queryKey: [...QUERY_KEYS.PRODUCT_REVIEWS(productId), page, limit],
    queryFn: () => fetchProductReviews(productId, page, limit),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,
    onSuccess: async (_, variables) => {
      // Invalidate the reviews list for this product to force a refetch and await it
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PRODUCT_REVIEWS(variables.productId),
      });
      // Invalidate product queries to update average rating and review counts
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PRODUCT(variables.productId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PRODUCTS,
      });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId }: { reviewId: string; productId: string }) =>
      deleteReview(reviewId),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PRODUCT_REVIEWS(variables.productId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PRODUCT(variables.productId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PRODUCTS,
      });
    },
  });
};
