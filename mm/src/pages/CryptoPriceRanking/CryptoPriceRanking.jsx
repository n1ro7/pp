import React, { useState, useEffect } from 'react';
import { Card, Table, Typography, Button, Spin, Space, message, Tag, Statistic } from 'antd';
import { ReloadOutlined, ArrowUpOutlined, ArrowDownOutlined, LineChartOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
import { fetchCryptoPriceRanking } from '../../services/cryptoPriceService';

const { Title } = Typography;

const CryptoPriceRanking = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalMarketCap, setTotalMarketCap] = useState(0);
  const [gainersCount, setGainersCount] = useState(0);
  const [losersCount, setLosersCount] = useState(0);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15
  });

  // 加载数据
  const loadCryptoData = async () => {
    setLoading(true);
    try {
      const data = await fetchCryptoPriceRanking(50);
      setCryptoData(data);
      
      // 计算统计数据
      const marketCap = data.reduce((sum, item) => sum + item.marketCap, 0);
      const gainers = data.filter(item => item.change24h > 0).length;
      const losers = data.filter(item => item.change24h < 0).length;
      
      setTotalMarketCap(marketCap);
      setGainersCount(gainers);
      setLosersCount(losers);
      
      message.success('数据加载成功');
    } catch (error) {
      console.error('加载数据失败:', error);
      message.error('数据加载失败');
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时加载数据，并设置定时刷新
  useEffect(() => {
    loadCryptoData();
    // 每30秒自动刷新一次数据
    const interval = setInterval(loadCryptoData, 30000);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  // 手动刷新
  const handleManualRefresh = () => {
    loadCryptoData();
  };

  // 表格列配置
  const columns = [
    {
      title: '排名',
      key: 'rank',
      width: 80,
      align: 'center',
      render: (text, record, index) => {
        // 使用pagination state中的当前页码和每页数量计算排名
        const { current, pageSize } = pagination;
        const rank = (current - 1) * pageSize + index + 1;
        return (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: rank <= 3 ? '#f0f5ff' : '#fafafa',
            color: rank <= 3 ? '#1890ff' : '#666',
            fontWeight: 'bold',
            fontSize: '16px'
          }}>
            {rank}
          </div>
        );
      }
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 180,
      render: (text, record) => (
        <Space size="middle" align="center">
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
          }}>
            <LineChartOutlined style={{ color: '#fff', fontSize: '20px' }} />
          </div>
          <div>
            <div style={{ fontWeight: '600', fontSize: '14px', color: '#262626' }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#8c8c8c', textTransform: 'uppercase' }}>{record.symbol}</div>
          </div>
        </Space>
      )
    },
    {
      title: '价格 (CNY)',
      dataIndex: 'price',
      key: 'price',
      align: 'right',
      width: 160,
      render: (text) => (
        <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#262626' }}>
          ¥{parseFloat(text).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      ),
      sorter: (a, b) => a.price - b.price
    },
    {
      title: '24h涨跌',
      dataIndex: 'change24h',
      key: 'change24h',
      align: 'right',
      width: 120,
      render: (text) => {
        const value = parseFloat(text);
        const isPositive = value >= 0;
        const color = isPositive ? '#52c41a' : '#ff4d4f';
        const icon = isPositive ? <RiseOutlined /> : <FallOutlined />;
        
        return (
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span style={{ 
              color: color, 
              fontWeight: '600',
              fontSize: '14px',
              padding: '4px 12px',
              borderRadius: '16px',
              background: isPositive ? 'rgba(82, 196, 26, 0.1)' : 'rgba(255, 77, 79, 0.1)',
              border: `1px solid ${color}`
            }}>
              <Space>
                {icon}
                {isPositive ? '+' : ''}{value.toFixed(2)}%
              </Space>
            </span>
          </div>
        );
      },
      sorter: (a, b) => a.change24h - b.change24h
    },
    {
      title: '24h成交量',
      dataIndex: 'volume24h',
      key: 'volume24h',
      align: 'right',
      width: 160,
      render: (text) => {
        const volume = parseFloat(text);
        let displayValue, unit;
        if (volume >= 1000000000) {
          displayValue = (volume / 1000000000).toFixed(2);
          unit = 'B';
        } else if (volume >= 1000000) {
          displayValue = (volume / 1000000).toFixed(2);
          unit = 'M';
        } else {
          displayValue = volume.toFixed(2);
          unit = '';
        }
        
        return (
          <span style={{ color: '#1890ff', fontSize: '14px', fontWeight: '500' }}>
            ¥{displayValue}{unit}
          </span>
        );
      },
      sorter: (a, b) => a.volume24h - b.volume24h
    },
    {
      title: '市值',
      dataIndex: 'marketCap',
      key: 'marketCap',
      align: 'right',
      width: 160,
      render: (text) => {
        const cap = parseFloat(text);
        const capInBillion = cap / 1000000000;
        
        return (
          <span style={{ color: '#fa8c16', fontSize: '14px', fontWeight: '500' }}>
            ¥{capInBillion.toFixed(2)}B
          </span>
        );
      },
      sorter: (a, b) => a.marketCap - b.marketCap
    }
  ];

  // 统计卡片数据
  const statsCards = [
    {
      title: '总市值',
      value: totalMarketCap,
      precision: 2,
      suffix: 'B',
      prefix: '¥',
      icon: <LineChartOutlined />,
      color: '#1890ff',
      bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderColor: '#667eea'
    },
    {
      title: '上涨币种',
      value: gainersCount,
      icon: <RiseOutlined />,
      color: '#52c41a',
      bgColor: 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)',
      borderColor: '#56ab2f'
    },
    {
      title: '下跌币种',
      value: losersCount,
      icon: <FallOutlined />,
      color: '#ff4d4f',
      bgColor: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
      borderColor: '#ff6b6b'
    }
  ];

  return (
    <div className="crypto-price-ranking-page" style={{ 
      padding: '40px 0 24px',
      background: '#f5f7fa',
      minHeight: 'calc(100vh - 120px)',
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
      {/* 页面标题栏 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '32px',
        padding: '0 16px'
      }}>
        <Title level={2} style={{
          margin: 0, 
          fontWeight: 'bold',
          color: '#262626',
          fontSize: '28px',
          letterSpacing: '0.5px'
        }}>
          <Space align="center" size="middle">
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 4px 16px rgba(102, 126, 234, 0.4)'
            }}>
              <LineChartOutlined style={{ color: '#fff', fontSize: '24px' }} />
            </div>
            数字货币价格排行
          </Space>
        </Title>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={handleManualRefresh}
          loading={loading}
          size="large"
          style={{
            height: '48px',
            fontSize: '16px',
            padding: '0 24px',
            background: 'linear-gradient(135deg, #1890ff 0%, #52c41a 100%)',
            border: 'none',
            boxShadow: '0 4px 16px rgba(24, 144, 255, 0.4)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(24, 144, 255, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(24, 144, 255, 0.4)';
          }}
        >
          刷新数据
        </Button>
      </div>

      {/* 数据统计卡片 */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', padding: '0 16px' }}>
        {statsCards.map((card, index) => (
          <Card key={index} style={{
            flex: 1,
            border: 'none',
            borderRadius: '16px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}
          hoverable
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.08)';
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px'
            }}>
              <div>
                <div style={{ fontSize: '14px', color: '#8c8c8c', marginBottom: '8px' }}>
                  {card.title}
                </div>
                <Statistic
                  value={card.value}
                  precision={card.precision}
                  prefix={card.prefix}
                  suffix={card.suffix}
                  valueStyle={{ 
                    color: card.color, 
                    fontSize: '28px',
                    fontWeight: 'bold'
                  }}
                />
              </div>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: card.bgColor,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: `0 4px 12px rgba(${card.color === '#1890ff' ? '102, 126, 234' : card.color === '#52c41a' ? '86, 171, 47' : '255, 107, 107'}, 0.3)`
              }}>
                {card.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 价格排行榜 */}
      <Card style={{
        margin: '0 16px',
        border: 'none',
        borderRadius: '16px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        background: '#fff'
      }}>
        <Spin 
          spinning={loading} 
          tip="数据加载中..."
          style={{ minHeight: '400px' }}
        >
          <Table
            columns={columns}
            dataSource={cryptoData}
            rowKey="id"
            pagination={{ 
              ...pagination,
              showSizeChanger: true, 
              showTotal: (total) => `共 ${total} 种币种`,
              pageSizeOptions: ['10', '15', '20', '50'],
              style: {
                padding: '16px',
                background: '#fafafa',
                borderRadius: '0 0 12px 12px'
              }
            }}
            scroll={{ x: 900 }}
            size="large"
            bordered={false}
            locale={{ emptyText: '无数据' }}
            rowClassName={(record, index) => 
              index % 2 === 0 ? 'table-row-even' : 'table-row-odd'
            }
            style={{ borderRadius: '12px', overflow: 'hidden' }}
            components={{
              Header: ({ children, className }) => (
                <thead className={`${className} custom-table-header`} style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  borderRadius: '12px 12px 0 0'
                }}>
                  {children}
                </thead>
              ),
              Cell: ({ children, column }) => (
                <td style={{
                  padding: '16px 12px',
                  borderBottom: '1px solid #f0f0f0',
                  transition: 'all 0.2s ease'
                }}>
                  {children}
                </td>
              )
            }}
            onRow={(record) => ({
              style: {
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              },
              onMouseEnter: (e) => {
                e.currentTarget.style.background = '#f0f5ff';
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.background = '';
              }
            })}
            onChange={(pagination) => {
              setPagination(pagination);
            }}
          />
        </Spin>
      </Card>
    </div>
  );
};

export default CryptoPriceRanking;