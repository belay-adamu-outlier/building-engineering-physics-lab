import assert from 'node:assert/strict';
import test from 'node:test';
import { sectionFor } from './staticContent.js';

const content = {
  profile: { labName: 'Lab' },
  research: [{ id: 'materials' }],
  publications: [{ id: 'paper' }],
  news: [{ id: 'story' }],
};

test('sectionFor returns the matching record', () => {
  assert.equal(sectionFor(content, '/api/profile').labName, 'Lab');
  assert.equal(sectionFor(content, '/api/news')[0].id, 'story');
});

test('sectionFor returns null for an unknown path', () => {
  assert.equal(sectionFor(content, '/api/contact'), null);
  assert.equal(sectionFor(null, '/api/profile'), null);
});
