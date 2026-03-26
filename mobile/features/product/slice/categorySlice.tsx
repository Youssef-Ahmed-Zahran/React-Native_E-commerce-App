import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../lib/axios";
import { QUERY_KEYS } from "../../../lib/queryKeys";

import type { Category, CategoriesResponse } from "../../../types/home.types";

// *********************************** ((API Functions)) **************************************** //

const fetchCategories = async (): Promise<CategoriesResponse> => {
  const response = await axiosInstance.get("/categories", {
    params: { limit: 50 },
  });
  return response.data.data;
};

// *********************************** ((React-Query Hooks)) **************************************** //

export const useCategories = () => {
  return useQuery<CategoriesResponse>({
    queryKey: QUERY_KEYS.CATEGORIES,
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes — categories rarely change
  });
};
