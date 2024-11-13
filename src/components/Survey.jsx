import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Добавляем экспорт констант
export const categories = {
  ru: ['Коммуникация', 'Эмоциональный интеллект', 'Принятие решений'],
  uz: ['Aloqa', 'Emotsional intellekt', 'Qaror qabul qilish']
};

export const allQuestions = {
  ru: [
    [
      'Насколько руководителю получается донести сложную информацию простым языком?',
      'Насколько руководитель даёт понятную и эффективную обратную связь по рабочим процессам?',
      'Насколько руководитель прислушивается к вашим идеям, комментариям в работе?',
      'Насколько ваш руководитель умеет говорить с разными сотрудниками, чтобы каждому было понятно и комфортно?'
    ],
    [
      'Насколько руководитель умеет контролировать свои негативные эмоции?',
      'Насколько руководитель умеет разрешать конфликтные ситуации?',
      'Насколько руководитель поддерживает позитивный настрой и мотивирует команду при любых обстоятельствах?',
      'Насколько руководитель умеет сохранять спокойствие в стрессовых ситуациях?'
    ],
    [
      'Насколько быстро Ваш руководитель принимает решение в условиях ограниченного времени?',
      'Насколько руководитель вникает в суть проблемы и эффективно решает возникающие вопросы?',
      'Насколько ваш руководитель принимает обдуманные и взвешенные решения?',
      'Насколько уверенно руководитель принимает решения в критических ситуациях?'
    ]
  ],
  uz: [
    [
      'Rahbaringiz murakkab maʼlumotni qay darajada soddalashtirib yetkaza oladi?',
      'Rahbaringiz ish jarayonlari toʼgʼrisida aniq va samarali fikrni qay darajada bildira oladi?',
      'Rahbaringiz sizning fikr va mulohazalaringizni qay darajada tinglay oladi?',
      'Rahbaringiz xodimlar bilan qanchalik tushunarli va qulay darajada gaplasha oladi?'
    ],
    [
      'Rahbaringiz oʼzining salbiy his-toʼygʼularini qay darajada nazorat qila oladi?',
      'Rahbaringiz konflikt vaziyatlarni qay darajada xal qila oladi?',
      'Rahbaringiz ijobiy muhitni saqlab qolish uchun xodimlarni qay darajada ruhlantira oladi?',
      'Rahbaringiz stress holatlarda qay darajada xotirjamlikni saqlay oladi'
    ],
    [
      'Rahbaringiz cheklangan vaqt sharoitida qay darajada tez qaror qabul qila oladi?',
      'Rahbaringiz muammoning ichiga qay darajada kirisha oladi va paydo boʼlgan masalalarni qanchalik samarali hal qila oladi?',
      'Rahbaringiz kritik vaziyatlarda qarorlarni qay darajada asosli qabul qiladi?',
      'Rahbaringiz qay darajada oʼylangan va samarali qarorlar qabul qiladi?'
    ]
  ]
};

const Container = styled.div`
  position: relative;
  z-index: 1;
  max-width: 800px;
  width: 95%;
  margin: 30px auto;
  padding: 32px;
  background: ${props => props.theme.surface};
  border-radius: 16px;
  box-shadow: ${props => props.theme.shadow};
  animation: slideIn 0.5s ease;

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }
`;

const Form = styled.form`
  position: relative;
  z-index: 2;
`;

const QuestionContainer = styled(motion.div)`
  width: 100%;
`;

const Question = styled.div`
  position: relative;
  z-index: 3;
  margin-bottom: 32px;
  padding: 24px;
  background: ${props => props.theme.background};
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid ${props => props.theme.border};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadow};
  }
`;

const QuestionText = styled.p`
  font-size: 18px;
  color: ${props => props.theme.text};
  margin-bottom: 20px;
  font-weight: 500;
  line-height: 1.4;
  word-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const RadioGroup = styled.div`
  position: relative;
  z-index: 4;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin-top: 15px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const RadioLabel = styled.label`
  position: relative;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 2px solid ${props => props.theme.border};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.theme.surface};
  
  &:hover {
    border-color: ${props => props.theme.primary};
    transform: translateY(-2px);
  }

  ${props => props.$isSelected && `
    background: ${props.theme.primary}15;
    border-color: ${props.theme.primary};
  `}
`;

const RadioInput = styled.input`
  margin-right: 8px;
  cursor: pointer;
`;

