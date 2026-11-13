import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Status from '../components/Status.jsx';
import { SectionTitle } from '../components/ui.js';
import { useApi } from '../hooks/useApi.js';
import { publicUrl } from '../publicUrl.js';
import { pickLatest } from '../select.js';

const Wrap = styled.main`
  grid-column: 1;
  padding: 1.75rem 0 2.5rem;
`;

const Hero = styled.section`
  grid-column: 1 / -1;
  position: relative;
  display: flex;
  align-items: flex-end;
  width: 100vw;
  min-height: 34rem;
  margin-top: 0;
  margin-left: calc(50% - 50vw);
  overflow: hidden;
  color: #ffffff;
  border-bottom: 4px solid ${(p) => p.theme.red};
`;

const Photo = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 16%;
`;

const Shade = styled.div`
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      to top,
      rgba(14, 6, 10, 0.86) 0%,
      rgba(14, 6, 10, 0.5) 18%,
      rgba(14, 6, 10, 0) 40%
    ),
    linear-gradient(
      to right,
      rgba(14, 6, 10, 0.72) 0%,
      rgba(14, 6, 10, 0.28) 32%,
      rgba(14, 6, 10, 0) 52%
    );
`;

const Copy = styled.div`
  position: relative;
  width: min(${(p) => p.theme.max}, calc(100vw - 2.5rem));
  margin-left: max(
    1.25rem,
    calc((100vw - ${(p) => p.theme.max}) / 2)
  );
  padding: 2rem 0 1.55rem;
`;

const Statement = styled.h1`
  margin: 0;
  max-width: 34rem;
  color: #ffffff;
  font-size: clamp(1.7rem, 2.4vw, 2.05rem);
  line-height: 1.12;
  text-shadow: 0 1px 16px rgba(0, 0, 0, 0.45);
`;

const Summary = styled.p`
  max-width: 38rem;
  margin: 0.7rem 0 0;
  color: rgba(255, 255, 255, 0.92);
  font-size: 1.02rem;
  text-shadow: 0 1px 12px rgba(0, 0, 0, 0.4);
`;

const HeroLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.15rem;
  margin-top: 1.25rem;
`;

const Primary = styled(Link)`
  display: inline-block;
  padding: 0.55rem 0.85rem;
  background: ${(p) => p.theme.red};
  color: #ffffff;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    background: ${(p) => p.theme.redDark};
    color: #ffffff;
  }
`;

const Quiet = styled(Link)`
  color: #ffffff;
  font-weight: 700;
  text-decoration: none;
  border-bottom: 2px solid #ffffff;

  &:hover {
    color: #ffffff;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const Action = styled(Link)`
  font-weight: 700;
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

const ItemTitle = styled.a`
  display: inline-block;
  margin: 0 0 0.25rem;
  color: ${(p) => p.theme.heading};
  font-size: 1.05rem;
  font-weight: 700;
  text-decoration: none;

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
    <>
      <Hero>
        <Photo
          src={publicUrl(person.hero)}
          alt={person.heroAlt}
        />
        <Shade aria-hidden="true" />
        <Copy>
          <Statement>{person.statement}</Statement>
          <Summary>{person.summary}</Summary>
          <HeroLinks>
            <Primary to="/research">Research themes</Primary>
            <Quiet to="/contact">Contact the lab</Quiet>
          </HeroLinks>
        </Copy>
      </Hero>
      <Wrap>
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
                href={paper.url}
                target="_blank"
                rel="noopener noreferrer"
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
      </Wrap>
    </>
  );
}
