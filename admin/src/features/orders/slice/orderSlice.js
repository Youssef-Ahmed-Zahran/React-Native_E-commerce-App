import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../lib/axios";

// ─── Query Keys ─────────────────────────────────────────────────────────────
export const orderKeys = {
    all: ["orders"],
    lists: () => [...orderKeys.all, "list"],
    list: (filters) => [...orderKeys.lists(), { filters }],
    details: () => [...orderKeys.all, "detail"],
    detail: (id) => [...orderKeys.details(), id],
};

// ─── API Functions ────────────────────────────────────────────────────────────
const fetchOrders = async (params) => {
    const response = await axiosInstance.get("/admin/orders", { params });
    return response.data.data; // { orders, pagination }
};

const updateOrderStatus = async ({ orderId, status }) => {
    const response = await axiosInstance.patch(`/admin/orders/${orderId}/status`, { status });
    return response.data.data;
};

// ─── React Query Hooks ────────────────────────────────────────────────────────
export const useOrders = (params = {}) => {
    return useInfiniteQuery({
        queryKey: orderKeys.list(params),
        queryFn: ({ pageParam = 1 }) => fetchOrders({ ...params, page: pageParam }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (lastPage?.pagination?.page < lastPage?.pagination?.totalPages) {
                return lastPage.pagination.page + 1;
            }
            return undefined;
        },
    });
};

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateOrderStatus,
        onSuccess: () => {
            // Invalidate all order queries to refetch the updated data
            queryClient.invalidateQueries({ queryKey: orderKeys.all });
        },
    });
};
