import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../../../lib/axios";
import { QUERY_KEYS } from "../../../../../lib/queryKeys";
import type { User, Address } from "../../../../../types/user.types";

// *********************************** ((API Functions)) **************************************** //

const updateProfileApi = async ({
  userId,
  data,
}: {
  userId: string;
  data: { name?: string; email?: string; imageUrl?: string };
}): Promise<User> => {
  const response = await axiosInstance.put(`/users/${userId}`, data);
  return response.data.data;
};

const addAddressApi = async (data: Omit<Address, "_id">): Promise<User> => {
  const response = await axiosInstance.post("/users/addresses", data);
  return response.data.data;
};

const deleteAddressApi = async (addressId: string): Promise<User> => {
  const response = await axiosInstance.delete(`/users/addresses/${addressId}`);
  return response.data.data;
};

const updateAddressApi = async ({
  addressId,
  data,
}: {
  addressId: string;
  data: Partial<Address>;
}): Promise<User> => {
  const response = await axiosInstance.put(
    `/users/addresses/${addressId}`,
    data,
  );
  return response.data.data;
};

// *********************************** ((React-Query Hooks)) **************************************** //

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfileApi,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(QUERY_KEYS.AUTH_USER, updatedUser);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH_USER });
    },
  });
};

export const useAddAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addAddressApi,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(QUERY_KEYS.AUTH_USER, updatedUser);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH_USER });
    },
  });
};

export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAddressApi,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(QUERY_KEYS.AUTH_USER, updatedUser);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH_USER });
    },
  });
};
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAddressApi,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(QUERY_KEYS.AUTH_USER, updatedUser);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH_USER });
    },
  });
};
