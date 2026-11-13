import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background: ${(p) => p.theme.paper};
    color: ${(p) => p.theme.ink};
    font-family: ${(p) => p.theme.sans};
    font-size: 16px;
    line-height: 1.5;
  }

  h1, h2, h3 {
    color: ${(p) => p.theme.heading};
    font-weight: 700;
  }

  a {
    color: ${(p) => p.theme.red};
  }

  img {
    display: block;
    max-width: 100%;
  }

  :focus-visible {
    outline: 2px solid ${(p) => p.theme.red};
    outline-offset: 3px;
  }
`;
