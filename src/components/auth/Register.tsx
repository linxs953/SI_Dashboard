import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: RegisterFormData) => {
    if (values.password !== values.confirmPassword) {
      message.error('两次输入的密码不一致');
      return;
    }

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await registerUser(values);
      message.success('注册成功！');
      navigate('/login');
    } catch (error) {
      message.error('注册失败，请重试。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a365d 0%, #2d3748 100%)',
      padding: '20px'
    }}>
      <Card 
        style={{
          width: '100%',
          maxWidth: '420px',
          borderRadius: '16px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
          background: 'rgba(255, 255, 255, 0.98)'
        }}
        bordered={false}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Title level={2} style={{ 
            marginBottom: '8px',
            background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            注册账号
          </Title>
          <Typography.Text type="secondary">
            创建账号以开始使用
          </Typography.Text>
        </div>
        <Form
          name="register"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名！' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#3b82f6' }} />}
              placeholder="用户名"
              size="large"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱！' },
              { type: 'email', message: '请输入有效的邮箱地址！' }
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: '#3b82f6' }} />}
              placeholder="邮箱"
              size="large"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码！' },
              { min: 6, message: '密码长度不能少于6个字符！' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#3b82f6' }} />}
              placeholder="密码"
              size="large"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: '请确认密码！' },
              { min: 6, message: '密码长度不能少于6个字符！' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#3b82f6' }} />}
              placeholder="确认密码"
              size="large"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              style={{
                height: '48px',
                borderRadius: '8px',
                fontSize: '16px',
                background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
                border: 'none',
                boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
              }}
            >
              注册
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Typography.Text type="secondary">
              已有账号？{' '}
              <Link to="/login" style={{ color: '#2563eb', fontWeight: 500 }}>
                立即登录
              </Link>
            </Typography.Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
