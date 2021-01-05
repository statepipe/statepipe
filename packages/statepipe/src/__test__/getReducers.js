import getReducers from '../getReducers';
import {
  SCHEMA_EVENT,
  SCHEMA_ACTION,
  SCHEMA_ARGS,
  SCHEMA_FN,
  SCHEMA_INDEX,
  SCHEMA_SLUG,
  SCHEMA_STORE,
  PIPE_STORE,
  PIPE_PROPS,
  TRIGGER_STORE,
  OUT_STORE,
} from '../../../common/src/const';

const mockStore = {
  [PIPE_STORE]: {
    pass: (...args) => ctx => {
      console.log('pass', args);
      return ctx;
    },
    fail: (...args) => () => {
      console.log('fail', args);
      return null;
    },
  },
  [TRIGGER_STORE]: {
    pass: (...args) => ctx => {
      console.log('pass', args);
      return ctx;
    },
    fail: (...args) => () => {
      console.log('fail', args);
      return null;
    },
  },
  [OUT_STORE]: {
    pass: (...args) => ctx => {
      console.log('pass', args);
      return ctx;
    },
    fail: (...args) => () => {
      console.log('fail', args);
      return null;
    },
  },
};

describe('getReducers', () => {
  test('stress args', () => {
    expect(getReducers(null, {})).toBe(null);
    expect(getReducers(undefined, {})).toBe(null);
    expect(getReducers()).toBe(null);
    expect(getReducers(function () {}, {})).toBe(null);
    expect(getReducers(1, {})).toBe(null);
    expect(getReducers({}, {})).toBe(null);
    expect(getReducers([], {})).toBe(null);
    expect(getReducers('', {})).toBe(null);
    expect(getReducers('pass')).toBe(null);
    expect(getReducers('pass', [])).toBe(null);
    expect(getReducers('pass', Error)).toBe(null);
    expect(getReducers('pass', '')).toBe(null);
    expect(getReducers('pass', 1)).toBe(null);
    expect(getReducers('pass', true)).toBe(null);
    expect(getReducers('pass', function () {})).toBe(null);

    const parse = getReducers(PIPE_STORE, mockStore);
    expect(parse(null, 0)).toBe(null);
    expect(parse(undefined, 0)).toBe(null);
    expect(parse()).toBe(null);
    expect(parse(function () {}, 0)).toBe(null);
    expect(parse(1, 0)).toBe(null);
    expect(parse({}, 0)).toBe(null);
    expect(parse([], 0)).toBe(null);
    expect(parse('', 0)).toBe(null);
  });
});

describe('testing ' + PIPE_STORE, () => {
  test('simple case', () => {
    const parse = getReducers(PIPE_STORE, mockStore);
    const t1 = parse('pass', 9)[0];

    expect(t1[SCHEMA_INDEX]).toBe(9);
    expect(t1[SCHEMA_STORE]).toBe(mockStore);
    expect(t1[SCHEMA_SLUG]).toBe('pass');
    expect(t1[SCHEMA_FN]).toBe('pass');
    expect(t1[SCHEMA_ARGS]).toEqual([]);
  });

  test('reducers with args', () => {
    const parse = getReducers(PIPE_STORE, mockStore);
    expect(parse('pass:a:b:c', 0)[0][SCHEMA_ARGS]).toEqual(['a', 'b', 'c']);
    expect(parse('pass:a: b :c  d', 0)[0][SCHEMA_ARGS]).toEqual([
      'a',
      'b',
      'c  d',
    ]);
    expect(
      parse(
        `pass:a
        :
        b :c  d`,
        0,
      )[0][SCHEMA_ARGS],
    ).toEqual(['a', 'b', 'c  d']);
  });

  test('multi reducers', () => {
    const parse = getReducers(PIPE_STORE, mockStore);
    expect(parse('pass:a:b:c|fail', 0).length).toEqual(2);
    expect(parse('pass:a:b:c|fail', 0)[0][SCHEMA_FN]).toEqual('pass');
    expect(parse('pass:a:b:c|fail', 0)[1][SCHEMA_FN]).toEqual('fail');
    expect(parse('pass:a:b:c|fail', 0)[0][SCHEMA_ARGS]).toEqual([
      'a',
      'b',
      'c',
    ]);
    expect(parse('pass:a:b:c|fail', 0)[1][SCHEMA_ARGS]).toEqual([]);
  });
});

describe('testing ' + TRIGGER_STORE, () => {
  test('malformed action@event|fn', () => {
    const parse = getReducers(TRIGGER_STORE, mockStore);
    expect(parse('ping', 7)).toBe(null);
    expect(parse('ping@', 7)).toBe(null);
    expect(parse(' ping@  ', 7)).toBe(null);
    expect(parse('ping@click', 7)).toBe(null);
    expect(parse(' @ ', 7)).toBe(null);
    expect(parse('ping@click|', 7)).toBe(null);
  });

  test('simple case', () => {
    const parse = getReducers(TRIGGER_STORE, mockStore);
    const res = parse('ping@click|pass', 7);

    const eventBlock = res[0];
    expect(eventBlock[SCHEMA_ACTION]).toBe('ping');
    expect(eventBlock[SCHEMA_EVENT]).toBe('click');
    expect(eventBlock[SCHEMA_FN]).toBe('ping@click');

    const reducerBlock = res[1];
    expect(reducerBlock[SCHEMA_ACTION]).toBe('ping');
    expect(reducerBlock[SCHEMA_EVENT]).toBe('click');
    expect(reducerBlock[SCHEMA_FN]).toBe('pass');
  });

  test('reducers with args', () => {
    const parse = getReducers(TRIGGER_STORE, mockStore);
    expect(parse('ping@click|pass:a:b:c', 0)[1][SCHEMA_ARGS]).toEqual([
      'a',
      'b',
      'c',
    ]);
    expect(parse('ping@click|pass:a: b :c  d', 0)[1][SCHEMA_ARGS]).toEqual([
      'a',
      'b',
      'c  d',
    ]);
    expect(
      parse(
        `ping@click|pass:a
        :
        b :c  d`,
        0,
      )[1][SCHEMA_ARGS],
    ).toEqual(['a', 'b', 'c  d']);
  });
});
