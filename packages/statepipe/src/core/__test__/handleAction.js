import handleAction, {CTX_PROPS} from '../handleAction';
import {
  STATEPIPE_ATTR,
  PIPE_STORE,
  STATE_ATTR,
  OUT_STORE,
  TRIGGER_STORE,
  PIPE_ATTR,
} from '../../common/const';

import {statepipeWrapper} from '../../common/test-helpers';
import {queryComponents} from '../../common';
import getSchema from '../getSchemas';

const mockStore = {
  [PIPE_STORE]: {},
  [OUT_STORE]: {},
  [TRIGGER_STORE]: {},
};

describe('basic tests', () => {
  document.body.setAttribute(STATEPIPE_ATTR, 'sample');
  document.body.setAttribute(STATE_ATTR, JSON.stringify({value: 'pass'}));
  document.body.statepipe = 'sample';

  const validPayload = {value: 7};
  const validAction = 'ping';
  const validOrigin = document.body;

  test('stress args 1st fase', () => {
    expect(null).toBe(handleAction());
    expect(null).toBe(handleAction(validAction, [], validOrigin));
    expect(null).toBe(handleAction(validAction, null, validOrigin));
    expect(null).toBe(handleAction(validAction, '', validOrigin));
    expect(null).toBe(handleAction(validAction, 'a', validOrigin));
    expect(null).toBe(handleAction(validAction, 1, validOrigin));
    expect(null).toBe(handleAction(validAction, true, validOrigin));
    expect(null).toBe(handleAction(validAction, function () {}, validOrigin));

    expect(null).toBe(handleAction(validAction, validPayload, []));
    expect(null).toBe(handleAction(validAction, validPayload, null));
    expect(null).toBe(handleAction(validAction, validPayload, ''));
    expect(null).toBe(handleAction(validAction, validPayload, 'a'));
    expect(null).toBe(handleAction(validAction, validPayload, 1));
    expect(null).toBe(handleAction(validAction, validPayload, true));
    expect(null).toBe(handleAction(validAction, validPayload, function () {}));

    expect(null).toBe(handleAction([], validPayload, validOrigin));
    expect(null).toBe(handleAction(null, validPayload, validOrigin));
    expect(null).toBe(handleAction('', validPayload, validOrigin));
    expect(null).toBe(handleAction(1, validPayload, validOrigin));
    expect(null).toBe(handleAction(true, validPayload, validOrigin));
    expect(null).toBe(handleAction(function () {}, validPayload, validOrigin));
  });

  test('stress args 2nd fase', () => {
    const fn = handleAction(validAction, validPayload, validOrigin);
    expect(null).toBe(fn([]));
    expect(null).toBe(fn(null));
    expect(null).toBe(fn(''));
    expect(null).toBe(fn('a'));
    expect(null).toBe(fn(1));
    expect(null).toBe(fn(true));
    expect(null).toBe(fn(function () {}));
    expect(null).toBe(fn({}));
    expect(null).toBe(fn(document.body));

    //missing state
    const span = document.createElement('span');
    span.setAttribute(STATE_ATTR, 'sp1');
    document.body.appendChild(span);

    expect(null).toBe(fn({node: 0, type: PIPE_STORE}));
    expect(null).toBe(fn({node: true, type: PIPE_STORE}));
    expect(null).toBe(fn({node: '', type: PIPE_STORE}));
    expect(null).toBe(fn({node: ' a', type: PIPE_STORE}));
    expect(null).toBe(fn({node: {}, type: PIPE_STORE}));
    expect(null).toBe(fn({node: function () {}, type: PIPE_STORE}));
    expect(null).toBe(fn({node: [], type: PIPE_STORE}));
    expect(null).toBe(fn({node: span, type: PIPE_STORE}));
    expect(null).toBe(fn({node: validOrigin, type: 0}));
    expect(null).toBe(fn({node: validOrigin, type: true}));
    expect(null).toBe(fn({node: validOrigin, type: ''}));
    expect(null).toBe(fn({node: validOrigin, type: ' a'}));
    expect(null).toBe(fn({node: validOrigin, type: function () {}}));
    expect(null).toBe(fn({node: validOrigin, type: []}));
    expect(null).toBe(fn({node: span, type: PIPE_STORE}));
    expect('object').toBe(
      typeof fn({
        node: validOrigin,
        type: PIPE_STORE,
      }),
    );
  });
  
  test('expected case', () => {
    const state = {value: 3};
    const span = document.createElement('span');

    span.setAttribute(STATE_ATTR, JSON.stringify(state));
    span.setAttribute(PIPE_ATTR, 'pass');

    mockStore[PIPE_STORE] = {
      pass: () => {
        return ctx => {
          expect(ctx.state).toEqual(state);
          expect(ctx.payload).toEqual(validPayload);
          CTX_PROPS.map(prop => {
            expect(ctx[prop]).not.toBe(undefined);
          })
          return {
            value: ctx.state.value + ctx.payload.value,
          };
        };
      },
    };

    const wrapper = statepipeWrapper(span);
    const list = queryComponents(wrapper, wrapper.getAttribute(':statepipe'));
    const fn = handleAction('ping', validPayload, span);
    const schema = getSchema(mockStore)(list[0]);

    expect(typeof fn(schema)).toBe('object');
    expect(JSON.parse(span.getAttribute(STATE_ATTR)).value).toBe(10);
  });

  test('pipe args', () => {
    const state = {value: 3};
    const span = document.createElement('span');

    span.setAttribute(STATE_ATTR, JSON.stringify(state));
    span.setAttribute(PIPE_ATTR, 'pass:a:b:c');

    mockStore[PIPE_STORE] = {
      pass: (a, b, c) => {
        expect(a).toEqual('a');
        expect(b).toEqual('b');
        expect(c).toEqual('c');
        return () => {
          return {value: 'abc'};
        };
      },
    };

    const wrapper = statepipeWrapper(span);
    const list = queryComponents(wrapper, wrapper.getAttribute(':statepipe'));
    const fn = handleAction('ping', validPayload, span);
    const schema = getSchema(mockStore)(list[0]);
    fn(schema);
    expect(JSON.parse(span.getAttribute(STATE_ATTR)).value).toBe('abc');
  });

  test('multi pipes', () => {
    const state = {value: 3};
    const span = document.createElement('span');

    span.setAttribute(STATE_ATTR, JSON.stringify(state));
    span.setAttribute(PIPE_ATTR, 'multi:2|foo|neg');

    mockStore[PIPE_STORE] = {
      multi: to => {
        return ctx => {
          return {value: ctx.payload.value * parseInt(to)};
        };
      },
      neg: () => {
        return ctx => {
          return {value: ctx.payload.value * -1};
        };
      },
    };

    const wrapper = statepipeWrapper(span);
    const list = queryComponents(wrapper, wrapper.getAttribute(':statepipe'));
    const fn = handleAction('ping', validPayload, span);
    const schema = getSchema(mockStore)(list[0]);
    fn(schema);
    expect(JSON.parse(span.getAttribute(STATE_ATTR)).value).toBe(-7);
  });

  test('stop the pipe', () => {
    const state = {value: 3};
    const span = document.createElement('span');

    span.setAttribute(STATE_ATTR, JSON.stringify(state));
    span.setAttribute(PIPE_ATTR, 'multi:2|stop|mult:5');

    mockStore[PIPE_STORE] = {
      multi: to => {
        expect(to).toEqual('2');
        return ctx => {
          return {value: ctx.payload.value * parseInt(to)};
        };
      },
      stop: () => {
        return () => {
          return null;
        };
      },
    };

    const wrapper = statepipeWrapper(span);
    const list = queryComponents(wrapper, wrapper.getAttribute(':statepipe'));
    const fn = handleAction('ping', validPayload, span);
    const schema = getSchema(mockStore)(list[0]);
    fn(schema);
    expect(JSON.parse(span.getAttribute(STATE_ATTR)).value).toBe(3);
  });

  test('handling reducer error', () => {
    const state = {value: 3};
    const span = document.createElement('span');

    span.setAttribute(STATE_ATTR, JSON.stringify(state));
    span.setAttribute(PIPE_ATTR, 'multi:2|stop|mult:5');

    mockStore[PIPE_STORE] = {
      multi: () => {
        return () => {
          throw new Error("shall not pass");
        };
      },
      stop: () => {
        //should not be called
        expect(true).toBe(false);
        return () => {
          return null;
        };
      },
    };

    const wrapper = statepipeWrapper(span);
    const list = queryComponents(wrapper, wrapper.getAttribute(':statepipe'));
    const fn = handleAction('ping', validPayload, span);
    const schema = getSchema(mockStore)(list[0]);
    fn(schema);
    expect(JSON.parse(span.getAttribute(STATE_ATTR)).value).toBe(3);
  });
  
  test('multi blocks', () => {
    const state = {value: 3};
    const span = document.createElement('span');

    span.setAttribute(STATE_ATTR, JSON.stringify(state));
    span.setAttribute(PIPE_ATTR, 'multi:2|neg,loren');

    mockStore[PIPE_STORE] = {
      multi: (to) => {
        return (ctx) => {
          return {value: ctx.payload.value * parseInt(to)};
        };
      },
      neg: () => {
        return (ctx) => {
          return {value: ctx.payload.value * -1};
        };
      },
      loren: () => {
        return (ctx) => {
          return {
            ...ctx.state,
            loren: ctx.payload.loren.toUpperCase()
          };
        };
      }
    };

    const wrapper = statepipeWrapper(span);
    const list = queryComponents(wrapper, wrapper.getAttribute(':statepipe'));
    const fn = handleAction('ping', {value:7,loren:"loren"}, span);
    const schema = getSchema(mockStore)(list[0]);
    fn(schema);
    expect(JSON.parse(span.getAttribute(STATE_ATTR)).value).toBe(3);
    expect(JSON.parse(span.getAttribute(STATE_ATTR)).loren).toBe("LOREN");
  });
});