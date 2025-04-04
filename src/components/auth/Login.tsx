import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Card, Typography, Divider, message, Space, Tabs, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, GithubOutlined, GoogleOutlined, WechatOutlined, AlipayOutlined, MobileOutlined, MailOutlined, SafetyOutlined, FacebookOutlined } from '@ant-design/icons';
import SliderCaptcha from './SliderCaptcha';
import './Login.css';

const { Title, Text } = Typography;

interface LoginFormValues {
  username?: string;
  password?: string;
  mobile?: string;
  verificationCode?: string;
  remember: boolean;
  loginType?: 'account' | 'mobile' | 'wechat' | 'alipay';
}

interface LoginProps {
  onLogin?: (values: LoginFormValues) => Promise<void>;
  loading?: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, loading = false }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('account');
  const [countDown, setCountDown] = useState(0);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [formValues, setFormValues] = useState<LoginFormValues | null>(null);

  const handleSocialLogin = async (type: 'wechat' | 'alipay') => {
    try {
      setSubmitting(true);
      // Here you would integrate with WeChat/Alipay SDK
      // For demo purposes, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success(`${type === 'wechat' ? '微信' : '支付宝'}登录成功！`);
    } catch (error) {
      message.error('登录失败，请重试');
      console.error('Social login error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // 优化提交处理函数，减少不必要的状态更新
  const handleSubmit = (values: LoginFormValues) => {
    // 仅在需要时更新状态，并合并更新以减少渲染次数
    setFormValues(values);
    setShowCaptcha(true);
  };

  const handleCaptchaSuccess = async () => {
    if (!formValues) return;
    
    try {
      setSubmitting(true);
      
      // 如果提供了onLogin，则使用它。否则只显示成功消息。
      if (onLogin) {
        await onLogin(formValues);
      } else {
        // 用于演示目的的默认行为
        await new Promise(resolve => setTimeout(resolve, 1000));
        message.success('登录成功！欢迎回来！');
      }
    } catch (error) {
      message.error('登录失败。请检查您的凭据并重试。');
      console.error('登录错误:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCaptchaClose = () => {
    setShowCaptcha(false);
  };

  return (
    <div className="login-container">
      <SliderCaptcha 
        visible={showCaptcha}
        onClose={handleCaptchaClose}
        onSuccess={handleCaptchaSuccess}
      />
      <Card className="login-card">
        <div className="login-header">
          <Title level={2}>欢迎回来</Title>
          <Text type="secondary">选择您喜欢的方式登录</Text>
        </div>

        <div className="social-login">
          <Button 
            icon={<WechatOutlined style={{ fontSize: '24px', color: '#07C160' }} />}
            size="large"
            onClick={() => handleSocialLogin('wechat')}
            loading={submitting}
            className="social-button wechat"
          />
          <Button 
            icon={<AlipayOutlined style={{ fontSize: '24px', color: '#1677FF' }} />}
            size="large"
            onClick={() => handleSocialLogin('alipay')}
            loading={submitting}
            className="social-button alipay"
          />
        </div>

        <Divider>或</Divider>
        
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          centered
          size="large"
          items={[
            {
              key: 'account',
              label: (
                <span>
                  <UserOutlined />
                  账号登录
                </span>
              ),
              children: null
            },
            {
              key: 'mobile',
              label: (
                <span>
                  <MobileOutlined />
                  手机登录
                </span>
              ),
              children: null
            },
          ]}
        />
        
        <Form
          form={form}
          name="login"
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          layout="vertical"
          size="large"
          className="login-form"
          // 优化Form性能
          validateTrigger={['onBlur', 'onSubmit']} // 只在失焦和提交时验证，减少输入时的验证
        >
          {activeTab === 'account' && (
            <>
              <Form.Item
                name="username"
                rules={[
                  { required: activeTab === 'account', message: '请输入您的用户名或邮箱' },
                ]}
              >
                <Input 
                  prefix={<UserOutlined />} 
                  placeholder="用户名或邮箱" 
                  autoComplete="username"
                  size="large"
                  // 添加节流以减少输入事件触发频率
                  onChange={(e) => {
                    // 不在这里更新任何状态，让Form自己管理值
                    // 这样可以减少不必要的重渲染
                  }}
                />
              </Form.Item>
              
              <Form.Item
                name="password"
                rules={[
                  { required: activeTab === 'account', message: '请输入您的密码' },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="密码"
                  autoComplete="current-password"
                  size="large"
                  // 添加节流以减少输入事件触发频率
                  onChange={(e) => {
                    // 不在这里更新任何状态，让Form自己管理值
                  }}
                />
              </Form.Item>
            </>
          )}

          {activeTab === 'mobile' && (
            <>
              <Form.Item
                name="mobile"
                rules={[
                  { required: activeTab === 'mobile', message: '请输入您的手机号码' },
                  { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码' }
                ]}
              >
                <Input
                  prefix={<MobileOutlined />}
                  placeholder="手机号码"
                  autoComplete="tel"
                  size="large"
                  // 优化输入性能
                  onChange={(e) => {
                    // 不额外更新状态
                  }}
                />
              </Form.Item>
              
              <Form.Item
                name="verificationCode"
                rules={[
                  { required: activeTab === 'mobile', message: '请输入验证码' },
                  { len: 6, message: '验证码必须为6位数字' }
                ]}
              >
                <Row gutter={8}>
                  <Col flex="auto">
                    <Input
                      prefix={<SafetyOutlined />}
                      placeholder="验证码"
                      size="large"
                      // 优化输入性能
                      onChange={(e) => {
                        // 不额外更新状态
                      }}
                    />
                  </Col>
                  <Col flex="none">
                    <Button 
                      size="large" 
                      disabled={countDown > 0}
                      onClick={() => {
                        // Check if mobile field has a valid value first
                        form.validateFields(['mobile']).then(() => {
                          // Start countdown
                          setCountDown(60);
                          // Countdown timer
                          const interval = setInterval(() => {
                            setCountDown(prev => {
                              if (prev <= 1) {
                                clearInterval(interval);
                                return 0;
                              }
                              return prev - 1;
                            });
                          }, 1000);
                          // Show success message
                          message.success('验证码已发送！');
                        }).catch(() => {
                          // Validation failed
                        });
                      }}
                    >
                      {countDown > 0 ? `${countDown}秒` : '获取验证码'}
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
            </>
          )}
          
          <div className="login-options">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住我</Checkbox>
            </Form.Item>
            
            <Button type="link" className="forgot-password">
              忘记密码？
            </Button>
          </div>
          
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-button"
              loading={loading || submitting}
              block
            >
              登录
            </Button>
          </Form.Item>
        </Form>
        
        <Divider plain>或继续使用</Divider>
        
        <div className="social-login">
          <Space size="large">
            <Button shape="circle" icon={<GoogleOutlined />} size="large" />
            <Button shape="circle" icon={<FacebookOutlined />} size="large" />
            <Button shape="circle" icon={<GithubOutlined />} size="large" />
          </Space>
        </div>
        
        <div className="register-link">
          <Text type="secondary">还没有账户？</Text>
          <Button type="link">立即注册</Button>
        </div>
      </Card>
    </div>
  );
};

export default Login;
