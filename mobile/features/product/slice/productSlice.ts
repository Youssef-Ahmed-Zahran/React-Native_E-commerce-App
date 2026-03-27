import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import axiosInstance from "../../../lib/axios";
import { QUERY_KEYS } from "../../../lib/queryKeys";
import type {
  Product,
  ProductsResponse,
  FetchProductsParams,
} from "../../../types/product.types";

// *********************************** ((API Functions)) **************************************** //

const fetchProducts = async (
  params: FetchProductsParams = {},
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

export const useProducts = (params: FetchProductsParams = {}) => {
  return useQuery<ProductsResponse>({
    queryKey: [...QUERY_KEYS.PRODUCTS, params],
    queryFn: () => fetchProducts(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useInfiniteProducts = (
  params: Omit<FetchProductsParams, "page"> = {},
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
    staleTime: 5 * 60 * 1000,
  });
};

export const useProduct = (id: string) => {
  return useQuery<Product>({
    queryKey: QUERY_KEYS.PRODUCT(id),
    queryFn: () => fetchProductById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
