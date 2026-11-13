import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import PaperModal from '../components/PaperModal.jsx';
import Status from '../components/Status.jsx';
import { Kicker, SectionTitle } from '../components/ui.js';
import { useApi } from '../hooks/useApi.js';
import { pickLatest } from '../select.js';

const Wrap = styled.main`
  padding: 1.75rem 0 2.5rem;
`;

const Hero = styled.section`
  display: grid;
  grid-template-columns: 1.4fr 0.8fr;
  gap: 3rem;
  align-items: end;
  padding-bottom: 2.5rem;
  border-bottom: 1px solid ${(p) => p.theme.line};

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const Statement = styled.h1`
  margin: 0;
  max-width: 18ch;
  color: ${(p) => p.theme.heading};
  font-size: clamp(1.9rem, 3.4vw, 2.5rem);
  line-height: 1.15;
`;

const Summary = styled.p`
  max-width: 38rem;
  margin: 1.25rem 0 0;
  color: ${(p) => p.theme.muted};
  font-size: 1.08rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const Action = styled(Link)`
  font-weight: 700;
`;

const Portrait = styled.img`
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  object-position: center 20%;
  background: ${(p) => p.theme.wash};
`;

const Block = styled.section`
  padding-top: 2.5rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled(Link)`
  display: block;
  padding: 1.2rem 1.2rem 1.3rem;
  color: inherit;
  text-decoration: none;
  background: ${(p) => p.theme.card};
  border: 1px solid ${(p) => p.theme.line};

  &:hover {
    border-color: ${(p) => p.theme.red};
  }
`;

const Number = styled.span`
  color: ${(p) => p.theme.red};
  font-size: 0.8rem;
  letter-spacing: 0.08em;
`;

const CardTitle = styled.h3`
  margin: 0.35rem 0 0.4rem;
  font-size: 1.15rem;
`;

const CardText = styled.p`
  margin: 0;
  color: ${(p) => p.theme.muted};
`;

const ItemTitle = styled.button`
  margin: 0 0 0.25rem;
  padding: 0;
  border: 0;
  background: none;
  color: ${(p) => p.theme.heading};
  font: inherit;
  font-size: 1.05rem;
  font-weight: 700;
  text-align: left;
  cursor: pointer;

  &:hover {
    color: ${(p) => p.theme.red};
    text-decoration: underline;
  }
`;

const Meta = styled.p`
  margin: 0;
  color: ${(p) => p.theme.muted};
  font-size: 0.92rem;
`;

const Stack = styled.div`
  display: grid;
  gap: 1.1rem;
`;

/** Homepage: statement, themes, and selected papers. */
export default function Home() {
  const profile = useApi('/api/profile');
  const research = useApi('/api/research');
  const papers = useApi('/api/publications');
  const [openPaper, setOpenPaper] = useState(null);
  const closePaper = useCallback(() => {
    setOpenPaper(null);
  }, []);
  const states = [profile, research, papers];
  const pending = states.some((item) => item.status === 'loading');
  const failed = states.find((item) => item.status === 'error');

  if (pending) {
    return <Status>Loading the lab.</Status>;
  }
  if (failed) {
    return <Status>{failed.error}</Status>;
  }

  const person = profile.data;
  const latestPapers = pickLatest(papers.data, 3);

  return (
    <Wrap>
      <Hero>
        <div>
          <Kicker>
            {person.personName}
            {' · '}
            {person.title}
          </Kicker>
          <Statement>{person.statement}</Statement>
          <Summary>{person.summary}</Summary>
          <Actions>
            <Action to="/research">Research themes</Action>
            <Action to="/contact">Contact the lab</Action>
          </Actions>
        </div>
        <Portrait
          src={person.portrait}
          alt={person.portraitAlt}
        />
      </Hero>

      <Block>
        <SectionTitle>Research</SectionTitle>
        <Grid>
          {research.data.map((theme) => (
            <Card key={theme.id} to={'/research#' + theme.id}>
              <Number>{theme.number}</Number>
              <CardTitle>{theme.title}</CardTitle>
              <CardText>{theme.teaser}</CardText>
            </Card>
          ))}
        </Grid>
      </Block>

      <Block>
        <SectionTitle>Selected papers</SectionTitle>
        <Stack>
          {latestPapers.map((paper) => (
            <article key={paper.id}>
              <ItemTitle
                type="button"
                onClick={() => setOpenPaper(paper)}
              >
                {paper.title}
              </ItemTitle>
              <Meta>
                {paper.authors}
                {' · '}
                {paper.year}
              </Meta>
            </article>
          ))}
        </Stack>
        <Actions>
          <Action to="/publications">All selected papers</Action>
        </Actions>
      </Block>
      <PaperModal paper={openPaper} onClose={closePaper} />
    </Wrap>
  );
}
