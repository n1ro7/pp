import axios from 'axios';
import { message } from 'antd';

// 创建Axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // 环境变量配置（适配开发/生产环境）
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
});

// 请求拦截器：添加token认证
request.interceptors.request.use(
  (config) => {
    // 添加token认证
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // 开发环境临时移除重定向逻辑，因为后端缺少JWT过滤器
      // if (!config.url.includes('/auth/login')) {
      //   window.location.href = '/login';
      // }
    }
    return config;
  },
  (error) => {
    message.error('请求发送失败，请检查网络');
    return Promise.reject(error);
  }
);

// 响应拦截器：处理错误
request.interceptors.response.use(
  (response) => {
    try {
      // 后端统一响应格式：{ code: 200(成功)/其他(失败), message: "提示", data: 业务数据 }
      const { code, message: resMsg, data } = response.data;
      if (code !== 200) {
        message.error(resMsg || '操作失败，请稍后重试');
        console.error('后端返回错误：', response.data);
        return Promise.reject(new Error(resMsg || '接口返回异常'));
      }
      return data; // 直接返回业务数据，简化组件调用
    } catch (error) {
      message.error('响应格式错误，请检查后端接口');
      console.error('响应格式错误：', response.data, error);
      return Promise.reject(new Error('响应格式错误，请检查后端接口'));
    }
  },
  (error) => {
    const errorMsg = error.response?.data?.message || error.response?.data || '服务器异常，请联系管理员';
    message.error(errorMsg);
    console.error('网络请求错误：', error);
    return Promise.reject(error);
  }
);

export default request;