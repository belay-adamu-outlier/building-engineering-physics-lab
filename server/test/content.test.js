import assert from 'node:assert/strict';
import test from 'node:test';
import { getSection, loadContent } from '../src/content.js';

test('seed content has the lab profile and four themes', () => {
  const content = loadContent();
  assert.equal(
    content.profile.labName,
    'Building Engineering Physics Lab',
  );
  assert.equal(content.profile.email, 'fitsum_tariku@sfu.ca');
  assert.ok(content.profile.portrait);
  assert.ok(content.profile.hero);
  assert.ok(content.profile.heroAlt);
  assert.ok(content.profile.group);
  assert.ok(content.profile.groupAlt);
  assert.equal(content.research.length, 4);
  content.research.forEach((theme) => {
    assert.ok(theme.teaser);
    assert.ok(theme.id);
  });
  assert.ok(content.publications.length >= 6);
  assert.ok(content.news.length >= 2);
});

test('each publication has the fields the page renders', () => {
  const papers = getSection('publications');
  papers.forEach((paper) => {
    assert.ok(paper.id);
    assert.ok(paper.title);
    assert.ok(paper.authors);
    assert.ok(paper.venue);
    assert.equal(typeof paper.year, 'number');
  });
});

test('getSection returns null for an unknown name', () => {
  assert.equal(getSection('missing', { profile: {} }), null);
});
