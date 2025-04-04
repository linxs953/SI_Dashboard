import React from 'react';
import styled from 'styled-components';
import { CheckCircleOutlined, ApiOutlined, SyncOutlined, RobotOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  min-height: 100vh;
  background-color: #f0f2f5;
  padding: 40px 20px;
`;

const Inner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  animation: fadeIn 0.5s ease-in-out;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const Banner = styled.div`
  background: linear-gradient(120deg, #2b4c7d 0%, #1e1e2f 100%);
  padding: 100px 20px;
  margin: -40px -20px 40px -20px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, rgba(0, 0, 0, 0) 50%);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zM16.686 0L10.2 6.485 11.616 7.9l7.9-7.9h-2.83zM22.344 0L13.858 8.485 15.272 9.9l7.9-7.9h-.828zm5.656 0L19.515 8.485 17.343 10.657 28 0h-2.83zM32.656 0L26.172 6.485 24 8.657 34.657 0h-2zM44.97 0L40.5 4.472 42.628 0h2.342zm-12.656 0l6.485 6.485L36 8.657 25.343 0h2.83zM0 0l.828.828-1.415 1.415L0 2.828V0zm54.627 0L52.8 2.828 51.373 0h3.254zm-7.985 0L42.427 4.215 40 0h6.642zM6.444 0L0 6.444V0h6.444zM53.313 0L0 53.313V0h53.313zm-6.97 0L0 46.343V0h46.343zM39.4 0L0 39.4V0h39.4z' fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
    opacity: 0.3;
    animation: moveBg 60s linear infinite;
  }

  @keyframes moveBg {
    0% { background-position: 0 0; }
    100% { background-position: 100% 100%; }
  }
`;

const BannerContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 64px;
  background: linear-gradient(120deg, #e2e2e2 0%, #ffffff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 24px;
  text-align: center;
  font-weight: 700;
  letter-spacing: -1px;
  
  @media (max-width: 768px) {
    font-size: 40px;
  }
`;

const Subtitle = styled.p`
  font-size: 20px;
  color: rgba(255, 255, 255, 0.85);
  text-align: center;
  max-width: 800px;
  margin: 0 auto 40px;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const StyledButton = styled(Button)`
  height: 52px;
  padding: 0 40px;
  font-size: 16px;
  border-radius: 26px;
  background: linear-gradient(120deg, #e2e2e2 0%, #ffffff 100%);
  border: none;
  color: #2b4c7d;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background: #ffffff;
    color: #1e1e2f !important;
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.25);
  }
  
  .anticon {
    font-size: 16px;
  }
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  padding: 20px 0;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`;

const CardIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background: #f0f5ff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  
  .anticon {
    font-size: 28px;
    color: #1890ff;
  }
`;

const CardTitle = styled.h3`
  font-size: 20px;
  color: #1a1a1a;
  margin: 0;
  font-weight: 500;
`;

const CardContent = styled.div`
  color: #666;
  font-size: 15px;
  line-height: 1.6;
  flex: 1;
  
  p {
    margin-bottom: 16px;
    color: #4a4a4a;
  }
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 16px 0 0 0;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px 12px;
  background: #fafafa;
  border-radius: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f0f5ff;
  }
  
  .anticon {
    color: #52c41a;
    margin-right: 12px;
    font-size: 16px;
  }
`;

const Introduction = styled.div`
  background: white;
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 40px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const IntroTitle = styled.h2`
  font-size: 20px;
  color: #1a1a1a;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  
  &:before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 20px;
    background: #1890ff;
    margin-right: 12px;
    border-radius: 2px;
  }
`;

const IntroContent = styled.div`
  color: #666;
  font-size: 15px;
  line-height: 1.8;
`;

const TechStack = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed #e8e8e8;
`;

const TechCategory = styled.div`
  margin-bottom: 20px;
`;

const CategoryTitle = styled.h4`
  font-size: 16px;
  color: #666;
  margin-bottom: 12px;
  &:before {
    content: '⚡';
    margin-right: 8px;
  }
`;

const TechItemsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const TechItem = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 16px;
  background: #f0f5ff;
  color: #1890ff;
  border-radius: 16px;
  font-size: 14px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #1890ff;
    color: white;
    transform: translateY(-2px);
  }
