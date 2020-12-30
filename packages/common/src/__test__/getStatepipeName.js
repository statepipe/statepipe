import {getStatepipeName, STATEPIPE_ATTR} from '../index';
import {render} from '../test-helpers';

test('getStatepipeName', () => {
  let i = 0;
  const name2 = 'name2';
  const name3 = 'name 3';
  render(`
      <span name="getStatepipeName${i}" ${STATEPIPE_ATTR}="pass" ></span>
      <span name="getStatepipeName${++i}" ${STATEPIPE_ATTR}=""></span>
      <span name="getStatepipeName${++i}" ${STATEPIPE_ATTR}="  ${name2}   "></span>
      <span name="getStatepipeName${++i}" ${STATEPIPE_ATTR}="  ${name3}   "></span>
      <span name="getStatepipeName${++i}" state="{foo}" ></span>
      <span name="getStatepipeName${++i}" state></span>
      `);

  const test0 = document.body.querySelector('[name=getStatepipeName0]');
  const test1 = document.body.querySelector('[name=getStatepipeName1]');
  const test2 = document.body.querySelector('[name=getStatepipeName2]');
  const test3 = document.body.querySelector('[name=getStatepipeName3]');
  const test4 = document.body.querySelector('[name=getStatepipeName4]');

  expect(getStatepipeName(test0)).toBe('pass');
  expect(getStatepipeName(test1)).toBe(null);
  expect(getStatepipeName(test2)).toBe(name2);
  expect(getStatepipeName(test3)).toBe(name3);
  expect(getStatepipeName(test4)).toBe(null);
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
