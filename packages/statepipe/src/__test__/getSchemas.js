import getSchemas, {
  PIPE_PROPS,
   getBlocks, 
   parseReducers, 
   SCHEMA_ACTION,
   SCHEMA_ARGS,
   SCHEMA_EVENT,
   SCHEMA_FN,
   SCHEMA_INDEX,
   SCHEMA_SLUG,
   SCHEMA_STORE,
   getReducers} from '../getSchemas';
import {
  PIPE_ATTR,
  PIPE_STORE,
  isObject,
} from '../../../common/src/index';
import {statepipeWrapper} from '../../../common/src/test-helpers';


const mockStore = {
  [PIPE_STORE]: {
    pass: (...args) => (ctx) => {
      console.log(args)
      return ctx;
    },
    fail: (...args) => () => {
      console.log(args)
      return null;
    }
  }
}

describe('Testing invalid cases', () => {

  test('getSchemas 1s call', () => {
    expect(typeof getSchemas(null)).toBe("function");
    expect(typeof getSchemas(undefined)).toBe("function");
    expect(typeof getSchemas()).toBe("function");
    expect(typeof getSchemas('')).toBe("function");
    expect(typeof getSchemas('a')).toBe("function");
    expect(typeof getSchemas(function () {})).toBe("function");
    expect(typeof getSchemas(1)).toBe("function");
    expect(typeof getSchemas({})).toBe('function');
  });
  
  test('getSchemas 2nd call', () => {
    const fn = getSchemas({});
    expect(fn(null)).toBe(null);
    expect(fn(undefined)).toBe(null);
    expect(fn()).toBe(null);
    expect(fn('')).toBe(null);
    expect(fn('a')).toBe(null);
    expect(fn(function () {})).toBe(null);
    expect(fn(1)).toBe(null);
    expect(fn({})).toBe(null);
    expect(fn([])).toBe(null);
    expect(fn({type:PIPE_STORE,node:{}})).toBe(null);
    expect(fn({type:PIPE_STORE,node:document})).toBe(null);
  }); 
});

describe("helpers",()=>{
  test("getBlocks",()=>{
    expect(getBlocks(null)).toBe(null);
    expect(getBlocks(undefined)).toBe(null);
    expect(getBlocks()).toBe(null);
    expect(getBlocks(function () {})).toBe(null);
    expect(getBlocks(1)).toBe(null);
    expect(getBlocks({})).toBe(null);
    expect(getBlocks([])).toBe(null);
    expect(getBlocks("").length).toBe(0);
    expect(getBlocks('a')).toEqual(['a']);
    expect(getBlocks('')).toEqual([]);
    expect(getBlocks('a,b')).toEqual(['a','b']);
    expect(getBlocks('a,,b')).toEqual(['a','b']);
    expect(getBlocks('a, ,b')).toEqual(['a','b']);
    expect(getBlocks('  a, ,  b')).toEqual(['a','b']);
  });

  test("getReducers",()=>{
    expect(getReducers(null,{})).toBe(null);
    expect(getReducers(undefined,{})).toBe(null);
    expect(getReducers()).toBe(null);
    expect(getReducers(function () {},{})).toBe(null);
    expect(getReducers(1,{})).toBe(null);
    expect(getReducers({},{})).toBe(null);
    expect(getReducers([],{})).toBe(null);
    expect(getReducers("",{})).toBe(null);
    expect(getReducers("pass")).toBe(null);
    expect(getReducers("pass",[])).toBe(null);
    expect(getReducers("pass",Error)).toBe(null);
    expect(getReducers("pass","")).toBe(null);
    expect(getReducers("pass",1)).toBe(null);
    expect(getReducers("pass",true)).toBe(null);
    expect(getReducers("pass",function(){})).toBe(null);

    const parse = getReducers(PIPE_STORE,mockStore);
    expect(parse(null,0)).toBe(null);
    expect(parse(undefined,0)).toBe(null);
    expect(parse()).toBe(null);
    expect(parse(function () {},0)).toBe(null);
    expect(parse(1,0)).toBe(null);
    expect(parse({},0)).toBe(null);
    expect(parse([],0)).toBe(null);
    expect(parse("",0)).toBe(null);

    const t1 = parse("pass",0)[0];

    expect(t1[SCHEMA_INDEX]).toBe(0);
    expect(t1[SCHEMA_STORE]).toBe(mockStore);
    expect(t1[SCHEMA_SLUG]).toBe("pass");
    expect(t1[SCHEMA_FN]).toBe("pass");
    expect(t1[SCHEMA_ARGS]).toEqual([]);

    const t2 = parse("pass:a:b:c",0)[0];
    expect(t2[SCHEMA_ARGS]).toEqual(["a","b","c"]);

    const t3 = parse("pass:a: b :c  d",0)[0];
    expect(t3[SCHEMA_ARGS]).toEqual(["a","b","c  d"]);
  });

  test.skip("parseReducers",()=>{
    expect(parseReducers(null)).toBe(null);
    expect(parseReducers(undefined)).toBe(null);
    expect(parseReducers()).toBe(null);
    expect(parseReducers(function () {})).toBe(null);
    expect(parseReducers(1)).toBe(null);
    expect(parseReducers({})).toBe(null);
    expect(parseReducers([])).toBe(null);
  });  
});


describe(`Testing ${PIPE_ATTR}`, () => {

  test.skip('empty case', () => {
    const parser = getSchemas({});
    const wrapper = statepipeWrapper(
      `<span name="pipe" ${PIPE_ATTR}=""></span>`,
    );
    const item = wrapper.querySelector('[name=pipe]');
    const result = parser({type: PIPE_STORE, node: item});
    expect(result).toBe(null);
  });
  test.skip('simple valid case', () => {
    const parser = parseStore({});
    const wrapper = statepipeWrapper(
      `<span name="pipe1" ${PIPE_ATTR}="pass"></span>`,
    );
    const item = wrapper.querySelector('[name=pipe1]');
    const result = parser({type: PIPE_STORE, node: item});
    expect(isObject(result)).toBe(true);
    expect(Object.keys(result)).toEqual(['type', 'node', 'reducers']);

    result.reducers.forEach(red => {
      PIPE_PROPS.forEach(n => {
        expect(red[n] !== undefined).toBe(true);
      });
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
