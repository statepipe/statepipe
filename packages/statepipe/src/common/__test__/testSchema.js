import {isObject, testSchema, validateStoreAttrName} from '../index';

import {render} from '../test-helpers';
import {
  STATEPIPE_ATTR,
  TRIGGER_STORE,
  TRIGGER_ATTR,
  PIPE_ATTR,
  OUT_ATTR,
  OUT_STORE,
  PIPE_STORE,
} from '../const';

test('stress args', () => {
  expect(testSchema()).toBe(null);
  expect(testSchema(1)).toBe(null);
  expect(testSchema({})).toBe(null);
  expect(testSchema(function () {})).toBe(null);
  expect(testSchema('')).toBe(null);
  expect(testSchema(undefined)).toBe(null);
  expect(testSchema(true)).toBe(null);
  expect(testSchema(false)).toBe(null);
  expect(testSchema([])).toBe(null);
  expect(testSchema(document.body)).toEqual([]);

  const wrapper = render(`
    <div ${STATEPIPE_ATTR}="testSchema">
      <span name="test1"></span>
    </div>
    `);
  expect(testSchema(wrapper)).toEqual([]);
});

describe('valid cases', () => {
  test(TRIGGER_ATTR, () => {
    const wrapper = render(`
      <span name="test1" ${TRIGGER_ATTR}="foo"></span>
      <span name="test2" ${TRIGGER_ATTR}=""></span>
      <span name="test3" ${TRIGGER_ATTR}="{}"></span>
      `);

    const t1 = wrapper.querySelector('[name=test1]');
    let res = testSchema(t1);
    expect(res.length).toEqual(1);
    let item = res[0];
    expect(isObject(item)).toBe(true);
    expect(item.node).toBe(t1);
    expect(item.type).toBe(TRIGGER_STORE);

    const t2 = wrapper.querySelector('[name=test2]');
    res = testSchema(t2);
    expect(res.length).toEqual(0);

    const t3 = wrapper.querySelector('[name=test3]');
    res = testSchema(t3);
    expect(res.length).toEqual(1);
    item = res[0];
    expect(isObject(item)).toBe(true);
    expect(item.node).toBe(t3);
    expect(item.type).toBe(TRIGGER_STORE);
  });

  test(PIPE_ATTR, () => {
    const wrapper = render(`
      <span name="test1" ${PIPE_ATTR}="foo"></span>
      <span name="test2" ${PIPE_ATTR}=""></span>
      <span name="test3" ${PIPE_ATTR}="{}"></span>
      `);

    const t1 = wrapper.querySelector('[name=test1]');
    let res = testSchema(t1);
    expect(res.length).toEqual(1);
    let item = res[0];
    expect(isObject(item)).toBe(true);
    expect(item.node).toBe(t1);
    expect(item.type).toBe(PIPE_STORE);

    const t2 = wrapper.querySelector('[name=test2]');
    res = testSchema(t2);
    expect(res.length).toEqual(0);

    const t3 = wrapper.querySelector('[name=test3]');
    res = testSchema(t3);
    expect(res.length).toEqual(1);
    item = res[0];
    expect(isObject(item)).toBe(true);
    expect(item.node).toBe(t3);
    expect(item.type).toBe(PIPE_STORE);
  });

  test(OUT_ATTR, () => {
    const wrapper = render(`
      <span name="test1" ${OUT_ATTR}="foo"></span>
      <span name="test2" ${OUT_ATTR}=""></span>
      <span name="test3" ${OUT_ATTR}="{}"></span>
  `);

    const t1 = wrapper.querySelector('[name=test1]');
    let res = testSchema(t1);
    expect(res.length).toEqual(1);
    let item = res[0];
    expect(isObject(item)).toBe(true);
    expect(item.node).toBe(t1);
    expect(item.type).toBe(OUT_STORE);

    const t2 = wrapper.querySelector('[name=test2]');
    res = testSchema(t2);
    expect(res.length).toEqual(0);

    const t3 = wrapper.querySelector('[name=test3]');
    res = testSchema(t3);
    expect(res.length).toEqual(1);
    item = res[0];
    expect(isObject(item)).toBe(true);
    expect(item.node).toBe(t3);
    expect(item.type).toBe(OUT_STORE);
  });

  test('multi type', () => {
    const wrapper = render(`
      <span name="test1" ${TRIGGER_ATTR}="trigger" ${PIPE_ATTR}="pipe" ${OUT_ATTR}="out"></span>
  `);

    const t1 = wrapper.querySelector('[name=test1]');
    let res = testSchema(t1);
    expect(res.length).toEqual(3);
    res.forEach(item => {
      expect(validateStoreAttrName(item.type)).toBe(true);
    });
  });
});
