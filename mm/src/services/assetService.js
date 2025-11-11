// 模拟获取持仓数据
export const fetchAssetHoldings = async () => {
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 返回模拟数据
  return [
    {
      id: 1,
      name: '股票A',
      type: '股票',
      quantity: 1000,
      price: 156.78,
      currentValue: 156780,
      costPrice: 145.50,
      profitRate: 7.75
    },
    {
      id: 2,
      name: '债券B',
      type: '债券',
      quantity: 500,
      price: 102.34,
      currentValue: 51170,
      costPrice: 100.00,
      profitRate: 2.34
    },
    {
      id: 3,
      name: '基金C',
      type: '基金',
      quantity: 2000,
      price: 234.56,
      currentValue: 469120,
      costPrice: 210.89,
      profitRate: 11.22
    },
    {
      id: 4,
      name: '房产D',
      type: '房产',
      quantity: 2,
      price: 4500000,
      currentValue: 9000000,
      costPrice: 3800000,
      profitRate: 18.42
    },
    {
      id: 5,
      name: '现金E',
      type: '现金',
      quantity: 1,
      price: 100000,
      currentValue: 100000,
      costPrice: 100000,
      profitRate: 0
    }
  ];
};