`;

const ProjectOverview: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <SyncOutlined />,
      title: '同步器',
      description: '支持多种API文档格式的同步功能，轻松实现文档统一管理',
      features: [
        'Apifox文档同步',
        'Swagger文档同步',
        'Postman文档同步',
        'OpenAPI规范支持',
        'UI测试用例同步'
      ]
    },
    {
      icon: <ApiOutlined />,
      title: 'API自动化配置',
      description: '强大的API自动化测试配置功能，提升测试效率',
      features: [
        '支持并发测试',
        '多数据源支持',
        '预期结果断言',
        '测试报告生成',
        '消息通知集成'
      ]
    },
    {
      icon: <RobotOutlined />,
      title: 'UI自动化配置',
      description: '便捷的UI自动化测试配置平台，可视化操作更简单',
      features: [
        '可视化操作录制',
        '元素定位支持',
        '测试用例管理',
        '截图对比功能',
        '失败重试机制'
      ]
    }
  ];

  const techStacks = {
    frontend: [
      'React', 
      'TypeScript',
      'Ant Design', 
      'Zustand',
      'Styled Components'
    ],
    backend: [
      'Golang',
      'Go-Zero',
      'gRPC',
      'GraphQL'
    ],
    cloud: [
      'Kubernetes',
      'Docker',
      'Helm',
      'Istio',
      'Prometheus',
      'ELK Stack'
    ],
    architecture: [
      '微服务架构',
      '声明式API',
      '云原生架构',
      'DevOps',
      'GitOps'
    ]
  };

  return (
    <Container>
      <Banner>
        <BannerContent>
          <Title>自动化配置平台</Title>
          <Subtitle>
            基于声明式API的自动化测试配置平台，让测试更简单，效率更高
          </Subtitle>
          <StyledButton 
            type="primary"
            onClick={() => navigate('/dashboard/api/image-build')}
          >
            开始使用 <RightOutlined />
          </StyledButton>
        </BannerContent>
      </Banner>
      
      <Inner>
        <Introduction>
          <IntroTitle>系统简介</IntroTitle>
          <IntroContent>
            <p>
              本系统采用声明式API设计理念，致力于简化测试任务的自动化配置流程。
              通过直观的界面操作和灵活的配置方式，帮助测试团队快速构建和管理自动化测试任务，
              提升测试效率和质量。基于云原生架构设计，支持容器化部署和弹性伸缩。
            </p>
            <TechStack>
              <IntroTitle>技术架构</IntroTitle>
              <p>
                采用现代化的技术栈和云原生微服务架构，后端基于Go-Zero微服务框架构建，
                结合Kubernetes实现容器编排和服务治理；前端使用React生态系统，
                结合Ant Design组件库和Zustand状态管理，打造流畅的用户体验。
                通过DevOps实践，实现持续集成和部署。
              </p>
              <div>
                <TechCategory>
                  <CategoryTitle>前端技术</CategoryTitle>
                  <TechItemsWrapper>
                    {techStacks.frontend.map((tech, index) => (
                      <TechItem key={index}>{tech}</TechItem>
                    ))}
                  </TechItemsWrapper>
                </TechCategory>
                
                <TechCategory>
                  <CategoryTitle>后端技术</CategoryTitle>
                  <TechItemsWrapper>
                    {techStacks.backend.map((tech, index) => (
                      <TechItem key={index}>{tech}</TechItem>
                    ))}
                  </TechItemsWrapper>
                </TechCategory>
                
                <TechCategory>
                  <CategoryTitle>云原生技术</CategoryTitle>
                  <TechItemsWrapper>
                    {techStacks.cloud.map((tech, index) => (
                      <TechItem key={index}>{tech}</TechItem>
                    ))}
                  </TechItemsWrapper>
                </TechCategory>
                
                <TechCategory>
                  <CategoryTitle>架构特性</CategoryTitle>
                  <TechItemsWrapper>
                    {techStacks.architecture.map((tech, index) => (
                      <TechItem key={index}>{tech}</TechItem>
                    ))}
                  </TechItemsWrapper>
                </TechCategory>
              </div>
            </TechStack>
          </IntroContent>
        </Introduction>

        <CardsContainer>
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <CardIcon>{feature.icon}</CardIcon>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{feature.description}</p>
                <FeatureList>
                  {feature.features.map((item, i) => (
                    <FeatureItem key={i}>
                      <CheckCircleOutlined /> {item}
                    </FeatureItem>
                  ))}
                </FeatureList>
              </CardContent>
            </Card>
          ))}
        </CardsContainer>
      </Inner>
    </Container>
  );
};

export default ProjectOverview;