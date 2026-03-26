import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../../../lib/axios";
import { QUERY_KEYS } from "../../../../../lib/queryKeys";

import type {
  Order,
  ShippingAddress,
  CreateOrderPayload,
  OrdersResponse,
} from "../../../../../types/order.types";

// *********************************** ((API Functions)) **************************************** //

const createOrderApi = async (data: CreateOrderPayload): Promise<Order> => {
  const response = await axiosInstance.post("/orders", data);
  return response.data.data;
};

const fetchOrders = async (
  page: number = 1,
  limit: number = 10
): Promise<OrdersResponse> => {
  const response = await axiosInstance.get("/orders", {
    params: { page, limit },
  });
  return response.data.data;
};

const cancelOrderApi = async (orderId: string): Promise<Order> => {
  const response = await axiosInstance.patch(`/orders/${orderId}/cancel`);
  return response.data.data;
};

// *********************************** ((React-Query Hooks)) **************************************** //

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrderApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS });
    },
  });
};

export const useOrders = (page: number = 1, limit: number = 10) => {
  return useQuery<OrdersResponse>({
    queryKey: [...QUERY_KEYS.ORDERS, { page, limit }],
    queryFn: () => fetchOrders(page, limit),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelOrderApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS });
    },
  });
};
