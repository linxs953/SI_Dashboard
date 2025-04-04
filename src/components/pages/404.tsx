import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const NotFoundContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const Title = styled.h1`
  font-size: 8rem;
  margin: 0;
  background: linear-gradient(45deg, #12c2e9, #c471ed, #f64f59);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: bold;
`;

const Message = styled.p`
  font-size: 1.5rem;
  color: #4a5568;
  margin: 1rem 0 2rem;
`;

const HomeButton = styled(motion.button)`
  padding: 1rem 2rem;
  font-size: 1.1rem;
  border: none;
  border-radius: 50px;
  background: linear-gradient(45deg, #12c2e9, #c471ed);
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <NotFoundContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Title>404</Title>
        <Message>抱歉，您访问的页面不存在</Message>
        <HomeButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
        >
          返回首页
        </HomeButton>
      </motion.div>
    </NotFoundContainer>
  );
};

export default NotFound;
