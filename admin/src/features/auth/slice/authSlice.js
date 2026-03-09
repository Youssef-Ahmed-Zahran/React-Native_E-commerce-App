import axiosInstance from "../../../lib/axios";
import toast from "react-hot-toast";
import { queryClient } from "../../../store/queryClient";

// ─── Query Keys ─────────────────────────────────────────────────────────────
export const authKeys = {
  me: ["auth", "me"],
};

// ─── API Functions ────────────────────────────────────────────────────────────

/**
 * Fetch the currently authenticated user
 * Used as queryFn for useQuery
 */
export const getCurrentUser = async () => {
  const { data } = await axiosInstance.get("/auth/me");
  return data.data;
};

/**
 * Login mutation function
 * @param {{ email: string, password: string }} credentials
 */
export const loginUser = async (credentials) => {
  const { data } = await axiosInstance.post("/auth/login", credentials);
  return data.data;
};

/**
 * Register mutation function
 * @param {{ name: string, email: string, password: string }} userData
 */
export const registerUser = async (userData) => {
  const { data } = await axiosInstance.post("/auth/register", userData);
  return data.data;
};

/**
 * Logout mutation function
 */
export const logoutUser = async () => {
  const { data } = await axiosInstance.post("/auth/logout");
  return data;
};

// ─── Shared Mutation Handlers ─────────────────────────────────────────────────

export const onAuthSuccess = (user) => {
  queryClient.setQueryData(authKeys.me, user);
};

export const onLogoutSuccess = () => {
  queryClient.setQueryData(authKeys.me, null);
  queryClient.clear();
  toast.success("Logged out successfully");
};
