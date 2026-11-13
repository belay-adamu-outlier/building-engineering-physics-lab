import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { saveMessage } from '../src/storeMessage.js';

test('creates a file and appends messages', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'lab-mail-'));
  const filePath = path.join(dir, 'nested', 'messages.json');
  const first = { name: 'Ada', email: 'ada@sfu.ca', message: 'Hello lab' };

  const count = await saveMessage(first, filePath);
  await saveMessage(
    { name: 'Grace', email: 'grace@sfu.ca', message: 'Second' },
    filePath,
  );
  const saved = JSON.parse(await readFile(filePath, 'utf8'));

  assert.equal(count, 1);
  assert.equal(saved.length, 2);
  assert.equal(saved[0].name, 'Ada');
  assert.equal(saved[1].name, 'Grace');
  await rm(dir, { recursive: true, force: true });
});

test('throws when the existing file is not JSON', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'lab-mail-'));
  const filePath = path.join(dir, 'messages.json');
  await writeFile(filePath, 'not json');

  await assert.rejects(
    () => saveMessage({ name: 'Ada' }, filePath),
    SyntaxError,
  );
  await rm(dir, { recursive: true, force: true });
});
