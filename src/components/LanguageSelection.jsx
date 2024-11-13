import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 20px;
  position: relative;
  z-index: 1;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 15px 30px;
  font-size: 18px;
  cursor: pointer;
  border: none;
  border-radius: 12px;
  background: ${props => props.theme.surface};
  color: ${props => props.theme.text};
  min-width: 250px;
  transition: all 0.3s ease;
  box-shadow: ${props => props.theme.shadow};
  border: 1px solid ${props => props.theme.border};
  
  &:hover {
    transform: translateY(-2px);
    border-color: ${props => props.theme.primary};
    background: ${props => props.theme.hover};
  }

  img {
    width: 30px;
    height: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const Title = styled.h1`
  color: ${props => props.theme.text};
  font-size: 2.5rem;
  text-align: center;
  line-height: 1.4;
  margin-bottom: 20px;
`;

const LanguageCard = styled.div`
  background: ${props => props.theme.cardBackground};
  backdrop-filter: blur(10px);
  padding: 40px;
  border-radius: 20px;
  box-shadow: ${props => props.theme.shadow};
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: fadeIn 0.5s ease;
  border: 1px solid ${props => props.theme.border};

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const LanguageSelection = () => {
  const navigate = useNavigate();

  const handleLanguageSelect = (language) => {
    localStorage.setItem('language', language);
    navigate('/user-info');
  };

  return (
    <Container>
      <LanguageCard>
        <Title>Выберите язык<br/>Tilni tanlang</Title>
        <Button onClick={() => handleLanguageSelect('ru')}>
          <img 
            src="https://flagcdn.com/w40/ru.png" 
            alt="Russian flag"
            loading="lazy"
          />
          Русский
        </Button>
        <Button onClick={() => handleLanguageSelect('uz')}>
          <img 
            src="https://flagcdn.com/w40/uz.png" 
            alt="Uzbek flag"
            loading="lazy"
          />
          O'zbek tili
        </Button>
      </LanguageCard>
    </Container>
  );
};

export default LanguageSelection; 