import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../lib/axios";
import toast from "react-hot-toast";

// ─── Query Keys ─────────────────────────────────────────────────────────────
export const categoryKeys = {
  all: ["categories"],
  lists: () => [...categoryKeys.all, "list"],
  list: (filters) => [...categoryKeys.lists(), { filters }],
  details: () => [...categoryKeys.all, "detail"],
  detail: (id) => [...categoryKeys.details(), id],
};

// ─── API Functions ────────────────────────────────────────────────────────────

const fetchCategories = async (params) => {
  const response = await axiosInstance.get("/admin/categories", { params });
  return response.data.data; // { categories, pagination }
};

const createCategory = async (categoryData) => {
  const response = await axiosInstance.post("/admin/categories", categoryData);
  return response.data.data;
};

const updateCategory = async ({ id, categoryData }) => {
  const response = await axiosInstance.put(
    `/admin/categories/${id}`,
    categoryData
  );
  return response.data.data;
};

const deleteCategory = async (id) => {
  const response = await axiosInstance.delete(`/admin/categories/${id}`);
  return response.data.data;
};

// ─── React Query Hooks ────────────────────────────────────────────────────────

export const useCategories = (params = {}) => {
  return useInfiniteQuery({
    queryKey: categoryKeys.list(params),
    queryFn: ({ pageParam = 1 }) => fetchCategories({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage?.pagination?.page < lastPage?.pagination?.totalPages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success("Category created successfully");
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create category");
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCategory,
    onSuccess: (data, variables) => {
      toast.success("Category updated successfully");
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: categoryKeys.detail(variables.id),
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update category");
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast.success("Category deleted successfully");
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete category");
    },
  });
};
