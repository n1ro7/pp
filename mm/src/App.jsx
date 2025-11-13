import React from 'react';
import AppRouter from './router/index.jsx';
import SettingsProvider from './contexts/SettingsContext';
// 引入Ant Design全局样式
import 'antd/dist/reset.css';
// 全局样式（可选，用于自定义样式）
import './assets/index.css';
import './assets/theme.css';

const App = () => {
  return (
    <SettingsProvider>
      <AppRouter />
    </SettingsProvider>
  );
};

export default App;