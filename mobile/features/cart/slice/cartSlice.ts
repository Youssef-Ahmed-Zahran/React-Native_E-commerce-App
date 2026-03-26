import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../lib/axios";
import { QUERY_KEYS } from "../../../lib/queryKeys";
import type { Cart } from "../../../types/cart.types";

// *********************************** ((API Functions)) **************************************** //

const fetchCart = async (): Promise<Cart> => {
  const response = await axiosInstance.get("/cart");
  return response.data.data;
};

const addToCartApi = async (data: {
  productId: string;
  quantity?: number;
}): Promise<Cart> => {
  const response = await axiosInstance.post("/cart", data);
  return response.data.data;
};

const updateCartItemApi = async (data: {
  productId: string;
  quantity: number;
}): Promise<Cart> => {
  const response = await axiosInstance.put(`/cart/${data.productId}`, {
    quantity: data.quantity,
  });
  return response.data.data;
};

const removeFromCartApi = async (productId: string): Promise<Cart> => {
  const response = await axiosInstance.delete(`/cart/${productId}`);
  return response.data.data;
};

const clearCartApi = async (): Promise<Cart> => {
  const response = await axiosInstance.delete("/cart");
  return response.data.data;
};

// *********************************** ((React-Query Hooks)) **************************************** //

export const useCart = () => {
  return useQuery<Cart>({
    queryKey: QUERY_KEYS.CART,
    queryFn: fetchCart,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addToCartApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCartItemApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeFromCartApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clearCartApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
    },
  });
};
