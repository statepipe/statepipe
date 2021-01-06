import {getStatepipeName} from '../index';
import {STATEPIPE_ATTR} from '../const';
import {render} from '../test-helpers';

test('stress args', () => {
  expect(getStatepipeName()).toBe(null);
  expect(getStatepipeName(null)).toBe(null);
  expect(getStatepipeName(undefined)).toBe(null);
  expect(getStatepipeName('')).toBe(null);
  expect(getStatepipeName(' ')).toBe(null);
  expect(getStatepipeName({})).toBe(null);
  expect(getStatepipeName(false)).toBe(null);
  expect(getStatepipeName(true)).toBe(null);
  expect(getStatepipeName([])).toBe(null);
  expect(getStatepipeName(function () {})).toBe(null);
});

test('valid cases', () => {
  let i = 0;
  render(`
      <span name="getStatepipeName${i}" ${STATEPIPE_ATTR}="pass" ></span>
      <span name="getStatepipeName${++i}" ${STATEPIPE_ATTR}=""></span>
      <span name="getStatepipeName${++i}" ${STATEPIPE_ATTR}></span>
      `);

  const test0 = document.body.querySelector('[name=getStatepipeName0]');
  const test1 = document.body.querySelector('[name=getStatepipeName1]');
  const test2 = document.body.querySelector('[name=getStatepipeName2]');

  expect(getStatepipeName(test0)).toBe('pass');
  expect(getStatepipeName(test1)).toBe(null);
  expect(getStatepipeName(test2)).toBe(null);
});
