import {parseJSON} from '../index';
import {STATE_ATTR} from '../const';
import {render} from '../test-helpers';

test('parseJSON', () => {
  const result = {value: true};
  render(`
      <span name="parseJSONtest0" ${STATE_ATTR}='${JSON.stringify(
    result,
  )}' ></span>
      <span name="parseJSONtest1" ${STATE_ATTR}="" ></span>
      <span name="parseJSONtest2" ${STATE_ATTR}="1" ></span>
      <span name="parseJSONtest3" ${STATE_ATTR}="false" ></span>
      <span name="parseJSONtest4" ${STATE_ATTR}="0" ></span>
      <span name="parseJSONtest5" ${STATE_ATTR}="[1]" ></span>
      <span name="parseJSONtest6" ${STATE_ATTR}='{value: true}' ></span>
      `);
  const test0 = document.body.querySelector('[name=parseJSONtest0]');
  const test1 = document.body.querySelector('[name=parseJSONtest1]');
  const test2 = document.body.querySelector('[name=parseJSONtest2]');
  const test3 = document.body.querySelector('[name=parseJSONtest3]');
  const test4 = document.body.querySelector('[name=parseJSONtest4]');
  const test5 = document.body.querySelector('[name=parseJSONtest5]');
  const test6 = document.body.querySelector('[name=parseJSONtest6]');

  expect(parseJSON(test0)).toEqual(result);
  expect(parseJSON(test1)).toBe(null);
  expect(parseJSON(test2)).toBe(null);
  expect(parseJSON(test3)).toBe(null);
  expect(parseJSON(test4)).toBe(null);
  expect(parseJSON(test5)).toBe(null);
  expect(parseJSON(test6)).toBe(null);
  expect(parseJSON()).toBe(null);
  expect(parseJSON(null)).toBe(null);
  expect(parseJSON(undefined)).toBe(null);
  expect(parseJSON('')).toBe(null);
  expect(parseJSON(' ')).toBe(null);
  expect(parseJSON({})).toBe(null);
  expect(parseJSON(false)).toBe(null);
  expect(parseJSON(true)).toBe(null);
  expect(parseJSON([])).toBe(null);
  expect(parseJSON(function () {})).toBe(null);
});
