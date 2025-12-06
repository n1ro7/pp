import request from './request';

// 登录服务
export const login = async (username, password) => {
  try {
    // 调用真实的后端API登录
    const response = await request.post('/auth/login', { username, password });
    // 保存token和用户信息到localStorage
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  } catch (error) {
    throw error;
  }
};

// 退出登录
export const logout = async () => {
  try {
    // 调用后端注销API
    await request.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // 清除localStorage中的token和用户信息
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// 获取当前登录用户信息
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  return null;
};

// 检查是否已登录
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};