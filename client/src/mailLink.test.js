import assert from 'node:assert/strict';
import test from 'node:test';
import { mailLink } from './mailLink.js';

test('mailLink addresses the lab and includes the note', () => {
  const href = mailLink('lab@sfu.ca', {
    name: 'Ada',
    email: 'ada@example.com',
    message: 'Hello lab',
  });
  assert.equal(href.startsWith('mailto:lab@sfu.ca?'), true);
  assert.equal(href.includes(encodeURIComponent('Hello lab')), true);
  assert.equal(href.includes(encodeURIComponent('Ada')), true);
});
