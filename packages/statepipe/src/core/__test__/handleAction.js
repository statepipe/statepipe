import handleAction from '../handleAction';
import {STATEPIPE_ATTR, PIPE_STORE, STATE_ATTR} from '../../common/const';

describe('basic tests', () => {
  document.body.setAttribute(STATEPIPE_ATTR, 'sample');
  document.body.setAttribute(STATE_ATTR, JSON.stringify({value: 'pass'}));
  document.body.statepipe = 'sample';

  const validPayload = {value: 1};
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
});

// test.skip('handleAction/ test reducer args and context', t => {
//   const config = contexts.withChildren([
//     contexts.element(utils.PIPE_ATTR, 'pass:a:b:c:d'),
//     contexts.element(utils.TRIGGER_ATTR, 'ping@click|foo'),
//   ]);
//   let ctx;

//   const wrapper = config.wrapper.querySelectorAll()[0];
//   const payload = {value: 'init'};
//   const state = {value: true};
//   const done = {done: true};

//   const sp = statepipe(config.wrapper, {
//     [utils.PIPE_STORE]: {
//       pass: (a, b, c, d) => {
//         t.is(a, 'a');
//         t.is(b, 'b');
//         t.is(c, 'c');
//         t.is(d, 'd');
//         return context => {
//           t.is(wrapper, context.wrapper);
//           t.is(ctx.components[0].node, context.node);
//           t.is(ctx.components[1].node, context.origin);
//           t.deepEqual(state, context.state);
//           t.is('ping', context.action);
//           t.deepEqual(payload, context.payload);
//           return done;
//         };
//       },
//     },
//   });

//   ctx = sp[config.name];
//   const handler = handleAction('ping', payload, ctx.components[1].node);

//   t.plan(11);
//   handler(ctx.components[0]);

//   t.is(
//     JSON.stringify(done),
//     ctx.components[0].node.getAttribute(utils.STATE_ATTR),
//   );
// });

// test.skip('handleAction/ resolve action/state for every block', t => {
//   //global.$statepipeLog = true;
//   const config = contexts.withChildren([
//     contexts.element(utils.PIPE_ATTR, 'passA,fail,passB'),
//   ]);
//   let ctx;

//   const sp = statepipe(config.wrapper, {
//     [utils.PIPE_STORE]: {
//       fail: () => {
//         t.pass();
//         return () => {
//           t.pass();
//           return null;
//         };
//       },
//       passA: () => {
//         t.pass();
//         return ({state, payload}) => {
//           t.is(true, state.value);
//           t.is('init', payload.value);
//           return {value: 'passA'};
//         };
//       },
//       passB: () => {
//         t.pass();
//         return ({state, payload}) => {
//           t.is(true, state.value);
//           t.is('init', payload.value);
//           return {value: 'passB'};
//         };
//       },
//     },
//   });

//   ctx = sp[config.name];

//   const handler = handleAction('ping', {value: 'init'}, ctx.components[0].node);

//   t.plan(9);
//   handler(ctx.components[0]);
//   t.is(
//     JSON.stringify({value: 'passB'}),
//     ctx.components[0].node.getAttribute(utils.STATE_ATTR),
//   );
// });

// test.skip('handleAction/ produce new state', t => {
//   const config = contexts.simple();
//   let ctx;

//   const sp = statepipe(config.wrapper, {
//     [utils.PIPE_STORE]: {
//       set: value => {
//         t.is('value', value);
//         return ({payload, state, action}) => {
//           t.is('ping', action);
//           t.is(true, utils.validateState(payload));
//           t.is(true, utils.validateState(state));
//           t.is('init', payload.value);
//           return {value: value};
//         };
//       },
//     },
//   });
//   ctx = sp[config.name];

//   const handler = handleAction('ping', {value: 'init'}, ctx.components[1].node);

//   t.plan(11);
//   t.is('function', typeof handler);
//   t.is(null, handler());
//   t.is(null, handler({}));
//   t.is(
//     null,
//     handler(function () {}),
//   );
//   t.is(null, handler(null));
//   handler(ctx.components[1]);

//   t.is(
//     JSON.stringify({value: 'value'}),
//     ctx.components[0].node.getAttribute(utils.STATE_ATTR),
//   );
// });

// test.skip('handleAction/ missing store reducer', t => {
//   //global.$statepipeLog = true;
//   const config = contexts.withChildren([
//     contexts.element(utils.PIPE_ATTR, 'set:foo|error|pass:true'),
//   ]);
//   let ctx;

//   const sp = statepipe(config.wrapper, {
//     [utils.PIPE_STORE]: {
//       set: value => {
//         return ({payload, state}) => {
//           t.is('init', payload.value);
//           t.is(true, state.value);
//           t.pass();
//           return {value: value};
//         };
//       },
//       pass: value => {
//         return ({payload, state}) => {
//           t.is('init', payload.value);
//           t.is('foo', state.value);
//           t.pass();
//           return {value: value};
//         };
//       },
//     },
//   });
//   ctx = sp[config.name];

