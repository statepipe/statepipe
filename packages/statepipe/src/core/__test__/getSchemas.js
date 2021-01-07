import getSchemas, {getBlocks, parseReducers} from '../getSchemas';

import {isObject} from '../../common';

import {
  SCHEMA_ARGS,
  SCHEMA_FN,
  SCHEMA_INDEX,
  TRIGGER_PROPS,
  PIPE_PROPS,
  OUT_PROPS,
  SCHEMA_EVENT,
  SCHEMA_SLUG,
  SCHEMA_ACTION,
  SCHEMA_STORE,
  PIPE_ATTR,
  PIPE_STORE,
  OUT_STORE,
  TRIGGER_STORE,
  TRIGGER_ATTR,
} from '../../common/const';

import {statepipeWrapper} from '../../common/test-helpers';

const mockStore = {
  [PIPE_STORE]: {},
  [OUT_STORE]: {},
  [TRIGGER_STORE]: {},
};

describe('test helpers', () => {

  describe('getBlocks', () => {
    test('stress args', () => {
      expect(getBlocks(null)).toBe(null);
      expect(getBlocks(undefined)).toBe(null);
      expect(getBlocks()).toBe(null);
      expect(getBlocks(function () {})).toBe(null);
      expect(getBlocks(1)).toBe(null);
      expect(getBlocks({})).toBe(null);
      expect(getBlocks([])).toBe(null);
    });

    test('valid cases', () => {
      expect(getBlocks('a')).toEqual(['a']);
      expect(getBlocks('')).toEqual([]);
      expect(getBlocks('a,b')).toEqual(['a', 'b']);
      expect(getBlocks('a,,b')).toEqual(['a', 'b']);
      expect(getBlocks('a, ,b')).toEqual(['a', 'b']);
      expect(getBlocks('  a, ,  b')).toEqual(['a', 'b']);
      expect(
        getBlocks(`  
      a,
       ,  b
       
       `),
      ).toEqual(['a', 'b']);
    });
  });

  describe('parseReducers', () => {
    test('stress args', () => {
      const blob = {
        type: PIPE_STORE,
        node: document,
      };
      expect(parseReducers(null, mockStore, blob)).toBe(null);
      expect(parseReducers(undefined, mockStore, blob)).toBe(null);
      expect(parseReducers(function () {}, mockStore, blob)).toBe(null);
      expect(parseReducers(1, mockStore, blob)).toBe(null);
      expect(parseReducers({}, mockStore, blob)).toBe(null);
      expect(parseReducers([], mockStore, blob)).toBe(null);
      expect(parseReducers([1], mockStore, blob)).toBe(null);
      expect(parseReducers('', mockStore, blob)).toBe(null);
      expect(parseReducers(' ', mockStore, blob)).toBe(null);
      expect(parseReducers('a', mockStore, blob)).toBe(null);
    });

    test(PIPE_ATTR + ' valid case', () => {
      const blob = {
        type: PIPE_STORE,
        node: document,
      };
      const result = parseReducers(
        [null,   'pass ', 0,   '  fail',   {},   function   ()   {}],
        {
          ...blob,
          node: document,
        },
        mockStore,
      );
      result.forEach(item => {
        expect(Object.keys(item)).toEqual(PIPE_PROPS);
      });

      expect(result.length).toBe(2);
      expect(result[0][SCHEMA_FN]).toBe('pass');
      expect(result[0][SCHEMA_INDEX]).toBe(1);

      expect(result[1][SCHEMA_FN]).toBe('fail');
      expect(result[1][SCHEMA_INDEX]).toBe(3);
    });

    test(TRIGGER_ATTR + ' valid case', () => {
      const blob = {
        type: TRIGGER_STORE,
        node: document,
      };

      const result = parseReducers(
        [null,   'ping@click|pass ', 0,   '  fail', 'rm@click|fail',   {},   function   ()   {}],
        {
          ...blob,
          node: document,
        },
        mockStore,
      );
      result.forEach(item => {
        expect(Object.keys(item)).toEqual(TRIGGER_PROPS);
      });

      expect(result.length).toBe(4);
      expect(result[0][SCHEMA_FN]).toBe('ping@click');
      expect(result[0][SCHEMA_INDEX]).toBe(1);

      expect(result[1][SCHEMA_FN]).toBe('pass');
      expect(result[1][SCHEMA_INDEX]).toBe(1);

      expect(result[2][SCHEMA_FN]).toBe("rm@click");
      expect(result[2][SCHEMA_INDEX]).toBe(4);

      expect(result[3][SCHEMA_FN]).toBe("fail");
      expect(result[3][SCHEMA_INDEX]).toBe(4);
    });
  });
});

