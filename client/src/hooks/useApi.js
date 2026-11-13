import { useEffect, useState } from 'react';

/** Load one JSON endpoint. */
export function useApi(path) {
  const [state, setState] = useState({
    status: 'loading',
    data: null,
    error: '',
  });

  useEffect(() => {
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
