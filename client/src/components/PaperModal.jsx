import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.72);
`;

const Close = styled.button`
  position: absolute;
  top: 0.85rem;
  right: 0.95rem;
  border: 0;
  background: transparent;
  color: ${(p) => p.theme.heading};
  font: inherit;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
`;

const Sheet = styled.article`
  position: relative;
  width: min(720px, 100%);
  max-height: calc(100vh - 3rem);
  overflow: auto;
  padding: 2.4rem 2.2rem 2rem;
  background: #ffffff;
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.35);
`;

const Year = styled.p`
  margin: 0 0 0.7rem;
  color: ${(p) => p.theme.red};
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
`;

const Heading = styled.h2`
  margin: 0;
  font-size: clamp(1.45rem, 2.4vw, 1.9rem);
  line-height: 1.25;
`;

const Authors = styled.p`
  margin: 1rem 0 0;
  font-size: 1.05rem;
`;

const Venue = styled.p`
  margin: 0.4rem 0 0;
  color: ${(p) => p.theme.muted};
`;

const Doi = styled.p`
  margin: 1.2rem 0 0;
  color: ${(p) => p.theme.heading};
  font-size: 0.92rem;
  word-break: break-all;
`;

/** Centered paper sheet on a dimmed page. */
export default function PaperModal({ paper, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!paper) {
      return undefined;
    }

    function onKey(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    if (closeRef.current) {
      closeRef.current.focus();
    }

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKey);
    };
  }, [paper, onClose]);

  if (!paper) {
    return null;
  }

  return (
    <Backdrop onClick={onClose}>
      <Sheet
        role="dialog"
        aria-modal="true"
        aria-labelledby="paper-title"
        onClick={(event) => event.stopPropagation()}
      >
        <Close ref={closeRef} type="button" onClick={onClose}>
          Close
        </Close>
        <Year>{paper.year}</Year>
        <Heading id="paper-title">{paper.title}</Heading>
        <Authors>{paper.authors}</Authors>
        <Venue>{paper.venue}</Venue>
        {paper.url ? <Doi>{paper.url}</Doi> : null}
      </Sheet>
    </Backdrop>
  );
}
