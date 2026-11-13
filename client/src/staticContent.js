const sections = {
  '/api/profile': 'profile',
  '/api/research': 'research',
  '/api/publications': 'publications',
  '/api/news': 'news',
};

/** One content section for a hosted page that has no API. */
export function sectionFor(content, path) {
  const key = sections[path];
  if (!key || !content) {
    return null;
  }
  return content[key];
}
