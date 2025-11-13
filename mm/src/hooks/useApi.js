import { useState, useCallback } from 'react';

// 通用API请求hook
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (apiFunction, ...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiFunction(...args);
      return data;
    } catch (err) {
      setError(err);
      console.error('API请求失败:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { request, loading, error };
};