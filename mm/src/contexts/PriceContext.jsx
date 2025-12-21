import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchCryptoPriceRanking } from '../services/cryptoPriceService';

// 创建价格上下文
const PriceContext = createContext();

// 价格上下文提供者组件
export const PriceProvider = ({ children }) => {
  // 存储最新的价格数据，格式为：{ BTC: 605828.06, ETH: 20820.10, SOL: 895.20, USDT: 7.04 }
  const [priceData, setPriceData] = useState({});
  // 存储价格数据加载状态
  const [loading, setLoading] = useState(false);

  // 加载价格数据
  const loadPriceData = async () => {
    setLoading(true);
    try {
      const data = await fetchCryptoPriceRanking(50);
      // 将价格数据转换为以symbol为key的对象
      const formattedPriceData = {};
      data.forEach(item => {
        formattedPriceData[item.symbol] = item.price;
      });
      setPriceData(formattedPriceData);
    } catch (error) {
      console.error('加载价格数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时加载价格数据
  useEffect(() => {
    loadPriceData();
    // 每30秒自动刷新价格数据
    const interval = setInterval(loadPriceData, 30000);
    return () => clearInterval(interval);
  }, []);

  // 手动刷新价格数据
  const refreshPriceData = async () => {
    await loadPriceData();
  };

  // 提供给上下文的值
  const contextValue = {
    priceData,
    loading,
    refreshPriceData
  };

  return (
    <PriceContext.Provider value={contextValue}>
      {children}
    </PriceContext.Provider>
  );
};

// 自定义钩子，方便组件使用价格上下文
export const usePrice = () => {
  const context = useContext(PriceContext);
  if (!context) {
    throw new Error('usePrice必须在PriceProvider内部使用');
  }
  return context;
};
