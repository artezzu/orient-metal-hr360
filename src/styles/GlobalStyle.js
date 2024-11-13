import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: all 0.3s ease;
    background: ${props => props.theme.background};
    color: ${props => props.theme.text};
  }

  * {
    box-sizing: border-box;
  }

  h1, h2 {
    color: ${props => props.theme.primary};
    text-align: center;
    font-weight: 500;
    letter-spacing: 0.5px;
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 2rem;
  }

  h2 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2rem;
    }
    h2 {
      font-size: 1.5rem;
    }
  }
`;

export default GlobalStyle; 