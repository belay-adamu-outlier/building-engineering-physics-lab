import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import NewsColumn from './NewsColumn.jsx';

const links = [
  ['/', 'Home', true],
  ['/research', 'Research'],
  ['/people', 'People'],
  ['/publications', 'Publications'],
  ['/news', 'News'],
  ['/contact', 'Contact'],
];

const Shell = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Top = styled.div`
  background: ${(p) => p.theme.redDark};
`;

const TopInner = styled.div`
  width: min(${(p) => p.theme.max}, calc(100% - 2.5rem));
  margin: 0 auto;
  padding: 0.45rem 0;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  background: ${(p) => p.theme.red};

  :focus-visible {
    outline-color: #ffffff;
  }
`;

const Inner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: min(${(p) => p.theme.max}, calc(100% - 2.5rem));
  margin: 0 auto;
  padding: 0.85rem 0;
`;

const Brand = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #ffffff;
  text-decoration: none;
`;

const Mark = styled.span`
  width: 0.45rem;
  align-self: stretch;
  background: #ffffff;
`;

const Lab = styled.span`
  display: block;
  color: #ffffff;
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.2;
`;

const Unit = styled.span`
  display: block;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1.15rem;

  @media (max-width: 760px) {
    display: ${(p) => (p.$open ? 'flex' : 'none')};
    position: absolute;
    top: 100%;
    right: 0;
    left: 0;
    flex-direction: column;
    gap: 0;
    background: ${(p) => p.theme.redDark};
    border-bottom: 1px solid ${(p) => p.theme.redDark};
  }
`;

const Item = styled(NavLink)`
  color: #ffffff;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-decoration: none;
  text-transform: uppercase;

  &.active {
    text-decoration: underline;
    text-underline-offset: 0.35rem;
  }

  @media (max-width: 760px) {
    padding: 0.85rem 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.28);
  }
`;

const MenuButton = styled.button`
  display: none;
  border: 1px solid #ffffff;
  background: transparent;
  color: #ffffff;
  font: inherit;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.35rem 0.7rem;
  cursor: pointer;

  @media (max-width: 760px) {
    display: inline-block;
  }
`;

const Frame = styled.div`
  flex: 1 0 auto;
  width: min(${(p) => p.theme.max}, calc(100% - 2.5rem));
  margin: 0 auto;
`;

const Columns = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  column-gap: 2.75rem;
  row-gap: 0;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Foot = styled.footer`
  background: ${(p) => p.theme.wash};
  border-top: 4px solid ${(p) => p.theme.red};
`;

const FootInner = styled.div`
  width: min(${(p) => p.theme.max}, calc(100% - 2.5rem));
  margin: 0 auto;
  padding: 1.3rem 0 1.8rem;
  color: ${(p) => p.theme.muted};
  font-size: 0.85rem;
`;

/** Site header, page content, news column, and footer. */
export default function Layout() {
  const [open, setOpen] = useState(false);

  function close() {
    setOpen(false);
  }

  return (
    <Shell>
      <Top>
        <TopInner>Simon Fraser University</TopInner>
      </Top>
      <Bar>
        <Inner>
          <Brand to="/" onClick={close}>
            <Mark aria-hidden="true" />
            <span>
              <Lab>Building Engineering Physics Lab</Lab>
              <Unit>Sustainable Energy Engineering</Unit>
            </span>
          </Brand>
          <MenuButton
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            Menu
          </MenuButton>
          <Nav $open={open} aria-label="Primary">
            {links.map(([to, label, end]) => (
              <Item key={to} to={to} end={end} onClick={close}>
                {label}
              </Item>
            ))}
          </Nav>
        </Inner>
      </Bar>
      <Frame>
        <Columns>
          <Outlet />
          <NewsColumn />
        </Columns>
      </Frame>
      <Foot>
        <FootInner>
          Building Engineering Physics Lab · Surrey campus
          · School of Sustainable Energy Engineering
        </FootInner>
      </Foot>
    </Shell>
  );
}
