import test from 'ava';
import statepipe from '../index';
import utils from '../utils';
import node from '~/test-utils/mock-node';
import handleMutation from '../handleMutation';
import window from '~/test-utils/mock-window';
import contexts from '~/test-utils/mock-context';

global.MutationObserver = window.MutationObserver;
//global.$statepipeLog = true;

test('unexpected context', t => {
  t.is('function', typeof handleMutation);
  t.is(null, handleMutation());
  t.is(null, handleMutation(1));
  t.is(null, handleMutation({}));
  t.is(
    null,
    handleMutation(function () {}),
  );
});

test('removedNodes with statepipe instance', t => {
  const config = contexts.simple();
  const sp = statepipe(config.wrapper, {});
  const ctx = sp[config.name];

  const mutate = handleMutation(ctx);
  const targetNode = ctx.wrapper;

  const mutation = [
    {
      attributeName: null,
      target: ctx.wrapper,
      addedNodes: [],
      removedNodes: [targetNode],
    },
  ];

  t.plan(4);

  ctx.observer.disconnect = t.pass;
  mutate(mutation);
  t.is(true, sp[config.name].ejected);
  t.is(undefined, sp[config.name].components);
  t.is(undefined, sp[config.name].wrapper);
});

test('removedNodes only components', t => {
  const n1 = contexts.element(utils.TRIGGER_ATTR, 'ping@click|pass');
  const n2 = contexts.element(utils.PIPE_ATTR, 'pass');
  const config = contexts.withChildren([n1, n2]);
  const sp = statepipe(config.wrapper, {});
  const ctx = sp[config.name];

  const mutate = handleMutation(ctx);
  t.is(2, ctx.components.length);

  let mutation = [
    {
      attributeName: null,
      target: ctx.wrapper,
      addedNodes: [],
      removedNodes: [node(), n1, node()],
    },
  ];

  mutate(mutation);
  t.is(1, ctx.components.length);

  mutation = [
    {
      attributeName: null,
      target: ctx.wrapper,
      addedNodes: [],
      removedNodes: [node(), n2, node()],
    },
  ];

  mutate(mutation);
  t.is(0, ctx.components.length);
});

test('removedNodes from different context', t => {
  t.pass();
});

test('addedNodes only components', t => {
  const n1 = contexts.element(utils.TRIGGER_ATTR, 'ping@click|pass');
  const n2 = contexts.element(utils.PIPE_ATTR, 'pass');

  const config = contexts.simple();
  const sp = statepipe(config.wrapper, {});
  const ctx = sp[config.name];

  const mutate = handleMutation(ctx);

  const mutation = [
    {
      attributeName: null,
      target: ctx.wrapper,
      addedNodes: [n1, node(), n2],
      removedNodes: [],
    },
  ];

  t.is(3, ctx.components.length);
  mutate(mutation);
  t.is(5, ctx.components.length);
});

test('addedNodes with new statepipe instance', t => {
  const n1 = contexts.element(utils.TRIGGER_ATTR, 'ping@click|pass');
  const n2 = contexts.element(utils.PIPE_ATTR, 'new');
  const n3 = contexts.element(utils.PIPE_ATTR, 'new');
  const inner = contexts.withChildren(
    [node(), n1, node(), n2],
    'inner-' + Math.random(),
  );
  const innerNode = inner.wrapper.querySelectorAll()[0];

  const config = contexts.simple();
  const sp = statepipe(config.wrapper, {});
  const root = sp[config.name];

  const mutate = handleMutation(root);

  const mutation = [
    {
      attributeName: null,
      target: root.wrapper,
      addedNodes: [innerNode, node(), n3],
      removedNodes: [],
    },
  ];

  mutate(mutation);

  t.is(true, !!sp[inner.name]);
  t.is('object', typeof sp[inner.name]);

  const innerSchema = sp[inner.name];

  t.is(2, innerSchema.components.length);
  t.is(4, root.components.length);

  t.is('new', root.components[3].reducers[0].fn);
});

test(`attributeName: ${utils.ACTION_ATTR}`, t => {
  const config = contexts.simple();
  let ctx;
  const sp = statepipe(config.wrapper, {
    [utils.PIPE_STORE]: {
      set: () => {
        return ({payload}) => {
          t.is(payload.value, 'payload');
          return {pass: true};
        };
      },
    },
  });
  ctx = sp[config.name];

  const mutate = handleMutation(ctx);
  ctx.wrapper.setAttribute(utils.ACTION_ATTR, 'ping');
  ctx.wrapper.setAttribute(
    utils.PAYLOAD_ATTR,
    JSON.stringify({value: 'payload'}),
  );
  ctx.wrapper.setAttribute(utils.STATE_ATTR, JSON.stringify({value: 'pong'}));

  const mutation = [
    {
      attributeName: utils.ACTION_ATTR,
      target: ctx.wrapper,
      addedNodes: [],
      removedNodes: [],
    },
  ];

  mutate(mutation);
  const res = utils.parseJSON(ctx.wrapper);
  t.is(true, res.pass);
});

test(`attributeName: ${utils.STATE_ATTR}`, t => {
  const n1 = contexts.element(
    utils.OUT_ATTR,
    'text:value:foo|pass:foo,mult:b|mult:c',
  );
  n1.setAttribute(utils.STATE_ATTR, JSON.stringify({value: 'text'}));

  const n2 = contexts.element(utils.OUT_ATTR, 'render:template');
  n2.setAttribute(utils.STATE_ATTR, JSON.stringify({value: 'render'}));
  const config = contexts.withChildren([n1, n2]);
  let ctx;
  const sp = statepipe(config.wrapper, {
    [utils.OUT_STORE]: {
      text: (...args) => {
        t.is('value', args[0]);
        t.is('foo', args[1]);
        return ({state, node}) => {
          t.is('text', state.value);
          t.is(n1, node);
          return {value: args[1]};
        };
      },
      pass: val => {
        t.is('foo', val);
        return ({state, node}) => {
          t.is(val, state.value);
          t.is(n1, node);
          return {value: val};
        };
      },
      mult: value => {
        t.is(true, typeof value === 'string');
        t.is(true, !!value.match(/a|b|c/));
        return ({node}) => {
          t.is(n1, node);
          return {multi: value};
        };
      },
      render: arg => {
        t.is(arg, 'template');
        return ({state, node}) => {
          t.is('render', state.value);
          t.is(node, n2);
          return {pass: true};
        };
      },
    },
  });
  ctx = sp[config.name];

  //global.$statepipeLog = true;
  const mutate = handleMutation(ctx);

  mutate([
    {
      attributeName: utils.STATE_ATTR,
      target: n1,
      addedNodes: [],
      removedNodes: [],
    },
  ]);

  mutate([
    {
      attributeName: utils.STATE_ATTR,
      target: n2,
      addedNodes: [],
      removedNodes: [],
    },
  ]);
  t.plan(16);
});
