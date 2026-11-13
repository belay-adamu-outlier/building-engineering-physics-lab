import { useCallback, useState } from 'react';
import styled from 'styled-components';
import PaperModal from '../components/PaperModal.jsx';
import Status from '../components/Status.jsx';
import { Kicker, Lead, Page, Title } from '../components/ui.js';
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

const Paper = styled.button`
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  color: ${(p) => p.theme.heading};
  font: inherit;
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.35;
  text-align: left;
  cursor: pointer;

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

/** Selected publications, newest first. */
export default function Publications() {
  const papers = useApi('/api/publications');
  const profile = useApi('/api/profile');
  const [openPaper, setOpenPaper] = useState(null);
  const closePaper = useCallback(() => {
    setOpenPaper(null);
  }, []);

  if (papers.status === 'loading' || profile.status === 'loading') {
    return <Status>Loading publications.</Status>;
  }
  if (papers.status === 'error' || profile.status === 'error') {
    return <Status>Could not load this page.</Status>;
  }

  const ordered = pickLatest(papers.data, papers.data.length);

  return (
    <Page>
      <Kicker>Publications</Kicker>
      <Title>Selected papers</Title>
      <Lead>
        A short list of recent work. The full record is on
        {' '}
        <Scholar href={profile.data.links.scholar}>
          Google Scholar
        </Scholar>
        .
      </Lead>
      <div>
        {ordered.map((paper) => (
          <Row key={paper.id}>
            <Year>{paper.year}</Year>
            <div>
              <Paper
                type="button"
                onClick={() => setOpenPaper(paper)}
              >
                {paper.title}
              </Paper>
              <Meta>{paper.authors}</Meta>
              <Meta>{paper.venue}</Meta>
            </div>
          </Row>
        ))}
      </div>
      <PaperModal paper={openPaper} onClose={closePaper} />
    </Page>
  );
}
