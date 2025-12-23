import request from './request';

// 获取用户列表（支持搜索和分页）
export const getUsers = async (params = {}) => {
  try {
    // 过滤掉空值参数
    const filteredParams = {};
    for (const key in params) {
      if (params[key] !== '' && params[key] !== undefined && params[key] !== null) {
        filteredParams[key] = params[key];
      }
    }
    const response = await request.get('/admin/users', { params: filteredParams });
    return response;
  } catch (error) {
    console.error('获取用户列表失败:', error);
    throw error;
  }
};

// 重置用户密码
export const resetPassword = async (userId, newPassword) => {
  try {
    const response = await request.post(`/admin/users/${userId}/reset-password`, { newPassword });
    return response;
  } catch (error) {
    console.error('重置密码失败:', error);
    throw error;
  }
};

// 获取操作日志
export const getOperationLogs = async (params = {}) => {
  try {
    const response = await request.get('/admin/operation-logs', { params });
    return response;
  } catch (error) {
    console.error('获取操作日志失败:', error);
    throw error;
  }
};

// 删除用户
export const deleteUser = async (userId) => {
  try {
    const response = await request.delete(`/admin/users/${userId}`);
    return response;
  } catch (error) {
    console.error('删除用户失败:', error);
    throw error;
  }
};

// 添加用户
export const addUser = async (userData) => {
  try {
    const response = await request.post('/admin/users', userData);
    return response;
  } catch (error) {
    console.error('添加用户失败:', error);
    throw error;
  }
};

// 更新用户
export const updateUser = async (userId, userData) => {
  try {
    const response = await request.put(`/admin/users/${userId}`, userData);
    return response;
  } catch (error) {
    console.error('更新用户失败:', error);
    throw error;
  }
};

// 获取系统设置
export const getSystemSettings = async () => {
  try {
    const response = await request.get('/admin/system-settings');
    return response;
  } catch (error) {
    console.error('获取系统设置失败:', error);
    throw error;
  }
};

// 更新系统设置
export const updateSystemSettings = async (settings) => {
  try {
    const response = await request.put('/admin/system-settings', settings);
    return response;
  } catch (error) {
    console.error('更新系统设置失败:', error);
    throw error;
  }
};