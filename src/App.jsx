import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import styled, { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AnimatePresence } from 'framer-motion';
import LanguageSelection from './components/LanguageSelection';
import UserInfo from './components/UserInfo';
import Survey from './components/Survey';
import ThankYou from './components/ThankYou';
import ThemeToggle from './components/ThemeToggle';
import GlobalStyle from './styles/GlobalStyle';

const AppContainer = styled.div`
  min-height: 100vh;
  transition: all 0.3s ease;
  background: ${props => props.theme.backgroundGradient};
  color: ${props => props.theme.text};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at top right, ${props => `${props.theme.primary}11`} 0%, transparent 70%),
                radial-gradient(circle at bottom left, ${props => `${props.theme.secondary}11`} 0%, transparent 70%);
    z-index: 0;
  }
`;

const themes = {
  light: {
    background: '#ffffff',
    surface: '#ffffff',
    primary: '#2563eb',
    secondary: '#3b82f6',
    text: '#1e293b',
    border: '#e2e8f0',
    hover: '#dbeafe',
    shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    gradient: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
    backgroundGradient: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    cardBackground: 'rgba(255, 255, 255, 0.9)'
  },
  dark: {
    background: '#1e1e2d',
    surface: '#2d2d3a',
    primary: '#60a5fa',
    secondary: '#93c5fd',
    text: '#f8fafc',
    border: '#404050',
    hover: '#2d3867',
    shadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
    backgroundGradient: 'linear-gradient(135deg, #1e1e2d 0%, #2d2d3a 100%)',
    cardBackground: 'rgba(45, 45, 58, 0.9)'
  }
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

function AppContent() {
  const { isDark } = useTheme();
  const location = useLocation();
  
  return (
    <StyledThemeProvider theme={isDark ? themes.dark : themes.light}>
      <GlobalStyle />
      <AppContainer>
        <ThemeToggle />
        <AnimatePresence mode='wait'>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LanguageSelection />} />
            <Route path="/user-info" element={<UserInfo />} />
            <Route path="/survey" element={<Survey />} />
            <Route path="/thank-you" element={<ThankYou />} />
          </Routes>
        </AnimatePresence>
      </AppContainer>
    </StyledThemeProvider>
  );
}

export default App;