//   t.plan(8);
//   const handler = handleAction('ping', {value: 'init'}, ctx.components[0].node);
//   handler(ctx.components[0]);
//   t.is(2, ctx.components[0].reducers.length);
//   t.is(
//     JSON.stringify({value: 'true'}),
//     ctx.components[0].node.getAttribute(utils.STATE_ATTR),
//   );
// });

// test.skip('handleAction/ malformed state', t => {
//   const config = contexts.simple();

//   const sp = statepipe(config.wrapper, {
//     [utils.PIPE_STORE]: {
//       set: () => {
//         t.fail();
//         return () => {
//           t.fail();
//           return {value: 'none'};
//         };
//       },
//     },
//   });

//   let ctx = sp[config.name];
//   t.plan(3);

//   ctx.components[1].node.setAttribute(utils.STATE_ATTR, '-');
//   let handler = handleAction('ping', {value: 'init'}, ctx.components[1].node);
//   handler(ctx.components[1]);
//   t.is('-', ctx.components[1].node.getAttribute(utils.STATE_ATTR));

//   ctx.components[1].node.setAttribute(utils.STATE_ATTR, null);
//   handler = handleAction('ping', {value: 'init'}, ctx.components[1].node);
//   handler(ctx.components[1]);
//   t.is(null, ctx.components[1].node.getAttribute(utils.STATE_ATTR));

//   ctx.components[1].node.setAttribute(utils.STATE_ATTR, '[]');
//   handler = handleAction('ping', {value: 'init'}, ctx.components[1].node);
//   handler(ctx.components[1]);
//   t.is('[]', ctx.components[1].node.getAttribute(utils.STATE_ATTR));
// });

// test.skip('handleAction/ handle reducer error', t => {
//   const config = contexts.withChildren([
//     contexts.element(utils.PIPE_ATTR, 'set:foo'),
//   ]);
//   let ctx;

//   const sp = statepipe(config.wrapper, {
//     [utils.PIPE_STORE]: {
//       set: value => {
//         return () => {
//           t.pass();
//           throw new Error('handler should catch this');
//           return {value: value};
//         };
//       },
//     },
//   });
//   ctx = sp[config.name];

//   t.plan(2);
//   const handler = handleAction('ping', {value: 'init'}, ctx.components[0].node);
//   handler(ctx.components[0]);
//   t.is(
//     JSON.stringify({value: true}),
//     ctx.components[0].node.getAttribute(utils.STATE_ATTR),
//   );
// });

// test.skip('handleAction/ handle reducer malformed reducer function', t => {
//   const config = contexts.withChildren([
//     contexts.element(utils.PIPE_ATTR, 'pass'),
//   ]);
//   let ctx;

//   const sp = statepipe(config.wrapper, {
//     [utils.PIPE_STORE]: {
//       pass: value => {
//         t.pass();
//         return true;
//       },
//     },
//   });

//   ctx = sp[config.name];

//   const handler = handleAction('ping', {value: 'init'}, ctx.components[0].node);
//   handler(ctx.components[0]);
//   t.plan(2);
//   t.is(
//     JSON.stringify({value: true}),
//     ctx.components[0].node.getAttribute(utils.STATE_ATTR),
//   );
// });

// test.skip('handleAction/ preserve element state btw blocks', t => {
//   const config = contexts.withChildren([
//     contexts.element(utils.PIPE_ATTR, 'rA:a,rB:b'),
//   ]);
//   let ctx;

//   const sp = statepipe(config.wrapper, {
//     [utils.PIPE_STORE]: {
//       rA: value => {
//         t.is('a', value);
//         return ({state, action}) => {
//           t.is('ping', action);
//           t.is(true, state.value);
//           return {value: value};
//         };
//       },
//       rB: value => {
//         t.is('b', value);
//         return ({payload, state}) => {
//           t.is(true, state.value);
//           t.is('init', payload.value);
//           return {value: value};
//         };
//       },
//     },
//   });

//   ctx = sp[config.name];

//   const handler = handleAction('ping', {value: 'init'}, ctx.components[0].node);

//   t.plan(7);
//   handler(ctx.components[0]);
//   t.is(
//     JSON.stringify({value: 'b'}),
//     ctx.components[0].node.getAttribute(utils.STATE_ATTR),
//   );
// });

// test.skip('handleAction/ preserve element state btw reducers', t => {
//   const config = contexts.withChildren([
//     contexts.element(utils.PIPE_ATTR, 'rA:a|rB:b'),
//   ]);
//   let ctx;

//   const sp = statepipe(config.wrapper, {
//     [utils.PIPE_STORE]: {
//       rA: value => {
//         t.is('a', value);
//         return ({state, action}) => {
//           t.is('ping', action);
//           t.is(true, state.value);
//           return {value: value};
//         };
//       },
//       rB: value => {
//         t.is('b', value);
//         return ({payload, state}) => {
//           t.is('a', state.value);
//           t.is('init', payload.value);
//           return {value: value};
//         };
//       },
//     },
//   });

//   ctx = sp[config.name];

//   const handler = handleAction('ping', {value: 'init'}, ctx.components[0].node);

//   t.plan(7);
//   handler(ctx.components[0]);
//   t.is(
//     JSON.stringify({value: 'b'}),
//     ctx.components[0].node.getAttribute(utils.STATE_ATTR),
//   );
// });
