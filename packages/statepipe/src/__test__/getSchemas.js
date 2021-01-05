import getSchemas, {getBlocks, parseReducers} from '../getSchemas';

import {isObject} from '../../../common/src/index';

import {
  SCHEMA_ARGS,
  SCHEMA_FN,
  SCHEMA_INDEX,
  SCHEMA_EVENT,
  SCHEMA_SLUG,
  SCHEMA_ACTION,
  SCHEMA_STORE,
  PIPE_ATTR,
  PIPE_PROPS,
  PIPE_STORE,
  OUT_STORE,
  TRIGGER_STORE,
} from '../../../common/src/const';

import {statepipeWrapper} from '../../../common/src/test-helpers';

const mockStore = {
  [PIPE_STORE]: {

  },
  [OUT_STORE]: {

  },
  [TRIGGER_STORE]: {

  }
};

describe('test helpers', () => {
  describe('getBlocks',()=>{
    
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
  
  describe("parseReducers",()=>{
    const blob = {
      type:PIPE_STORE,
      node:document
    };
    test('stress args', () => {
      expect(parseReducers(null,mockStore,blob)).toBe(null);
      expect(parseReducers(undefined,mockStore,blob)).toBe(null);
      expect(parseReducers(function () {},mockStore,blob)).toBe(null);
      expect(parseReducers(1,mockStore,blob)).toBe(null);
      expect(parseReducers({},mockStore,blob)).toBe(null);
      expect(parseReducers([],mockStore,blob)).toBe(null);
      expect(parseReducers("",mockStore,blob)).toBe(null);
      expect(parseReducers(" ",mockStore,blob)).toBe(null);
      expect(parseReducers("a",mockStore,blob)).toBe(null);
    });
    test('working case', () => {
      const wrapper = statepipeWrapper(
        `<span name="pipe" ${PIPE_ATTR}="pass:a:b|fail"></span>`,
      );
      const span = wrapper.querySelector('[name=pipe]');
      const result = parseReducers(["pass","fail"],{
        ...blob,
        node:span
      },mockStore);
      
      expect(result[0][SCHEMA_FN]).toBe("pass");
      expect(result[1][SCHEMA_FN]).toBe("fail");
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
    expect(getSchemas({foo:  1})).toBe(null);
    expect(typeof getSchemas({[PIPE_STORE]:  {}})).toBe("function");
    expect(typeof getSchemas({[OUT_STORE]:  {}})).toBe("function");
    expect(typeof getSchemas({[TRIGGER_STORE]:  {}})).toBe("function");
    expect(typeof getSchemas(mockStore)).toBe("function");
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
      expect(result.reducers[0][SCHEMA_FN]).toEqual("pass");
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
      expect(result.reducers[0][SCHEMA_FN]).toEqual("pass1");
      expect(result.reducers[0][SCHEMA_ARGS]).toEqual(["a"]);
      expect(result.reducers[0][SCHEMA_INDEX]).toEqual(0);
      
      expect(result.reducers[1][SCHEMA_FN]).toEqual("pass2");
      expect(result.reducers[1][SCHEMA_ARGS]).toEqual([]);
      expect(result.reducers[1][SCHEMA_INDEX]).toEqual(0);

      expect(result.reducers[2][SCHEMA_FN]).toEqual("fail");
      expect(result.reducers[2][SCHEMA_ARGS]).toEqual(["b"]);
      expect(result.reducers[2][SCHEMA_INDEX]).toEqual(1);
    });
  });
  
});


// test('invalid args', t => {
//   const schema = getSchemas({});

//   t.is(
//     null,
//     schema(function () {}),
//   );

//   t.is(null, schema({}, ''));
//   t.is(null, schema({}, 1));
//   t.is(null, schema({}, {}));
//   t.is(
//     null,
//     schema({}, function () {}),
//   );
//   t.is(null, schema({type: 'foo'}, {}));
//   t.is(null, schema({type: utils.OUT_STORE}, {}));
//   t.is(
//     null,
//     schema(
//       {
//         type: utils.OUT_STORE,
//         components: [],
//       },
//       {},
//     ),
//   );
//   t.is(
//     null,
//     schema(
//       {
//         type: 'invalid-name',
//         node: node({':out': 'text'}),
//       },
//       {},
//     ),
//   );
// });

// test('single reducer', t => {
//   const schema = getSchemas({});

//   let singleReducer = {
//     type: utils.PIPE_STORE,
//     node: node({[utils.PIPE_ATTR]: 'text:a:b'}),
//   };

//   let res = schema(singleReducer);

//   t.is(true, Array.isArray(res.reducers));
//   t.is(1, res.reducers.length);
//   t.is('text', res.reducers[0].fn);
//   t.deepEqual(['a', 'b'], res.reducers[0].args);
//   t.deepEqual(0, res.reducers[0].index);

//   singleReducer = {
//     type: utils.OUT_STORE,
//     node: node({[utils.OUT_ATTR]: 'text:a:b'}),
//   };

//   res = schema(singleReducer);

//   t.is(true, Array.isArray(res.reducers));
//   t.is(1, res.reducers.length);
//   t.is('text', res.reducers[0].fn);
//   t.deepEqual(['a', 'b'], res.reducers[0].args);
//   t.deepEqual(0, res.reducers[0].index);

//   singleReducer = {
//     type: utils.TRIGGER_STORE,
//     node: node({[utils.TRIGGER_ATTR]: 'text:a:b'}),
//   };

//   res = schema(singleReducer);

//   t.is(true, Array.isArray(res.reducers));
//   t.is(0, res.reducers.length);

//   singleReducer = {
//     type: utils.TRIGGER_STORE,
//     node: node({[utils.TRIGGER_ATTR]: 'text:a:b'}),
//   };

//   res = schema(singleReducer);

//   t.is(true, Array.isArray(res.reducers));
//   t.is(0, res.reducers.length);
// });

// test('trigger with action', t => {
//   const schema = getSchemas({});
//   let singleReducer = {
//     type: utils.TRIGGER_STORE,
//     node: node({[utils.TRIGGER_ATTR]: 'ping@click:a:b'}),
//   };

//   let res = schema(singleReducer);

//   t.is(true, Array.isArray(res.reducers));
//   t.is(1, res.reducers.length);
//   t.is('ping', res.reducers[0].action);
//   t.is(0, res.reducers[0].index);
//   t.is('ping@click', res.reducers[0].fn);
//   t.is(2, res.reducers[0].args.length);
//   t.deepEqual(['a', 'b'], res.reducers[0].args);
// });

// test('trigger action must be the first reducer', t => {
//   const schema = getSchemas({});
//   let singleReducer = {
//     type: utils.TRIGGER_STORE,
//     node: node({[utils.TRIGGER_ATTR]: 'foo|ping@click:a:b'}),
//   };
//   let res = schema(singleReducer);
//   t.is(true, Array.isArray(res.reducers));
//   t.is(0, res.reducers.length);
// });

// test('trigger action name and action special chars', t => {
//   const schema = getSchemas({});
//   let singleReducer = {
//     type: utils.TRIGGER_STORE,
//     node: node({[utils.TRIGGER_ATTR]: 'é;ç! ã ó? @click:a:b'}),
//   };

//   let res = schema(singleReducer);

//   t.is(true, Array.isArray(res.reducers));
//   t.is(1, res.reducers.length);
//   t.is('é;ç!ãó?', res.reducers[0].action);
//   t.is(0, res.reducers[0].index);
//   t.is('é;ç!ãó?@click', res.reducers[0].fn);
//   t.is(2, res.reducers[0].args.length);
//   t.deepEqual(['a', 'b'], res.reducers[0].args);
// });

// test('handle multi action', t => {
//   const schema = getSchemas({});
//   let multiaction = {
//     type: utils.TRIGGER_STORE,
//     node: node({[utils.TRIGGER_ATTR]: 'ping@click|pick|set,pong@change|not'}),
//   };

//   let res = schema(multiaction);

//   t.is(true, Array.isArray(res.reducers));
//   t.is(5, res.reducers.length);
//   t.is('ping', res.reducers[0].action);
//   t.is('ping', res.reducers[0].action);
//   t.is('ping', res.reducers[1].action);
//   t.is('ping', res.reducers[2].action);
//   t.is('pong', res.reducers[3].action);
//   t.is('pong', res.reducers[4].action);
// });

// test('multi reducers', t => {
//   let schema = getSchemas({});
//   let multiReducerOut = {
//     type: utils.PIPE_STORE,
//     node: node({
//       [utils.PIPE_ATTR]: 'text:value|pick|not,template:1:2:3|set,render',
//     }),
//   };
//   let res = schema(multiReducerOut);

//   t.is(true, Array.isArray(res.reducers));
//   //assert 1st
//   t.is(6, res.reducers.length);
//   t.is('text', res.reducers[0].fn);
//   t.is(0, res.reducers[0].index);
//   t.deepEqual(['value'], res.reducers[0].args);
//   //
//   t.is('pick', res.reducers[1].fn);
//   t.is(0, res.reducers[1].index);
//   t.is(0, res.reducers[1].args.length);
//   //
//   t.is('not', res.reducers[2].fn);
//   t.is(0, res.reducers[2].index);
//   t.is(0, res.reducers[2].args.length);

//   //assert 2nd
//   t.is('template', res.reducers[3].fn);
//   t.is(1, res.reducers[3].index);
//   t.deepEqual(['1', '2', '3'], res.reducers[3].args);
//   //
//   t.is('set', res.reducers[4].fn);
//   t.is(1, res.reducers[4].index);
//   t.is(0, res.reducers[4].args.length);

//   //assert 3rd
//   t.is('render', res.reducers[5].fn);
//   t.is(0, res.reducers[5].args.length);
//   t.is(2, res.reducers[5].index);

//   schema = getSchemas({});
//   multiReducerOut = {
//     type: utils.OUT_STORE,
//     node: node({
//       [utils.OUT_ATTR]: 'text:value,template:1:2:3',
//     }),
//   };
//   res = schema(multiReducerOut);

//   t.is(true, Array.isArray(res.reducers));
//   //assert 1st
//   t.is(2, res.reducers.length);
//   t.is(0, res.reducers[0].index);
//   t.is('text', res.reducers[0].fn);
//   t.deepEqual(['value'], res.reducers[0].args);
//   //assert 2nd
//   t.is('template', res.reducers[1].fn);
//   t.is(1, res.reducers[1].index);
//   t.deepEqual(['1', '2', '3'], res.reducers[1].args);

//   schema = getSchemas({});
//   multiReducerOut = {
//     type: utils.TRIGGER_STORE,
//     node: node({
//       [utils.TRIGGER_ATTR]: 'ping@click:value,pong@change',
//     }),
//   };
//   res = schema(multiReducerOut);

//   t.is(true, Array.isArray(res.reducers));
//   //assert 1st
//   t.is(2, res.reducers.length);
//   t.is('ping@click', res.reducers[0].fn);
//   t.is(0, res.reducers[0].index);
//   t.deepEqual(['value'], res.reducers[0].args);
//   //assert 2nd
//   t.is('pong@change', res.reducers[1].fn);
// });

// test('reducers arg allow whitespace', t => {
//   let schema = getSchemas({});
//   let multiReducerOut = {
//     type: utils.PIPE_STORE,
//     node: node({
//       [utils.PIPE_ATTR]: 'text: value:value : value ',
//     }),
//   };
//   let res = schema(multiReducerOut);

//   t.is(true, Array.isArray(res.reducers));
//   //assert 1st
//   t.is(1, res.reducers.length);
//   t.is('text', res.reducers[0].fn);
//   t.is(3, res.reducers[0].args.length);

//   t.deepEqual(['value', 'value', 'value'], res.reducers[0].args);
//   multiReducerOut = {
//     type: utils.OUT_STORE,
//     node: node({
//       [utils.OUT_ATTR]: 'text: value:value : value ',
//     }),
//   };
//   res = schema(multiReducerOut);

//   t.is(true, Array.isArray(res.reducers));
//   //assert 1st
//   t.is(1, res.reducers.length);
//   t.is('text', res.reducers[0].fn);
//   t.is(3, res.reducers[0].args.length);
//   t.deepEqual(['value', 'value', 'value'], res.reducers[0].args);

//   multiReducerOut = {
//     type: utils.TRIGGER_STORE,
//     node: node({
//       [utils.TRIGGER_ATTR]: 'foo@click: value:value : value ',
//     }),
//   };
//   res = schema(multiReducerOut);

//   t.is(true, Array.isArray(res.reducers));
//   //assert 1st
//   t.is(1, res.reducers.length);
//   t.is('foo@click', res.reducers[0].fn);
//   t.is(3, res.reducers[0].args.length);
//   t.deepEqual(['value', 'value', 'value'], res.reducers[0].args);
// });

// test('invalid reducers blocks', t => {
//   const schema = getSchemas({});
//   let multiReducerOut = {
//     type: utils.PIPE_STORE,
//     node: node({
//       [utils.PIPE_ATTR]: 'text:value,template: 1:2 :3,,addClass:1:  3:a : : b',
//     }),
//   };
//   let res = schema(multiReducerOut);

//   t.is(true, Array.isArray(res.reducers));
//   t.is(3, res.reducers.length);
//   t.is('text', res.reducers[0].fn);
//   t.is(1, res.reducers[0].args.length);
//   t.is('template', res.reducers[1].fn);
//   t.is(3, res.reducers[1].args.length);
//   t.is('addClass', res.reducers[2].fn);
//   t.is(4, res.reducers[2].args.length);
// });

// test('multiline strings', t => {
//   const schema = getSchemas({});
//   let multiReducerOut = {
//     type: utils.PIPE_STORE,
//     node: node({
//       [utils.PIPE_ATTR]: `text:value,
//       template: 1:2 :3,
//       ,addClass:1:  3:a : : b`,
//     }),
//   };
//   let res = schema(multiReducerOut);

//   t.is(true, Array.isArray(res.reducers));
//   t.is(3, res.reducers.length);
//   t.is('text', res.reducers[0].fn);
//   t.is(1, res.reducers[0].args.length);
//   t.is('template', res.reducers[1].fn);
//   t.is(3, res.reducers[1].args.length);
//   t.is('addClass', res.reducers[2].fn);
//   t.is(4, res.reducers[2].args.length);
// });
