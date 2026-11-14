import styled from 'styled-components';
import { publicUrl } from '../publicUrl.js';

const BUILDING = '/srye-building.jpg';
const BUILDING_ALT = (
  'Sustainable Energy Engineering building at SFU Surrey'
);

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
  object-position: ${(p) => p.$focus};
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

const Kicker = styled.p`
  margin: 0 0 0.35rem;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
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

/** Full-width photo with the page title along the bottom. */
export default function Banner({
  src = BUILDING,
  alt = BUILDING_ALT,
  kicker,
  title,
  summary,
  children,
  focus = 'center 48%',
}) {
  return (
    <Hero>
      <Photo src={publicUrl(src)} alt={alt} $focus={focus} />
      <Shade aria-hidden="true" />
      <Copy>
        {kicker ? <Kicker>{kicker}</Kicker> : null}
        <Statement>{title}</Statement>
        {summary ? <Summary>{summary}</Summary> : null}
        {children}
      </Copy>
    </Hero>
  );
}
