import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../../services/authService';

const AuthGuard = () => {
  // 检查用户是否已登录
  const authenticated = isAuthenticated();

  // 如果未登录，重定向到登录页面
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  // 如果已登录，渲染子路由
  return <Outlet />;
};

export default AuthGuard;