import {
  validateStoreAttrName,
  TRIGGER_STORE,
  PIPE_STORE,
  OUT_STORE,
} from '../index';

test('validateStoreAttrName', () => {
  expect(validateStoreAttrName(TRIGGER_STORE)).toBe(true);
  expect(validateStoreAttrName(PIPE_STORE)).toBe(true);
  expect(validateStoreAttrName(OUT_STORE)).toBe(true);
  expect(validateStoreAttrName()).toBe(false);
  expect(validateStoreAttrName(1)).toBe(false);
  expect(validateStoreAttrName(function () {})).toBe(false);
  expect(validateStoreAttrName('')).toBe(false);
  expect(validateStoreAttrName(undefined)).toBe(false);
  expect(validateStoreAttrName(true)).toBe(false);
  expect(validateStoreAttrName([])).toBe(false);
  expect(validateStoreAttrName(false)).toBe(false);
  expect(validateStoreAttrName({})).toBe(false);
  expect(validateStoreAttrName(document.body)).toBe(false);
});
