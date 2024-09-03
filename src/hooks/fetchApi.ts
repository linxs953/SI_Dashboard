
// 封装通用的外部Api请求hook

import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";

function useFetchApi(domain:string,url:string, options = {}) {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const memoizedOptions = useMemo(() => ({ ...options }), [options]);

    const fetchData = useCallback(async () => {
        try {
          setLoading(true); 
          const responseData = await sendRequest(domain,url, memoizedOptions);
          setData(responseData);
          setLoading(false);
        } catch (error) {
          setError(error as any);
          setLoading(false);
        }
    }, [url, memoizedOptions]);

    useEffect(() => {
        let ignore = false; // 用于取消已经发出但不再需要的请求
        const runFetchData = async () => {
            if (!ignore) {
            await fetchData();
            }
        };

        runFetchData();
    
        // 返回清理函数以取消请求或设置ignore标志
        return () => {
          ignore = true;
        };
    }, [fetchData]); // 依赖项数组包含url和options，确保当这些值改变时重新请求
    
    return { data, loading, error };
}


const sendRequest = async (domain:string,url:string, options={}) => {
    try {
        // 设置默认选项
        const defaultOptions = {
          method: 'GET', // 默认为GET请求
          timeout: 5000, // 超时时间为5秒
          headers: {
            'Content-Type': 'application/json',
          },
        };
    
        // 合并默认选项和传入的选项
        const requestOptions = { ...defaultOptions, ...options };
    
        // 发送请求
        const response = await axios.request({
          url,
          ...requestOptions,
        });
    
        // 检查响应状态码是否为200
        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        return response.data;
    
      } catch (error) {
        // 处理请求错误
        if (axios.isAxiosError(error)) {
          if (error.response) {
            // 服务器响应错误
            throw new Error(`HTTP error! status: ${error.response.status}`);
          } else if (error.request) {
            // 客户端未收到响应
            throw new Error('No response received');
          } else {
            // 发送请求时发生错误
            throw new Error('Error sending request');
          }
        } else {
          // 其他错误
          throw new Error('An unknown error occurred');
        }
      }
}


export default useFetchApi