import React, { useEffect } from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { t } from '../../utils/i18n';

const Header = () => {
  const { settings, loadSettings } = useSettings();
  
  // 监听系统设置变化事件，确保系统名称实时更新
  useEffect(() => {
    const handleSettingsChanged = () => {
      // 重新加载设置，确保获取最新的系统名称
      loadSettings();
    };
    
    // 监听自定义事件
    window.addEventListener('settingsChanged', handleSettingsChanged);
    
    // 清理事件监听器
    return () => {
      window.removeEventListener('settingsChanged', handleSettingsChanged);
    };
  }, [loadSettings]);
  
  // 监听语言变化事件，确保界面文字实时更新
  useEffect(() => {
    const handleLanguageChanged = () => {
      // 强制组件重新渲染，更新翻译
      window.location.reload(); // 这是一个简单直接的方式，在实际应用中可能需要更优雅的解决方案
    };
    
    window.addEventListener('languageChanged', handleLanguageChanged);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChanged);
    };
  }, []);
  
  return (
    <header className="header">
      <div className="header-logo">{settings.systemName || '数字资产投资系统'}</div>
      <div className="header-right">
        <span className="user-info">{t('welcomeAdmin')}</span>
      </div>
    </header>
  );
};

export default Header;