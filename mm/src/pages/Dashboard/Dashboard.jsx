import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Statistic, Space, message, Typography, Spin, Tooltip } from 'antd';
import { BellOutlined, FileTextOutlined, WalletOutlined, ReloadOutlined, BarChartOutlined, FileOutlined, UpOutlined, DownOutlined, PieChartOutlined, ClockCircleOutlined, AlertOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { fetchDashboardStats } from '../../services/dashboardService';

const { Title } = Typography;

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalAssets: 0,
    totalValue: 0,
    dailyChange: 0,
    monthlyChange: 0
  });
  const [loading, setLoading] = useState(false);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    const timer = setInterval(loadDashboardData, 5 * 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  const jumpToPage = (path) => {
    navigate(path);
  };

  // 获取变化趋势图标
  const getTrendIcon = (value) => {
    return value >= 0 ? 
      <UpOutlined style={{ color: '#3f8600', marginRight: 4 }} /> : 
      <DownOutlined style={{ color: '#cf1322', marginRight: 4 }} />;
  };

  // 统计卡片配置
  const statCards = [
    {
      key: 'totalAssets',
      title: '总资产数量',
      value: stats.totalAssets,
      prefix: <WalletOutlined style={{ color: '#1890ff' }} />,
      color: '#1890ff',
      bgGradient: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)'
    },
    {
      key: 'totalValue',
      title: '总持仓价值',
      value: stats.totalValue,
      precision: 2,
      prefix: '¥',
      suffix: '元',
      valueStyle: { color: '#3f8600' },
      color: '#3f8600',
      bgGradient: 'linear-gradient(135deg, #52c41a 0%, #95de64 100%)'
    },
    {
      key: 'dailyChange',
      title: '今日变化',
      value: stats.dailyChange,
      precision: 2,
      prefix: stats.dailyChange >= 0 ? '+' : '',
      suffix: '%',
      valueStyle: { color: stats.dailyChange >= 0 ? '#3f8600' : '#cf1322' },
      color: stats.dailyChange >= 0 ? '#3f8600' : '#cf1322',
      icon: getTrendIcon(stats.dailyChange),
      bgGradient: stats.dailyChange >= 0 ? 
        'linear-gradient(135deg, #52c41a 0%, #95de64 100%)' : 
        'linear-gradient(135deg, #ff4d4f 0%, #ff7a45 100%)'
    },
    {
      key: 'monthlyChange',
      title: '本月变化',
      value: stats.monthlyChange,
      precision: 2,
      prefix: stats.monthlyChange >= 0 ? '+' : '',
      suffix: '%',
      valueStyle: { color: stats.monthlyChange >= 0 ? '#3f8600' : '#cf1322' },
      color: stats.monthlyChange >= 0 ? '#3f8600' : '#cf1322',
      icon: getTrendIcon(stats.monthlyChange),
      bgGradient: stats.monthlyChange >= 0 ? 
        'linear-gradient(135deg, #52c41a 0%, #95de64 100%)' : 
        'linear-gradient(135deg, #ff4d4f 0%, #ff7a45 100%)'
    }
  ];

  return (
    <div className="dashboard-page" style={{ minHeight: '100%' }}>
      {/* 页面标题栏（含刷新按钮） */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '32px',
        padding: '24px 0 0 0'
      }}>
        <div>
          <Title level={2} style={{ 
            margin: 0, 
            color: '#262626',
            fontWeight: 600
          }}>
            系统概览
          </Title>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginTop: '8px', 
            color: '#8c8c8c',
            fontSize: '14px'
          }}>
            <ClockCircleOutlined style={{ marginRight: '4px' }} />
            <span>最后更新: {new Date().toLocaleString('zh-CN')}</span>
          </div>
        </div>
        <Tooltip title="刷新数据">
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={loadDashboardData}
            size="middle"
            loading={loading}
            style={{
              backgroundColor: '#1890ff',
              borderColor: '#1890ff',
              boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(24, 144, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(24, 144, 255, 0.3)';
            }}
          >
            刷新数据
          </Button>
        </Tooltip>
      </div>

      {/* 核心指标卡片布局 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
        {statCards.map((card) => (
          <Col xs={24} sm={12} lg={6} key={card.key}>
            <Card
              hoverable
              style={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
                overflow: 'hidden'
              }}
              bodyStyle={{
                padding: '24px',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
              }}
            >
              {/* 背景装饰 */}
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '100px',
                  height: '100px',
                  background: card.bgGradient,
                  opacity: 0.1,
                  borderRadius: '0 0 0 100px',
                  zIndex: 0
                }}
              />
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <Statistic 
                  title={card.title} 
                  value={card.value} 
                  precision={card.precision}
                  valueStyle={{ fontSize: '32px', fontWeight: 'bold' }}
                  prefix={card.prefix}
                  suffix={card.suffix}
                  formatter={(value) => {
                    if (card.icon) {
                      return (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          {card.icon}
                          <span>{value}</span>
                        </div>
                      );
                    }
                    return value;
                  }}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 功能快速入口 */}
      <Card 
        title="快捷操作" 
        bordered={false}
        style={{ 
          marginBottom: '32px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <Space size="middle" wrap style={{ 
          display: 'flex', 
          gap: '16px'
        }}>
          <Button
            type="primary"
            icon={<BarChartOutlined />}
            onClick={() => jumpToPage('/asset-holdings')}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(24, 144, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(24, 144, 255, 0.3)';
            }}
          >
            持仓数据
          </Button>
          <Button
            type="primary"
            icon={<FileTextOutlined />}
            onClick={() => jumpToPage('/report-list')}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(24, 144, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(24, 144, 255, 0.3)';
            }}
          >
            报告审核
          </Button>
          <Button
            type="primary"
            icon={<FileOutlined />}
            onClick={() => jumpToPage('/asset-history')}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(24, 144, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(24, 144, 255, 0.3)';
            }}
          >
            历史持仓
          </Button>
          <Tooltip title="您有3条未读消息">
            <Button
              icon={<BellOutlined />}
              onClick={() => jumpToPage('/message-list')}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
              }}
            >
              通知中心
            </Button>
          </Tooltip>
        </Space>
      </Card>

      {/* 资产分布卡片 */}
      <Card 
        title="资产分布" 
        bordered={false}
        style={{
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden'
        }}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ padding: '24px' }}>
          <div style={{ 
            height: 400, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f6f8fa 0%, #e9ecef 100%)',
            borderRadius: '8px',
            position: 'relative'
          }}>
            <div style={{ textAlign: 'center' }}>
              <PieChartOutlined style={{ fontSize: '48px', color: '#91d5ff', marginBottom: '16px' }} />
              <p style={{ color: '#8c8c8c', fontSize: '16px' }}>资产分布图表区域</p>
            </div>
            
            {/* 装饰元素 */}
            <div style={{ position: 'absolute', top: '20px', right: '20px', opacity: 0.1 }}>
              <AlertOutlined style={{ fontSize: '120px', color: '#1890ff' }} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;