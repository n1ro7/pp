import request from './request';

// 获取仪表盘统计数据
export const fetchDashboardStats = async (userId) => {
  try {
    const response = await request.get('/dashboard/stats', { 
      params: { userId },
      noLoading: false
    });
    return response;
  } catch (error) {
    console.error('获取仪表盘统计数据失败:', error);
    throw error;
  }
};

// 获取资产分布数据
export const fetchAssetDistribution = async (userId) => {
  try {
    const response = await request.get('/dashboard/asset-distribution', { 
      params: { userId },
      noLoading: false
    });
    return response;
  } catch (error) {
    console.error('获取资产分布数据失败:', error);
    throw error;
  }
};

// 获取最近交易记录
export const fetchRecentTransactions = async (userId, limit = 10) => {
  try {
    const response = await request.get('/dashboard/recent-transactions', { 
      params: { userId, limit },
      noLoading: false
    });
    return response;
  } catch (error) {
    console.error('获取最近交易记录失败:', error);
    throw error;
  }
};