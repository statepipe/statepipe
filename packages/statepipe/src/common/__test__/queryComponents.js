import {queryComponents} from '../index';
import {TRIGGER_ATTR, PIPE_ATTR, OUT_ATTR} from '../const';
import {statepipeWrapper} from '../test-helpers';

test('stress args', () => {
  expect(queryComponents()).toBe(null);
  expect(queryComponents(1)).toBe(null);
  expect(queryComponents({})).toBe(null);
  expect(queryComponents(function () {})).toBe(null);
  expect(queryComponents('')).toBe(null);
  expect(queryComponents(undefined)).toBe(null);
  expect(queryComponents(true)).toBe(null);
  expect(queryComponents(false)).toBe(null);
  expect(queryComponents([])).toBe(null);
  expect(queryComponents(document.body)).toEqual(null);

  const wrapper = statepipeWrapper(``);
  expect(queryComponents(wrapper, 'test')).toEqual([]);

  const wrapper2 = statepipeWrapper(`<span name="test1"></span>`);
  expect(queryComponents(wrapper2, 'test')).toEqual([]);
});

describe('valid cases', () => {
  test(TRIGGER_ATTR, () => {
    const w1 = statepipeWrapper(`
      <span ${TRIGGER_ATTR}="foo"></span>
    `);
    let res = queryComponents(w1, 'test');
    expect(res.length).toBe(1);
  });

  test(PIPE_ATTR, () => {
    const w1 = statepipeWrapper(`
      <span ${PIPE_ATTR}="foo"></span>
    `);
    let res = queryComponents(w1, 'test');
    expect(res.length).toBe(1);
  });

  test(OUT_ATTR, () => {
    const w1 = statepipeWrapper(`
      <span ${OUT_ATTR}="foo"></span>
    `);
    let res = queryComponents(w1, 'test');
    expect(res.length).toBe(1);
  });

  test('multi stores', () => {
    const wrapper = statepipeWrapper(`
      <span ${TRIGGER_ATTR}="foo"></span>
      <span ${PIPE_ATTR}="foo"></span>
      <span ${OUT_ATTR}="foo"></span>
    `);
    const res = queryComponents(wrapper, 'test');
    expect(res.length).toBe(3);
  });
});