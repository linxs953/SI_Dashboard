import axios from "axios";

const service = axios.create({
    baseURL: '/api', // 所有的请求地址前缀部分
    timeout: 60000, // 请求超时时间毫秒
    withCredentials: true, // 异步请求携带 cookie
    headers: {
      'Content-Type': 'application/json',
    },
});

// 请求拦截器
// service.interceptors.request.use(
//     (config) => {
//       // 在发送请求之前做些什么
//       return config;
//     },
//     (error) => {
//       // 对请求错误做些什么
//       console.log(error);
//       return Promise.reject(error);
//     }
//   );
  
//   // 响应拦截器
//   service.interceptors.response.use(
//     (response) => {
//       // 2xx 范围内的状态码都会触发该函数
//       return response.data;
//     },
//     (error) => {
//       // 超出 2xx 范围的状态码都会触发该函数
//       console.log(error);
//       return Promise.reject(error);
//     }
//   );
  
export default service;