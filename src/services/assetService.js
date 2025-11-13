// 模拟获取持仓数据
export const fetchAssetHoldings = async () => {
  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 返回模拟数据 - 重新分配资产价值，使比例更有层次感
  return [
    {
      id: 1,
      name: '股票A',
      type: '股票',
      quantity: 15000,
      price: 350.00,
      currentValue: 5250000,
      costPrice: 320.00,
      profitRate: 9.38
    },
    {
      id: 2,
      name: '债券B',
      type: '债券',
      quantity: 30000,
      price: 100.00,
      currentValue: 3000000,
      costPrice: 95.00,
      profitRate: 5.26
    },
    {
      id: 3,
      name: '基金C',
      type: '基金',
      quantity: 8000,
      price: 200.00,
      currentValue: 1600000,
      costPrice: 180.00,
      profitRate: 11.11
    },
    {
      id: 4,
      name: '房产D',
      type: '房产',
      quantity: 1,
      price: 3500000,
      currentValue: 3500000,
      costPrice: 3200000,
      profitRate: 9.38
    },
    {
      id: 5,
      name: '现金E',
      type: '现金',
      quantity: 1,
      price: 650000,
      currentValue: 650000,
      costPrice: 650000,
      profitRate: 0
    }
  ];
};