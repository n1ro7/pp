import axios from 'axios';
import { message, Spin } from 'antd';

// 创建Axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // 环境变量配置（适配开发/生产环境）
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
});

// 全局loading实例（避免重复创建）
let loadingInstance = null;
let loadingCount = 0; // 计数控制：多请求时仅最后一个关闭loading

// 请求拦截器：显示loading（除标记noLoading的请求）
request.interceptors.request.use(
  (config) => {
    if (!config.noLoading) {
      loadingCount++;
      if (!loadingInstance) {
        loadingInstance = Spin.show({
          tip: '加载中...',
          target: document.body,
          className: 'global-spin',
        });
      }
    }
    // 添加token认证
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // 如果没有token且不是登录请求，跳转到登录页面
      if (!config.url.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return config;
  },
  (error) => {
    if (!error.config?.noLoading) {
      loadingCount--;
      if (loadingCount === 0 && loadingInstance) {
        Spin.hide();
        loadingInstance = null;
      }
    }
    message.error('请求发送失败，请检查网络');
    return Promise.reject(error);
  }
);

// 响应拦截器：处理错误、关闭loading
request.interceptors.response.use(
  (response) => {
    if (!response.config?.noLoading) {
      loadingCount--;
      if (loadingCount === 0 && loadingInstance) {
        Spin.hide();
        loadingInstance = null;
      }
    }
    // 后端统一响应格式：{ code: 200(成功)/其他(失败), message: "提示", data: 业务数据 }
    const { code, message: resMsg, data } = response.data;
    if (code !== 200) {
      message.error(resMsg || '操作失败，请稍后重试');
      return Promise.reject(new Error(resMsg || '接口返回异常'));
    }
    return data; // 直接返回业务数据，简化组件调用
  },
  (error) => {
    if (!error.config?.noLoading) {
      loadingCount--;
      if (loadingCount === 0 && loadingInstance) {
        Spin.hide();
        loadingInstance = null;
      }
    }
    const errorMsg = error.response?.data?.message || '服务器异常，请联系管理员';
    message.error(errorMsg);
    return Promise.reject(error);
  }
);

export default request;