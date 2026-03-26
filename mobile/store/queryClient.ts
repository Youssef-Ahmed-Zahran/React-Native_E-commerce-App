import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // How long data is considered fresh before background re-fetch
      staleTime: 1000 * 60 * 5, // 5 minutes
      // How long inactive queries are kept in the cache
      gcTime: 1000 * 60 * 10, // 10 minutes
      // Number of times to retry failed queries
      retry: 1,
      // Retry delay with exponential back-off (max 10 s)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10_000),
      // Refetch on window focus (useful in mobile for foreground/background)
      refetchOnWindowFocus: false,
    },
    mutations: {
      // Mutations don't retry by default — safer for write operations
      retry: 0,
    },
  },
});
