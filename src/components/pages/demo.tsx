import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, Checkbox, Divider, message, Typography } from 'antd';
import Draggable from 'react-draggable';
import styled from '@emotion/styled';
import { LockOutlined, UserOutlined, SafetyOutlined, GithubOutlined, GoogleOutlined, EyeTwoTone, EyeInvisibleOutlined, ReloadOutlined } from '@ant-design/icons';
import { keyframes } from '@emotion/react';

const { Title, Text } = Typography;

interface LoginFormData {
  username: string;
  password: string;
  remember?: boolean;
  captcha?: string;
}

// 背景动画效果
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// 淡入动画
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// 主容器样式
const LoginPage = styled.div`
  display: flex;
  min-height: 100vh;
  background-image: url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1920&q=80'), linear-gradient(-45deg, #8bb9e0, #a990cc, #91c7c7, #a3c7a2);
  background-size: cover, 400% 400%;
  background-position: center;
  background-blend-mode: overlay;
  animation: ${gradientAnimation} 20s ease infinite;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(5px);
  }
`;

// 内容区域的布局
const LoginContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  position: relative;
  z-index: 1;
`;

// 左侧图形区域
const BrandSection = styled.div`
  display: none;
  animation: ${fadeIn} 0.8s ease-out;
  
  @media (min-width: 992px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 50%;
    max-width: 600px;
    padding: 40px;
  }
  
  .brand-logo {
    margin-bottom: 30px;
    font-size: 40px;
    font-weight: 700;
    color: white;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }
  
  .brand-illustration {
    width: 100%;
    max-width: 480px;
    filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.15));
  }
