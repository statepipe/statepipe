import {
  STATEPIPE_ATTR,
  STATE_ATTR,
  TRIGGER_ATTR,
  TRIGGER_STORE,
} from '../../common/const';
import initTrigger, {parseTarget} from '../initTrigger';
import getSchemas from '../getSchemas';
import jest from 'jest-mock';

describe('basic tests', () => {
  document.body.setAttribute(STATEPIPE_ATTR, 'initTrigger');
  document.body.setAttribute(STATE_ATTR, JSON.stringify({value: 'pass'}));
  document.body.statepipe = 'sample';

  //const validPayload = {value: 7};
  //const validAction = 'ping';
  const validStore = {
    [TRIGGER_STORE]: {
      pass: () => {
        return () => {
          return true;
        };
      },
    },
  };
  const validState = {value: 7};
  const parseTrigger = getSchemas(validStore);

  const validNode = document.createElement('span');
  validNode.setAttribute(TRIGGER_ATTR, 'ping@foo|pass');
  validNode.setAttribute(STATE_ATTR, JSON.stringify(validState));
  document.body.appendChild(validNode);
  const validObject = {
    type: TRIGGER_STORE,
    node: validNode,
    wrapper: 'test',
    reducers: parseTrigger({
      type: TRIGGER_STORE,
      node: validNode,
    }).reducers,
  };

  test('stress args', () => {
    expect(null).toEqual(initTrigger());
    expect(null).toEqual(initTrigger([]));
    expect(null).toEqual(initTrigger(null));
    expect(null).toEqual(initTrigger(''));
    expect(null).toEqual(initTrigger('a'));
    expect(null).toEqual(initTrigger(1));
    expect(null).toEqual(initTrigger(true));
    expect(null).toEqual(initTrigger({}));
  });

  test('expected case', () => {
    const fn = jest.fn();
    validObject.node.addEventListener = fn;
    expect(validObject).toEqual(initTrigger(validObject));
    expect(fn).toHaveBeenCalled();
  });

  test('multi trigger', () => {
    const span = document.createElement('span');
    span.setAttribute(TRIGGER_ATTR, 'ping@foo|pass,pong@bar|pass');
    span.setAttribute(STATE_ATTR, JSON.stringify(validState));
    document.body.appendChild(span);
    const blob = {
      ...validObject,
      node: span,
      reducers: parseTrigger({
        type: TRIGGER_STORE,
        node: span,
      }).reducers,
    };
    const fn = jest.fn();
    blob.node.addEventListener = fn;
    expect(blob).toEqual(initTrigger(blob));
    expect(fn).toHaveBeenCalledTimes(2);
  });

  test('multi trigger + wild cards', () => {
    const span = document.createElement('span');
    span.setAttribute(TRIGGER_ATTR, 'ping@foo|pass,pong@bar|pass');
    span.setAttribute(STATE_ATTR, JSON.stringify(validState));
    document.body.appendChild(span);
    const blob = {
      ...validObject,
      node: span,
      reducers: parseTrigger({
        type: TRIGGER_STORE,
        node: span,
      }).reducers,
    };
    expect(blob).toEqual(initTrigger(blob));
    validObject.node.addEventListener = name => {
      expect(name).toMatch(/foo|bar/);
    };
  });

  describe('parseTarget', () => {
    test('stress parseTarget', () => {
      expect(null).toEqual(parseTarget());
      expect(null).toEqual(parseTarget([], document.body));
      expect(null).toEqual(parseTarget(null, document.body));
      expect(null).toEqual(parseTarget('', document.body));
      expect(null).toEqual(parseTarget(1, document.body));
      expect(null).toEqual(parseTarget(true, document.body));
      expect(null).toEqual(parseTarget({}, document.body));
    });

    test('default node case', () => {
      const a = {
        target: document.body,
        event: 'click',
      };
      const result = parseTarget('click', document.body);
      expect(a.event).toBe(result.event);
    });

    test('document case', () => {
      const result = parseTarget('document.click', document);
      expect('click').toBe(result.event);
      expect(document).toBe(result.target);
    });

    test('documentElement case', () => {
      const result = parseTarget(
        'documentElement.click',
        document.documentElement,
      );
      expect('click').toBe(result.event);
      expect(document.documentElement).toEqual(result.target);
    });

    test('window case', () => {
      const result = parseTarget('window.click', window);
      expect('click').toBe(result.event);
      expect(window).toEqual(result.target);
    });

    test('body case', () => {
      const result = parseTarget('body.click', document.body);
      expect('click').toBe(result.event);
      expect(document.body).toEqual(result.target);
    });
  });
});
