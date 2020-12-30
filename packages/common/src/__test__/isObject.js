import {isObject} from '../index';

test('isObject', () => {
  expect(isObject()).toBe(false);
  expect(isObject(1)).toBe(false);
  expect(isObject(function () {})).toBe(false);
  expect(isObject('')).toBe(false);
  expect(isObject(undefined)).toBe(false);
  expect(isObject(true)).toBe(false);
  expect(isObject([])).toBe(false);
  expect(isObject(false)).toBe(false);
  expect(isObject({})).toBe(true);
  expect(isObject(document.body)).toBe(true);
});
