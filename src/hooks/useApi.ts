import { useState, useEffect, useCallback } from "react";
import { api, ApiError } from "../services/api";
import type { StatsResponse, PaginatedBets, BetResponse } from "../types/api";
import { useToast } from "../components/ToastProvider";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error?: boolean; // Simple error flag for loading states
}

/**
 * Hook for casino statistics with auto-refresh
 */
export function useStats(autoRefresh = false, refreshInterval = 30000) {
  const { showError } = useToast();
  const [state, setState] = useState<UseApiState<StatsResponse>>({
    data: null,
    loading: true,
  });

  const fetchStats = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: false }));

    try {
      const stats = await api.getStats();
      setState({ data: stats, loading: false, error: false });
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Failed to fetch stats";

      // Show toast notification for errors
      showError("Failed to load statistics", message, {
        label: "Retry",
        onClick: fetchStats,
      });

      setState((prev) => ({ ...prev, loading: false, error: true }));
    }
  }, [showError]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchStats, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchStats]);

  return { ...state, refetch: fetchStats };
}

/**
 * Enhanced hook for paginated bets with caching and prefetching
 */
export function useBets(page: number = 1, limit: number = 20) {
  const { showError } = useToast();
  const [state, setState] = useState<UseApiState<PaginatedBets>>({
    data: null,
    loading: true,
  });

  const [cache, setCache] = useState<Map<number, PaginatedBets>>(new Map());

  const fetchBets = useCallback(
    async (targetPage: number = page, useCache = true) => {
      // Ensure page is at least 1
      const safePage = Math.max(1, targetPage);

      // Check cache first
      if (useCache && cache.has(safePage)) {
        setState({ data: cache.get(safePage)!, loading: false, error: false });
        return;
      }

      setState((prev) => ({ ...prev, loading: true, error: false }));

      try {
        const offset = Math.max(0, (safePage - 1) * limit); // Ensure offset is never negative
        const bets = await api.getBets(limit, offset);

        // Update cache
        setCache((prev) => new Map(prev.set(safePage, bets)));
        setState({ data: bets, loading: false, error: false });
      } catch (error) {
        const message =
          error instanceof ApiError ? error.message : "Failed to fetch bets";

        // Show toast notification for errors
        showError("Failed to load bet history", message, {
          label: "Retry",
          onClick: () => fetchBets(safePage, false),
        });

        setState((prev) => ({ ...prev, loading: false, error: true }));
      }
    },
    [limit, page, cache, showError]
  );

  // Prefetch next page
  const prefetchNextPage = useCallback(async () => {
    const nextPage = page + 1;
    if (!cache.has(nextPage) && state.data?.has_more) {
      try {
        const offset = Math.max(0, (nextPage - 1) * limit); // Ensure offset is never negative
        const bets = await api.getBets(limit, offset);
        setCache((prev) => new Map(prev.set(nextPage, bets)));
      } catch (error) {
        // Silent fail for prefetch
        console.log("Prefetch failed:", error);
      }
    }
  }, [page, limit, cache, state.data?.has_more]);

  useEffect(() => {
    fetchBets(page);
  }, [fetchBets, page]);

  // Prefetch next page after current data loads
  useEffect(() => {
    if (state.data && !state.loading && state.data.has_more) {
      const timer = setTimeout(prefetchNextPage, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.data, state.loading, prefetchNextPage]);

  return {
    ...state,
    totalPages: state.data ? Math.ceil(state.data.total_count / limit) : 0,
    refetch: () => {
      setCache(new Map()); // Clear cache
      fetchBets(page, false);
    },
  };
}

/**
 * Hook for making bets with proper error handling
 */
export function useBetting() {
  const { showError } = useToast();
  const [state, setState] = useState<{
    loading: boolean;
    lastResult: BetResponse | null;
  }>({
    loading: false,
    lastResult: null,
  });

  const flipCoin = useCallback(
    async (wallet: string, amount: number, choice: "heads" | "tails") => {
      setState((prev) => ({ ...prev, loading: true }));

      try {
        const nonce = api.generateNonce();
        const result = await api.flipCoinUniversal(
          wallet,
          amount,
          nonce,
          choice
        );
        setState({ loading: false, lastResult: result });

        return result;
      } catch (error) {
        const message =
          error instanceof ApiError ? error.message : "Failed to place bet";

        showError("Bet failed", message);

        setState((prev) => ({ ...prev, loading: false }));
        throw error;
      }
    },
    [showError]
  );

  const playSlots = useCallback(
    async (wallet: string, amount: number, lines: number = 1) => {
      setState((prev) => ({ ...prev, loading: true }));

      try {
        const nonce = api.generateNonce();
        const result = await api.playSlots(wallet, amount, nonce, lines);
        setState({ loading: false, lastResult: result });

        return result;
      } catch (error) {
        const message =
          error instanceof ApiError ? error.message : "Failed to place bet";

        showError("Bet failed", message);

        setState((prev) => ({ ...prev, loading: false }));
        throw error;
      }
    },
    [showError]
  );

  return { ...state, flipCoin, playSlots };
}
