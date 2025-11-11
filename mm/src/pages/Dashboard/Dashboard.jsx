import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Statistic, Space, message, Typography } from 'antd';
import {
  BellOutlined,
  FileTextOutlined,
  WalletOutlined,
  ReloadOutlined,
  BarChartOutlined,
  FileOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import request from '../../services/request';
import { fetchDashboardStats } from '../../services/dashboardService';

const { Title } = Typography;

const Dashboard = () => {
  const navigate = useNavigate();
  // 更新状态变量结构
  const [stats, setStats] = useState({
    totalAssets: 0,
    totalValue: 0,
    dailyChange: 0,
    monthlyChange: 0
  });

  // 修复数据获取逻辑
  const loadDashboardData = async () => {
    try {
      // 优先使用新的service，避免直接调用request
      const data = await fetchDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('获取仪表盘数据失败:', error);
      message.error('获取数据失败，请稍后重试');
      // 使用默认数据避免页面空白
      setStats({
        totalAssets: 42,
        totalValue: 1586240.50,
        dailyChange: 1.24,
        monthlyChange: 5.67
      });
    }
  };

  // 组件挂载时初始化数据
  useEffect(() => {
    loadDashboardData();
    // 保留定时刷新功能
    const timer = setInterval(loadDashboardData, 5 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  // 快速跳转函数
  const jumpToPage = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard-page" style={{ padding: '24px' }}>
      {/* 页面标题栏（含刷新按钮） */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2}>系统概览</Title>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={loadDashboardData}
          size="middle"
        >
          刷新数据
        </Button>
      </div>

      {/* 更新核心指标卡片布局 */}
      <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="总资产数量" 
              value={stats.totalAssets} 
              prefix={<WalletOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="总持仓价值" 
              value={stats.totalValue} 
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix="¥"
              suffix="元"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="今日变化" 
              value={stats.dailyChange} 
              precision={2}
              valueStyle={{ color: stats.dailyChange >= 0 ? '#3f8600' : '#cf1322' }}
              prefix={stats.dailyChange >= 0 ? '+' : ''}
              suffix="%"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic 
              title="本月变化" 
              value={stats.monthlyChange} 
              precision={2}
              valueStyle={{ color: stats.monthlyChange >= 0 ? '#3f8600' : '#cf1322' }}
              prefix={stats.monthlyChange >= 0 ? '+' : ''}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* 更新功能快速入口 */}
      <Card title="快捷操作" bordered style={{ marginBottom: '24px' }}>
        <Space size="middle" wrap style={{ display: 'flex', justifyContent: 'flex-start', padding: '16px 0' }}>
          <Button
            type="primary"
            icon={<BarChartOutlined />}
            onClick={() => jumpToPage('/asset-holdings')}
          >
            持仓数据
          </Button>
          <Button
            type="primary"
            icon={<FileTextOutlined />}
            onClick={() => jumpToPage('/report-list')}
          >
            报告审核
          </Button>
          <Button
            type="primary"
            icon={<FileOutlined />}
            onClick={() => jumpToPage('/asset-history')}
          >
            历史持仓
          </Button>
          <Button
            icon={<BellOutlined />}
            onClick={() => jumpToPage('/message-list')}
          >
            通知中心
          </Button>
        </Space>
      </Card>

      {/* 添加资产分布卡片 */}
      <Card title="资产分布" bordered>
        <div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>资产分布图表区域</p>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;