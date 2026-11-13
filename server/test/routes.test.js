import assert from 'node:assert/strict';
import test from 'node:test';
import { createApp } from '../src/index.js';

function listen(app) {
  return new Promise((resolve) => {
    const server = app.listen(0, '127.0.0.1', () => {
      resolve(server);
    });
  });
}

test('GET /api/profile returns the lab name', async () => {
  const server = await listen(createApp());
  const { port } = server.address();

  try {
    const response = await fetch(
      'http://127.0.0.1:' + port + '/api/profile',
    );
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.labName, 'Building Engineering Physics Lab');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('unknown API routes return 404', async () => {
  const server = await listen(createApp());
  const { port } = server.address();

  try {
    const response = await fetch(
      'http://127.0.0.1:' + port + '/api/missing',
    );
    assert.equal(response.status, 404);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
