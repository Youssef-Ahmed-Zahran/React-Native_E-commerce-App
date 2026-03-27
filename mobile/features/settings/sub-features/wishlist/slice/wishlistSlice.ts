import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axiosInstance from "../../../../../lib/axios";
import { QUERY_KEYS } from "../../../../../lib/queryKeys";
import type { Product } from "../../../../../types/product.types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface WishlistPage {
  products: Product[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

// *********************************** ((API Functions)) **************************************** //

const fetchWishlist = async (): Promise<Product[]> => {
  const response = await axiosInstance.get("/wishlist");
  return response.data.data?.products || [];
};

const fetchWishlistPage = async (
  page: number = 1,
  limit: number = 10,
): Promise<WishlistPage> => {
  const response = await axiosInstance.get("/wishlist", {
    params: { page, limit },
  });
  const data = response.data.data;
  return {
    products: data?.products || [],
    pagination: data?.pagination ?? {
      totalItems: 0,
      totalPages: 0,
      currentPage: page,
      limit,
    },
  };
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

export const useInfiniteWishlist = (limit: number = 10) => {
  return useInfiniteQuery<WishlistPage>({
    queryKey: [...QUERY_KEYS.WISHLIST, "infinite", { limit }],
    queryFn: ({ pageParam = 1 }) =>
      fetchWishlistPage(pageParam as number, limit),
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      return pagination.currentPage < pagination.totalPages
        ? pagination.currentPage + 1
        : undefined;
    },
    initialPageParam: 1,
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
