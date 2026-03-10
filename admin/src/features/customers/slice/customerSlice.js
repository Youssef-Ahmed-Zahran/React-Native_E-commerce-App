import { useInfiniteQuery } from "@tanstack/react-query";
import axiosInstance from "../../../lib/axios";

// ─── Query Keys ─────────────────────────────────────────────────────────────
export const customerKeys = {
  all: ["customers"],
  lists: () => [...customerKeys.all, "list"],
  list: (filters) => [...customerKeys.lists(), { filters }],
};

// ─── API Functions ────────────────────────────────────────────────────────────
const fetchCustomers = async (params) => {
  const response = await axiosInstance.get("/admin/customers", { params });
  return response.data.data; // { customers, pagination }
};

// ─── React Query Hooks ────────────────────────────────────────────────────────
export const useCustomers = (params = {}) => {
  return useInfiniteQuery({
    queryKey: customerKeys.list(params),
    queryFn: ({ pageParam = 1 }) => fetchCustomers({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.totalPages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
  });
};
