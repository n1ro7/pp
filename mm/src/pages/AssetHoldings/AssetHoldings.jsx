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
      // 优先使用模拟数据服务
      const mockData = await fetchAssetHoldings();
      // 转换模拟数据为饼图格式
      const totalValue = mockData.reduce((sum, asset) => sum + asset.currentValue, 0);
      const formatted = mockData.map((item) => ({
        name: item.name, // 资产名称
        value: (item.currentValue / totalValue * 100) || 0, // 计算占比（%）
        amount: item.currentValue / 10000, // 转换为万美元
        rateText: `${((item.currentValue / totalValue * 100) || 0).toFixed(2)}%`, // 占比文本（带%）
      }));
      setCurrentHoldings(formatted);
    } catch (error) {
      console.error('获取当前持仓失败:', error);
      // 使用默认数据避免页面空白
      setCurrentHoldings([
        { name: '股票A', value: 25.5, amount: 255, rateText: '25.50%' },
        { name: '债券B', value: 15.8, amount: 158, rateText: '15.80%' },
        { name: '基金C', value: 30.2, amount: 302, rateText: '30.20%' },
        { name: '房产D', value: 25.0, amount: 250, rateText: '25.00%' },
        { name: '现金E', value: 3.5, amount: 35, rateText: '3.50%' },
      ]);
    }
  };

  // 2. 获取历史持仓数据（使用模拟数据）
  const fetchHistoryHoldings = async () => {
    try {
      // 生成模拟的历史数据
      const days = timeRange === '7days' ? 7 : 30;
      const historyData = [];
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
        
        // 生成有波动的模拟数据
        historyData.push({
          date: dateStr,
          '股票A': 25 + Math.random() * 5 - 2.5,
          '债券B': 15 + Math.random() * 3 - 1.5,
          '基金C': 30 + Math.random() * 6 - 3,
          '房产D': 25 + Math.random() * 4 - 2,
          '现金E': 5 + Math.random() * 2 - 1
        });
      }
      setHistoryHoldings(historyData);
    } catch (error) {
      console.error('获取历史持仓失败:', error);
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
    <div className="asset-holdings-page" style={{ padding: '24px' }}>
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
          <Card title="当前资产占比（总计：1000万美元）" bordered>
            {currentHoldings.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={currentHoldings}
                    cx="50%" // 饼图中心x坐标
                    cy="50%" // 饼图中心y坐标
                    labelLine={false} // 隐藏标签连接线
                    // 自定义标签内容（显示币种+占比+金额）
                    label={({ name, rateText, amount }) => `${name}：${rateText}（${amount}万美元）`}
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
                    formatter={(value) => [`${value}%`, '资产占比']}
                    contentStyle={{ width: '120px', borderRadius: '4px' }}
                  />
                  {/* 图例 */}
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              // 无数据时显示空状态
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <Spin size="middle" tip="暂无当前持仓数据" />
              </div>
            )}
          </Card>
        </Col>

        {/* 2. 历史持仓折线图 */}
        <Col xs={24}>
          <Card title={`${timeRange === '7days' ? '近7日' : '近30日'}持仓占比变化`} bordered>
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
                <Spin size="middle" tip="暂无历史持仓数据" />
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AssetHoldings;