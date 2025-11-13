import React, { useState, useEffect } from 'react';
import { Card, Table, Select, Tag, Button, Space, Modal, Typography, DatePicker, Badge, Spin, Empty } from 'antd';
import { ClockCircleOutlined, FilterOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

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

// 模拟消息数据
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
      read: i > 5, // 模拟部分未读消息
    });
  }
  
  return messages.sort((a, b) => new Date(b.publishTime) - new Date(a.publishTime));
};

const MessageList = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrypto, setSelectedCrypto] = useState([]);
  const [selectedImpact, setSelectedImpact] = useState([]);
  const [dateRange, setDateRange] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);

  // 初始化数据
  useEffect(() => {
    // 模拟数据加载延迟
    const timer = setTimeout(() => {
      const mockData = generateMockMessages();
      setMessages(mockData);
      setFilteredMessages(mockData);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // 应用筛选条件
  useEffect(() => {
    let filtered = [...messages];

    // 按数字货币类型筛选
    if (selectedCrypto.length > 0) {
      filtered = filtered.filter(msg => selectedCrypto.includes(msg.cryptoType));
    }

    // 按利好利空筛选
    if (selectedImpact.length > 0) {
      filtered = filtered.filter(msg => selectedImpact.includes(msg.marketImpact));
    }

    // 按日期范围筛选
    if (dateRange && dateRange.length === 2) {
      const [start, end] = dateRange;
      filtered = filtered.filter(msg => {
        const msgDate = new Date(msg.publishTime);
        return msgDate >= start && msgDate <= end;
      });
    }

    // 始终按时间倒序
    filtered.sort((a, b) => new Date(b.publishTime) - new Date(a.publishTime));
    setFilteredMessages(filtered);
  }, [messages, selectedCrypto, selectedImpact, dateRange]);

  // 格式化时间
  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 获取市场影响的标签样式
  const getImpactTag = (impact) => {
    switch (impact) {
      case 'positive':
        return <Tag color="success">利好</Tag>;
      case 'negative':
        return <Tag color="error">利空</Tag>;
      default:
        return <Tag color="default">中性</Tag>;
    }
  };

  // 查看消息详情
  const viewMessageDetail = (record) => {
    // 标记为已读
    if (!record.read) {
      setMessages(messages.map(msg => 
        msg.id === record.id ? { ...msg, read: true } : msg
      ));
    }
    setCurrentMessage(record);
    setDetailVisible(true);
  };

  // 重置筛选条件
  const resetFilters = () => {
    setSelectedCrypto([]);
    setSelectedImpact([]);
    setDateRange(null);
  };

  // 表格列定义
  const columns = [
    {
      title: '消息标题',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Badge dot={!record.read} offset={[10, 0]}>
          <Text ellipsis style={{ maxWidth: 500 }}>{text}</Text>
        </Badge>
      ),
    },
    {
      title: '数字货币类型',
      dataIndex: 'cryptoType',
      key: 'cryptoType',
      render: (type) => <Tag color="blue">{type}</Tag>,
      filters: CRYPTO_TYPES.map(type => ({ text: type.label, value: type.value })),
      onFilter: (value, record) => record.cryptoType === value,
    },
    {
      title: '市场影响',
      dataIndex: 'marketImpact',
      key: 'marketImpact',
      render: getImpactTag,
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      key: 'publishTime',
      sorter: (a, b) => new Date(b.publishTime) - new Date(a.publishTime),
      render: formatTime,
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => viewMessageDetail(record)}>
          查看详情
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title="消息列表" style={{ marginBottom: '24px' }}>
        {/* 筛选区域 */}
        <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
          <Space wrap size="middle">
            <Space size="small">
              <Text strong>数字货币类型:</Text>
              <Select
                mode="multiple"
                placeholder="选择数字货币类型"
                style={{ width: 300 }}
                value={selectedCrypto}
                onChange={setSelectedCrypto}
                options={CRYPTO_TYPES}
              />
            </Space>
            
            <Space size="small">
              <Text strong>市场影响:</Text>
              <Select
                mode="multiple"
                placeholder="选择市场影响"
                style={{ width: 200 }}
                value={selectedImpact}
                onChange={setSelectedImpact}
                options={MARKET_IMPACTS}
              />
            </Space>
            
            <Space size="small">
              <Text strong>时间范围:</Text>
              <RangePicker
                onChange={(dates) => setDateRange(dates)}
                placeholder={['开始日期', '结束日期']}
              />
            </Space>
            
            <Space>
              <Button type="primary" icon={<FilterOutlined />}>
                筛选
              </Button>
              <Button onClick={resetFilters}>
                重置
              </Button>
            </Space>
          </Space>
        </div>

        {/* 消息列表 */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Spin size="large" tip="加载中..." />
          </div>
        ) : filteredMessages.length === 0 ? (
          <Empty description="暂无符合条件的消息" />
        ) : (
          <Table
            columns={columns}
            dataSource={filteredMessages}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            rowHoverable
            onRow={(record) => ({
              onClick: () => viewMessageDetail(record),
            })}
          />
        )}
      </Card>

      {/* 消息详情弹窗 */}
      <Modal
        title="消息详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {currentMessage && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <Title level={4} style={{ marginBottom: 0 }}>{currentMessage.title}</Title>
              <Space>
                <Tag color="blue">{currentMessage.cryptoType}</Tag>
                {getImpactTag(currentMessage.marketImpact)}
              </Space>
            </div>
            
            <div style={{ marginBottom: '24px', color: '#666' }}>
              <Space>
                <ClockCircleOutlined /> {formatTime(currentMessage.publishTime)}
              </Space>
            </div>
            
            <Paragraph style={{ fontSize: '16px', lineHeight: 1.8 }}>
              {currentMessage.content}
            </Paragraph>
            
            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f0f8ff', borderRadius: '4px', borderLeft: '4px solid #1890ff' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <InfoCircleOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                <Text strong>AI分析建议</Text>
              </div>
              <Paragraph style={{ marginBottom: 0 }}>
                根据消息内容，建议密切关注市场动态变化。可结合技术指标和其他相关消息进行综合判断，避免单一消息影响投资决策。
              </Paragraph>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MessageList;