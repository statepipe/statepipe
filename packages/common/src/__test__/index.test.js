import {
  isNode,
  isObject,
  validateStoreAttrName,
  TRIGGER_STORE,
  OUT_STORE,
  PIPE_STORE,
  STATEPIPE_ATTR,
  warn,
  log,
  error,
  parseJSON,
  getStatepipeName,
} from '../index';

import {render} from '../test-helpers';

test('isNode', () => {
  expect(isNode()).toBe(false);
  expect(isNode(1)).toBe(false);
  expect(isNode({})).toBe(false);
  expect(isNode(function () {})).toBe(false);
  expect(isNode('')).toBe(false);
  expect(isNode(undefined)).toBe(false);
  expect(isNode(true)).toBe(false);
  expect(isNode([])).toBe(false);
  expect(isNode(false)).toBe(false);
  expect(isNode(document.body)).toBe(true);
});

test('isObject', () => {
  expect(isObject()).toBe(false);
  expect(isObject(1)).toBe(false);
  expect(isObject(function () {})).toBe(false);
  expect(isObject('')).toBe(false);
  expect(isObject(undefined)).toBe(false);
  expect(isObject(true)).toBe(false);
  expect(isObject([])).toBe(false);
  expect(isObject(false)).toBe(false);
  expect(isObject({})).toBe(true);
  expect(isObject(document.body)).toBe(true);
});

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

test('log,warn,error', () => {
  const CLOG = console.log;
  const CWARN = console.warn;
  const CERR = console.error;

  let logCount = 0;
  window.$statepipeLog = false;
  console.log = (msg, val) => {
    logCount++;
    expect(logCount).toBe(val);
  };

  let logWarn = 0;
  console.warn = (msg, val) => {
    logWarn++;
    expect(logWarn).toBe(val);
  };

  let logErr = 0;
  console.error = (msg, val) => {
    logErr++;
    expect(logErr).toBe(val);
  };

  log('foo', 0);
  warn('foo', 0);
  error('foo', 0);

  window.$statepipeLog = true;
  log('foo', 1);
  warn('foo', 1);
  error('foo', 1);

  console.log = CLOG;
  console.error = CERR;
  console.warn = CWARN;
});

test('parseJSON', () => {
  const result = {value: true};
  render(`
    <span name="parseJSONtest0" :state='${JSON.stringify(result)}' ></span>
    <span name="parseJSONtest1" :state="" ></span>
    <span name="parseJSONtest2" :state="1" ></span>
    <span name="parseJSONtest3" :state="false" ></span>
    <span name="parseJSONtest4" :state="0" ></span>
    <span name="parseJSONtest5" :state="[1]" ></span>
    <span name="parseJSONtest7" :state='{value: true}' ></span>
    `);
  const test0 = document.body.querySelector('[name=parseJSONtest0]');
  const test1 = document.body.querySelector('[name=parseJSONtest1]');
  const test2 = document.body.querySelector('[name=parseJSONtest2]');
  const test3 = document.body.querySelector('[name=parseJSONtest3]');
  const test4 = document.body.querySelector('[name=parseJSONtest4]');
  const test5 = document.body.querySelector('[name=parseJSONtest5]');
  const test7 = document.body.querySelector('[name=parseJSONtest7]');

  expect(parseJSON(test0)).toEqual(result);
  expect(parseJSON(test1)).toBe(null);
  expect(parseJSON(test2)).toBe(null);
  expect(parseJSON(test3)).toBe(null);
  expect(parseJSON(test4)).toBe(null);
  expect(parseJSON(test5)).toBe(null);
  expect(parseJSON(test7)).toBe(null);
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
