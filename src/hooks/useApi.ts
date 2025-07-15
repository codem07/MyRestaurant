import { useState, useEffect } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export function useApi<T = any>(url: string, options: AxiosRequestConfig = {}) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response: AxiosResponse<T> = await axios.get(url, options);
        setData(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    if (url) {
      fetchData();
    }
  }, [url]);

  const refetch = async () => {
    try {
      setLoading(true);
      const response: AxiosResponse<T> = await axios.get(url, options);
      setData(response.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
}

export function useApiMutation() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (
    method: 'post' | 'put' | 'patch' | 'delete',
    url: string,
    data: any = null,
    options: AxiosRequestConfig = {}
  ): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      setLoading(true);
      setError(null);
      let response: AxiosResponse<any>;
      switch (method.toLowerCase()) {
        case 'post':
          response = await axios.post(url, data, options);
          break;
        case 'put':
          response = await axios.put(url, data, options);
          break;
        case 'patch':
          response = await axios.patch(url, data, options);
          break;
        case 'delete':
          response = await axios.delete(url, options);
          break;
        default:
          throw new Error('Invalid HTTP method');
      }
      return { success: true, data: response.data };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'An error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
} 