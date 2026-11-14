import styled from 'styled-components';
import Banner from '../components/Banner.jsx';
import Status from '../components/Status.jsx';
import { Page } from '../components/ui.js';
import { useApi } from '../hooks/useApi.js';
import { sortByDateDesc } from '../select.js';

const Card = styled.article`
  scroll-margin-top: 5.5rem;
  padding: 1.3rem 0;
  border-top: 1px solid ${(p) => p.theme.line};
`;

const When = styled.p`
  margin: 0;
  color: ${(p) => p.theme.muted};
  font-size: 0.92rem;
  font-style: italic;
`;

const Heading = styled.h2`
  margin: 0.3rem 0 0.45rem;
  font-size: 1.35rem;
`;

const Text = styled.p`
  max-width: 42rem;
  margin: 0;
  color: ${(p) => p.theme.muted};
`;

const Source = styled.a`
  display: inline-block;
  margin-top: 0.7rem;
  font-weight: 700;
`;

function newsList(items) {
  return (
    <div>
        {items.map((item) => (
          <Card key={item.id} id={item.id}>
            <When>{item.displayDate}</When>
            <Heading>{item.title}</Heading>
            <Text>{item.summary}</Text>
            {item.url ? (
              <Source href={item.url}>Source</Source>
            ) : null}
          </Card>
        ))}
    </div>
  );
}

/** News items, newest first. */
export default function News() {
  const news = useApi('/api/news');
  const loading = news.status === 'loading';
  const failed = news.status === 'error';

  return (
    <>
      <Banner
        kicker="News"
        title="Lab news"
        summary={
          'Notes from the group, from new funding to '
          + 'new colleagues.'
        }
      />
      <Page>
        {loading ? <Status>Loading news.</Status> : null}
        {failed ? <Status>{news.error}</Status> : null}
        {news.status === 'ready'
          ? newsList(sortByDateDesc(news.data))
          : null}
      </Page>
    </>
  );
}
