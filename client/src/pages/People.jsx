import styled from 'styled-components';
import Banner from '../components/Banner.jsx';
import Status from '../components/Status.jsx';
import { Page } from '../components/ui.js';
import { useApi } from '../hooks/useApi.js';
import { publicUrl } from '../publicUrl.js';

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

const Name = styled.h2`
  margin: 0 0 0.7rem;
  font-size: 1.45rem;
`;

const Role = styled.p`
  margin: 0.35rem 0 0;
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

function profileBody(person) {
  return (
    <LayoutGrid>
        <div>
          <Portrait
            src={publicUrl(person.portrait)}
            alt={person.portraitAlt}
          />
          <Role>{person.role}</Role>
          <Muted>{person.unit}</Muted>
          <Muted>{person.university}</Muted>
        </div>
        <div>
          <Name>{person.personName}</Name>
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
  );
}

/** Principal investigator profile. */
export default function People() {
  const profile = useApi('/api/profile');
  const loading = profile.status === 'loading';
  const failed = profile.status === 'error';

  return (
    <>
      <Banner
        kicker="People"
        title="The lab group"
        summary={
          'Professor Fitsum Tariku with graduates of the '
          + 'building science programs he founded.'
        }
      />
      <Page>
        {loading ? <Status>Loading people.</Status> : null}
        {failed ? <Status>{profile.error}</Status> : null}
        {profile.status === 'ready'
          ? profileBody(profile.data)
          : null}
      </Page>
    </>
  );
}
