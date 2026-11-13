import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * Append one contact message to a JSON file.
 * @param {object} message Validated message.
 * @param {string} filePath Destination file.
 * @returns {Promise<number>} New message count.
 */
export async function saveMessage(message, filePath) {
  await mkdir(path.dirname(filePath), { recursive: true });
  let current = [];

  try {
    const raw = await readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    current = Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }

  current.push(message);
  await writeFile(filePath, JSON.stringify(current, null, 2));
  return current.length;
}
