import { useQuery } from "@tanstack/react-query";
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
  return useQuery({
    queryKey: customerKeys.list(params),
    queryFn: () => fetchCustomers(params),
    keepPreviousData: true, // Keep showing previous data while fetching new page/search
  });
};
