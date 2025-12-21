import request from './request';

// 获取数字货币价格排行数据
export const fetchCryptoPriceRanking = async (limit = 100) => {
  try {
    const response = await request.get('/crypto/prices', {
      params: { limit },
      noLoading: false
    });
    return response;
  } catch (error) {
    console.error('获取数字货币价格排行数据失败:', error);
    // 删除模拟数据，返回空数组
    return [];
  }
};

// 获取单个数字货币价格详情
export const fetchCryptoPriceDetail = async (symbol) => {
  try {
    const response = await request.get(`/crypto/prices/${symbol}`);
    return response;
  } catch (error) {
    console.error(`获取${symbol}价格详情失败:`, error);
    // 删除模拟数据，返回null
    return null;
  }
};

// 更新单个数字货币价格
export const updateCryptocurrencyPrice = async (symbol, price) => {
  try {
    const response = await request.put(`/crypto/prices/${symbol}`, {
      price
    });
    return response;
  } catch (error) {
    console.error(`更新${symbol}价格失败:`, error);
    throw error;
  }
};

// 批量更新数字货币价格
export const batchUpdateCryptocurrencyPrices = async (updateDataList) => {
  try {
    const response = await request.put(`/crypto/prices/batch`, updateDataList);
    return response;
  } catch (error) {
    console.error('批量更新价格失败:', error);
    throw error;
  }
};