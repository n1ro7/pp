import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Space, message, Typography, Select, Spin } from 'antd';
import { DownloadOutlined, CalendarOutlined } from '@ant-design/icons';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { exportAssetExcel } from '../../utils/exportExcel';
import { fetchAssetHoldings, updateAsset, fetchAssetHistory } from '../../services/assetService';
import { getCurrentUser } from '../../services/authService';
import { usePrice } from '../../contexts/PriceContext';

const { Title } = Typography;
const { Option } = Select;

// 币种颜色配置（与后端返回的assetType对应，固定配色确保一致性）
const ASSET_COLOR_MAP = {
  BTC: '#F7931A', // 比特币橙色
  ETH: '#627EEA', // 以太坊蓝色
  SOL: '#00FFA3', // Solana绿色
  USDT: '#26A17B', // USDT绿色
  DEFAULT: '#8884d8', // 默认颜色
};

const AssetHoldings = () => {
  const navigate = useNavigate();
  const { priceData } = usePrice(); // 使用价格上下文获取最新价格数据
  
  // 状态管理
  const [currentHoldings, setCurrentHoldings] = useState([]); // 当前持仓（饼图）
  const [historyHoldings, setHistoryHoldings] = useState([]); // 历史持仓（折线图）
  const [timeRange, setTimeRange] = useState('7days'); // 时间范围筛选
  const [exportLoading, setExportLoading] = useState(false); // 导出按钮loading
  const [totalValue, setTotalValue] = useState(0); // 总计金额（万美元）
  const [assets, setAssets] = useState([]); // 从API获取的原始资产数据
  
  // 1. 计算当前持仓数据
  const calculateHoldings = () => {
    try {
      if (assets.length === 0) return;
      
      // 定义固定比率
      const FIXED_RATES = {
        BTC: 40,
        ETH: 35,
        SOL: 15,
        USDT: 10
      };
      
      // 计算每个资产的当前价值
      const holdingsWithValues = assets.map(asset => {
        // 获取当前价格，如果没有获取到则使用成本价
        const currentPrice = priceData[asset.cryptoType] || asset.costPrice;
        // 计算当前价值（数量 * 当前价格）
        const currentValue = asset.quantity * currentPrice;
        
        return {
          ...asset,
          currentValue: currentValue
        };
      });
      
      // 计算总资产价值
      const total = holdingsWithValues.reduce((sum, asset) => sum + asset.currentValue, 0);
      
      // 处理数据，格式化为饼图需要的格式
      const formattedData = holdingsWithValues.map(asset => {
        // 使用固定比率
        const holdPercentage = FIXED_RATES[asset.cryptoType] || 0;
        // 格式化金额（转换为万美元，保留两位小数）
        const amount = asset.currentValue / 10000;
        
        return {
          name: asset.cryptoType || asset.name,
          value: holdPercentage,
          amount: amount,
          rateText: `${holdPercentage.toFixed(2)}%`
        };
      });
      
      // 更新状态
      setCurrentHoldings(formattedData);
      // 转换为万美元显示
      setTotalValue(total / 10000);
      
      // 同步更新数据到数据库 - 只更新必要的字段，避免干扰后端的其他逻辑
      const updateAssetPromises = assets.map(asset => {
        // 获取当前价格，如果没有获取到则使用成本价
        const currentPrice = priceData[asset.cryptoType] || asset.costPrice || 0;
        // 计算当前价值（数量 * 当前价格）
        const currentValue = asset.quantity * currentPrice;
        
        // 字段名使用下划线命名，与后端数据库表保持一致
        return updateAsset(asset.id, {
          price: currentPrice,
          current_value: currentValue
        });
      });
      
      // 并行执行所有更新请求
      Promise.all(updateAssetPromises)
        .then(() => {
          console.log('资产数据已同步到数据库');
        })
        .catch(error => {
          console.error('更新资产数据到数据库失败:', error);
        });
    } catch (error) {
      console.error('计算持仓数据失败:', error);
      // 失败时使用默认数据
      const formattedData = [
        { name: 'BTC', value: 40, amount: 400, rateText: '40%' },
        { name: 'ETH', value: 35, amount: 350, rateText: '35%' },
        { name: 'SOL', value: 15, amount: 150, rateText: '15%' },
        { name: 'USDT', value: 10, amount: 100, rateText: '10%' }
      ];
      setCurrentHoldings(formattedData);
      setTotalValue(1000);
    }
  };
  
  // 2. 获取当前持仓数据（API调用）
  const fetchCurrentHoldings = async () => {
    try {
      // 尝试调用API获取真实持仓数据
      const user = getCurrentUser();
      if (user) {
        const data = await fetchAssetHoldings(user.id);
        
        // 检查API返回的数据是否有效
        if (Array.isArray(data) && data.length > 0) {
          setAssets(data);
          calculateHoldings();
          return;
        } else {
          // 如果API返回空数据，使用默认数据
          setAssets([
            { id: 1, name: 'BTC', cryptoType: 'BTC', quantity: 66.666667, costPrice: 60000, type: '加密货币' },
            { id: 2, name: 'ETH', cryptoType: 'ETH', quantity: 1750, costPrice: 2000, type: '加密货币' },
            { id: 3, name: 'SOL', cryptoType: 'SOL', quantity: 15000, costPrice: 100, type: '加密货币' },
            { id: 4, name: 'USDT', cryptoType: 'USDT', quantity: 1000000, costPrice: 1, type: '加密货币' }
          ]);
          calculateHoldings();
        }
      }
    } catch (error) {
      console.error('获取当前持仓失败:', error);
      // 失败时使用默认数据
      setAssets([
        { id: 1, name: 'BTC', cryptoType: 'BTC', quantity: 66.666667, costPrice: 60000, type: '加密货币' },
        { id: 2, name: 'ETH', cryptoType: 'ETH', quantity: 1750, costPrice: 2000, type: '加密货币' },
        { id: 3, name: 'SOL', cryptoType: 'SOL', quantity: 15000, costPrice: 100, type: '加密货币' },
        { id: 4, name: 'USDT', cryptoType: 'USDT', quantity: 1000000, costPrice: 1, type: '加密货币' }
      ]);
      calculateHoldings();
    }
  };

  // 2. 获取历史持仓数据
  const fetchHistoryHoldings = async () => {
    try {
      // 调用API获取真实历史数据
      const user = getCurrentUser();
      if (user) {
        const data = await fetchAssetHistory(user.id, timeRange);
        setHistoryHoldings(data);
      } else {
        // 如果没有用户信息，使用空数组
        setHistoryHoldings([]);
      }
    } catch (error) {
      console.error('获取历史持仓失败:', error);
      setHistoryHoldings([]);
    }
  };

  // 3. 初始化数据 + 时间范围变化时更新
  useEffect(() => {
    fetchCurrentHoldings();
    fetchHistoryHoldings();
  }, [timeRange]);
  
  // 4. 当价格数据变化时重新计算持仓数据
  useEffect(() => {
    calculateHoldings();
  }, [priceData, assets]);

  // 4. 处理Excel导出
  const handleExport = async () => {
    setExportLoading(true);
    try {
      // 使用当前数据进行导出
      const success = exportAssetExcel(currentHoldings, historyHoldings, timeRange);
      if (success) {
        message.success('数据导出成功');
      } else {
        message.error('Excel导出失败，请稍后重试');
      }
    } catch (error) {
      message.error('导出失败，请稍后重试');
      console.error('导出失败:', error);
    } finally {
      setExportLoading(false);
    }
  };

  // 5. 时间范围筛选变化
  const handleTimeRangeChange = (value) => {
    setTimeRange(value);
  };

  return (
    <div className="asset-holdings-page" style={{ padding: '40px 24px 24px' }}>
      {/* 页面标题栏（含筛选+导出） */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={4}>持仓数据管理</Title>
        <Space size="middle">
          {/* 时间范围筛选 */}
          <Select
            defaultValue={timeRange}
            style={{ width: 180 }}
            onChange={handleTimeRangeChange}
            prefix={<CalendarOutlined />}
            options={[
              { label: '近7天', value: '7days' },
              { label: '近30天', value: '30days' },
            ]}
          />

          {/* 导出按钮 */}
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExport}
            loading={exportLoading}
          >
            导出Excel
          </Button>

          {/* 返回按钮 */}
          <Button
            onClick={() => navigate('/dashboard')}
          >
            返回概览
          </Button>
        </Space>
      </div>

      {/* 图表区域（2行1列，上下布局） */}
      <Row gutter={[24, 24]}>
        {/* 1. 当前持仓饼图 */}
        <Col xs={24}>
          <Card title={`当前资产占比（总计：${totalValue.toFixed(2)}万美元）`}>
            {currentHoldings.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <PieChart style={{ border: 'none', outline: 'none' }}>
                  <Pie
                    data={currentHoldings}
                    cx="50%" // 饼图中心x坐标
                    cy="50%" // 饼图中心y坐标
                    labelLine={false} // 隐藏标签连接线
                    // 自定义标签内容（显示币种+占比+金额）
                    label={({ name, value, amount }) => `${name}：${value}%（${amount}万美元）`}
                    outerRadius={140} // 饼图外半径，减小以防止标签被截断
                    fill="#8884d8"
                    dataKey="value" // 饼图数据字段（占比）
                    animationDuration={1000} // 动画时长
                  >
                    {/* 为每个币种设置颜色 */}
                    {currentHoldings.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={ASSET_COLOR_MAP[entry.name] || ASSET_COLOR_MAP.DEFAULT}
                      />
                    ))}
                  </Pie>
                  {/*  tooltip：鼠标悬停显示详情 */}
                  <Tooltip
                    formatter={(value) => [`${Math.round(value)}%`, '资产占比']}
                    contentStyle={{ width: '120px', borderRadius: '4px' }}
                  />
                  {/* 图例 */}
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              // 无数据时显示空状态
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <Spin size="middle" tip="暂无当前持仓数据">
                  <div style={{ height: '100px' }}></div>
                </Spin>
              </div>
            )}
          </Card>
        </Col>

        {/* 2. 历史持仓折线图 */}
        <Col xs={24}>
          <Card title={`${timeRange === '7days' ? '近7日' : '近30日'}持仓占比变化`} variant="outlined">
            {historyHoldings.length > 0 ? (
              <ResponsiveContainer width="100%" height={450}>
                <LineChart
                  data={historyHoldings}
                  margin={{ top: 10, right: 30, left: 20, bottom: 60 }} // 增加底部边距，确保标签显示完整
                  style={{ border: 'none', outline: 'none' }}
                  onMouseMove={(e) => {
                    // 可以添加自定义鼠标移动事件
                  }}
                >
                  {/* 网格线：改进样式 */}
                  <CartesianGrid 
                    strokeDasharray="5 5" 
                    opacity={0.2} 
                    stroke="#f0f0f0"
                  />
                  {/* x轴（日期）：改进样式和可读性 */}
                  <XAxis
                    dataKey="date"
                    angle={-45} 
                    textAnchor="end"
                    height={80} 
                    tick={{ fontSize: 12, fill: '#666' }}
                    tickLine={{ stroke: '#e0e0e0' }}
                    axisLine={{ stroke: '#e0e0e0' }}
                  />
                  {/* y轴（占比%）：改进样式 */}
                  <YAxis
                    label={{ 
                      value: '占比(%)', 
                      angle: -90, 
                      position: 'insideLeft', 
                      style: { 
                        textAnchor: 'middle',
                        fontSize: 14,
                        fill: '#666'
                      } 
                    }}
                    domain={[0, 'dataMax + 5']}
                    tickFormatter={(value) => `${value}%`}
                    tick={{ fontSize: 12, fill: '#666' }}
                    tickLine={{ stroke: '#e0e0e0' }}
                    axisLine={{ stroke: '#e0e0e0' }}
                    // 增加y轴刻度线
                    interval="preserveStartEnd"
                  />
                  {/* 自定义tooltip：改进样式和信息展示 */}
                  <Tooltip
                    formatter={(value, name) => {
                      const asset = currentHoldings.find(a => a.name === name);
                      const color = asset ? ASSET_COLOR_MAP[asset.name] || ASSET_COLOR_MAP.DEFAULT : '#888';
                      return [
                        <span style={{ color, fontWeight: 'bold' }}>{value}%</span>, 
                        <span style={{ color: '#666' }}>{name}占比</span>
                      ];
                    }}
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                      padding: '12px',
                      fontSize: '14px'
                    }}
                    labelFormatter={(label) => (
                      <span style={{ fontWeight: 'bold', color: '#333' }}>日期：{label}</span>
                    )}
                    // 添加交错显示效果，避免tooltip重叠
                    wrapperStyle={{ zIndex: 1000 }}
                  />
                  {/* 图例：改进样式 */}
                  <Legend 
                    verticalAlign="top" 
                    height={40}
                    wrapperStyle={{ paddingBottom: '20px' }}
                    iconType="line" // 使用线条图标，与折线图保持一致
                    formatter={(value) => (
                      <span style={{ 
                        fontSize: '14px',
                        color: '#333',
                        fontWeight: '500'
                      }}>{value}</span>
                    )}
                  />
                  {/* 动态生成各币种折线：改进样式和交互 */}
                  {currentHoldings.map((asset) => (
                    <Line
                      key={asset.name}
                      type="monotone"
                      dataKey={asset.name}
                      name={asset.name}
                      stroke={ASSET_COLOR_MAP[asset.name] || ASSET_COLOR_MAP.DEFAULT}
                      strokeWidth={2.5} // 增加线条宽度，提高可读性
                      dot={{ 
                        r: 4, 
                        strokeWidth: 2,
                        fill: '#fff',
                        stroke: ASSET_COLOR_MAP[asset.name] || ASSET_COLOR_MAP.DEFAULT
                      }}
                      activeDot={{ 
                        r: 8, 
                        strokeWidth: 2,
                        fill: ASSET_COLOR_MAP[asset.name] || ASSET_COLOR_MAP.DEFAULT,
                        stroke: '#fff',
                        cursor: 'pointer'
                      }}
                      animationDuration={1500}
                      animationEasing="ease-out"
                      // 添加填充区域，提高视觉效果
                      fill={ASSET_COLOR_MAP[asset.name] || ASSET_COLOR_MAP.DEFAULT}
                      fillOpacity={0.1}
                      // 添加事件监听
                      onClick={(data) => {
                        console.log(`${asset.name} - ${data.date}: ${data[asset.name]}%`);
                        // 可以添加点击事件处理，如显示详细信息
                      }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              // 无数据时显示更友好的空状态
              <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                <div style={{ 
                  fontSize: '48px', 
                  marginBottom: '16px',
                  opacity: 0.3
                }}>
                  📊
                </div>
                <h3 style={{ marginBottom: '8px', color: '#333' }}>暂无历史数据</h3>
                <p style={{ color: '#999', marginBottom: '24px' }}>
                  系统将定期保存您的资产快照，数据将在保存后显示
                </p>
                <Button 
                  type="primary" 
                  onClick={() => fetchHistoryHoldings()}
                >
                  刷新数据
                </Button>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AssetHoldings;