describe('getSchemas', () => {
  test('stress args 1s call', () => {
    expect(getSchemas(null)).toBe(null);
    expect(getSchemas(undefined)).toBe(null);
    expect(getSchemas('')).toBe(null);
    expect(getSchemas('a')).toBe(null);
    expect(getSchemas(function () {})).toBe(null);
    expect(getSchemas(false)).toBe(null);
    expect(getSchemas(true)).toBe(null);
    expect(getSchemas(1)).toBe(null);
    expect(getSchemas({})).toBe(null);
    expect(getSchemas({foo: 1})).toBe(null);
    expect(typeof getSchemas({[PIPE_STORE]: {}})).toBe('function');
    expect(typeof getSchemas({[OUT_STORE]: {}})).toBe('function');
    expect(typeof getSchemas({[TRIGGER_STORE]: {}})).toBe('function');
    expect(typeof getSchemas(mockStore)).toBe('function');
  });

  test('stress args 2nd call', () => {
    const fn = getSchemas(mockStore);
    expect(fn(null)).toBe(null);
    expect(fn(undefined)).toBe(null);
    expect(fn()).toBe(null);
    expect(fn('')).toBe(null);
    expect(fn('a')).toBe(null);
    expect(fn(function () {})).toBe(null);
    expect(fn(1)).toBe(null);
    expect(fn({})).toBe(null);
    expect(fn([])).toBe(null);
    expect(fn({type: PIPE_STORE, node: {}})).toBe(null);
    expect(fn({type: PIPE_STORE, node: document})).toBe(null);
  });

  describe(PIPE_ATTR, () => {
    test('empty case', () => {
      const parser = getSchemas(mockStore);
      const wrapper = statepipeWrapper(
        `<span name="pipe" ${PIPE_ATTR}=""></span>`,
      );
      const item = wrapper.querySelector('[name=pipe]');
      const result = parser({type: PIPE_STORE, node: item});
      expect(result).toBe(null);
    });

    test('simple case', () => {
      const parser = getSchemas(mockStore);
      const wrapper = statepipeWrapper(
        `<span name="pipe" ${PIPE_ATTR}="pass"></span>`,
      );
      const item = wrapper.querySelector('[name=pipe]');
      const result = parser({type: PIPE_STORE, node: item});
      expect(isObject(result)).toBe(true);
      expect(Object.keys(result)).toEqual(['type', 'node', 'reducers']);

      result.reducers.forEach(red => {
        PIPE_PROPS.forEach(n => {
          expect(red[n] !== undefined).toBe(true);
        });
      });
      expect(result.type).toEqual(PIPE_STORE);
      expect(result.node).toEqual(item);
      expect(result.reducers[0][SCHEMA_FN]).toEqual('pass');
    });

    test('multi stores', () => {
      const parser = getSchemas(mockStore);
      const wrapper = statepipeWrapper(
        `<span name="pipe" ${PIPE_ATTR}="pass1:a|pass2,fail:b"></span>`,
      );
      const item = wrapper.querySelector('[name=pipe]');
      const result = parser({type: PIPE_STORE, node: item});
      expect(result.type).toEqual(PIPE_STORE);
      expect(result.node).toEqual(item);
      expect(result.reducers[0][SCHEMA_FN]).toEqual('pass1');
      expect(result.reducers[0][SCHEMA_ARGS]).toEqual(['a']);
      expect(result.reducers[0][SCHEMA_INDEX]).toEqual(0);

      expect(result.reducers[1][SCHEMA_FN]).toEqual('pass2');
      expect(result.reducers[1][SCHEMA_ARGS]).toEqual([]);
      expect(result.reducers[1][SCHEMA_INDEX]).toEqual(0);

      expect(result.reducers[2][SCHEMA_FN]).toEqual('fail');
      expect(result.reducers[2][SCHEMA_ARGS]).toEqual(['b']);
      expect(result.reducers[2][SCHEMA_INDEX]).toEqual(1);
    });
  });
});