`;

// 登录卡片
const LoginCard = styled.div`
  width: 100%;
  max-width: 520px;
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 50px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.6s ease-out;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);
  }
  
  .login-header {
    text-align: center;
    margin-bottom: 40px;
    
    .ant-typography {
      margin: 0;
    }
    
    h1 {
      font-size: 28px;
      font-weight: 700;
      background: linear-gradient(120deg, #1890ff, #722ed1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .subtitle {
      color: #8c8c8c;
      margin-top: 10px;
    }
  }
  
  .ant-form-item {
    margin-bottom: 24px;
    opacity: 0;
    animation: ${fadeIn} 0.4s ease-out forwards;
    
    &:nth-of-type(1) { animation-delay: 0.2s; }
    &:nth-of-type(2) { animation-delay: 0.3s; }
    &:nth-of-type(3) { animation-delay: 0.4s; }
    &:nth-of-type(4) { animation-delay: 0.5s; }
  }
  
  .ant-input-affix-wrapper {
    border-radius: 12px;
    border: 1px solid #f0f0f0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    padding: 12px 16px;
    height: 50px;
    background: #f5f5f5;
    
    .anticon {
      color: #bfbfbf;
      transition: color 0.3s ease;
      font-size: 18px;
    }
    
    &:hover {
      border-color: #40a9ff;
      background: #f9f9f9;
      .anticon { color: #40a9ff; }
    }
    
    &:focus, &-focused {
      border-color: #1890ff;
      background: white;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.12);
      .anticon { color: #1890ff; }
    }
    
    .ant-input {
      background: transparent;
      font-size: 16px;
      
      &::placeholder {
        color: #bfbfbf;
      }
    }
  }
`;

// 验证码输入框样式
const CaptchaInput = styled(Input)`
  width: 60%;
`;

// 验证码按钮样式
const CaptchaButton = styled(Button)`
  width: 40%;
  height: 50px;
  margin-left: 10px;
  border-radius: 12px;
  background: #f5f5f5;
  border: 1px solid #f0f0f0;
  color: #595959;
  transition: all 0.3s ease;
  
  &:hover, &:focus {
    background: #f0f0f0;
    color: #1890ff;
    border-color: #d9d9d9;
  }
  
  &:active {
    background: #e8e8e8;
  }
  
  &.ant-btn-loading {
    opacity: 0.8;
  }
`;

// 拼图滑块验证码容器
const SliderContainer = styled.div`
  margin-bottom: 24px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  opacity: 0;
  animation: ${fadeIn} 0.4s ease-out forwards;
  animation-delay: 0.45s;
  
  .verification-text {
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: #8c8c8c;
    
    span.success {
      color: #52c41a;
    }
    
    .refresh-button {
      cursor: pointer;
      color: #1890ff;
      transition: transform 0.3s ease;
      
      &:hover {
        transform: rotate(90deg);
      }
    }
  }
  
  .puzzle-container {
    position: relative;
    width: 100%;
    height: 160px;
    margin-bottom: 15px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    .puzzle-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .puzzle-block {
      position: absolute;
      width: 50px;
      height: 50px;
      background-color: rgba(255, 255, 255, 0.7);
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
      cursor: move;
      border-radius: 3px;
      transition: background-color 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      color: rgba(0, 0, 0, 0.5);
      
      &:hover {
        background-color: rgba(255, 255, 255, 0.8);
      }
    }
    
    .puzzle-slot {
      position: absolute;
      width: 52px;
      height: 52px;
      border: 2px dashed rgba(24, 144, 255, 0.4);
      border-radius: 3px;
      z-index: 0;
    }
  }
  
  .slider-track {
    position: relative;
    height: 40px;
    margin-top: 10px;
    background-color: #f0f0f0;
    border-radius: 20px;
    cursor: pointer;
    
    .slider-progress {
      position: absolute;
      height: 100%;
      border-radius: 20px;
      background-color: #91c788;
      width: 0;
      transition: width 0.1s;
    }
    
    .slider-handle {
      position: absolute;
      left: 0;
      top: -2px;
      width: 44px;
      height: 44px;
      background-color: white;
      border-radius: 50%;
      border: 2px solid #1890ff;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
      z-index: 10;
      cursor: grab;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #1890ff;
      transition: box-shadow 0.3s ease;
      
      &:hover {
        box-shadow: 0 3px 7px rgba(0, 0, 0, 0.2);
      }
      
      &:active {
        cursor: grabbing;
      }
    }
  }
  
  .verify-success {
    opacity: 0;
    pointer-events: none;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 20px;
    color: #52c41a;
    animation: ${fadeIn} 0.4s ease-out forwards;
    
    .success-icon {
      font-size: 40px;
      margin-bottom: 15px;
    }
  }
`;

// 登录按钮样式
const LoginButton = styled(Button)`
  height: 50px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
  margin-top: 10px;
  background: linear-gradient(90deg, #1890ff, #096dd9);
  border: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(24, 144, 255, 0.3);
    background: linear-gradient(90deg, #40a9ff, #1890ff);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 8px rgba(24, 144, 255, 0.2);
  }
  
  &.ant-btn-loading {
    opacity: 0.8;
  }
`;

// 其他登录方式样式
const OtherLoginOptions = styled.div`
  margin-top: 30px;
  text-align: center;
  
  .ant-divider {
    color: #bfbfbf;
    font-size: 14px;
  }
  
  .social-buttons {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    
    button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 1px solid #f0f0f0;
      background: white;
      margin: 0 8px;
      transition: all 0.3s ease;
      font-size: 18px;
      color: #8c8c8c;
      
      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
      }
      
      &:nth-child(1):hover { color: #333; }
      &:nth-child(2):hover { color: #db4437; }
    }
  }
`;

// 底部注册提示
const BottomText = styled.div`
  text-align: center;
  margin-top: 30px;
  font-size: 14px;
  color: #8c8c8c;
  
  a {
    color: #1890ff;
    font-weight: 500;
    margin-left: 4px;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const LoginForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // 获取验证码
  const handleGetCaptcha = () => {
    form.validateFields(['username']).then(() => {
      setCaptchaLoading(true);
      // 模拟获取验证码
      setTimeout(() => {
        setCaptchaLoading(false);
        setCountdown(60);
        message.success('验证码已发送至您的账号！');
      }, 1000);
    }).catch(() => {});
  };

  // 倒计时处理
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);
  
  // 滑块状态
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  
  // 处理滑块拖动完成
  const handleDragStop = (_e: any, data: any) => {
    const { x } = data;
    if (isVerified) return;
    
    // 获取轨道宽度
    const trackWidth = trackRef.current?.clientWidth || 300;
    const handleWidth = 40; // 滑块的宽度
    const maxDistance = trackWidth - handleWidth;
    
    // 如果拖动到达右侧（验证成功）
    if (x >= maxDistance * 0.95) {
      setSliderPosition(maxDistance);
      setIsVerified(true);
      message.success('验证成功！');
    } else {
      // 如果没有到达端点，重置位置
      setSliderPosition(0);
    }
  };
  
  // 拖动过程中更新进度条
  const handleDrag = (_e: any, data: any) => {
    if (isVerified) return;
    
    const { x } = data;
    // 确保不会超出轨道最大宽度
    const trackWidth = trackRef.current?.clientWidth || 300;
    const handleWidth = 40;
    const maxDistance = trackWidth - handleWidth;
    
    // 限制滑块位置在轨道范围内
    const constrainedPosition = Math.max(0, Math.min(x, maxDistance));
    setSliderPosition(constrainedPosition);
  };
  

  // 表单提交
  const onFinish = async (values: LoginFormData) => {
    if (!isVerified) {
      message.error('请完成滑块验证！');
      return;
    }
    
    setLoading(true);
    try {
      // 模拟登录请求
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Login form values:', values);
      message.success('登录成功！');
    } catch (error) {
      message.error('登录失败，请重试！');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginPage>
      <LoginContainer>
        <LoginCard>
          <div className="login-header">
            <Title level={2}>欢迎登录</Title>
            <Text className="subtitle">请使用您的账号密码登录系统</Text>
          </div>
          
          <Form
            form={form}
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: '请输入用户名!' },
                { min: 3, message: '用户名长度不能小于3个字符!' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="请输入用户名"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码!' },
                { min: 6, message: '密码长度不能小于6个字符!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="请输入密码"
                size="large"
                iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>


            
            <Form.Item>
              <SliderContainer>
                <div className="slider-title">
                  <span className={`slider-text ${isVerified ? 'success-text' : ''}`}>
                    {isVerified ? '验证成功！' : '请拖动滑块到最右侧完成验证'}
                  </span>
                </div>
                
                {!isVerified ? (
                  <div className="slider-track" ref={trackRef}>
                    <div 
                      className="slider-progress" 
                      style={{ width: `${sliderPosition}px` }}
                    />
                    <Draggable
                      axis="x"
                      bounds="parent"
                      position={{ x: sliderPosition, y: 0 }}
                      onStop={handleDragStop}
                      onDrag={handleDrag}
                      disabled={isVerified}
                    >
                      <div className={`slider-handle ${isVerified ? 'slider-success' : ''}`}>
                        {isVerified ? '✓' : '≡'}
                      </div>
                    </Draggable>
                  </div>
                ) : (
                  <div className="verify-success">
                    <span>✓</span> 验证成功！
                  </div>
                )}
              </SliderContainer>
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>记住我</Checkbox>
            </Form.Item>

            <Form.Item>
              <LoginButton
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                block
              >
                登录
              </LoginButton>
            </Form.Item>
          </Form>
          
          <OtherLoginOptions>
            <Divider>其他登录方式</Divider>
            <div className="social-buttons">
              <Button type="text" icon={<GithubOutlined />} />
              <Button type="text" icon={<GoogleOutlined />} />
            </div>
          </OtherLoginOptions>
          
          <BottomText>
            还没有账号? <a href="#/register">立即注册</a>
          </BottomText>
        </LoginCard>
      </LoginContainer>
    </LoginPage>
  );
};

const Demo = () => {
  return <LoginForm />;
};

export default Demo;