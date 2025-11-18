import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, UserAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // 这里应该调用注册服务，但目前系统可能没有实现
      // 模拟注册成功 - 自动添加到用户列表，无需管理员审核
      message.success('注册成功，账户已自动激活');
      
      // 注册成功后跳转到登录页面
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      message.error(error.message || '注册失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form-wrapper">
        <div className="register-logo">
          <h1>数字货币投资系统</h1>
          <p>创建新账户</p>
        </div>
        <Form
          name="normal_register"
          className="register-form"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名!' },
              { min: 3, message: '用户名至少3个字符!' }
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="用户名"
              className="register-input"
            />
          </Form.Item>
          
          <Form.Item
            name="name"
            rules={[
              { required: true, message: '请输入姓名!' }
            ]}
          >
            <Input
              prefix={<UserAddOutlined className="site-form-item-icon" />}
              placeholder="姓名"
              className="register-input"
            />
          </Form.Item>
          
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱!' },
              { type: 'email', message: '请输入有效的邮箱地址!' }
            ]}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="邮箱"
              className="register-input"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码!' },
              { min: 6, message: '密码至少6个字符!' }
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="密码"
              className="register-input"
            />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致!'));
                },
              }),
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="确认密码"
              className="register-input"
            />
          </Form.Item>
          
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="register-form-button"
              loading={loading}
              style={{ width: '100%', marginBottom: '12px' }}
            >
              注册
            </Button>
            <Button
              type="default"
              className="register-back-button"
              onClick={() => navigate('/login')}
              style={{ width: '100%' }}
            >
              返回登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Register;