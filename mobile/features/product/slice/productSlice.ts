import { useQuery, useInfiniteQuery } from "@tanstack/react-query"; // useQuery kept for useProduct (single product by ID)
import axiosInstance from "../../../lib/axios";
import { QUERY_KEYS } from "../../../lib/queryKeys";
import type {
  Product,
  ProductsResponse,
  FetchProductsParams,
} from "../../../types/product.types";

// *********************************** ((API Functions)) **************************************** //

const fetchProducts = async (
  params: FetchProductsParams = {}
): Promise<ProductsResponse> => {
  const { page = 1, limit = 10, search = "", category = "" } = params;
  const response = await axiosInstance.get("/products", {
    params: { page, limit, search, category },
  });
  return response.data.data;
};

const fetchProductById = async (id: string): Promise<Product> => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data.data;
};

// *********************************** ((React-Query Hooks)) **************************************** //

export const useInfiniteProducts = (
  params: Omit<FetchProductsParams, "page"> = {}
) => {
  const { limit = 10, search = "", category = "" } = params;
  return useInfiniteQuery<ProductsResponse>({
    queryKey: [...QUERY_KEYS.PRODUCTS, "infinite", { search, category, limit }],
    queryFn: ({ pageParam = 1 }) =>
      fetchProducts({ page: pageParam as number, limit, search, category }),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    // staleTime: 0 — cache is always stale, so useFocusEffect's invalidateQueries
    // triggers an immediate refetch every time the Home tab is focused.
    // This ensures admin-added products appear on the very first return to Home.
    // gcTime 5 min keeps paginated pages in memory during tab-switching.
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  });
};

export const useProduct = (id: string) => {
  return useQuery<Product>({
    queryKey: QUERY_KEYS.PRODUCT(id),
    queryFn: () => fetchProductById(id),
    enabled: !!id,
    // 30 s staleTime: avoids duplicate network calls when the user opens the
    // same product within a short burst; the useFocusEffect in ProductDetails
    // will still force a refetch if the cache is older than 30 s
    staleTime: 30 * 1000,
    // 5 min: keep the cached product data around even after the screen
    // is unmounted so it can be shown instantly on re-navigation
    gcTime: 5 * 60 * 1000,
    // true: triggers a background refetch when the component mounts and
    // the data is stale — works together with useFocusEffect invalidation
    refetchOnMount: true,
  });
};
