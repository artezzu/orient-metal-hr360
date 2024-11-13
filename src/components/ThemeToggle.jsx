import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

const ToggleButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  background: ${props => props.theme.surface};
  border: 2px solid ${props => props.theme.primary};
  color: ${props => props.theme.primary};
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    top: 10px;
    right: 10px;
  }
`;

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <ToggleButton onClick={toggleTheme}>
      {isDark ? '🌞' : '🌙'}
    </ToggleButton>
  );
};

export default ThemeToggle; 