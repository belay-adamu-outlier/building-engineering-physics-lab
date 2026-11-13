import styled from 'styled-components';

export const Page = styled.main`
  padding: 1.75rem 0 2.5rem;
`;

export const Kicker = styled.p`
  margin: 0 0 0.45rem;
  color: ${(p) => p.theme.red};
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const Title = styled.h1`
  margin: 0;
  color: ${(p) => p.theme.heading};
  font-size: clamp(1.8rem, 3vw, 2.35rem);
  line-height: 1.15;
`;

export const Lead = styled.p`
  max-width: 40rem;
  margin: 0.85rem 0 0;
  color: ${(p) => p.theme.heading};
  font-size: 1.05rem;
`;

export const SectionTitle = styled.h2`
  margin: 0 0 1rem;
  color: ${(p) => p.theme.heading};
  font-size: 1.35rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;
