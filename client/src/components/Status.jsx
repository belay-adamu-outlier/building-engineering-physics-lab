import styled from 'styled-components';

const Note = styled.p`
  margin: 2rem 0;
  color: ${(p) => p.theme.muted};
`;

/** Short loading or error line for a page. */
export default function Status({ children }) {
  return <Note role="status">{children}</Note>;
}
