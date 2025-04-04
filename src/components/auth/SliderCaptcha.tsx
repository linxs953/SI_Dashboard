import React, { useState, useEffect } from 'react';
import { Modal, Button, message, Slider, Row, Col, Typography, Space } from 'antd';
import { CheckOutlined, ReloadOutlined, UnlockOutlined, LockOutlined } from '@ant-design/icons';
import './SliderCaptcha.css';

interface SliderCaptchaProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SliderCaptcha: React.FC<SliderCaptchaProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [sliderValue, setSliderValue] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [targetPosition, setTargetPosition] = useState(60); // Default target at 60%
  const { Text, Title } = Typography;
  
  // Reset the state when modal becomes visible
  useEffect(() => {
    if (visible) {
      setSliderValue(0);
      setIsVerified(false);
      // Generate a random target between 40 and 80
      setTargetPosition(Math.floor(Math.random() * 40 + 40));
    }
  }, [visible]);
  
  // Handle slider change
  const handleSliderChange = (value: number) => {
    setSliderValue(value);
  };
  
  // Handle slider after change (after user stops dragging)
  const handleSliderAfterChange = (value: number) => {
    console.log('Final slider value:', value);
    console.log('Target position:', targetPosition);
    
    // For demo purposes, make verification very easy
    // In a real application, you would want a more strict check
    if (value >= 10) {
      setIsVerified(true);
      message.success('验证成功!');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    } else {
      message.info('请将滑块向右拖动');
    }
  };

  // Mark the slider with some colors
  const sliderTrackStyle = isVerified ? 
    { backgroundColor: '#52c41a' } : 
    { backgroundColor: '#1890ff' };

  // Use the handle style from Ant Design
  const sliderHandleStyle = {
    borderColor: isVerified ? '#52c41a' : '#1890ff',
    backgroundColor: '#fff',
    opacity: 1,
  };
  
  // Reset the captcha
  const resetCaptcha = () => {
    setSliderValue(0);
    setIsVerified(false);
    // Generate a new random target
    setTargetPosition(Math.floor(Math.random() * 40 + 40));
  };

  return (
    <Modal
      title="安全验证"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={400}
      maskClosable={false}
      className="ant-slider-captcha-modal"
    >
      <div style={{ padding: '20px' }}>
        <Row gutter={[0, 24]}>
          <Col span={24} style={{ textAlign: 'center' }}>
            <Space direction="vertical" size="small">
              <Title level={5}>
                {isVerified ? (
                  <span style={{ color: '#52c41a' }}>
                    <CheckOutlined /> 验证成功
                  </span>
                ) : (
                  <span>滑动滑块完成验证</span>
                )}
              </Title>
              
              <div className="verification-status">
                {isVerified ? (
                  <UnlockOutlined style={{ fontSize: '64px', color: '#52c41a' }} />
                ) : (
                  <LockOutlined style={{ fontSize: '64px', color: '#1890ff' }} />
                )}
              </div>
            </Space>
          </Col>

          <Col span={24}>
            <Slider
              disabled={isVerified}
              value={sliderValue}
              onChange={handleSliderChange}
              onAfterChange={handleSliderAfterChange}
              trackStyle={sliderTrackStyle}
              handleStyle={sliderHandleStyle}
              tooltip={{ formatter: null }}
            />
            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <Text type="secondary">
                {isVerified ? (
                  "验证成功"
                ) : (
                  "请将滑块拖动到右侧"
                )}
              </Text>
            </div>
          </Col>

          <Col span={24} style={{ textAlign: 'center' }}>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={resetCaptcha}
              disabled={isVerified}
              type="text"
            >
              重置
            </Button>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

export default SliderCaptcha;
