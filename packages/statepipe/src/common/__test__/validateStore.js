import {validateStore} from '../index';
import {TRIGGER_STORE, PIPE_STORE, OUT_STORE} from '../const';

test('stress args', () => {
  expect(validateStore()).toBe(false);
  expect(validateStore(null)).toBe(false);
  expect(validateStore('')).toBe(false);
  expect(validateStore(' ')).toBe(false);
  expect(validateStore({})).toBe(false);
  expect(validateStore(function () {})).toBe(false);
  expect(validateStore(1)).toBe(false);
  expect(validateStore(true)).toBe(false);
  expect(validateStore(false)).toBe(false);
  expect(validateStore([])).toBe(false);

  expect(
    validateStore({
      [TRIGGER_STORE]: null,
      [PIPE_STORE]: null,
      [OUT_STORE]: null,
    }),
  ).toBe(false);

  expect(
    validateStore({
      [TRIGGER_STORE]: true,
      [PIPE_STORE]: true,
      [OUT_STORE]: true,
    }),
  ).toBe(false);
});

test('valid cases', () => {
  const store = {
    [TRIGGER_STORE]: {},
    [PIPE_STORE]: {},
    [OUT_STORE]: {},
  };
  expect(validateStore(store)).toBe(true);
});
