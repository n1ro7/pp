import React, { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Badge, Dropdown } from 'antd';
import {
  DashboardOutlined,
  PieChartOutlined,
  BellOutlined,
  FileTextOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import Dashboard from '../pages/Dashboard/Dashboard';
import AssetHoldings from '../pages/AssetHoldings/AssetHoldings';
import MessageList from '../pages/MessageList/MessageList';
import ReportList from '../pages/ReportList/ReportList';

const { Header, Sider, Content } = Layout;

// 全局布局组件（含头部导航、侧边栏）
const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const toggle = () => {
    setCollapsed(!collapsed);
  };
  
  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>个人资料</Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>系统设置</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />}>退出登录</Menu.Item>
    </Menu>
  );
  
  // 获取当前路由对应的菜单key
  const getCurrentMenuKey = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'dashboard';
    if (path.includes('/asset-holdings')) return 'asset-holdings';
    if (path.includes('/message-list')) return 'message-list';
    if (path.includes('/report-list')) return 'report-list';
    return 'dashboard';
  };

  return (
    <Layout className="main-layout" style={{ minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <Sider
        collapsible
        collapsed={collapsed}
        theme="light"
        width={240}
        trigger={null}
        className="custom-sider"
        style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
        }}
      >
        <div className="logo-container" style={{
          textAlign: 'center',
          padding: '24px 0',
          background: 'var(--primary-color)',
          color: '#fff',
          marginBottom: '16px'
        }}>
          <h3 style={{ margin: 0, fontSize: collapsed ? '16px' : '18px', fontWeight: 600 }}>
            数字货币投资系统
          </h3>
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={[getCurrentMenuKey()]}
          className="main-menu"
          style={{ borderRight: 0, background: 'transparent' }}
          items={[
            {
              key: 'dashboard',
              icon: <DashboardOutlined />,
              label: '系统概览',
              onClick: () => window.location.href = '/dashboard'
            },
            {
              key: 'asset-holdings',
              icon: <PieChartOutlined />,
              label: '持仓数据',
              onClick: () => window.location.href = '/asset-holdings'
            },
            {
              key: 'message-list',
              icon: <BellOutlined />,
              label: '消息列表',
              onClick: () => window.location.href = '/message-list',
              badge: { dot: true }
            },
            {
              key: 'report-list',
              icon: <FileTextOutlined />,
              label: '建议报告',
              onClick: () => window.location.href = '/report-list'
            }
          ]}
        />
      </Sider>
      
      <Layout className="main-content-wrapper">
        {/* 头部导航 */}
        <Header className="custom-header" style={{
          background: '#fff',
          padding: '0 24px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
          zIndex: 1000
        }}>
          <button
            onClick={toggle}
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              color: '#666',
              marginRight: '16px'
            }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
          
          <div style={{ flex: 1 }} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Badge count={3} style={{ marginRight: '16px' }}>
              <BellOutlined style={{ fontSize: '18px', color: '#666', cursor: 'pointer' }} />
            </Badge>
            
            <Dropdown menu={userMenu} placement="bottomRight">
              <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '8px' }}>
                <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
                <span style={{ fontSize: '14px', color: '#333' }}>管理员</span>
              </div>
            </Dropdown>
          </div>
        </Header>
        
        {/* 内容区域 */}
        <Content className="page-content" style={{
          margin: '24px',
          padding: 0,
          background: 'transparent',
          minHeight: 280
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};


// 路由配置主组件
const AppRouter = () => {
  return (
    <Routes>
      {/* 所有页面都使用全局布局 */}
      <Route path="/" element={<MainLayout />}>
        {/* 默认重定向到系统概览页 */}
        <Route index element={<Navigate to="/dashboard" />} />
        {/* 前端开发A负责页面 */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="asset-holdings" element={<AssetHoldings />} />
        {/* 前端开发B负责页面（占位） */}
        <Route path="message-list" element={<MessageList />} />
        <Route path="report-list" element={<ReportList />} />
      </Route>
      {/* 404页面 */}
      <Route path="*" element={<div style={{ textAlign: 'center', padding: '50px' }}>404 页面不存在</div>} />
    </Routes>
  );
};

export default AppRouter;