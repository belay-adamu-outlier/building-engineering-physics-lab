/** Prefix a public file so it works under a GitHub Pages base. */
export function joinPublic(path, base) {
  if (!path || /^https?:/.test(path)) {
    return path;
  }
  const root = base || '/';
  const prefix = root.endsWith('/') ? root : root + '/';
  return prefix + String(path).replace(/^\//, '');
}

/** BrowserRouter basename. Home is undefined so "/" stays local. */
export function routerBase(base) {
  const value = base || '/';
  if (value === '/') {
    return undefined;
  }
  return value.replace(/\/$/, '');
}

/** Image path for the current Vite base. */
export function publicUrl(path) {
  return joinPublic(path, import.meta.env.BASE_URL);
}
