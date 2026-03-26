import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../lib/axios";
import { QUERY_KEYS } from "../../../lib/queryKeys";
import type { User } from "../../../types/user.types";
import type { LoginCredentials, RegisterData } from "../../../types/auth.types";

// *********************************** ((API Functions)) **************************************** //

const getCurrentUser = async (): Promise<User> => {
  const response = await axiosInstance.get("/auth/me");
  return response.data.data;
};

const registerUser = async (data: RegisterData): Promise<User> => {
  const response = await axiosInstance.post("/auth/register", data);
  return response.data.data;
};

const loginUser = async (data: LoginCredentials): Promise<User> => {
  const response = await axiosInstance.post("/auth/login", data);
  return response.data.data;
};

const logoutUser = async (): Promise<void> => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

// *********************************** ((React-Query Hooks)) **************************************** //

export const useCurrentUser = () => {
  return useQuery<User | null>({
    queryKey: QUERY_KEYS.AUTH_USER,
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useRegisterUser = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, RegisterData>({
    mutationFn: registerUser,
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.AUTH_USER, data);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH_USER });
    },
  });
};

export const useLoginUser = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, LoginCredentials>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.AUTH_USER, data);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH_USER });
    },
  });
};

export const useLogoutUser = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.setQueryData(QUERY_KEYS.AUTH_USER, null);
      queryClient.clear();
    },
  });
};