const RadioText = styled.span`
  font-size: 16px;
  line-height: 1.2;
  flex: 1;
  white-space: normal;
`;

const Button = styled.button`
  padding: 15px 30px;
  font-size: 18px;
  background-color: ${props => props.theme.primary};
  color: ${props => props.theme.surface};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 12px 20px;
  }
`;

const Progress = styled.div`
  width: 100%;
  height: 8px;
  background: ${props => props.theme.background};
  border-radius: 999px;
  margin-bottom: 32px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  width: ${props => props.$progress}%;
  height: 100%;
  background: ${props => props.theme.gradient};
  border-radius: 999px;
  transition: width 0.5s ease;
`;

const Survey = () => {
  const navigate = useNavigate();
  const language = localStorage.getItem('language') || 'ru';
  const [currentScreen, setCurrentScreen] = useState(0);
  const [answers, setAnswers] = useState({});

  const isScreenComplete = () => {
    const screenQuestions = allQuestions[language][currentScreen];
    return screenQuestions.every((_, index) => 
      answers[`screen${currentScreen}_question${index}`] !== undefined
    );
  };

  const calculateResults = () => {
    const scores = {};
    const percentages = {};
    
    categories[language].forEach((category, categoryIndex) => {
      const categoryScores = allQuestions[language][categoryIndex].map((_, questionIndex) => {
        const answer = parseInt(answers[`screen${categoryIndex}_question${questionIndex}`] || 0);
        return answer;
      });
      
      const totalScore = categoryScores.reduce((sum, score) => sum + score, 0);
      scores[category] = totalScore;
      
      const maxPossibleScore = 5 * categoryScores.length;
      percentages[category] = (totalScore / maxPossibleScore) * 100;
    });

    return { scores, percentages };
  };

  const handleNext = () => {
    if (currentScreen < 2) {
      setCurrentScreen(currentScreen + 1);
    } else {
      const results = calculateResults();
      handleSubmit(results);
    }
  };

  const handleSubmit = async (results) => {
    try {
      localStorage.setItem('surveyAnswers', JSON.stringify({
        ...results,
        answers
      }));
      navigate('/thank-you');
    } catch (error) {
      console.error('Error:', error);
      alert(language === 'ru' ? 
        'Произошла ошибка. Пожалуйста, попробуйте еще раз.' :
        'Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.'
      );
    }
  };

  const ratings = {
    ru: ['Очень плохо', 'Плохо', 'Удовлетворительно', 'Хорошо', 'Отлично'],
    uz: ['Juda yomon', 'Yomon', 'Qoniqarli', 'Yaxshi', 'A\'lo']
  };

  return (
    <Container>
      <Form>
        <Progress>
          <ProgressBar $progress={(currentScreen + 1) * 33} />
        </Progress>
        <h2>
          {language === 'ru' ? 
            `Этап ${currentScreen + 1} из 3` : 
            `Bosqich ${currentScreen + 1} dan 3`}
        </h2>
        <AnimatePresence mode='wait'>
          <QuestionContainer
            key={currentScreen}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {allQuestions[language][currentScreen].map((question, index) => (
              <Question key={index}>
                <QuestionText>{question}</QuestionText>
                <RadioGroup>
                  {ratings[language].map((rating, value) => {
                    const inputName = `screen${currentScreen}_question${index}`;
                    const inputValue = String(value + 1);
                    const isSelected = answers[inputName] === inputValue;

                    return (
                      <RadioLabel 
                        key={value}
                        $isSelected={isSelected}
                      >
                        <RadioInput
                          type="radio"
                          name={inputName}
                          value={inputValue}
                          onChange={(e) =>
                            setAnswers({
                              ...answers,
                              [inputName]: e.target.value
                            })
                          }
                          checked={isSelected}
                        />
                        <RadioText>{rating}</RadioText>
                      </RadioLabel>
                    );
                  })}
                </RadioGroup>
              </Question>
            ))}
          </QuestionContainer>
        </AnimatePresence>
        <Button 
          onClick={handleNext}
          disabled={!isScreenComplete()}
        >
          {currentScreen < 2 ? 
            (language === 'ru' ? 'Следующий этап' : 'Keyingi bosqich') :
            (language === 'ru' ? 'Завершить' : 'Yakunlash')}
        </Button>
      </Form>
    </Container>
  );
};

export default Survey; 