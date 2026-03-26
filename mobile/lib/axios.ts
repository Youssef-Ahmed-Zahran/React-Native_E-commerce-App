import axios from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";

const getApiHost = () => {
  if (__DEV__) {
    const hostUri = Constants?.expoConfig?.hostUri;
    if (hostUri) {
      return hostUri.split(":")[0];
    }
    // Fallback if hostUri is unavailable
    return Platform.OS === "android" ? "10.0.2.2" : "localhost";
  }
  // Production IP or Domain
  return "192.168.1.3";
};

const BASE_URL = `http://${getApiHost()}:8080/api`;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// ─── Request Interceptor ───────────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ─── Response Interceptor ──────────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
