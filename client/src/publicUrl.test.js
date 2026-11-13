import assert from 'node:assert/strict';
import test from 'node:test';
import { joinPublic, routerBase } from './publicUrl.js';

test('joinPublic keeps a remote url', () => {
  const url = 'https://doi.org/10.1016/example';
  assert.equal(joinPublic(url, '/lab/'), url);
});

test('joinPublic adds the pages base', () => {
  assert.equal(
    joinPublic('/fitsum-tariku.jpg', '/lab/'),
    '/lab/fitsum-tariku.jpg',
  );
  assert.equal(joinPublic('photo.jpg', '/'), '/photo.jpg');
});

test('routerBase is empty on the local site', () => {
  assert.equal(routerBase('/'), undefined);
  assert.equal(routerBase(undefined), undefined);
});

test('routerBase drops the trailing slash', () => {
  assert.equal(routerBase('/lab/'), '/lab');
});
