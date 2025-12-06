import React, { useState, useEffect } from 'react';
import { Card, List, Tag, Button, Space, Modal, Typography, Radio, Divider, Spin, Empty, message, Input } from 'antd';
import { EyeOutlined, EditOutlined, CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

// 报告状态选项
const REPORT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

// 模拟报告数据
const generateMockReports = () => {
  const reports = [];
  const now = new Date();
  const cryptos = ['BTC', 'ETH', 'SOL', 'BNB', 'USDT'];
  
  for (let i = 0; i < 15; i++) {
    const date = new Date(now);
    date.setHours(date.getHours() - i * 4);
    
    const crypto = cryptos[Math.floor(Math.random() * cryptos.length)];
    const isPositive = Math.random() > 0.4;
    const status = i > 10 ? REPORT_STATUS.PENDING : 
                   i > 5 ? REPORT_STATUS.APPROVED : REPORT_STATUS.REJECTED;
    
    let title, suggestion, message, confidence;
    
    if (isPositive) {
      title = `建议增加 ${crypto} 持仓`;
      suggestion = `基于最新市场数据分析，建议在未来7天内逐步增加${crypto}持仓比例。`;
      message = `${crypto}价格在过去24小时内上涨了5.3%，交易量增加30%。技术指标显示MACD形成金叉，RSI处于58位置，表明短期上涨动能正在增强。同时，机构资金流入增加，市场情绪指标向好。`;
      confidence = (75 + Math.random() * 20).toFixed(1);
    } else {
      title = `建议减少 ${crypto} 持仓`;
      suggestion = `基于技术面和基本面分析，建议暂时减少${crypto}持仓，等待更好的入场时机。`;
      message = `${crypto}近期价格波动加大，成交量萎缩，技术面出现顶背离信号。同时，行业监管政策趋严，可能对短期价格造成压力。`;
      confidence = (65 + Math.random() * 25).toFixed(1);
    }
    
    reports.push({
      id: `report-${i + 1}`,
      title,
      coreSuggestion: suggestion,
      originalMessage: message,
      cryptoType: crypto,
      confidence: confidence,
      publishTime: date.toISOString(),
      status,
      analystNotes: i % 3 === 0 ? '此报告需要结合近期宏观经济数据进行综合考量。' : '',
    });
  }
  
  return reports.sort((a, b) => new Date(b.publishTime) - new Date(a.publishTime));
};

const ReportList = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewDecision, setReviewDecision] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // 初始化数据
  useEffect(() => {
    // 模拟数据加载延迟
    const timer = setTimeout(() => {
      const mockData = generateMockReports();
      setReports(mockData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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

  // 获取状态标签
  const getStatusTag = (status) => {
    switch (status) {
      case REPORT_STATUS.APPROVED:
        return <Tag color="success">已通过</Tag>;
      case REPORT_STATUS.REJECTED:
        return <Tag color="error">已拒绝</Tag>;
      default:
        return <Tag color="processing">待审核</Tag>;
    }
  };

  // 获取建议类型标签
  const getSuggestionTag = (title) => {
    return title.includes('增加') ? 
      <Tag color="success">买入建议</Tag> : 
      <Tag color="error">卖出建议</Tag>;
  };

  // 查看报告详情
  const viewReportDetail = (record) => {
    setCurrentReport(record);
    setReviewNotes('');
    setReviewDecision(null);
    setDetailVisible(true);
  };

  // 提交审核
  const submitReview = async () => {
    if (!reviewDecision) {
      message.warning('请选择审核结果');
      return;
    }

    setActionLoading(true);
    
    // 模拟API调用延迟
    setTimeout(() => {
      setReports(reports.map(report => 
        report.id === currentReport.id 
          ? { ...report, status: reviewDecision === 'approve' ? REPORT_STATUS.APPROVED : REPORT_STATUS.REJECTED }
          : report
      ));
      
      message.success(reviewDecision === 'approve' ? '报告已通过审核' : '报告已拒绝');
      setDetailVisible(false);
      setActionLoading(false);
    }, 800);
  };

  // 计算待审核报告数量
  const pendingReportsCount = reports.filter(report => report.status === REPORT_STATUS.PENDING).length;

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={4}>建议报告管理</Title>
        {pendingReportsCount > 0 && (
          <Tag color="processing" icon={<ClockCircleOutlined />}>
            待审核: {pendingReportsCount}
          </Tag>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin size="large" tip="加载中">
            <div style={{ padding: '20px' }}></div>
          </Spin>
        </div>
      ) : reports.length === 0 ? (
        <Empty description="暂无建议报告" />
      ) : (
        <List
          grid={{ gutter: 24, column: 1 }}
          dataSource={reports}
          renderItem={(item) => (
            <List.Item>
              <Card
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div>
                      <Space>
                        <Text strong>{item.title}</Text>
                        {getSuggestionTag(item.title)}
                        <Tag color="blue">{item.cryptoType}</Tag>
                        <Tag color="orange">可信度: {item.confidence}%</Tag>
                      </Space>
                    </div>
                    <Space>
                      {getStatusTag(item.status)}
                      <Button type="link" icon={<EyeOutlined />} onClick={() => viewReportDetail(item)}>
                        查看详情
                      </Button>
                    </Space>
                  </div>
                }
                style={{ marginBottom: '16px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Paragraph ellipsis={{ rows: 2, expandable: false }} style={{ marginBottom: 0, maxWidth: '80%' }}>
                    <Text strong>核心建议: </Text>
                    {item.coreSuggestion}
                  </Paragraph>
                  <div style={{ color: '#666' }}>
                    <ClockCircleOutlined /> {formatTime(item.publishTime)}
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      )}

      {/* 报告详情弹窗 */}
      <Modal
        title="报告详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          ...(currentReport?.status === REPORT_STATUS.PENDING ? [
            <Button key="reject" danger icon={<CloseCircleOutlined />} onClick={() => setReviewDecision('reject')} loading={actionLoading}>
              拒绝
            </Button>,
            <Button key="approve" type="primary" icon={<CheckCircleOutlined />} onClick={() => setReviewDecision('approve')} loading={actionLoading}>
              通过
            </Button>
          ] : []),
          <Button key="close" onClick={() => setDetailVisible(false)} disabled={actionLoading}>
            关闭
          </Button>
        ]}
        width={900}
        onOk={submitReview}
        okButtonProps={{ style: { display: 'none' } }} // 隐藏默认确认按钮
      >
        {currentReport && (
          <div>
            {/* 报告头部信息 */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Title level={4} style={{ marginBottom: 0 }}>{currentReport.title}</Title>
                <Space>
                  <Tag color="blue">{currentReport.cryptoType}</Tag>
                  {getSuggestionTag(currentReport.title)}
                  <Tag color="orange">可信度: {currentReport.confidence}%</Tag>
                </Space>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#666', marginBottom: '16px' }}>
                <Space>
                  <ClockCircleOutlined /> {formatTime(currentReport.publishTime)}
                </Space>
                <Space>
                  {getStatusTag(currentReport.status)}
                </Space>
              </div>
            </div>

            <Divider />

            {/* 核心建议 */}
            <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: '#f6ffed', borderRadius: '8px', border: '1px solid #b7eb8f' }}>
              <Title level={5} style={{ marginBottom: '16px', color: '#389e0d' }}>AI核心建议</Title>
              <Paragraph style={{ fontSize: '16px', lineHeight: 1.8, marginBottom: 0 }}>
                {currentReport.coreSuggestion}
              </Paragraph>
            </div>

            {/* 原始消息 */}
            <div style={{ marginBottom: '24px' }}>
              <Title level={5} style={{ marginBottom: '16px' }}>关联原始消息</Title>
              <Card size="small" variant="outlined">
                <Paragraph style={{ lineHeight: 1.8 }}>{currentReport.originalMessage}</Paragraph>
              </Card>
            </div>

            {/* 分析师备注 */}
            {currentReport.analystNotes && (
              <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#e6f7ff', borderRadius: '8px', border: '1px solid #91d5ff' }}>
                <Title level={5} style={{ marginBottom: '12px', color: '#0050b3' }}>分析师备注</Title>
                <Paragraph style={{ lineHeight: 1.6, marginBottom: 0 }}>{currentReport.analystNotes}</Paragraph>
              </div>
            )}

            {/* 审核区域 - 仅对待审核报告显示 */}
            {currentReport.status === REPORT_STATUS.PENDING && (
              <div style={{ marginTop: '24px', padding: '20px', backgroundColor: '#fafafa', borderRadius: '8px' }}>
                <Title level={5} style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
                  <ExclamationCircleOutlined style={{ marginRight: '8px', color: '#faad14' }} />
                  审核操作
                </Title>
                
                <div style={{ marginBottom: '16px' }}>
                  <Radio.Group onChange={(e) => setReviewDecision(e.target.value)} value={reviewDecision}>
                    <Radio value="approve">通过此建议报告</Radio>
                    <Radio value="reject">拒绝此建议报告</Radio>
                  </Radio.Group>
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <Input.TextArea
                    rows={4}
                    placeholder="请输入审核备注（可选）"
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* 审核结果显示 */}
            {currentReport.status !== REPORT_STATUS.PENDING && (
              <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                <Text strong>审核状态：</Text>
                <Text style={{ marginLeft: '8px' }}>
                  {currentReport.status === REPORT_STATUS.APPROVED ? '已通过' : '已拒绝'}
                </Text>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReportList;