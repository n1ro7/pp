import request from './request';

// 获取用户持仓数据
export const fetchAssetHoldings = async (userId) => {
  try {
    // 调用真实的后端API获取资产列表
    const response = await request.get('/assets', { 
      params: { userId },
      noLoading: false
    });
    return response;
  } catch (error) {
    console.error('获取资产数据失败:', error);
    throw error;
  }
};

// 根据类型获取资产
export const fetchAssetsByType = async (userId, type) => {
  try {
    const response = await request.get('/assets', { 
      params: { userId, type },
      noLoading: false
    });
    return response;
  } catch (error) {
    console.error('获取资产数据失败:', error);
    throw error;
  }
};

// 获取资产详情
export const fetchAssetDetail = async (assetId) => {
  try {
    const response = await request.get(`/assets/${assetId}`, { 
      noLoading: false
    });
    return response;
  } catch (error) {
    console.error('获取资产详情失败:', error);
    throw error;
  }
};

// 添加资产
export const addAsset = async (assetData) => {
  try {
    const response = await request.post('/assets', assetData, { 
      noLoading: false
    });
    return response;
  } catch (error) {
    console.error('添加资产失败:', error);
    throw error;
  }
};

// 更新资产
export const updateAsset = async (assetId, assetData) => {
  try {
    const response = await request.put(`/assets/${assetId}`, assetData, { 
      noLoading: false
    });
    return response;
  } catch (error) {
    console.error('更新资产失败:', error);
    throw error;
  }
};

// 删除资产
export const deleteAsset = async (assetId) => {
  try {
    const response = await request.delete(`/assets/${assetId}`, { 
      noLoading: false
    });
    return response;
  } catch (error) {
    console.error('删除资产失败:', error);
    throw error;
  }
};

// 获取资产统计数据
export const fetchAssetStats = async (userId) => {
  try {
    const response = await request.get(`/assets/stats/${userId}`, { 
      noLoading: false
    });
    return response;
  } catch (error) {
    console.error('获取资产统计数据失败:', error);
    throw error;
  }
};

// 批量更新资产当前价值和占比数据
export const batchUpdateAssetValues = async (assetValues) => {
  try {
    const response = await request.post('/assets/batch-update', assetValues, { 
      noLoading: false
    });
    return response;
  } catch (error) {
    console.error('批量更新资产价值失败:', error);
    throw error;
  }
};