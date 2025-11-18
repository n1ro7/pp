import React, { useState, useEffect } from 'react';
import { Card, Tabs, Form, Input, Select, Button, Switch, message, Modal, Space, Table, Spin, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SettingOutlined, UserOutlined, ReloadOutlined, SearchOutlined, KeyOutlined, AuditOutlined, EyeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
import { useSettings } from '../../contexts/SettingsContext';
import { addUser, getUsers, updateUser, deleteUser, resetPassword, getOperationLogs, getSystemSettings, updateSystemSettings } from '../../services/adminService';
import { useNavigate } from 'react-router-dom';
import { t } from '../../utils/i18n';
import './Admin.css';

const { TabPane } = Tabs;
const { Option } = Select;

const Admin = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm();
  const [settingsForm] = Form.useForm();
  const [settingsLoading, setSettingsLoading] = useState(false);
  // 搜索和过滤状态
  const [searchParams, setSearchParams] = useState({
    search: '',
    role: '',
    status: '',
    page: 1,
    pageSize: 10
  });
  // 操作日志状态
  const [logs, setLogs] = useState([]);
  const [logsTotal, setLogsTotal] = useState(0);
  const [logSearchParams, setLogSearchParams] = useState({
    operator: '',
    action: '',
    page: 1,
    pageSize: 10
  });
  // 密码重置模态框
  const [resetPasswordVisible, setResetPasswordVisible] = useState(false);
  const [resetPasswordForm] = Form.useForm();
  const [selectedUserId, setSelectedUserId] = useState(null);
  // 日志详情模态框
  const [logDetailsVisible, setLogDetailsVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  // 获取用户列表
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsers(searchParams);
      setUsers(response.users);
      setTotal(response.total);
    } catch (error) {
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchOperationLogs = async () => {
    try {
      setLoading(true);
      const response = await getOperationLogs(logSearchParams);
      setLogs(response.logs);
      setLogsTotal(response.total);
    } catch (error) {
      message.error('获取操作日志失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperationLogs();
  }, [logSearchParams]);

  // 获取系统设置
  const fetchSystemSettings = async () => {
    setSettingsLoading(true);
    try {
      const response = await getSystemSettings();
      settingsForm.setFieldsValue(response);
    } catch (error) {
      message.error('获取系统设置失败');
    } finally {
      setSettingsLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    fetchUsers();
    fetchSystemSettings();
  }, [searchParams]);

  // 保存系统设置
  const handleSettingsFormSubmit = async (values) => {
    setSettingsLoading(true);
    try {
      // 转换自动登出时间为毫秒
      if (values.autoLogoutTime) {
        values.autoLogoutTime = values.autoLogoutTime * 60 * 1000;
      }
      
      const response = await updateSystemSettings(values);
      message.success(response.message || '设置保存成功');
      
      // 更新Context中的设置，使所有组件都能获取最新设置
      updateSettings(values);
      
      // 如果切换了语言，显示提示信息
      if (values.defaultLanguage && values.defaultLanguage !== settings.defaultLanguage) {
        message.info(`系统语言已切换为${values.defaultLanguage === 'en-US' ? 'English' : '简体中文'}`);
      }
    } catch (error) {
      message.error('保存失败，请重试');
    } finally {
      setSettingsLoading(false);
    }
  };

  // 刷新设置
  const handleRefreshSettings = () => {
    fetchSystemSettings();
  };

  // 用户表格列配置
  const userColumns = [
    {
      title: t('username'),
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('email'),
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: t('role'),
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <span>{role === 'admin' ? t('admin') : t('regularUser')}</span>
      ),
    },
    {
      title: t('status'),
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        return status === 'active' ? (
          <span className="status-active">{t('enabled')}</span>
        ) : (
          <span className="status-inactive">{t('disabled')}</span>
        );
      },
    },
    {
      title: t('createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: t('action'),
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditUser(record)}
            disabled={record.username === 'admin'}
            title={t('editUser')}
          >
            {t('edit')}
          </Button>
          <Button
            type="link"
            icon={<KeyOutlined />}
            onClick={() => showResetPasswordModal(record.id)}
            title={t('resetPassword')}
          >
            {t('resetPassword')}
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteUser(record.id)}
            disabled={record.username === 'admin'}
            title={t('deleteUser')}
          >
            {t('delete')}
          </Button>
        </Space>
      ),
    },
  ];

  // 查看日志详情
  const handleViewLogDetails = (log) => {
    setSelectedLog(log);
    setLogDetailsVisible(true);
  };

  const logColumns = [
    {
      title: t('operator'),
      dataIndex: 'operator',
      key: 'operator'
    },
    {
      title: t('action'),
      dataIndex: 'action',
      key: 'action'
    },
    {
      title: t('target'),
      dataIndex: 'target',
      key: 'target'
    },
    {
      title: t('operationTime'),
      dataIndex: 'time',
      key: 'time'
    },
    {
      title: t('ipAddress'),
      dataIndex: 'ip',
      key: 'ip'
    },
    {      title: '详情',      key: 'details',      render: (_, record) => (        <Button           type="link"           icon={<EyeOutlined />}           size="small"          onClick={() => handleViewLogDetails(record)}        >          查看详情        </Button>      )    }
  ];

  // 打开添加用户模态框
  const handleAddUser = () => {
    setModalType('add');
    setCurrentUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 打开编辑用户模态框
  const handleEditUser = (user) => {
    setModalType('edit');
    setCurrentUser(user);
    form.setFieldsValue(user);
    setModalVisible(true);
  };

  // 处理用户搜索
  const handleUserSearch = (values) => {
    setSearchParams({
      ...searchParams,
      search: values.search || '',
      role: values.role || '',
      status: values.status || '',
      page: 1
    });
  };

  // 处理日志搜索
  const handleLogSearch = (values) => {
    setLogSearchParams({
      ...logSearchParams,
      operator: values.operator || '',
      action: values.action || '',
      page: 1
    });
  };

  // 重置搜索条件
  const resetUserSearch = () => {
    setSearchParams({
      search: '',
      role: '',
      status: '',
      page: 1,
      pageSize: 10
    });
  };

  const resetLogSearch = () => {
    setLogSearchParams({
      operator: '',
      action: '',
      page: 1,
      pageSize: 10
    });
  };

  // 处理分页
  const handleUserPageChange = (page, pageSize) => {
    setSearchParams({
      ...searchParams,
      page,
      pageSize
    });
  };

  const handleLogPageChange = (page, pageSize) => {
    setLogSearchParams({
      ...logSearchParams,
      page,
      pageSize
    });
  };

  // 处理密码重置
  const showResetPasswordModal = (userId) => {
    setSelectedUserId(userId);
    resetPasswordForm.resetFields();
    setResetPasswordVisible(true);
  };

  const handleResetPassword = async (values) => {
    try {
      setLoading(true);
      await resetPassword(selectedUserId, values.newPassword);
      message.success('密码重置成功');
      setResetPasswordVisible(false);
      fetchOperationLogs(); // 刷新日志
    } catch (error) {
      message.error('密码重置失败');
    } finally {
      setLoading(false);
    }
  };

  // 删除用户
  const handleDeleteUser = (userId) => {
    Modal.confirm({
      title: t('deleteUserConfirm'),
      content: t('deleteUserContent'),
      onOk: async () => {
        try {
          await deleteUser(userId);
          message.success('删除用户成功');
          fetchUsers();
        } catch (error) {
          message.error('删除用户失败');
        }
      },
    });
  };

  // 提交用户表单
  const handleUserFormSubmit = async (values) => {
    try {
      if (modalType === 'add') {
        await addUser(values);
        message.success('添加用户成功');
      } else {
        await updateUser(currentUser.id, values);
        message.success('更新用户成功');
      }
      setModalVisible(false);
      fetchUsers();
    } catch (error) {
      message.error(modalType === 'add' ? '添加用户失败' : '更新用户失败');
    }
  };

  const renderSystemSettings = () => {
    // 设置表单初始值（移除theme相关配置和基础设置）
    const formInitialValues = {
      apiTimeout: settings.apiTimeout || 30000,
      autoLogoutTime: settings.autoLogoutTime ? settings.autoLogoutTime / 60000 : 30,
      notificationEnabled: settings.notificationEnabled !== undefined ? settings.notificationEnabled : true,
      dataRefreshInterval: settings.dataRefreshInterval || 60
    };

    return (
      <div className="system-settings">
        <div className="settings-header">
          <h2>{t('systemConfiguration')}</h2>
          <Button type="primary" onClick={handleRefreshSettings}>{t('refresh')}</Button>
        </div>
        <Form
          name="system-settings-form"
          layout="horizontal"
          onFinish={handleSettingsFormSubmit}
          initialValues={formInitialValues}
        >
          <Card className="settings-card" title={t('securitySettings')}>
            <Form.Item
              label={t('apiTimeout')}
              name="apiTimeout"
              rules={[{ required: true, message: t('enterApiTimeout') }]}
            >
              <Input type="number" />
            </Form.Item>
            <Form.Item
              label={t('autoLogoutTime')}
              name="autoLogoutTime"
              rules={[{ required: true, message: t('enterAutoLogoutTime') }]}
            >
              <Input type="number" />
            </Form.Item>
          </Card>
          <Card className="settings-card" title={t('notificationSettings')}>
            <Form.Item
              label={t('systemNotification')}
              name="notificationEnabled"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Card>
          <Card className="settings-card" title={t('advancedSettings')}>
            <Form.Item
              label={t('dataRefreshInterval')}
              name="dataRefreshInterval"
              rules={[{ required: true, message: t('enterDataRefreshInterval') }]}
            >
              <Input type="number" />
            </Form.Item>
          </Card>
          <Form.Item wrapperCol={{ offset: 4, span: 16 }} style={{ textAlign: 'center', marginTop: '24px' }}>
            <Space size="middle">
              <Button type="primary" htmlType="submit" size="middle">{t('saveSettings')}</Button>
              <Button size="middle" onClick={() => settingsForm.resetFields()}>{t('reset')}</Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    );
  };

  return (
    <div className="admin-page">
      <Card className="admin-card" title={t('systemManagement')} extra={t('manageUsersSettings')}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          {/* 用户管理标签页 */}
          <TabPane tab={<span><UserOutlined /> {t('userManagement')}</span>} key="users">
            <div className="users-section">
              <div className="section-header">
                <h3>{t('userList')}</h3>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAddUser}>
                  {t('addUser')}
                </Button>
              </div>
              
              {/* 搜索表单 */}
              <div className="search-section">
                <Card className="search-card">
                  <Form layout="inline" onFinish={handleUserSearch}>
                    <Form.Item name="search" className="search-item">
                      <Input prefix={<SearchOutlined />} placeholder={t('searchUsernameNameEmail')} />
                    </Form.Item>
                    <Form.Item name="role">
                      <Select placeholder={t('role')} allowClear>
                        <Option value="admin">{t('admin')}</Option>
                        <Option value="user">{t('regularUser')}</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item name="status">
                      <Select placeholder={t('status')} allowClear>
                        <Option value="active">{t('enabled')}</Option>
                        <Option value="inactive">{t('disabled')}</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item>
                      <Space>
                        <Button type="primary" htmlType="submit">{t('search')}</Button>
                        <Button onClick={resetUserSearch}>{t('reset')}</Button>
                        <Button icon={<ReloadOutlined />} onClick={fetchUsers}>{t('refresh')}</Button>
                      </Space>
                    </Form.Item>
                  </Form>
                </Card>
              </div>
              
              <div className="users-table">
                <Table
                  className="users-table"
                  columns={userColumns}
                  dataSource={users}
                  rowKey="id"
                  loading={loading}
                  pagination={{
                    total,
                    current: searchParams.page,
                    pageSize: searchParams.pageSize,
                    showSizeChanger: true,
                    showTotal: total => `${t('total')} ${total} ${t('items')}`,
                    onChange: handleUserPageChange,
                    onShowSizeChange: handleUserPageChange
                  }}
                  size="middle"
                />
              </div>
            </div>
          </TabPane>
          
          {/* 操作日志标签页 */}
          <TabPane tab={<span><AuditOutlined /> {t('operationLogs')}</span>} key="logs">
            <div className="logs-section">
              <div className="section-header">
                <h3>{t('systemOperationLogs')}</h3>
                <Button icon={<ReloadOutlined />} onClick={fetchOperationLogs}>
                  {t('refresh')}
                </Button>
              </div>
              
              {/* 日志搜索表单 */}
              <div className="search-section">
                <Card className="search-card">
                  <Form layout="inline" onFinish={handleLogSearch}>
                    <Form.Item name="operator">
                      <Input prefix={<UserOutlined />} placeholder={t('operator')} />
                    </Form.Item>
                    <Form.Item name="action">
                      <Input prefix={<SearchOutlined />} placeholder={t('operationType')} />
                    </Form.Item>
                    <Form.Item>
                      <Space>
                        <Button type="primary" htmlType="submit">{t('search')}</Button>
                        <Button onClick={resetLogSearch}>{t('reset')}</Button>
                        <Button icon={<ReloadOutlined />} onClick={fetchOperationLogs}>{t('refresh')}</Button>
                      </Space>
                    </Form.Item>
                  </Form>
                </Card>
              </div>
              
              <div className="logs-table">
                <Table
                  className="logs-table"
                  columns={logColumns}
                  dataSource={logs}
                  rowKey="id"
                  loading={loading}
                  pagination={{
                    total: logsTotal,
                    current: logSearchParams.page,
                    pageSize: logSearchParams.pageSize,
                    showSizeChanger: true,
                    showTotal: total => `${t('total')} ${total} ${t('logs')}`,
                    onChange: handleLogPageChange,
                    onShowSizeChange: handleLogPageChange
                  }}
                  size="middle"
                />
              </div>
            </div>
          </TabPane>

          {/* 系统设置标签页 */}
          <TabPane tab={<span><SettingOutlined /> {t('systemSettings')}</span>} key="settings">
            <div className="settings-section">
              <Spin spinning={settingsLoading}>
                {renderSystemSettings()}
              </Spin>
            </div>
          </TabPane>
        </Tabs>
      </Card>

      {/* 用户编辑模态框 */}
      <Modal
        title={modalType === 'add' ? t('addUser') : t('editUser')}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUserFormSubmit}
        >
          <Form.Item
            label={t('username')}
            name="username"
            rules={[{ required: true, message: t('enterUsername') }, { min: 3, message: t('usernameMinCharacters') }]}
          >
            <Input disabled={modalType === 'edit'} placeholder={t('enterUsername')} />
          </Form.Item>
          
          {modalType === 'add' && (
            <Form.Item
              label={t('initialPassword')}
              name="password"
              rules={[{ required: true, message: t('enterInitialPassword') }, { min: 6, message: t('passwordMinCharacters') }]}
            >
              <Input.Password placeholder={t('enterInitialPassword')} />
            </Form.Item>
          )}

          <Form.Item
            label={t('name')}
            name="name"
            rules={[{ required: true, message: t('enterName') }]}
          >
            <Input placeholder={t('enterName')} />
          </Form.Item>

          <Form.Item
            label={t('email')}
            name="email"
            rules={[
              { required: true, message: t('enterEmail') },
              { type: 'email', message: t('enterValidEmail') }
            ]}
          >
            <Input placeholder={t('enterEmail')} />
          </Form.Item>

          <Form.Item
            label={t('role')}
            name="role"
            rules={[{ required: true, message: t('selectRole') }]}
          >
            <Select placeholder={t('selectRole')}>
              <Option value="admin">{t('admin')}</Option>
              <Option value="user">{t('regularUser')}</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={t('status')}
            name="status"
            rules={[{ required: true, message: t('selectStatus') }]}
          >
            <Select placeholder={t('selectStatus')}>
              <Option value="active">{t('enabled')}</Option>
              <Option value="inactive">{t('disabled')}</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => setModalVisible(false)}>{t('cancel')}</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {modalType === 'add' ? t('add') : t('save')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 密码重置模态框 */}
      <Modal
        title={t('resetPassword')}
        open={resetPasswordVisible}
        onCancel={() => setResetPasswordVisible(false)}
        footer={null}
        width={400}
      >
        <Form
          form={resetPasswordForm}
          layout="vertical"
          onFinish={handleResetPassword}
        >
          <Form.Item
            label={t('newPassword')}
            name="newPassword"
            rules={[
              { required: true, message: t('enterNewPassword') },
              { min: 6, message: t('passwordMinCharacters') },
              { pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/, 
                message: t('passwordMustContain') }
            ]}
          >
            <Input.Password placeholder={t('enterNewPassword')} />
          </Form.Item>
          
          <Form.Item
            label={t('confirmNewPassword')}
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: t('confirmNewPassword') },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t('passwordsDoNotMatch')));
                },
              }),
            ]}
          >
            <Input.Password placeholder={t('confirmNewPassword')} />
          </Form.Item>
          
          <Form.Item>
            <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => setResetPasswordVisible(false)}>{t('cancel')}</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {t('reset')}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 日志详情模态框 */}      <Modal        title="操作日志详情"        open={logDetailsVisible}        onCancel={() => setLogDetailsVisible(false)}        footer={[          <Button key="close" onClick={() => setLogDetailsVisible(false)}>            关闭          </Button>        ]}        width={650}        bodyStyle={{ padding: '24px' }}      >        {selectedLog && (          <div className="log-details" style={{ fontSize: '14px' }}>            <div className="log-detail-item" style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column' }}>              <Text strong style={{ marginBottom: '8px', fontSize: '15px', color: '#1890ff' }}>基本信息</Text>              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>                <div style={{ display: 'flex', alignItems: 'flex-start' }}>                  <Text strong style={{ width: '80px', color: '#666' }}>操作人:</Text>                  <Text style={{ flex: 1, wordBreak: 'break-all' }}>{selectedLog.operator || '-'}</Text>                </div>                <div style={{ display: 'flex', alignItems: 'flex-start' }}>                  <Text strong style={{ width: '80px', color: '#666' }}>操作类型:</Text>                  <Text style={{ flex: 1, wordBreak: 'break-all' }}>{selectedLog.action || '-'}</Text>                </div>                <div style={{ display: 'flex', alignItems: 'flex-start' }}>                  <Text strong style={{ width: '80px', color: '#666' }}>操作对象:</Text>                  <Text style={{ flex: 1, wordBreak: 'break-all' }}>{selectedLog.target || '-'}</Text>                </div>                <div style={{ display: 'flex', alignItems: 'flex-start' }}>                  <Text strong style={{ width: '80px', color: '#666' }}>IP地址:</Text>                  <Text style={{ flex: 1, wordBreak: 'break-all' }}>{selectedLog.ip || '-'}</Text>                </div>              </div>            </div>            <div className="log-detail-item" style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column' }}>              <Text strong style={{ marginBottom: '8px', fontSize: '15px', color: '#1890ff' }}>操作时间</Text>              <div style={{ display: 'flex', alignItems: 'flex-start' }}>                <Text strong style={{ width: '80px', color: '#666' }}>时间:</Text>                <Text style={{ flex: 1, wordBreak: 'break-all' }}>{selectedLog.time || '-'}</Text>              </div>            </div>            {selectedLog.description && (              <div className="log-detail-item" style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column' }}>                <Text strong style={{ marginBottom: '8px', fontSize: '15px', color: '#1890ff' }}>操作描述</Text>                <div style={{ backgroundColor: '#f7f7f7', padding: '12px', borderRadius: '4px', lineHeight: '1.6' }}>                  <Text>{selectedLog.description}</Text>                </div>              </div>            )}            {selectedLog.params && Object.keys(selectedLog.params).length > 0 && (              <div className="log-detail-item" style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column' }}>                <Text strong style={{ marginBottom: '12px', fontSize: '15px', color: '#1890ff' }}>参数详情</Text>                <pre style={{ fontSize: '13px', backgroundColor: '#f5f5f5', padding: '16px', borderRadius: '6px', overflow: 'auto', border: '1px solid #e8e8e8', lineHeight: '1.5' }}>                  {JSON.stringify(selectedLog.params, null, 2)}                </pre>              </div>            )}          </div>        )}      </Modal>
    </div>
  );
};

export default Admin;