import {isNode} from '../index';

test('stress args', () => {
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

test('valid cases', () => {
  expect(isNode(document.body)).toBe(true);
});
