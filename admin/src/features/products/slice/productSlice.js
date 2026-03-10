import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../lib/axios";
import toast from "react-hot-toast";

// ─── Query Keys ─────────────────────────────────────────────────────────────
export const productKeys = {
    all: ["products"],
    lists: () => [...productKeys.all, "list"],
    list: (filters) => [...productKeys.lists(), { filters }],
    details: () => [...productKeys.all, "detail"],
    detail: (id) => [...productKeys.details(), id],
};

// ─── API Functions ────────────────────────────────────────────────────────────

const fetchProducts = async (params) => {
    const response = await axiosInstance.get("/admin/products", { params });
    return response.data.data; // { products, pagination }
};

const fetchProductById = async (id) => {
    const response = await axiosInstance.get(`/admin/products/${id}`);
    return response.data.data;
};

const createProduct = async (productData) => {
    const response = await axiosInstance.post("/admin/products", productData);
    return response.data.data;
};

const updateProduct = async ({ id, productData }) => {
    const response = await axiosInstance.put(
        `/admin/products/${id}`,
        productData
    );
    return response.data.data;
};

const deleteProduct = async (id) => {
    const response = await axiosInstance.delete(`/admin/products/${id}`);
    return response.data.data;
};

// ─── React Query Hooks ────────────────────────────────────────────────────────

export const useProducts = (params = {}) => {
    return useQuery({
        queryKey: productKeys.list(params),
        queryFn: () => fetchProducts(params),
        keepPreviousData: true,
    });
};

export const useProductById = (id) => {
    return useQuery({
        queryKey: productKeys.detail(id),
        queryFn: () => fetchProductById(id),
        enabled: !!id,
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            toast.success("Product created successfully");
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to create product");
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProduct,
        onSuccess: (data, variables) => {
            toast.success("Product updated successfully");
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
            queryClient.invalidateQueries({
                queryKey: productKeys.detail(variables.id),
            });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update product");
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            toast.success("Product deleted successfully");
            queryClient.invalidateQueries({ queryKey: productKeys.lists() });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to delete product");
        },
    });
};
