import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  position: relative;
  z-index: 1;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 500px;
  padding: 32px;
  background: ${props => props.theme.surface};
  border-radius: 16px;
  box-shadow: ${props => props.theme.shadow};
  animation: fadeIn 0.5s ease;
  position: relative;
  z-index: 2;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Input = styled.input`
  padding: 12px 16px;
  font-size: 16px;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.surface};
  color: ${props => props.theme.text};
  transition: all 0.3s ease;
  position: relative;
  z-index: 3;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}33;
  }

  &::placeholder {
    color: ${props => props.theme.text}88;
  }
`;

const Button = styled.button`
  padding: 16px;
  font-size: 16px;
  font-weight: 500;
  background: ${props => props.theme.gradient};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 3;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadow};
  }

  &:active {
    transform: translateY(0);
  }
`;

const Title = styled.h2`
  margin-bottom: 32px;
  color: ${props => props.theme.primary};
  text-align: center;
  position: relative;
  z-index: 3;
  font-size: 1.2rem;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  font-weight: 400;
  padding: 0 20px;

  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.5;
  }
`;

const UserInfo = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    department: '',
    position: '',
    manager: '',
    company: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    localStorage.setItem('userName', userInfo.company);
    navigate('/survey');
  };

  const handleChange = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value
    });
  };

  const language = localStorage.getItem('language') || 'ru';

  const translations = {
    ru: {
      title: 'Это конфиденциальный опрос для анализа мотивации и вовлеченности сотрудников. Все ответы анонимны и будут использованы для улучшения условий работы.',
      company: 'Ваша компания',
      department: 'Ваш отдел',
      position: 'Ваша должность',
      manager: 'Ваш руководитель',
      next: 'Далее'
    },
    uz: {
      title: 'Bu xodimlarning motivatsiyasi va ishtiroki darajasini tahlil qilish uchun maxfiy so\'rovnoma. Barcha javoblar anonim va ish sharoitlarini yaxshilash uchun foydalaniladi.',
      company: 'Kompaniyangiz',
      department: 'Bo\'limingiz',
      position: 'Lavozimingiz',
      manager: 'Rahbaringiz',
      next: 'Keyingi'
    }
  };

  const t = translations[language];

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Title>{t.title}</Title>
        <Input
          name="company"
          placeholder={t.company}
          required
          onChange={handleChange}
        />
        <Input
          name="department"
          placeholder={t.department}
          required
          onChange={handleChange}
        />
        <Input
          name="position"
          placeholder={t.position}
          required
          onChange={handleChange}
        />
        <Input
          name="manager"
          placeholder={t.manager}
          required
          onChange={handleChange}
        />
        <Button type="submit">
          {t.next}
        </Button>
      </Form>
    </Container>
  );
};

export default UserInfo; 