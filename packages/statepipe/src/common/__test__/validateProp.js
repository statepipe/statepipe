import {validateProp} from '../index';

test('stress args', () => {
  expect(validateProp({})).toBe(false);
  expect(validateProp(1)).toBe(false);
  expect(validateProp(true)).toBe(false);
  expect(validateProp(false)).toBe(false);
  expect(validateProp(undefined)).toBe(false);
  expect(validateProp(null)).toBe(false);
  expect(validateProp(function () {})).toBe(false);
  expect(validateProp('')).toBe(false);
  expect(validateProp(' ')).toBe(false);
});

test('valid cases', () => {
  expect(validateProp('a')).toBe(true);
  expect(validateProp('  a')).toBe(true);
});
