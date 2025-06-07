import { useEffect, useState } from "react";

type FetchResult<T> = { data: T | null; error: Error | null };

export function useFetch<T>(
  fetchFn: () => Promise<FetchResult<T>>,
  defaultValue: T,
) {
  const [data, setData] = useState<T>(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetchFn()
      .then((result) => {
        if (isMounted) {
          if (result.data !== null) setData(result.data);
          setError(null);
        }
      })
      .catch((e) => isMounted && setError(e.message))
      .finally(() => isMounted && setLoading(false));

    return () => {
      isMounted = false;
    };
  }, [fetchFn]);

  return { data, loading, error };
}
