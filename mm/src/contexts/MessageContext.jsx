import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// 数字货币类型选项
const CRYPTO_TYPES = [
  { label: '比特币 (BTC)', value: 'BTC' },
  { label: '以太坊 (ETH)', value: 'ETH' },
  { label: 'Solana (SOL)', value: 'SOL' },
  { label: '币安币 (BNB)', value: 'BNB' },
  { label: '泰达币 (USDT)', value: 'USDT' },
  { label: 'Cardano (ADA)', value: 'ADA' },
  { label: 'Polygon (MATIC)', value: 'MATIC' },
];

// 利好利空选项
const MARKET_IMPACTS = [
  { label: '利好', value: 'positive' },
  { label: '利空', value: 'negative' },
  { label: '中性', value: 'neutral' },
];

// 模拟消息数据生成函数
const generateMockMessages = () => {
  const messages = [];
  const now = new Date();
  
  for (let i = 0; i < 20; i++) {
    const date = new Date(now);
    date.setMinutes(date.getMinutes() - i * 30);
    
    const crypto = CRYPTO_TYPES[Math.floor(Math.random() * CRYPTO_TYPES.length)].value;
    const impact = MARKET_IMPACTS[Math.floor(Math.random() * MARKET_IMPACTS.length)].value;
    
    let title, content;
    
    switch (impact) {
      case 'positive':
        title = `${crypto} 价格突破重要阻力位，有望继续上涨`;
        content = `${crypto} 今日交易量大幅增加，价格突破了近三个月来的重要阻力位。分析师预测，随着市场情绪好转和机构资金流入，短期内可能继续保持上涨趋势。技术指标显示，RSI指标处于中性区域，MACD指标形成金叉，表明短期动能正在增强。`;
        break;
      case 'negative':
        title = `监管消息导致 ${crypto} 价格下跌，投资者需谨慎`;
        content = `今日市场传来关于 ${crypto} 相关的监管收紧消息，导致价格出现明显下跌。专家建议投资者保持谨慎，关注监管动态。从技术面看，价格已跌破5日均线，短期内可能面临进一步回调压力。`;
        break;
      default:
        title = `${crypto} 市场维持横盘整理，等待新的催化剂`;
        content = `${crypto} 近期交易维持在一定区间内，波动性较低。市场正在等待新的基本面消息或技术突破来决定下一步走势。目前交易量较为平淡，表明市场参与者态度谨慎。`;
        break;
    }
    
    messages.push({
      id: `msg-${i + 1}`,
      title,
      content,
      cryptoType: crypto,
      marketImpact: impact,
      publishTime: date.toISOString(),
      read: i > 5, // 模拟前6条为未读消息
    });
  }
  
  return messages.sort((a, b) => new Date(b.publishTime) - new Date(a.publishTime));
};

// 创建消息上下文
const MessageContext = createContext();

// 消息上下文提供者组件
export const MessageProvider = ({ children }) => {
  // 存储消息数据
  const [messages, setMessages] = useState([]);
  // 存储消息加载状态
  const [loading, setLoading] = useState(true);
  
  // 初始化消息数据
  useEffect(() => {
    // 模拟数据加载延迟
    const timer = setTimeout(() => {
      const mockData = generateMockMessages();
      setMessages(mockData);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);
  
  // 标记消息为已读
  const markAsRead = (messageId) => {
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    );
  };
  
  // 获取未读消息数，使用useCallback确保引用稳定性
  const getUnreadCount = useCallback(() => {
    return messages.filter(msg => !msg.read).length;
  }, [messages]);
  
  // 提供给上下文的值
  const contextValue = {
    messages,
    loading,
    markAsRead,
    getUnreadCount
  };

  return (
    <MessageContext.Provider value={contextValue}>
      {children}
    </MessageContext.Provider>
  );
};

// 自定义钩子，方便组件使用消息上下文
export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage必须在MessageProvider内部使用');
  }
  return context;
};
