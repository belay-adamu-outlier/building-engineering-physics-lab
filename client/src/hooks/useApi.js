import { useEffect, useState } from 'react';
import content from '../../../server/data/content.json';
import { sectionFor } from '../staticContent.js';

const hosted = import.meta.env.VITE_STATIC === 'true';

function initialState(path) {
  if (!hosted) {
    return { status: 'loading', data: null, error: '' };
  }
  const data = sectionFor(content, path);
  if (!data) {
    return {
      status: 'error',
      data: null,
      error: 'Could not load this page.',
    };
  }
  return { status: 'ready', data, error: '' };
}

/** Load one JSON endpoint, or the bundled record on Pages. */
export function useApi(path) {
  const [state, setState] = useState(() => initialState(path));

  useEffect(() => {
    if (hosted) {
      return undefined;
    }
    let active = true;

    fetch(path)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Could not load this page.');
        }
        return response.json();
      })
      .then((data) => {
        if (!active) {
          return;
        }
        setState({ status: 'ready', data, error: '' });
      })
      .catch(() => {
        if (!active) {
          return;
        }
        setState({
          status: 'error',
          data: null,
          error: 'Could not load this page.',
        });
      });

    return () => {
      active = false;
    };
  }, [path]);

  return state;
}
