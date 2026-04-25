"use client";

import { useState, useEffect, useCallback } from "react";

export function useApi<T>(fetcher: () => Promise<T>, intervalMs?: number) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const result = await fetcher();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchData();
    });

    if (intervalMs) {
      const interval = setInterval(() => {
        void fetchData();
      }, intervalMs);
      return () => clearInterval(interval);
    }
  }, [fetchData, intervalMs]);

  return { data, error, loading, refetch: fetchData };
}
