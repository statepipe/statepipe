import {validateProp} from '../index';

test('validateProp', () => {
  expect(validateProp({})).toBe(false);
  expect(validateProp(1)).toBe(false);
  expect(validateProp(true)).toBe(false);
  expect(validateProp(false)).toBe(false);
  expect(validateProp(undefined)).toBe(false);
  expect(validateProp(null)).toBe(false);
  expect(validateProp(function () {})).toBe(false);
  expect(validateProp('')).toBe(false);
  expect(validateProp(' ')).toBe(false);
  expect(validateProp('a')).toBe(true);
});
