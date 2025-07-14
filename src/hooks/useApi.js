
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(url, options);
        setData(response.data);
        setError(null);
      } catch (err) {
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
      const response = await axios.get(url, options);
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

export const useApiMutation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (method, url, data = null, options = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
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
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
};
