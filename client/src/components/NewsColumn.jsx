import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useApi } from '../hooks/useApi.js';
import { sortByDateDesc } from '../select.js';

const Aside = styled.aside`
  padding: 1.75rem 0 2.5rem;

  @media (max-width: 900px) {
    padding-top: 0;
    border-top: 1px solid ${(p) => p.theme.line};
  }
`;

const Heading = styled.h2`
  margin: 0 0 1rem;
  color: ${(p) => p.theme.heading};
  font-size: 1.35rem;
`;

const Item = styled.article`
  margin: 0 0 1.15rem;
`;

const When = styled.p`
  margin: 0;
  color: ${(p) => p.theme.muted};
  font-size: 0.92rem;
  font-style: italic;
`;

const Title = styled.a`
  display: inline-block;
  margin-top: 0.15rem;
  font-size: 0.98rem;
  line-height: 1.35;
`;

const Local = styled(Link)`
  display: inline-block;
  margin-top: 0.15rem;
  font-size: 0.98rem;
  line-height: 1.35;
`;

const Note = styled.p`
  margin: 0;
  color: ${(p) => p.theme.muted};
  font-size: 0.92rem;
`;

const More = styled(Link)`
  display: inline-block;
  margin-top: 0.4rem;
  font-weight: 700;
`;

/** News list shown on the right of every page. */
export default function NewsColumn() {
  const news = useApi('/api/news');
  const items = news.status === 'ready'
    ? sortByDateDesc(news.data)
    : [];

  return (
    <Aside aria-label="News">
      <Heading>News</Heading>
      {news.status === 'loading' ? (
        <Note>Loading news.</Note>
      ) : null}
      {news.status === 'error' ? (
        <Note>News is unavailable.</Note>
      ) : null}
      {items.map((item) => (
        <Item key={item.id}>
          <When>{item.displayDate}</When>
          {item.url ? (
            <Title href={item.url}>{item.title}</Title>
          ) : (
            <Local to={'/news#' + item.id}>{item.title}</Local>
          )}
        </Item>
      ))}
      <More to="/news">All news</More>
    </Aside>
  );
}
