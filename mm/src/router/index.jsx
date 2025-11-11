import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd'; // 引入Ant Design布局组件（可选，用于全局布局）
import Dashboard from '../pages/Dashboard/Dashboard';
import AssetHoldings from '../pages/AssetHoldings/AssetHoldings';
// 前端开发B负责的页面（仅占位，无需实现）
import MessageList from '../pages/MessageList/MessageList';
import ReportList from '../pages/ReportList/ReportList';

const { Header, Sider, Content } = Layout;

// 全局布局组件（含头部导航、侧边栏）
const MainLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <Sider theme="light" width={200}>
        <div style={{ textAlign: 'center', padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
          <h3>数字货币投资系统</h3>
        </div>
        {/* 侧边栏菜单（可使用Ant Design Menu组件实现，此处简化） */}
        <div style={{ padding: '16px' }}>
          <p style={{ cursor: 'pointer', margin: '8px 0' }} onClick={() => window.location.href = '/dashboard'}>
            系统概览
          </p>
          <p style={{ cursor: 'pointer', margin: '8px 0' }} onClick={() => window.location.href = '/asset-holdings'}>
            持仓数据
          </p>
          <p style={{ cursor: 'pointer', margin: '8px 0' }} onClick={() => window.location.href = '/message-list'}>
            消息列表
          </p>
          <p style={{ cursor: 'pointer', margin: '8px 0' }} onClick={() => window.location.href = '/report-list'}>
            建议报告
          </p>
        </div>
      </Sider>
      <Layout>
        {/* 头部导航 */}
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <span>管理员账号</span>
        </Header>
        {/* 内容区域（渲染当前路由页面） */}
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
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