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
import request from '../../services/request';
import { exportAssetExcel } from '../../utils/exportExcel';
import { fetchAssetHoldings } from '../../services/assetService';
import { getCurrentUser } from '../../services/authService';

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
  // 状态管理
  const [currentHoldings, setCurrentHoldings] = useState([]); // 当前持仓（饼图）
  const [historyHoldings, setHistoryHoldings] = useState([]); // 历史持仓（折线图）
  const [timeRange, setTimeRange] = useState('7days'); // 时间范围筛选
  const [exportLoading, setExportLoading] = useState(false); // 导出按钮loading

  // 1. 获取当前持仓数据
  const fetchCurrentHoldings = async () => {
    try {
      // 获取当前用户信息
      const currentUser = getCurrentUser();
      
      // 调用真实API获取资产数据
      if (currentUser && currentUser.id) {
        const assetData = await fetchAssetHoldings(currentUser.id);
        
        // 转换API数据为饼图格式
        if (assetData && assetData.length > 0) {
          const totalValue = assetData.reduce((sum, asset) => sum + (asset.currentValue || 0), 0);
          const formatted = assetData.map((item) => {
              const percentage = Math.round(((item.currentValue || 0) / totalValue * 100) || 0); // 计算占比并取整
              return {
                name: item.name || '未知资产', // 资产名称
                value: percentage, // 计算占比（%）已取整
                amount: ((item.currentValue || 0) / 10000), // 转换为万美元
                rateText: `${percentage}%`, // 占比文本（带%，整数显示）
              };
            });
          setCurrentHoldings(formatted);
        } else {
          setCurrentHoldings([]);
        }
      } else {
        setCurrentHoldings([]);
      }
    } catch (error) {
      console.error('获取当前持仓失败:', error);
      setCurrentHoldings([]);
    }
  };

  // 2. 获取历史持仓数据
  const fetchHistoryHoldings = async () => {
    try {
      // 实际应用中应调用API获取历史数据
      // const response = await fetch(`/api/holdings/history?userId=${currentUser.id}&timeRange=${timeRange}`);
      // const historyData = await response.json();
      // setHistoryHoldings(historyData);
      
      // 暂时返回空数据
      setHistoryHoldings([]);
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
          <Card title="当前资产占比（总计：1000万美元）" variant="outlined">
            {currentHoldings.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={currentHoldings}
                    cx="50%" // 饼图中心x坐标
                    cy="50%" // 饼图中心y坐标
                    labelLine={false} // 隐藏标签连接线
                    // 自定义标签内容（显示币种+占比+金额）
                    label={({ name, value, amount }) => `${name}：${value}%（${amount}万美元）`}
                    outerRadius={160} // 饼图外半径
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
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={historyHoldings}
                  margin={{ top: 5, right: 30, left: 20, bottom: 30 }} // 图表边距（避免x轴标签被截断）
                >
                  {/* 网格线 */}
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  {/* x轴（日期） */}
                  <XAxis
                    dataKey="date"
                    angle={-45} // 标签倾斜45度，避免重叠
                    textAnchor="end"
                    height={60} // 预留足够高度显示倾斜标签
                  />
                  {/* y轴（占比%） */}
                  <YAxis
                    label={{ value: '占比(%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                    domain={[0, 'dataMax + 5']} // y轴范围：0到最大数据+5（避免最高点贴顶）
                    tickFormatter={(value) => `${value}%`} // 格式化y轴标签（添加%）
                  />
                  {/* tooltip */}
                  <Tooltip
                    formatter={(value) => [`${value}%`, '占比']}
                    contentStyle={{ borderRadius: '4px' }}
                    labelFormatter={(label) => `日期：${label}`} // 格式化tooltip标题
                  />
                  {/* 图例 */}
                  <Legend verticalAlign="top" height={36} />
                  {/* 动态生成各币种折线 */}
                  {currentHoldings.map((asset) => (
                    <Line
                      key={asset.name}
                      type="monotone" // 平滑折线
                      dataKey={asset.name} // 对应历史数据中的币种key
                      name={asset.name} // 图例名称
                      stroke={ASSET_COLOR_MAP[asset.name] || ASSET_COLOR_MAP.DEFAULT}
                      strokeWidth={2} // 线条宽度
                      dot={{ r: 4 }} // 数据点半径
                      activeDot={{ r: 6 }} // 鼠标悬停数据点半径
                      animationDuration={1000}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              // 无数据时显示空状态
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <Spin size="middle" tip="暂无历史持仓数据">
                  <div style={{ height: '100px' }}></div>
                </Spin>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AssetHoldings;