import React, { useState, useEffect } from 'react';
import { Card, List, Tag, Button, Space, Modal, Typography, Radio, Divider, Spin, Empty, message, Input, Select } from 'antd';
import {
    EyeOutlined, EditOutlined, CheckCircleOutlined, CloseCircleOutlined,
    ExclamationCircleOutlined, ClockCircleOutlined, PlusOutlined,
    UploadOutlined, SearchOutlined, ReloadOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 配置axios默认项，增加容错处理
axios.defaults.timeout = 10000; // 延长超时时间到10秒
axios.defaults.baseURL = 'http://localhost:8080';
// 增加请求头，避免后端接收参数异常
axios.defaults.headers.common['Content-Type'] = 'application/json';
// 允许跨域携带凭证（可选，根据后端配置）
axios.defaults.withCredentials = true;

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

// 报告状态选项
const REPORT_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
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
    const [searchKeyword, setSearchKeyword] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // 初始化数据 + 筛选触发
    const fetchReports = async () => {
        // 每次请求前强制设置loading为true，避免状态异常
        setLoading(true);
        try {
            // 真实接口请求：保留原有逻辑，增加参数容错
            const response = await axios.get('/api/reports', {
                params: {
                    keyword: searchKeyword || '', // 避免传递undefined
                    status: filterStatus === 'all' ? '' : filterStatus || ''
                },
                // 单独设置当前请求的超时时间（可选）
                timeout: 10000
            });
            // 兼容后端不同返回格式：优先取data，无数据则设为空数组
            const reportData = response.data?.data || [];
            //模拟数据
            setReports([
                {
                    id: 1,
                    title: "增加比特币持仓建议",
                    cryptoType: "BTC",
                    confidence: 92,
                    coreSuggestion: "基于近期市场走势和技术指标分析，比特币处于上升通道，建议增加10%的持仓比例，长期持有收益有望超过20%。",
                    publishTime: "2025-12-20 14:30:00",
                    status: REPORT_STATUS.PENDING,
                    originalMessage: "用户咨询：比特币近期是否值得加仓？最近市场波动较大，担心买入后下跌，想了解专业的投资建议。",
                    analystNotes: "该报告数据支撑充分，技术指标分析到位，参考了近6个月的市场走势和成交量数据。"
                }
            ]);
        } catch (error) {
            // 详细打印错误信息，便于排查
            console.error('接口请求异常详情：', {
                message: error.message,
                status: error.response?.status,
                url: error.config?.url
            });
            // 错误提示区分场景，提升用户体验
            if (error.message.includes('Network Error')) {
                message.error('网络异常，请检查网络连接或后端服务是否启动');
            } else if (error.response?.status === 404) {
                message.error('接口地址不存在，请检查后端接口路径是否正确');
            } else if (error.response?.status === 500) {
                message.error('后端服务报错，请联系后端开发人员排查');
            } else {
                message.error('获取报告数据失败，请稍后重试');
            }
            // 强制兜底：确保设置为空数组，让组件能渲染空状态
            setReports([]);
        } finally {
            // 无论成功失败，都强制结束加载状态，避免一直处于加载中
            setLoading(false);
        }
    };

    // 初始化加载数据
    useEffect(() => {
        // 加延迟，避免组件挂载时立即请求导致的渲染阻塞
        const timer = setTimeout(() => {
            fetchReports();
        }, 300);
        // 清理定时器，避免组件卸载后执行
        return () => clearTimeout(timer);
    }, []);

    // 格式化时间：增加容错，避免时间格式错误导致报错
    const formatTime = (timeString) => {
        if (!timeString) return '未知时间';
        try {
            const date = new Date(timeString);
            return date.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch (error) {
            return '时间格式错误';
        }
    };

    // 获取状态标签：增加容错，避免status为undefined
    const getStatusTag = (status) => {
        if (!status) return <Tag color="default">未知状态</Tag>;
        switch (status) {
            case REPORT_STATUS.APPROVED:
                return <Tag color="success">已通过</Tag>;
            case REPORT_STATUS.REJECTED:
                return <Tag color="error">已拒绝</Tag>;
            default:
                return <Tag color="processing">待审核</Tag>;
        }
    };

    // 获取建议类型标签：增加容错
    const getSuggestionTag = (title) => {
        if (!title) return <Tag color="default">未知类型</Tag>;
        return title.includes('增加') ?
            <Tag color="success">买入建议</Tag> :
            <Tag color="error">卖出建议</Tag>;
    };

    // 查看报告详情：增加容错，避免传入空数据
    const viewReportDetail = (record) => {
        if (!record) return;
        setCurrentReport(record);
        setReviewNotes('');
        setReviewDecision(null);
        setDetailVisible(true);
    };

    // 快速审核（通过/拒绝）
    const handleQuickReview = async (record, decision) => {
        if (!record?.id) {
            message.error('报告数据异常，无法执行审核');
            return;
        }

        setActionLoading(true);
        try {
            // 模拟API调用延迟（真实项目替换为后端审核接口）
            await new Promise(resolve => setTimeout(resolve, 800));
            // 更新本地数据
            setReports(prev => prev.map(report =>
                report.id === record.id
                    ? { ...report, status: decision === 'approve' ? REPORT_STATUS.APPROVED : REPORT_STATUS.REJECTED }
                    : report
            ));
            message.success(decision === 'approve' ? '报告已通过审核' : '报告已拒绝');
        } catch (error) {
            message.error('审核操作失败，请稍后重试');
            console.error('审核异常：', error);
        } finally {
            setActionLoading(false);
        }
    };

    // 提交审核（弹窗内）
    const submitReview = async () => {
        if (!reviewDecision) {
            message.warning('请选择审核结果');
            return;
        }
        if (!currentReport?.id) {
            message.error('报告数据异常，无法执行审核');
            return;
        }

        setActionLoading(true);

        try {
            // 模拟API调用延迟（真实项目中替换为后端审核接口）
            await new Promise(resolve => setTimeout(resolve, 800));
            // 更新本地数据
            setReports(prev => prev.map(report =>
                report.id === currentReport.id
                    ? { ...report, status: reviewDecision === 'approve' ? REPORT_STATUS.APPROVED : REPORT_STATUS.REJECTED }
                    : report
            ));
            message.success(reviewDecision === 'approve' ? '报告已通过审核' : '报告已拒绝');
            setDetailVisible(false);
        } catch (error) {
            message.error('审核操作失败，请稍后重试');
            console.error('审核异常：', error);
        } finally {
            setActionLoading(false);
        }
    };

    // 计算待审核报告数量：增加容错，避免reports不是数组
    const pendingReportsCount = Array.isArray(reports)
        ? reports.filter(report => report.status === REPORT_STATUS.PENDING).length
        : 0;

    // 搜索功能：增加容错
    const handleSearch = () => {
        console.log("搜索关键词：", searchKeyword);
        fetchReports();
    };

    // 重置筛选：优化状态更新逻辑
    const handleResetFilter = () => {
        setSearchKeyword('');
        setFilterStatus('all');
        // 确保状态更新后再请求
        setTimeout(() => {
            fetchReports();
        }, 100);
    };

    // 筛选状态变化：增加容错
    const handleFilterStatusChange = (value) => {
        if (!value) return;
        setFilterStatus(value);
        fetchReports();
    };

    const handleCreateReport = () => {
        message.info('跳转到新建报告页面');
        // navigate('/report/create');
    };

    const handleImportReport = () => {
        message.info('打开报告导入弹窗');
        // 此处可实现导入逻辑
    };

    // 强制确保组件有渲染内容（核心兜底）
    if (!loading && !Array.isArray(reports)) {
        setReports([]);
    }

    return (
        <div style={{ padding: '40px 24px 24px', minHeight: '80vh', backgroundColor: '#fff' }}> {/* 增加背景色，避免完全空白 */}
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <Title level={4}>建议报告管理</Title>

                <Space size="middle">
                    {/* 筛选区域 */}
                    <Space size="small">
                        <Input
                            placeholder="输入报告名称/币种搜索"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value || '')}
                            style={{ width: 200 }}
                            suffix={<SearchOutlined onClick={handleSearch} style={{ cursor: 'pointer' }} />}
                            onPressEnter={handleSearch}
                            disabled={loading} // 加载中禁用搜索
                        />
                        <Select
                            value={filterStatus}
                            onChange={handleFilterStatusChange}
                            style={{ width: 120 }}
                            options={[
                                { label: '全部状态', value: 'all' },
                                { label: '待审核', value: REPORT_STATUS.PENDING },
                                { label: '已通过', value: REPORT_STATUS.APPROVED },
                                { label: '已拒绝', value: REPORT_STATUS.REJECTED },
                            ]}
                            disabled={loading} // 加载中禁用筛选
                        />
                        <Button
                            type="text"
                            icon={<ReloadOutlined />}
                            onClick={handleResetFilter}
                            disabled={loading}
                        >
                            重置
                        </Button>
                    </Space>

                    {/* 操作按钮 */}
                    <Space size="small">
                        {pendingReportsCount > 0 && (
                            <Tag color="processing" icon={<ClockCircleOutlined />}>
                                待审核: {pendingReportsCount}
                            </Tag>
                        )}
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleCreateReport}
                            disabled={loading}
                        >
                            新建报告
                        </Button>
                        <Button
                            icon={<UploadOutlined />}
                            onClick={handleImportReport}
                            disabled={loading}
                        >
                            导入
                        </Button>
                    </Space>
                </Space>
            </div>

            {loading ? (
                // 加载状态：确保有明显的视觉反馈
                <div style={{ textAlign: 'center', padding: '100px 0', minHeight: '60vh' }}>
                    <Spin size="large" tip="正在加载报告数据...">
                        <div style={{ padding: '20px' }}></div>
                    </Spin>
                </div>
            ) : reports.length === 0 ? (
                // 空状态：确保渲染完整
                <div style={{ textAlign: 'center', padding: '80px 0', backgroundColor: '#fafafa', borderRadius: '12px', margin: '0 auto', maxWidth: '800px', minHeight: '40vh' }}>
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            <div style={{ marginTop: '16px' }}>
                                <Paragraph style={{ marginBottom: '8px', fontSize: '16px', color: '#666' }}>
                                    暂无建议报告数据
                                </Paragraph>
                                <Text type="secondary">
                                    您可以创建新报告或导入已有报告模板开始使用
                                </Text>
                            </div>
                        }
                    />
                    <Space size="middle" style={{ marginTop: '24px' }}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleCreateReport}
                        >
                            创建新报告
                        </Button>
                        <Button
                            icon={<UploadOutlined />}
                            onClick={handleImportReport}
                        >
                            导入报告
                        </Button>
                    </Space>
                </div>
            ) : (
                // 有数据状态：核心修改区域，恢复双查看详情入口 + 强制显示底部审核按钮
                <List
                    grid={{ gutter: 24, column: 1 }}
                    dataSource={reports}
                    renderItem={(item) => (
                        <List.Item key={item.id || Math.random()}>
                            <Card
                                title={
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '8px' }}>
                                        <div>
                                            <Space>
                                                <Text strong style={{ fontSize: '16px' }}>{item.title || '未知报告'}</Text>
                                                {getSuggestionTag(item.title)}
                                                <Tag color="blue">{item.cryptoType || '未知币种'}</Tag>
                                                <Tag color="orange">可信度: {item.confidence || 0}%</Tag>
                                            </Space>
                                        </div>
                                        <Space>
                                            {getStatusTag(item.status)}
                                            {/* 恢复标题栏的查看详情按钮 */}
                                            <Button type="link" icon={<EyeOutlined />} onClick={() => viewReportDetail(item)} disabled={loading}>
                                                查看详情
                                            </Button>
                                        </Space>
                                    </div>
                                }
                                style={{
                                    marginBottom: '16px',
                                    position: 'relative', // 作为底部绝对定位按钮的容器
                                    overflow: 'visible' // 确保按钮不被裁剪
                                }}
                                // 调整卡片主体内边距，预留底部空间
                                bodyStyle={{ padding: '24px', paddingBottom: '90px' }}
                                // 底部审核操作栏：双重保障（footer + 绝对定位）
                                footer={
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        alignItems: 'center',
                                        gap: '16px',
                                        padding: '20px 24px',
                                        borderTop: '2px solid #f5f5f5',
                                        backgroundColor: '#fafafa',
                                        margin: '0 -24px',
                                        marginTop: '10px'
                                    }}>
                                        <div style={{ marginRight: 'auto', color: '#666', fontSize: '14px' }}>
                                            <ClockCircleOutlined style={{ marginRight: '4px' }} />
                                            {formatTime(item.publishTime)}
                                        </div>
                                        {/* 底部查看详情按钮（保留） */}
                                        <Button
                                            type="link"
                                            icon={<EyeOutlined />}
                                            onClick={() => viewReportDetail(item)}
                                            disabled={loading}
                                            style={{ color: '#1890ff', fontWeight: 600 }}
                                        >
                                            查看详情
                                        </Button>
                                    </div>
                                }
                            >
                                {/* 1. 突出展示AI核心建议 */}
                                <div style={{
                                    marginBottom: '16px',
                                    padding: '20px',
                                    backgroundColor: '#f6ffed',
                                    borderRadius: '8px',
                                    border: '1px solid #b7eb8f'
                                }}>
                                    <Text strong style={{ fontSize: '16px', color: '#52c41a', display: 'block', marginBottom: '8px' }}>AI核心建议</Text>
                                    <Paragraph style={{
                                        fontSize: '15px',
                                        lineHeight: 1.8,
                                        marginBottom: 0,
                                        color: '#262626'
                                    }}>
                                        {item.coreSuggestion || '暂无核心建议'}
                                    </Paragraph>
                                </div>

                                {/* 2. 关联展示对应的原始消息 */}
                                <div style={{
                                    padding: '16px',
                                    backgroundColor: '#fafafa',
                                    borderRadius: '8px',
                                    border: '1px solid #f0f0f0'
                                }}>
                                    <Text strong style={{ fontSize: '15px', color: '#4a4a4a', display: 'block', marginBottom: '8px' }}>原始消息</Text>
                                    <Paragraph style={{
                                        fontSize: '14px',
                                        lineHeight: 1.7,
                                        marginBottom: 0,
                                        color: '#595959'
                                    }}>
                                        {item.originalMessage || '暂无原始消息'}
                                    </Paragraph>
                                </div>

                                {/* 强制显示底部审核按钮（绝对定位，不被任何样式覆盖） */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: '25px',
                                    right: '180px', // 避开底部查看详情按钮
                                    display: 'flex',
                                    gap: '12px',
                                    zIndex: 10, // 确保在最上层
                                }}>
                                    {item.status === REPORT_STATUS.PENDING && (
                                        <Space size="middle">
                                            <Button
                                                danger
                                                size="default"
                                                icon={<CloseCircleOutlined />}
                                                onClick={() => handleQuickReview(item, 'reject')}
                                                loading={actionLoading}
                                                style={{
                                                    padding: '0 20px',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                    backgroundColor: '#ff4d4f',
                                                    borderColor: '#ff4d4f'
                                                }}
                                            >
                                                拒绝
                                            </Button>
                                            <Button
                                                type="primary"
                                                size="default"
                                                icon={<CheckCircleOutlined />}
                                                onClick={() => handleQuickReview(item, 'approve')}
                                                loading={actionLoading}
                                                style={{
                                                    padding: '0 20px',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                    backgroundColor: '#1890ff',
                                                    borderColor: '#1890ff'
                                                }}
                                            >
                                                通过
                                            </Button>
                                        </Space>
                                    )}
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
                        <Button
                            key="reject"
                            danger
                            icon={<CloseCircleOutlined />}
                            onClick={() => setReviewDecision('reject')}
                            loading={actionLoading}
                            style={{ marginRight: '8px' }}
                        >
                            拒绝
                        </Button>,
                        <Button
                            key="approve"
                            type="primary"
                            icon={<CheckCircleOutlined />}
                            onClick={() => setReviewDecision('approve')}
                            loading={actionLoading}
                        >
                            通过
                        </Button>
                    ] : []),
                    <Button
                        key="close"
                        onClick={() => setDetailVisible(false)}
                        disabled={actionLoading}
                        style={{ marginLeft: '8px' }}
                    >
                        关闭
                    </Button>
                ]}
                width={900}
                onOk={submitReview}
                okButtonProps={{ style: { display: 'none' } }}
                maskClosable={false}
                destroyOnHidden={true} // 关闭弹窗销毁内容，避免内存泄漏
            >
                {currentReport ? (
                    <div style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '8px' }}>
                        {/* 报告头部信息 */}
                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                                <Title level={4} style={{ marginBottom: 0 }}>{currentReport.title || '未知报告'}</Title>
                                <Space>
                                    <Tag color="blue">{currentReport.cryptoType || '未知币种'}</Tag>
                                    {getSuggestionTag(currentReport.title)}
                                    <Tag color="orange">可信度: {currentReport.confidence || 0}%</Tag>
                                </Space>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#666', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
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
                                {currentReport.coreSuggestion || '暂无核心建议内容'}
                            </Paragraph>
                        </div>

                        {/* 原始消息 */}
                        <div style={{ marginBottom: '24px' }}>
                            <Title level={5} style={{ marginBottom: '16px' }}>原始消息</Title>
                            <Card size="small" variant="outlined">
                                <Paragraph style={{ lineHeight: 1.8 }}>{currentReport.originalMessage || '暂无原始消息'}</Paragraph>
                            </Card>
                        </div>

                        {/* 分析师备注 */}
                        {currentReport.analystNotes ? (
                            <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#e6f7ff', borderRadius: '8px', border: '1px solid #91d5ff' }}>
                                <Title level={5} style={{ marginBottom: '12px', color: '#0050b3' }}>分析师备注</Title>
                                <Paragraph style={{ lineHeight: 1.6, marginBottom: 0 }}>{currentReport.analystNotes}</Paragraph>
                            </div>
                        ) : (
                            <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
                                <Text type="secondary">暂无分析师备注</Text>
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
                                        onChange={(e) => setReviewNotes(e.target.value || '')}
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
                                {reviewNotes ? (
                                    <div style={{ marginTop: '8px' }}>
                                        <Text strong>审核备注：</Text>
                                        <Text style={{ marginLeft: '8px' }}>{reviewNotes}</Text>
                                    </div>
                                ) : (
                                    <div style={{ marginTop: '8px' }}>
                                        <Text type="secondary">暂无审核备注</Text>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <Text type="secondary">暂无报告详情数据</Text>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ReportList;