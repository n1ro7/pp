// 模拟获取仪表盘统计数据
export const fetchDashboardStats = async () => {
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 返回模拟数据
  return {
    totalAssets: 42,
    totalValue: 1586240.50,
    dailyChange: 1.24,
    monthlyChange: 5.67
  };
};