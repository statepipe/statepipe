import {injectBlobFnFromStore} from '../index';
import {PIPE_STORE, OUT_STORE, TRIGGER_STORE} from '../const';

const invalidType = 'foo';
const validStore = {
  [PIPE_STORE]: {
    pass: function () {
      console.log('pass');
    },
  },
  [OUT_STORE]: {
    pass: function () {
      console.log('pass');
    },
  },
  [TRIGGER_STORE]: {
    pass: function () {
      console.log('pass');
    },
  },
};
const validBlock = {
  store: validStore,
  fn: 'pass',
};

test('stress args', () => {
  expect(injectBlobFnFromStore(PIPE_STORE)()).toBe(null);
  expect(injectBlobFnFromStore(PIPE_STORE)(null)).toBe(null);
  expect(injectBlobFnFromStore(PIPE_STORE)('')).toBe(null);
  expect(injectBlobFnFromStore(PIPE_STORE)('a')).toBe(null);
  expect(injectBlobFnFromStore(PIPE_STORE)(1)).toBe(null);
  expect(injectBlobFnFromStore(PIPE_STORE)(true)).toBe(null);
  expect(injectBlobFnFromStore(PIPE_STORE)({})).toBe(null);
  expect(injectBlobFnFromStore(PIPE_STORE)(function () {})).toBe(null);
  expect(injectBlobFnFromStore(invalidType)(validBlock)).toBe(null);
  expect(injectBlobFnFromStore(invalidType)(validBlock)).toBe(null);
  expect(injectBlobFnFromStore(invalidType)(validBlock)).toBe(null);
  expect(injectBlobFnFromStore(invalidType)(validBlock)).toBe(null);
  expect(injectBlobFnFromStore(invalidType)(validBlock)).toBe(null);
  expect(injectBlobFnFromStore(invalidType)(validBlock)).toBe(null);
  expect(injectBlobFnFromStore(invalidType)(validBlock)).toBe(null);
  expect(injectBlobFnFromStore(invalidType)(validBlock)).toBe(null);
});

test('valid cases', () => {
  expect(injectBlobFnFromStore(PIPE_STORE)(validBlock).run).toBe(
    validBlock.store[PIPE_STORE].pass,
  );
  expect(injectBlobFnFromStore(TRIGGER_STORE)(validBlock).run).toBe(
    validBlock.store[TRIGGER_STORE].pass,
  );
  expect(injectBlobFnFromStore(OUT_STORE)(validBlock).run).toBe(
    validBlock.store[OUT_STORE].pass,
  );
});
