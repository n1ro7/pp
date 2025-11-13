import React, { createContext, useState, useEffect, useContext } from 'react';
import { getSystemSettings } from '../services/adminService';
import { setCurrentLanguage } from '../utils/i18n';

// 创建系统设置上下文
const SettingsContext = createContext();

// 自定义Hook用于使用设置上下文
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings必须在SettingsProvider内部使用');
  }
  return context;
};

// 设置提供者组件
export default function SettingsProvider({ children }) {
  // 初始设置（移除theme相关配置）
  const [settings, setSettings] = useState({
    systemName: '数字资产投资系统',
    defaultLanguage: 'zh-CN', // 默认中文
    maxUploadSize: 100, // 默认最大上传大小为100MB
    apiTimeout: 30000, // 默认API超时时间为30秒
    autoLogoutTime: 3600000, // 默认自动登出时间为30分钟
    notificationEnabled: true, // 默认开启通知
    dataRefreshInterval: 60, // 默认数据刷新间隔为60秒
    enableTwoFactorAuth: false,
    sessionTimeout: 1800,
    enableAuditLogging: true,
    backupFrequency: 'daily',
    maxFailedLoginAttempts: 5,
    passwordExpiryDays: 90
  });
  
  const [loading, setLoading] = useState(true);

  // 加载系统设置
  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await getSystemSettings();
      // 移除theme相关处理
      const { theme, ...settingsWithoutTheme } = response;
      setSettings(settingsWithoutTheme);
      
      // 应用语言
      applyLanguage(response.defaultLanguage || 'zh-CN');
    } catch (error) {
      console.error('加载系统设置失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 更新设置
  const updateSettings = (newSettings) => {
    // 移除theme相关处理
    const { theme, ...newSettingsWithoutTheme } = newSettings;
    // 合并新旧设置，确保保留未提供的字段
    const updatedSettings = { ...settings, ...newSettingsWithoutTheme };
    setSettings(updatedSettings);
    
    // 立即将更新后的设置保存到localStorage
    localStorage.setItem('systemSettings', JSON.stringify(updatedSettings));
    
    // 应用语言
    if (newSettings.defaultLanguage) {
      applyLanguage(newSettings.defaultLanguage);
      // 为确保语言切换立竿见影，可以考虑强制刷新页面或通知所有组件
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: newSettings.defaultLanguage }));
    }
    
    // 确保系统名称更改后立即生效
    window.dispatchEvent(new CustomEvent('settingsChanged', { detail: updatedSettings }));
  };

  // 应用语言
  const applyLanguage = (language) => {
    // 使用国际化工具设置语言
    setCurrentLanguage(language);
    // 使用与i18n.js中一致的localStorage键名
    localStorage.setItem('appLanguage', language);
  };

  // 初始加载设置
  useEffect(() => {
    // 清除可能存在的旧设置中的theme字段
    const existingSettings = localStorage.getItem('systemSettings');
    if (existingSettings) {
      try {
        const parsedSettings = JSON.parse(existingSettings);
        // 移除theme字段
        if (parsedSettings.theme !== undefined) {
          delete parsedSettings.theme;
          localStorage.setItem('systemSettings', JSON.stringify(parsedSettings));
        }
      } catch (error) {
        console.error('解析旧设置失败:', error);
        // 解析失败时清除旧设置
        localStorage.removeItem('systemSettings');
      }
    }
    
    loadSettings();
  }, []);

  const contextValue = {
    settings,
    loading,
    updateSettings,
    loadSettings
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

// 导出上下文（如果需要直接使用）
export { SettingsContext };