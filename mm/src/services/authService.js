import request from './request';

// 登录服务
export const login = async (username, password) => {
  try {
    // 这里是模拟的登录请求，实际项目中应该调用真实的后端API
    // const response = await request.post('/api/login', { username, password });
    // return response.data;
    
    // 模拟API响应
    return new Promise((resolve, reject) => {
      // 模拟网络延迟
      setTimeout(() => {
        // 简单的验证逻辑，实际项目中应该由后端完成
        if (username === 'admin' && password === 'admin123') {
          resolve({
            token: 'mock-jwt-token-' + Date.now(),
            user: {
              id: 1,
              username: 'admin',
              name: '管理员',
              role: 'admin'
            }
          });
        } else {
          reject(new Error('用户名或密码错误'));
        }
      }, 1000);
    });
  } catch (error) {
    throw error;
  }
};

// 退出登录
export const logout = () => {
  // 清除localStorage中的token和用户信息
  localStorage.removeItem('token');
  localStorage.removeItem('user');
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