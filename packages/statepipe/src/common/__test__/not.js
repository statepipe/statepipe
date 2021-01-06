import {not} from '../index';

test('all cases', () => {
  expect(not({})).toBe(false);
  expect(not(1)).toBe(false);
  expect(not(0)).toBe(true);
  expect(not(true)).toBe(false);
  expect(not(false)).toBe(true);
  expect(not(undefined)).toBe(true);
  expect(not(null)).toBe(true);
  expect(not('null')).toBe(false);
  expect(not(function () {})).toBe(false);
  expect(not([])).toBe(false);
});
