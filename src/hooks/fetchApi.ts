import { useState, useEffect } from 'react';
import axios from 'axios';

interface FetchResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

function useFetchApi<T>(domain: string, url: string, options = {},refetch:number): FetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios({
          method: 'GET',
          url: `${domain}${url}`,
          timeout: 5000,
          headers: {
            'Content-Type': 'application/json',
          },
          ...options,
        });
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('发生未知错误'));
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [domain, url, JSON.stringify(options),refetch]);

  return { data, isLoading, error };
}

export default useFetchApi;


