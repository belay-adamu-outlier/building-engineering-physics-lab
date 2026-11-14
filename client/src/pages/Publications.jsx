import styled from 'styled-components';
import Banner from '../components/Banner.jsx';
import Status from '../components/Status.jsx';
import { Page } from '../components/ui.js';
import { useApi } from '../hooks/useApi.js';
import { pickLatest } from '../select.js';

const Row = styled.article`
  display: grid;
  grid-template-columns: 4.5rem 1fr;
  gap: 1rem;
  padding: 1.15rem 0;
  border-top: 1px solid ${(p) => p.theme.line};

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    gap: 0.2rem;
  }
`;

const Year = styled.p`
  margin: 0;
  color: ${(p) => p.theme.red};
  font-weight: 700;
`;

const Paper = styled.a`
  color: ${(p) => p.theme.heading};
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.35;
  text-decoration: none;

  &:hover {
    color: ${(p) => p.theme.red};
    text-decoration: underline;
  }
`;

const Meta = styled.p`
  margin: 0.25rem 0 0;
  color: ${(p) => p.theme.muted};
`;

const Scholar = styled.a`
  font-weight: 700;
`;

const Lead = styled.p`
  max-width: 40rem;
  margin: 0 0 0.4rem;
  color: ${(p) => p.theme.heading};
  font-size: 1.05rem;
`;

function paperList(papers, scholar) {
  const ordered = pickLatest(papers, papers.length);
  return (
    <>
      <Lead>
        A short list of recent work. The full record is on
        {' '}
        <Scholar href={scholar}>Google Scholar</Scholar>
        .
      </Lead>
      <div>
        {ordered.map((paper) => (
          <Row key={paper.id}>
            <Year>{paper.year}</Year>
            <div>
              <Paper
                href={paper.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {paper.title}
              </Paper>
              <Meta>{paper.authors}</Meta>
              <Meta>{paper.venue}</Meta>
            </div>
          </Row>
        ))}
      </div>
    </>
  );
}

/** Selected publications, newest first. */
export default function Publications() {
  const papers = useApi('/api/publications');
  const profile = useApi('/api/profile');
  const loading = papers.status === 'loading'
    || profile.status === 'loading';
  const failed = papers.status === 'error'
    || profile.status === 'error';
  const ready = papers.status === 'ready'
    && profile.status === 'ready';

  return (
    <>
      <Banner
        kicker="Publications"
        title="Selected papers"
        summary={
          'Recent work on materials, envelopes, and '
          + 'whole buildings.'
        }
      />
      <Page>
        {loading ? <Status>Loading publications.</Status> : null}
        {failed ? (
          <Status>Could not load this page.</Status>
        ) : null}
        {ready
          ? paperList(
            papers.data,
            profile.data.links.scholar,
          )
          : null}
      </Page>
    </>
  );
}
