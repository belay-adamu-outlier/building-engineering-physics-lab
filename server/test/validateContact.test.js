import assert from 'node:assert/strict';
import test from 'node:test';
import { createLimiter, validateContact } from '../src/validateContact.js';

const valid = {
  name: 'Ada Lovelace',
  email: 'ada@sfu.ca',
  message: 'I would like to ask about graduate research.',
  company: '',
};

test('accepts a complete message', () => {
  const result = validateContact(valid);
  assert.equal(result.ok, true);
  assert.equal(result.value.name, 'Ada Lovelace');
  assert.equal(result.value.email, 'ada@sfu.ca');
  assert.ok(result.value.sentAt);
});

test('rejects a short message and a bad email', () => {
  const result = validateContact({
    ...valid,
    email: 'not-an-email',
    message: 'short',
  });
  assert.equal(result.ok, false);
  assert.ok(result.errors.email);
  assert.ok(result.errors.message);
});

test('rejects a missing name', () => {
  const result = validateContact({ ...valid, name: ' ' });
  assert.equal(result.ok, false);
  assert.ok(result.errors.name);
});

test('rejects a filled honeypot', () => {
  const result = validateContact({ ...valid, company: 'spam' });
  assert.equal(result.ok, false);
  assert.ok(result.errors.company);
});

test('rejects an empty body', () => {
  const result = validateContact(null);
  assert.equal(result.ok, false);
  assert.ok(result.errors.name);
});

test('limiter blocks the hit past the maximum', () => {
  const allow = createLimiter(2, 1000);
  assert.equal(allow('a', 0), true);
  assert.equal(allow('a', 10), true);
  assert.equal(allow('a', 20), false);
  assert.equal(allow('a', 2000), true);
});
