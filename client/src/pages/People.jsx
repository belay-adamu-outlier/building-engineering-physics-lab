import styled from 'styled-components';
import Status from '../components/Status.jsx';
import { Kicker, Page, Title } from '../components/ui.js';
import { useApi } from '../hooks/useApi.js';

const LayoutGrid = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2.5rem;
  margin-top: 2rem;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

const Portrait = styled.img`
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  object-position: center 20%;
`;

const Role = styled.p`
  margin: 0.8rem 0 0;
  font-weight: 700;
`;

const Muted = styled.p`
  margin: 0.2rem 0 0;
  color: ${(p) => p.theme.muted};
`;

const Prose = styled.p`
  margin: 0 0 1rem;
`;

const Heading = styled.h2`
  margin: 1.6rem 0 0.6rem;
  font-size: 1.15rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const List = styled.ul`
  margin: 0;
  padding-left: 1.1rem;
  color: ${(p) => p.theme.muted};
`;

/** Principal investigator profile. */
export default function People() {
  const profile = useApi('/api/profile');

  if (profile.status === 'loading') {
    return <Status>Loading people.</Status>;
  }
  if (profile.status === 'error') {
    return <Status>{profile.error}</Status>;
  }

  const person = profile.data;

  return (
    <Page>
      <Kicker>People</Kicker>
      <Title>{person.personName}</Title>
      <LayoutGrid>
        <div>
          <Portrait src={person.portrait} alt={person.portraitAlt} />
          <Role>{person.role}</Role>
          <Muted>{person.unit}</Muted>
          <Muted>{person.university}</Muted>
        </div>
        <div>
          {person.bio.map((paragraph) => (
            <Prose key={paragraph}>{paragraph}</Prose>
          ))}
          <Muted>
            Student profiles will be added as the group grows.
          </Muted>
          <Heading>Education</Heading>
          <List>
            {person.education.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </List>
          <Heading>Programs developed</Heading>
          <List>
            {person.programs.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </List>
          <Heading>Selected service</Heading>
          <List>
            {person.service.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </List>
          <Heading>Teaching</Heading>
          <List>
            {person.teaching.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </List>
        </div>
      </LayoutGrid>
    </Page>
  );
}
