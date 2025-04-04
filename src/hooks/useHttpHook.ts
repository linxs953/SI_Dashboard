import { useState } from 'react';
import service from './axios';
import { message } from 'antd';

/**
 * Custom hook for making HTTP requests
 */
export const useHttpHook = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  /**
   * Send a POST request to the specified endpoint
   * @param endpoint API endpoint
   * @param data Request payload
   * @returns Promise with the response data
   */
  const post = async (endpoint: string, data: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await service.post(endpoint, data);
      setLoading(false);
      return response.data;
    } catch (err: any) {
      setLoading(false);
      setError(err);
      console.log(`请求失败: ${err.message || '未知错误'}`);
      throw err;
    }
  };

  /**
   * Send a GET request to the specified endpoint
   * @param endpoint API endpoint
   * @param params Query parameters
   * @returns Promise with the response data
   */
  const get = async (endpoint: string, params?: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await service.get(endpoint, { params });
      setLoading(false);
      return response.data;
    } catch (err: any) {
      setLoading(false);
      setError(err);
      message.error(`请求失败: ${err.message || '未知错误'}`);
      throw err;
    }
  };

  return {
    loading,
    error,
    post,
    get
  };
};
