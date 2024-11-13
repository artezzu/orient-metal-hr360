import React, { useEffect, useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { sendToGoogleSheets } from '../services/googleSheetsService';
import { sendToTelegram } from '../services/telegramService';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  padding: 20px;
  animation: fadeIn 1s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const Title = styled.h1`
  color: ${props => props.theme.primary};
  margin-top: 30px;
  font-size: 2rem;
  opacity: 0;
  animation: fadeInUp 0.8s ease forwards;
  animation-delay: 1s;

  @keyframes fadeInUp {
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

const CheckmarkWrapper = styled.div`
  width: 150px;
  height: 150px;
  margin: 0 auto;
  padding: 20px;
  background: ${props => props.theme.surface};
  border-radius: 50%;
  box-shadow: ${props => props.theme.shadow};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const checkmarkAnimation = keyframes`
  0% {
    stroke-dashoffset: 100;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
`;

const StyledCheckmark = styled(motion.svg)`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: block;
  stroke-width: 5;
  stroke: #4CAF50;
  stroke-miterlimit: 10;

  circle {
    stroke-dasharray: 166;
    stroke-dashoffset: 166;
    stroke-width: 5;
    stroke-miterlimit: 10;
    fill: none;
    animation: ${checkmarkAnimation} 0.8s cubic-bezier(0.65, 0, 0.45, 1) forwards;
  }

  path {
    transform-origin: 50% 50%;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    stroke-width: 5;
    animation: ${checkmarkAnimation} 0.5s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
  }
`;

const ThankYou = () => {
  const navigate = useNavigate();
  const language = localStorage.getItem('language') || 'ru';
  const [isSending, setIsSending] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const hasAttemptedRef = useRef(false);
  const requestIdRef = useRef(Date.now());

  useEffect(() => {
    const sendData = async () => {
      if (isSending || hasAttemptedRef.current || !localStorage.getItem('surveyAnswers')) {
        return;
      }
      
      hasAttemptedRef.current = true;
      setIsSending(true);
      
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        const surveyData = JSON.parse(localStorage.getItem('surveyAnswers') || '{}');

        console.log('Sending data:', { userInfo, surveyData });

        if (Object.keys(userInfo).length && Object.keys(surveyData).length) {
          const response = await sendToGoogleSheets({ 
            userInfo, 
            surveyAnswers: surveyData,
            requestId: requestIdRef.current
          });
          
          setShowCheckmark(true);
          
          sendToTelegram({
            userInfo,
            surveyAnswers: surveyData
          }).catch(console.error);
          
          localStorage.removeItem('surveyAnswers');
          localStorage.removeItem('userInfo');
          
          setTimeout(() => {
            navigate('/');
          }, 3000);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsSending(false);
      }
    };

    sendData();
  }, [navigate]);

  const translations = {
    ru: {
      thank: 'Спасибо за прохождение опроса!'
    },
    uz: {
      thank: 'So\'rovnomani to\'ldiganingiz uchun rahmat!'
    }
  };

  return (
    <Container>
      {showCheckmark && (
        <>
          <CheckmarkWrapper>
            <StyledCheckmark 
              viewBox="0 0 52 52"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
              }}
            >
              <circle cx="26" cy="26" r="25" fill="none"/>
              <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </StyledCheckmark>
          </CheckmarkWrapper>
          <Title>{translations[language].thank}</Title>
        </>
      )}
    </Container>
  );
};

export default ThankYou; 