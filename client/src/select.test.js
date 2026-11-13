import assert from 'node:assert/strict';
import test from 'node:test';
import { pickLatest, sortByDateDesc } from './select.js';

const papers = [
  { id: 'b', year: 2021, title: 'Older' },
  { id: 'a', year: 2023, title: 'Newer' },
  { id: 'c', year: 2023, title: 'Also new' },
];

test('pickLatest orders by year and limits the count', () => {
  const picked = pickLatest(papers, 2);
  assert.deepEqual(picked.map((item) => item.id), ['c', 'a']);
});

test('pickLatest returns an empty list for bad input', () => {
  assert.deepEqual(pickLatest(null, 3), []);
  assert.deepEqual(pickLatest(papers, 0), []);
});

test('sortByDateDesc puts the newest date first', () => {
  const sorted = sortByDateDesc([
    { id: 'old', date: '2025-06-16' },
    { id: 'new', date: '2026-08' },
  ]);
  assert.equal(sorted[0].id, 'new');
});

test('sortByDateDesc ignores a non-array', () => {
  assert.deepEqual(sortByDateDesc(undefined), []);
});
