import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// 资产上下文
export const AssetContext = createContext();

// 资产上下文提供者组件
export const AssetProvider = ({ children }) => {
  // 存储当前持仓数据
  const [currentHoldings, setCurrentHoldings] = useState([]);
  // 存储总资产估值（元），初始化值为10000000（1000万元）
  const [totalAssetValue, setTotalAssetValue] = useState(10000000);
  // 存储资产加载状态
  const [loading, setLoading] = useState(false);
  
  // 更新总资产估值
  const updateTotalAssetValue = useCallback((value) => {
    // 确保值为数字类型，避免显示NaN
    const numericValue = typeof value === 'number' ? value : 0;
    console.log('更新总资产估值:', numericValue);
    setTotalAssetValue(numericValue);
  }, []);
  
  // 更新当前持仓数据
  const updateCurrentHoldings = useCallback((holdings) => {
    setCurrentHoldings(holdings);
  }, []);
  
  // 重置资产数据
  const resetAssets = useCallback(() => {
    setCurrentHoldings([]);
    setTotalAssetValue(0);
  }, []);
  
  // 提供给上下文的值
  const contextValue = {
    currentHoldings,
    totalAssetValue,
    loading,
    updateTotalAssetValue,
    updateCurrentHoldings,
    resetAssets
  };

  return (
    <AssetContext.Provider value={contextValue}>
      {children}
    </AssetContext.Provider>
  );
};

// 自定义钩子，方便组件使用资产上下文
export const useAsset = () => {
  const context = useContext(AssetContext);
  if (!context) {
    throw new Error('useAsset必须在AssetProvider内部使用');
  }
  return context;
};
