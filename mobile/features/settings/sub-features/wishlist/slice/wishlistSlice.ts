import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../../../lib/axios";
import { QUERY_KEYS } from "../../../../../lib/queryKeys";
import type { Product } from "../../../../../types/product.types";

// *********************************** ((API Functions)) **************************************** //

const fetchWishlist = async (): Promise<Product[]> => {
  const response = await axiosInstance.get("/wishlist");
  return response.data.data?.products || [];
};

const addToWishlistApi = async (productId: string): Promise<Product[]> => {
  const response = await axiosInstance.post("/wishlist", { productId });
  return response.data.data;
};

const removeFromWishlistApi = async (productId: string): Promise<Product[]> => {
  const response = await axiosInstance.delete(`/wishlist/${productId}`);
  return response.data.data;
};

// *********************************** ((React-Query Hooks)) **************************************** //

export const useWishlist = () => {
  return useQuery<Product[]>({
    queryKey: QUERY_KEYS.WISHLIST,
    queryFn: fetchWishlist,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addToWishlistApi,
    onMutate: async (productId: string) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.WISHLIST });
      const previousWishlist = queryClient.getQueryData<Product[]>(
        QUERY_KEYS.WISHLIST,
      );

      if (previousWishlist) {
        queryClient.setQueryData<Product[]>(QUERY_KEYS.WISHLIST, [
          ...previousWishlist,
          { _id: productId } as Product,
        ]);
      }

      return { previousWishlist };
    },
    onError: (err, productId, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(QUERY_KEYS.WISHLIST, context.previousWishlist);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST });
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeFromWishlistApi,
    onMutate: async (productId: string) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.WISHLIST });
      const previousWishlist = queryClient.getQueryData<Product[]>(
        QUERY_KEYS.WISHLIST,
      );

      if (previousWishlist) {
        queryClient.setQueryData<Product[]>(
          QUERY_KEYS.WISHLIST,
          previousWishlist.filter((p) => p._id !== productId),
        );
      }

      return { previousWishlist };
    },
    onError: (err, productId, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(QUERY_KEYS.WISHLIST, context.previousWishlist);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST });
    },
  });
};
