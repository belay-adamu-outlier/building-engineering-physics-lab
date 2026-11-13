import styled from 'styled-components';
import Status from '../components/Status.jsx';
import { Kicker, Lead, Page, Title } from '../components/ui.js';
import { useApi } from '../hooks/useApi.js';

const Theme = styled.article`
  scroll-margin-top: 5.5rem;
  padding: 1.6rem 0;
  border-top: 1px solid ${(p) => p.theme.line};
`;

const Heading = styled.h2`
  margin: 0.3rem 0 0.6rem;
  font-size: 1.45rem;
`;

const Number = styled.p`
  margin: 0;
  color: ${(p) => p.theme.red};
  font-size: 0.8rem;
  letter-spacing: 0.08em;
`;

const Text = styled.p`
  max-width: 42rem;
  margin: 0;
  color: ${(p) => p.theme.muted};
`;

/** Four research themes from the API. */
export default function Research() {
  const research = useApi('/api/research');

  if (research.status === 'loading') {
    return <Status>Loading research.</Status>;
  }
  if (research.status === 'error') {
    return <Status>{research.error}</Status>;
  }

  return (
    <Page>
      <Kicker>Research</Kicker>
      <Title>What the lab works on</Title>
      <Lead>
        Four themes cover the path from a material sample
        to a building on a city street.
      </Lead>
      <div>
        {research.data.map((theme) => (
          <Theme key={theme.id} id={theme.id}>
            <Number>{theme.number}</Number>
            <Heading>{theme.title}</Heading>
            <Text>{theme.summary}</Text>
          </Theme>
        ))}
      </div>
    </Page>
  );
}
