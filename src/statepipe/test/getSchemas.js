import test from "ava"
import getSchemas from "../getSchemas"
import utils from "../utils"
import node from "~/test-utils/mock-node"

test('invalid store', t => {
  t.is("function", typeof getSchemas) 
  t.is(null, getSchemas()) 
  t.is(null, getSchemas(1)) 
  t.is("function", typeof getSchemas({}))
})

test('invalid args', t => {
  const schema = getSchemas({});

  t.is(null, schema(function(){})) 

  t.is(null, schema({},"")) 
  t.is(null, schema({},1)) 
  t.is(null, schema({},{})) 
  t.is(null, schema({},function(){})) 
  t.is(null, schema({type:"foo"},{})) 
  t.is(null, schema({type:utils.OUT_STORE},{})) 
  t.is(null, schema({
    type:utils.OUT_STORE,
    components:[]
  },{})) 
  t.is(null, schema({
    type:"invalid-name",
    node:node({":out":"text"})
  },{})) 
})

test('single reducer', t => {
  const schema = getSchemas({});

  let singleReducer = {
    type:utils.PIPE_STORE,
    node:node({[utils.PIPE_ATTR]:"text:a:b"})
  };
  
  let res = schema(singleReducer)

  t.is(true, Array.isArray(res.reducers))
  t.is(1, res.reducers.length)
  t.is("text", res.reducers[0].fn)
  t.deepEqual(["a","b"], res.reducers[0].args)
  t.deepEqual(0, res.reducers[0].index)


  singleReducer = {
    type:utils.OUT_STORE,
    node:node({[utils.OUT_ATTR]:"text:a:b"})
  };
  
  res = schema(singleReducer)

  t.is(true, Array.isArray(res.reducers))
  t.is(1, res.reducers.length)
  t.is("text", res.reducers[0].fn)
  t.deepEqual(["a","b"], res.reducers[0].args)
  t.deepEqual(0, res.reducers[0].index)

  singleReducer = {
    type:utils.TRIGGER_STORE,
    node:node({[utils.TRIGGER_ATTR]:"text:a:b"})
  };
  
  res = schema(singleReducer)

  t.is(true, Array.isArray(res.reducers))
  t.is(0, res.reducers.length)

  singleReducer = {
    type:utils.TRIGGER_STORE,
    node:node({[utils.TRIGGER_ATTR]:"text:a:b"})
  };
  
  res = schema(singleReducer)

  t.is(true, Array.isArray(res.reducers))
  t.is(0, res.reducers.length)
})

test('trigger with action', t => {
  const schema = getSchemas({});
  let singleReducer = {
    type:utils.TRIGGER_STORE,
    node:node({[utils.TRIGGER_ATTR]:"ping@click:a:b"})
  };

  let res = schema(singleReducer)

  t.is(true, Array.isArray(res.reducers))
  t.is(1, res.reducers.length)
  t.is("ping", res.reducers[0].action)
  t.is(0, res.reducers[0].index)
  t.is("ping@click", res.reducers[0].fn)
  t.is(2, res.reducers[0].args.length)
  t.deepEqual(["a","b"], res.reducers[0].args)
})

test('trigger action must be the first reducer', t => {
  const schema = getSchemas({});
  let singleReducer = {
    type:utils.TRIGGER_STORE,
    node:node({[utils.TRIGGER_ATTR]:"foo|ping@click:a:b"})
  };
  let res = schema(singleReducer)
  t.is(true, Array.isArray(res.reducers))
  t.is(0, res.reducers.length)
})

test('trigger action name and action special chars', t => {
  const schema = getSchemas({});
  let singleReducer = {
    type:utils.TRIGGER_STORE,
    node:node({[utils.TRIGGER_ATTR]:"é;ç! ã ó? @click:a:b"})
  };

  let res = schema(singleReducer)

  t.is(true, Array.isArray(res.reducers))
  t.is(1, res.reducers.length)
  t.is("é;ç!ãó?", res.reducers[0].action)
  t.is(0, res.reducers[0].index)
  t.is("é;ç!ãó?@click", res.reducers[0].fn)
  t.is(2, res.reducers[0].args.length)
  t.deepEqual(["a","b"], res.reducers[0].args)
})

test('handle multi action', t => {
  const schema = getSchemas({});
  let multiaction = {
    type:utils.TRIGGER_STORE,
    node:node({[utils.TRIGGER_ATTR]:"ping@click|pick|set,pong@change|not"})
  };

  let res = schema(multiaction)

  t.is(true, Array.isArray(res.reducers))
  t.is(5, res.reducers.length)
  t.is("ping", res.reducers[0].action)
  t.is("ping", res.reducers[0].action)
  t.is("ping", res.reducers[1].action)
  t.is("ping", res.reducers[2].action)
  t.is("pong", res.reducers[3].action)
  t.is("pong", res.reducers[4].action)
})

