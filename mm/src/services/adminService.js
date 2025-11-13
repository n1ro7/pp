import request from './request';

// 获取用户列表（支持搜索和分页）
export const getUsers = async (params = {}) => {
  try {
    // 模拟API响应
    return new Promise((resolve) => {
      setTimeout(() => {
        let mockUsers = [
          { id: 1, username: 'admin', name: '管理员', role: 'admin', email: 'admin@example.com', status: 'active', createdAt: '2024-01-01 10:00:00' },
          { id: 2, username: 'user1', name: '用户一', role: 'user', email: 'user1@example.com', status: 'active', createdAt: '2024-01-02 14:30:00' },
          { id: 3, username: 'user2', name: '用户二', role: 'user', email: 'user2@example.com', status: 'inactive', createdAt: '2024-01-03 09:15:00' },
          { id: 4, username: 'user3', name: '张三', role: 'user', email: 'zhangsan@example.com', status: 'active', createdAt: '2024-01-04 11:45:00' },
          { id: 5, username: 'user4', name: '李四', role: 'user', email: 'lisi@example.com', status: 'active', createdAt: '2024-01-05 16:20:00' }
        ];
        
        // 搜索过滤
        if (params.search) {
          const searchTerm = params.search.toLowerCase();
          mockUsers = mockUsers.filter(user => 
            user.username.toLowerCase().includes(searchTerm) ||
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
          );
        }
        
        // 角色过滤
        if (params.role) {
          mockUsers = mockUsers.filter(user => user.role === params.role);
        }
        
        // 状态过滤
        if (params.status) {
          mockUsers = mockUsers.filter(user => user.status === params.status);
        }
        
        // 分页处理
        const page = params.page || 1;
        const pageSize = params.pageSize || 10;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedUsers = mockUsers.slice(startIndex, endIndex);
        
        resolve({
          users: paginatedUsers,
          total: mockUsers.length,
          page,
          pageSize
        });
      }, 500);
    });
  } catch (error) {
    console.error('获取用户列表失败:', error);
    throw error;
  }
};

// 重置用户密码
export const resetPassword = async (userId, newPassword) => {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, userId, message: '密码重置成功' });
      }, 500);
    });
  } catch (error) {
    console.error('重置密码失败:', error);
    throw error;
  }
};

// 获取操作日志
export const getOperationLogs = async (params = {}) => {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockLogs = [
          { id: 1, operator: 'admin', action: '登录系统', target: '系统', time: '2024-01-15 10:05:32', ip: '192.168.1.100' },
          { id: 2, operator: 'admin', action: '创建用户', target: 'user3', time: '2024-01-15 09:45:18', ip: '192.168.1.100' },
          { id: 3, operator: 'user1', action: '查看报告', target: 'report-20240114', time: '2024-01-15 09:30:05', ip: '192.168.1.101' },
          { id: 4, operator: 'admin', action: '修改系统设置', target: 'notificationEnabled', time: '2024-01-15 09:15:22', ip: '192.168.1.100' },
          { id: 5, operator: 'user2', action: '查看资产', target: 'BTC', time: '2024-01-15 08:55:47', ip: '192.168.1.102' },
          { id: 6, operator: 'admin', action: '禁用用户', target: 'user2', time: '2024-01-15 08:30:10', ip: '192.168.1.100' }
        ];
        
        // 过滤
        let filteredLogs = mockLogs;
        if (params.operator) {
          filteredLogs = filteredLogs.filter(log => log.operator.toLowerCase().includes(params.operator.toLowerCase()));
        }
        if (params.action) {
          filteredLogs = filteredLogs.filter(log => log.action.toLowerCase().includes(params.action.toLowerCase()));
        }
        
        // 分页
        const page = params.page || 1;
        const pageSize = params.pageSize || 10;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedLogs = filteredLogs.slice(startIndex, endIndex);
        
        resolve({
          logs: paginatedLogs,
          total: filteredLogs.length
        });
      }, 500);
    });
  } catch (error) {
    console.error('获取操作日志失败:', error);
    throw error;
  }
};

// 添加用户
export const addUser = async (userData) => {
  try {
    // 模拟API响应
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Date.now(),
          ...userData,
          status: 'active'
        });
      }, 500);
    });
  } catch (error) {
    console.error('添加用户失败:', error);
    throw error;
  }
};

// 更新用户
export const updateUser = async (userId, userData) => {
  try {
    // 模拟API响应
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ id: userId, ...userData });
      }, 500);
    });
  } catch (error) {
    console.error('更新用户失败:', error);
    throw error;
  }
};

// 删除用户
export const deleteUser = async (userId) => {
  try {
    // 模拟API响应
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, id: userId });
      }, 500);
    });
  } catch (error) {
    console.error('删除用户失败:', error);
    throw error;
  }
};

// 获取系统设置
export const getSystemSettings = async () => {
  try {
    // 模拟API响应
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          siteName: '数字货币投资系统',
          theme: 'dark',
          defaultLanguage: 'zh-CN',
          maxUploadSize: 100,
          apiTimeout: 30000,
          autoLogoutTime: 60, // 分钟
          autoLogoutEnabled: true,
          passwordComplexityEnabled: true,
          notificationEnabled: true,
          emailNotification: true,
          smsNotification: false,
          logEnabled: true,
          dataRefreshInterval: 30, // 秒
          cacheTime: 10 // 分钟
        });
      }, 500);
    });
  } catch (error) {
    console.error('获取系统设置失败:', error);
    throw error;
  }
};

// 更新系统设置
export const updateSystemSettings = async (settings) => {
  try {
    // 模拟API响应
    return new Promise((resolve) => {
      setTimeout(() => {
        // 模拟保存到后端
        console.log('系统设置已更新:', settings);
        resolve({
          success: true,
          message: '系统设置保存成功',
          data: settings
        });
      }, 500);
    });
  } catch (error) {
    console.error('更新系统设置失败:', error);
    throw error;
  }
};