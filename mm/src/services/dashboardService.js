import request from './request';

// 获取仪表盘统计数据
export const fetchDashboardStats = async (userId) => {
  try {
    // 模拟API返回数据，与三个核心组件的数据保持一致
    // 1. 未读消息数：从MessageList的模拟数据中获取，前6条为未读
    // 2. 待审核报告数：从ReportList的模拟数据中获取，状态为pending的有2条
    // 3. 总资产估值：从AssetHoldings的模拟数据中获取，默认1000万美元
    const mockData = {
      unreadMessages: 6,
      pendingReports: 2,
      totalAssetValue: 10000000,
      recentActivities: [
        {
          id: 1,
          type: 'message',
          title: '比特币价格突破重要阻力位',
          content: '比特币价格突破了近三个月来的重要阻力位，分析师预测短期内可能继续上涨。',
          status: 'unread',
          time: '2025-12-22 14:30:00'
        },
        {
          id: 2,
          type: 'report',
          title: '增加比特币持仓建议',
          content: '基于近期市场走势和技术指标分析，建议增加10%的比特币持仓比例。',
          status: 'pending',
          time: '2025-12-22 10:15:00'
        },
        {
          id: 3,
          type: 'message',
          title: '以太坊技术面出现看跌信号',
          content: '以太坊近期技术面出现看跌信号，建议投资者保持谨慎。',
          status: 'unread',
          time: '2025-12-21 16:45:00'
        }
      ]
    };
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockData;
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