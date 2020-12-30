import {isNode} from '../index';

test('isNode', () => {
  expect(isNode()).toBe(false);
  expect(isNode(1)).toBe(false);
  expect(isNode({})).toBe(false);
  expect(isNode(function () {})).toBe(false);
  expect(isNode('')).toBe(false);
  expect(isNode(undefined)).toBe(false);
  expect(isNode(true)).toBe(false);
  expect(isNode([])).toBe(false);
  expect(isNode(false)).toBe(false);
  expect(isNode(document.body)).toBe(true);
});
