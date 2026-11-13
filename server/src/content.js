import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(here, '..', 'data', 'content.json');

/**
 * Read the lab content file.
 * @param {string} [filePath] Override path, used in tests.
 * @returns {object}
 */
export function loadContent(filePath = dataPath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

/**
 * Return one top-level section, or null when it is missing.
 * @param {string} name Section name.
 * @param {object} [content] Already loaded content.
 * @returns {object|Array|null}
 */
export function getSection(name, content) {
  const data = content || loadContent();
  if (!Object.hasOwn(data, name)) {
    return null;
  }
  return data[name];
}
