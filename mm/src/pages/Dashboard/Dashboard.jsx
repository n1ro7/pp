import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Statistic, Space, message, Typography, Spin, Tooltip, List, Tag } from 'antd';
import { BellOutlined, FileTextOutlined, WalletOutlined, ReloadOutlined, BarChartOutlined, FileOutlined, ArrowUpOutlined, ArrowDownOutlined, PieChartOutlined, ClockCircleOutlined, AlertOutlined, MessageOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { fetchDashboardStats } from '../../services/dashboardService';
import { getCurrentUser } from '../../services/authService';

const { Title } = Typography;

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    unreadMessages: 0,
    pendingReports: 0,
    totalAssetValue: 0,
    recentActivities: []
  });
  const [loading, setLoading] = useState(false);

  // 生成模拟数据
  const generateMockDashboardData = () => ({
    unreadMessages: 5,
    pendingReports: 3,
    totalAssetValue: 1586240.50,
    recentActivities: [
      {
        id: 1,
        type: 'message',
        title: '比特币价格突破45000美元',
        content: '比特币价格今日突破45000美元关口，创三个月新高',
        time: '10分钟前',
        status: 'unread'
      },
      {
        id: 2,
        type: 'report',
        title: '以太坊技术分析报告',
        content: 'AI生成的最新以太坊技术分析报告需要审核',
        time: '30分钟前',
        status: 'pending'
      },
      {
        id: 3,
        type: 'message',
        title: 'DeFi协议安全事件提醒',
        content: '某DeFi协议出现安全漏洞，建议关注相关资产',
        time: '1小时前',
        status: 'unread'
      }
    ]
  });

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // 获取当前用户信息
      const currentUser = getCurrentUser();
      if (!currentUser || !currentUser.id) {
        throw new Error('用户未登录或用户信息不完整');
      }
      
      // 调用API获取仪表盘数据，传递userId
      const data = await fetchDashboardStats(currentUser.id);
      // 转换API数据格式以适应新的UI需求
      setDashboardData({
        unreadMessages: data.unreadMessages || 5,
        pendingReports: data.pendingReports || 3,
        totalAssetValue: data.totalAssetValue || 1586240.50,
        recentActivities: data.recentActivities || generateMockDashboardData().recentActivities
      });
    } catch (error) {
      console.error('获取仪表盘数据失败:', error);
      message.error('获取数据失败，请稍后重试');
      // 使用模拟数据避免页面空白
      setDashboardData(generateMockDashboardData());
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

  // 核心指标卡片配置
  const statCards = [
    {
      key: 'unreadMessages',
      title: '未读消息数',
      value: dashboardData.unreadMessages,
      prefix: <BellOutlined style={{ color: '#1890ff' }} />,
      color: '#1890ff',
      bgGradient: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
      action: () => jumpToPage('/message-list')
    },
    {
      key: 'pendingReports',
      title: '待审核报告数',
      value: dashboardData.pendingReports,
      prefix: <FileTextOutlined style={{ color: '#faad14' }} />,
      color: '#faad14',
      bgGradient: 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)',
      action: () => jumpToPage('/report-list')
    },
    {
      key: 'totalAssetValue',
      title: '当前总资产估值',
      value: dashboardData.totalAssetValue,
      precision: 2,
      prefix: '¥',
      suffix: '元',
      valueStyle: { color: '#52c41a' },
      color: '#52c41a',
      bgGradient: 'linear-gradient(135deg, #52c41a 0%, #95de64 100%)',
      action: () => jumpToPage('/asset-holdings')
    }
  ];

  // 获取活动项的图标
  const getActivityIcon = (type, status) => {
    if (type === 'message') {
      return <MessageOutlined style={{ color: status === 'unread' ? '#1890ff' : '#91d5ff' }} />;
    } else if (type === 'report') {
      return <FileTextOutlined style={{ color: status === 'pending' ? '#faad14' : '#ffc53d' }} />;
    }
    return <BellOutlined style={{ color: '#91d5ff' }} />;
  };

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
                styles={{
                  body: {
                    padding: '24px',
                    position: 'relative'
                  }
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
                />
                <Button 
                  type="text" 
                  size="small" 
                  style={{ marginTop: '12px', color: card.color }}
                  onClick={(e) => {
                    e.stopPropagation();
                    card.action();
                  }}
                >
                  查看详情 →
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 功能快速入口 */}
      <Card 
        title="快捷操作" 
        variant="outlined"
        style={{ 
          marginBottom: '32px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
        }}
        styles={{ 
          body: { padding: '24px' }
        }}
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
        <Button
          type="primary"
          icon={<CheckCircleOutlined />}
          onClick={() => jumpToPage('/message-list')}
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
          所有功能
        </Button>
      </Space>
    </Card>

    {/* 近期动态列表 */}
    <Card 
      title="近期动态" 
      variant="outlined"
      style={{
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        marginBottom: '32px'
      }}
      styles={{ 
        body: { padding: '24px' }
      }}
    >
      {dashboardData.recentActivities.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={dashboardData.recentActivities}
          renderItem={(item) => (
            <List.Item
              key={item.id}
              actions={[
                <span key="time" style={{ color: '#8c8c8c', fontSize: '14px' }}>
                  {item.time}
                </span>
              ]}
              style={{
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                borderRadius: '8px',
                padding: '12px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              onClick={() => {
                if (item.type === 'message') {
                  jumpToPage('/message-list');
                } else if (item.type === 'report') {
                  jumpToPage('/report-list');
                }
              }}
            >
              <List.Item.Meta
                avatar={getActivityIcon(item.type, item.status)}
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{item.title}</span>
                    {item.status === 'unread' && (
                      <Tag color="blue" style={{ height: '20px', fontSize: '12px' }}>未读</Tag>
                    )}
                    {item.status === 'pending' && (
                      <Tag color="orange" style={{ height: '20px', fontSize: '12px' }}>待审核</Tag>
                    )}
                  </div>
                }
                description={item.content}
              />
            </List.Item>
          )}
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#8c8c8c' }}>
          <p>暂无近期动态</p>
        </div>
      )}
    </Card>

    {/* 功能模块快速入口 */}
    <Card 
      title="功能模块" 
      variant="outlined"
      style={{
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
      }}
      styles={{ 
        body: { padding: '24px' }
      }}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card
            hoverable
            onClick={() => jumpToPage('/message-list')}
            style={{
              border: '1px solid #f0f0f0',
              borderRadius: '8px',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#1890ff';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(24, 144, 255, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#f0f0f0';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#e6f7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MessageOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', color: '#262626' }}>消息列表</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#8c8c8c' }}>查看和筛选最新市场消息</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            hoverable
            onClick={() => jumpToPage('/report-list')}
            style={{
              border: '1px solid #f0f0f0',
              borderRadius: '8px',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#1890ff';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(24, 144, 255, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#f0f0f0';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fff7e6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileTextOutlined style={{ fontSize: '24px', color: '#faad14' }} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', color: '#262626' }}>建议报告</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#8c8c8c' }}>审核AI生成的投资建议</p>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            hoverable
            onClick={() => jumpToPage('/asset-holdings')}
            style={{
              border: '1px solid #f0f0f0',
              borderRadius: '8px',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#1890ff';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(24, 144, 255, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#f0f0f0';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#f6ffed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PieChartOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', color: '#262626' }}>持仓数据</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#8c8c8c' }}>查看资产分布和历史变化</p>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </Card>
    </div>
  );
};

export default Dashboard;