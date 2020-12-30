import {
  queryComponents,
  STATEPIPE_ATTR,
  TRIGGER_ATTR,
  PIPE_ATTR,
  OUT_ATTR,
} from '../index';
import {render} from '../test-helpers';

test('stress tests', () => {
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

  const wrapper = render(`
  <div ${STATEPIPE_ATTR}="test-empy">
    <span name="test1"></span>
  </div>
  `);
  expect(queryComponents(wrapper, 'test')).toEqual([]);
});

test('tests', () => {
  const wrapper = render(`
  <div ${STATEPIPE_ATTR}="test">
    <span name="test1" ${TRIGGER_ATTR}="foo"></span>
    <span name="test1" ${PIPE_ATTR}="foo"></span>
    <span name="test1" ${OUT_ATTR}="foo"></span>
  </div>
  `);
  const res = queryComponents(wrapper, 'test');
  expect(res.length).toBe(3);
});
