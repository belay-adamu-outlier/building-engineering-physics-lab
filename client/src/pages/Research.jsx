import styled from 'styled-components';
import Banner from '../components/Banner.jsx';
import Status from '../components/Status.jsx';
import { Page } from '../components/ui.js';
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

function themeList(themes) {
  return themes.map((theme) => (
    <Theme key={theme.id} id={theme.id}>
      <Number>{theme.number}</Number>
      <Heading>{theme.title}</Heading>
      <Text>{theme.summary}</Text>
    </Theme>
  ));
}

/** Four research themes from the API. */
export default function Research() {
  const research = useApi('/api/research');
  const loading = research.status === 'loading';
  const failed = research.status === 'error';

  return (
    <>
      <Banner
        kicker="Research"
        title="What the lab works on"
        summary={
          'Four themes cover the path from a material '
          + 'sample to a building on a city street.'
        }
      />
      <Page>
        {loading ? <Status>Loading research.</Status> : null}
        {failed ? <Status>{research.error}</Status> : null}
        {research.status === 'ready'
          ? themeList(research.data)
          : null}
      </Page>
    </>
  );
}