test('multi reducers', t => {
  let schema = getSchemas({});
  let multiReducerOut = {
    type:utils.PIPE_STORE,
    node:node({
      [utils.PIPE_ATTR]:"text:value|pick|not,template:1:2:3|set,render",
    })
  };
  let res = schema(multiReducerOut)
  
  t.is(true, Array.isArray(res.reducers))
  //assert 1st
  t.is(6, res.reducers.length)
  t.is("text", res.reducers[0].fn)
  t.is(0, res.reducers[0].index)
  t.deepEqual(["value"], res.reducers[0].args)
  //
  t.is("pick", res.reducers[1].fn)
  t.is(0, res.reducers[1].index)
  t.is(0, res.reducers[1].args.length)
  //
  t.is("not", res.reducers[2].fn)
  t.is(0, res.reducers[2].index)
  t.is(0, res.reducers[2].args.length)
  
  //assert 2nd
  t.is("template", res.reducers[3].fn)
  t.is(1, res.reducers[3].index)
  t.deepEqual(["1","2","3"], res.reducers[3].args)
  //
  t.is("set", res.reducers[4].fn)
  t.is(1, res.reducers[4].index)
  t.is(0, res.reducers[4].args.length)
  
  //assert 3rd
  t.is("render", res.reducers[5].fn)
  t.is(0, res.reducers[5].args.length)
  t.is(2, res.reducers[5].index)

  schema = getSchemas({});
  multiReducerOut = {
    type:utils.OUT_STORE,
    node:node({
      [utils.OUT_ATTR]:"text:value,template:1:2:3",
    })
  };
  res = schema(multiReducerOut)
  
  t.is(true, Array.isArray(res.reducers))
  //assert 1st
  t.is(2, res.reducers.length)
  t.is(0, res.reducers[0].index)
  t.is("text", res.reducers[0].fn)
  t.deepEqual(["value"], res.reducers[0].args)
  //assert 2nd
  t.is("template", res.reducers[1].fn)
  t.is(1, res.reducers[1].index)
  t.deepEqual(["1","2","3"], res.reducers[1].args)

  schema = getSchemas({});
  multiReducerOut = {
    type:utils.TRIGGER_STORE,
    node:node({
      [utils.TRIGGER_ATTR]:"ping@click:value,pong@change",
    })
  };
  res = schema(multiReducerOut)
  
  t.is(true, Array.isArray(res.reducers))
  //assert 1st
  t.is(2, res.reducers.length)
  t.is("ping@click", res.reducers[0].fn)
  t.is(0, res.reducers[0].index)
  t.deepEqual(["value"], res.reducers[0].args)
  //assert 2nd
  t.is("pong@change", res.reducers[1].fn)
})

test('reducers arg allow whitespace', t => {
  let schema = getSchemas({});
  let multiReducerOut = {
    type:utils.PIPE_STORE,
    node:node({
      [utils.PIPE_ATTR]:"text: value:value : value ",
    })
  };
  let res = schema(multiReducerOut)
  
  t.is(true, Array.isArray(res.reducers))
  //assert 1st
  t.is(1, res.reducers.length)
  t.is("text", res.reducers[0].fn)
  t.is(3, res.reducers[0].args.length)

  t.deepEqual(["value","value", "value"], res.reducers[0].args)
  multiReducerOut = {
    type:utils.OUT_STORE,
    node:node({
      [utils.OUT_ATTR]:"text: value:value : value ",
    })
  };
  res = schema(multiReducerOut)
  
  t.is(true, Array.isArray(res.reducers))
  //assert 1st
  t.is(1, res.reducers.length)
  t.is("text", res.reducers[0].fn)
  t.is(3, res.reducers[0].args.length)
  t.deepEqual(["value","value", "value"], res.reducers[0].args)

  multiReducerOut = {
    type:utils.TRIGGER_STORE,
    node:node({
      [utils.TRIGGER_ATTR]:"foo@click: value:value : value ",
    })
  };
  res = schema(multiReducerOut)
  
  t.is(true, Array.isArray(res.reducers))
  //assert 1st
  t.is(1, res.reducers.length)
  t.is("foo@click", res.reducers[0].fn)
  t.is(3, res.reducers[0].args.length)
  t.deepEqual(["value","value", "value"], res.reducers[0].args)
})

test('invalid reducers blocks', t => {
  const schema = getSchemas({});
  let multiReducerOut = {
    type:utils.PIPE_STORE,
    node:node({
      [utils.PIPE_ATTR]:"text:value,template: 1:2 :3,,addClass:1:  3:a : : b",
    })
  };
  let res = schema(multiReducerOut)
  
  t.is(true, Array.isArray(res.reducers))
  t.is(3, res.reducers.length)
  t.is("text", res.reducers[0].fn)
  t.is(1, res.reducers[0].args.length)
  t.is("template", res.reducers[1].fn)
  t.is(3, res.reducers[1].args.length)
  t.is("addClass", res.reducers[2].fn)
  t.is(4, res.reducers[2].args.length)
})

test('multiline strings', t => {
  const schema = getSchemas({});
  let multiReducerOut = {
    type:utils.PIPE_STORE,
    node:node({
      [utils.PIPE_ATTR]:`text:value,
      template: 1:2 :3,  
      ,addClass:1:  3:a : : b`,
    })
  };
  let res = schema(multiReducerOut)
  
  t.is(true, Array.isArray(res.reducers))
  t.is(3, res.reducers.length)
  t.is("text", res.reducers[0].fn)
  t.is(1, res.reducers[0].args.length)
  t.is("template", res.reducers[1].fn)
  t.is(3, res.reducers[1].args.length)
  t.is("addClass", res.reducers[2].fn)
  t.is(4, res.reducers[2].args.length)
})

