import React, { useState } from 'react';
import { logout } from "../services/authService";
import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
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
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import AuthGuard from '../components/AuthGuard/AuthGuard';
import Admin from '../pages/Admin/Admin';

const { Header, Sider, Content } = Layout;

// 全局布局组件（含头部导航、侧边栏）
const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const toggle = () => {
    setCollapsed(!collapsed);
  };
  
  // 管理员下拉菜单配置
  const adminMenuItems = [
    {
      key: "settings",
      label: "设置",
      icon: <SettingOutlined />,
      onClick: () => window.location.href = '/admin'
    },
    {
      key: "logout",
      label: "退出",
      icon: <LogoutOutlined />,
      onClick: () => {
        logout();
        window.location.href = '/login';
      }
    }
  ];
  
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
    <Layout className="main-layout" style={{ minHeight: '100vh', display: 'flex' }}>
      {/* 侧边栏 */}
      <Sider
        collapsible
        collapsed={collapsed}
        theme="light"
        width={240}
        trigger={null}
        className="custom-sider"
        style={{
          background: 'var(--background-color)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          position: 'relative',
          zIndex: 1001
        }}
      >
        <div className="logo-container" style={{
            height: '64px',
            padding: collapsed ? '0 12px' : '0 24px',
            background: 'var(--primary-color)',
            color: '#fff',
            marginBottom: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ 
              margin: 0, 
              fontSize: collapsed ? '14px' : '18px', 
              fontWeight: 600,
              whiteSpace: 'nowrap',
              opacity: 1,
              transition: 'all 0.3s'
            }}>
              {collapsed ? '数字系统' : '数字货币投资系统'}
            </h3>
          <button
            onClick={toggle}
            style={{
              border: 'none',
              background: 'rgba(255, 255, 255, 0.2)',
              color: '#fff',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
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
              onClick: () => window.location.href = '/dashboard',
              style: {
                marginBottom: '4px',
                borderRadius: 'var(--border-radius)'
              }
            },
            {
              key: 'asset-holdings',
              icon: <PieChartOutlined />,
              label: '持仓数据',
              onClick: () => window.location.href = '/asset-holdings',
              style: {
                marginBottom: '4px',
                borderRadius: 'var(--border-radius)'
              }
            },
            {
              key: 'message-list',
              icon: <BellOutlined />,
              label: '消息列表',
              onClick: () => window.location.href = '/message-list',
              badge: { 
                dot: true,
                color: 'var(--error-color)'
              },
              style: {
                marginBottom: '4px',
                borderRadius: 'var(--border-radius)'
              }
            },
            {
              key: 'report-list',
              icon: <FileTextOutlined />,
              label: '建议报告',
              onClick: () => window.location.href = '/report-list',
              style: {
                marginBottom: '4px',
                borderRadius: 'var(--border-radius)'
              }
            }
          ]}
        />
      </Sider>
      
      <Layout className="main-content-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* 头部导航 */}
        <Header className="custom-header" style={{
          background: '#fff',
          padding: '0 24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          zIndex: 1000,
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          position: 'fixed',
          left: collapsed ? 80 : 240,
          right: 0,
          top: 0,
          borderBottom: '1px solid var(--border-color)'
        }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Badge count={3} style={{ backgroundColor: 'var(--error-color)' }}>
              <BellOutlined 
                style={{ fontSize: '18px', color: 'var(--text-light)', cursor: 'pointer', transition: 'color 0.2s' }}
                onClick={() => window.location.href = '/message-list'}
                className="hover:text-primary"
              />
            </Badge>
            
            <Dropdown menu={{ items: adminMenuItems }} placement="bottomRight" trigger={['click']}>
              <a onClick={(e) => e.preventDefault()} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-color)' }}>
                <Avatar icon={<UserOutlined />} style={{ backgroundColor: 'var(--primary-color)' }} />
                <span style={{ fontSize: '14px' }}>管理员</span>
              </a>
            </Dropdown>
          </div>
        </Header>
        
        {/* 内容区域 */}
        <Content className="page-content" style={{
          margin: '80px 24px 24px',
          padding: 0,
          background: 'transparent',
          minHeight: 280
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};


// 路由配置主组件
const AppRouter = () => {
  return (
    <Routes>
      {/* 根路径默认重定向到登录页面 */}
      <Route index element={<Navigate to="/login" />} />
      
      {/* 登录和注册页面，不需要认证 */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* 使用AuthGuard保护需要登录的页面 */}
      <Route element={<AuthGuard />}>
        {/* 所有需要认证的页面都使用全局布局 */}
        <Route path="/" element={<MainLayout />}>
          {/* 默认重定向到系统概览页 */}
          <Route index element={<Navigate to="/dashboard" />} />
          {/* 前端开发A负责页面 */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="asset-holdings" element={<AssetHoldings />} />
          {/* 前端开发B负责页面 */}
          <Route path="message-list" element={<MessageList />} />
          <Route path="report-list" element={<ReportList />} />
          {/* 管理员页面 */}
          <Route path="admin" element={<Admin />} />
        </Route>
      </Route>
      
      {/* 404页面 */}
      <Route path="*" element={<div style={{ textAlign: 'center', padding: '50px' }}>404 页面不存在</div>} />
    </Routes>
  );
};

export default AppRouter;