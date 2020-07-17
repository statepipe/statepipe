import test from "ava"
import getSchemas from "../getSchemas"
import initTrigger from "../initTrigger"
import utils from "../utils"
import node from "~/test-utils/mock-node"
import window from "~/test-utils/mock-window"

global.window = window;
global.document = node()
global.document.documentElement = node();
global.document.body = node();

test('check args', t => {
    t.is("function", typeof initTrigger)
    t.is(undefined,initTrigger())
    t.deepEqual({},initTrigger({}))
    t.deepEqual({type:"no-trigger"},initTrigger({type:"no-trigger"}))
})

test('ignore reducers without action', t => {
    const schema = getSchemas({});
    
    const simpleTrigger = {
        type: utils.TRIGGER_STORE,
        node: node({ ":trigger": "foo@click:a:b" })
    };
    const trigger = schema(simpleTrigger)
    initTrigger(trigger)
    t.is(0, trigger.reducers.length) 
})

test('simple case', t => {
    const schema = getSchemas({});
    
    const simpleTrigger = {
        type: utils.TRIGGER_STORE,
        node: node({ ":trigger": "foo@click:a:b|pick:a:b" })
    };
    const trigger = schema(simpleTrigger)
    initTrigger(trigger)
    t.is(1, trigger.reducers.length);
    t.is("foo", trigger.reducers[0].action);
    t.is("pick", trigger.reducers[0].fn);
    t.deepEqual(["a","b"], trigger.reducers[0].args);
})

test('window case', t => {
  const schema = getSchemas({});
  
  const simpleTrigger = {
      type: utils.TRIGGER_STORE,
      node: node({ ":trigger": "foo@window.load|pick:a:b" })
  };
  const trigger = schema(simpleTrigger)
  t.plan(4)
  global.window.addEventListener = v => t.is(v,"load");
  initTrigger(trigger)
  t.is(1, trigger.reducers.length);
  t.is("foo", trigger.reducers[0].action);
  t.is("pick", trigger.reducers[0].fn);
  global.window.addEventListener = {}.addEventListener
})

test('document case', t => {
  const schema = getSchemas({});
  
  const simpleTrigger = {
      type: utils.TRIGGER_STORE,
      node: node({ ":trigger": "foo@document.load|pick:a:b" })
  };
  const trigger = schema(simpleTrigger)
  t.plan(4)
  global.document.addEventListener = v => t.is(v,"load");
  initTrigger(trigger)
  t.is(1, trigger.reducers.length);
  t.is("foo", trigger.reducers[0].action);
  t.is("pick", trigger.reducers[0].fn);
  global.document.addEventListener = {}.addEventListener
})

test('documentElement case', t => {
  const schema = getSchemas({});
  
  const simpleTrigger = {
      type: utils.TRIGGER_STORE,
      node: node({ ":trigger": "foo@documentElement.load|pick:a:b" })
  };
  const trigger = schema(simpleTrigger)
  t.plan(4)
  global.document.documentElement.addEventListener = v => t.is(v,"load");
  initTrigger(trigger)
  t.is(1, trigger.reducers.length);
  t.is("foo", trigger.reducers[0].action);
  t.is("pick", trigger.reducers[0].fn);
  global.document.documentElement.addEventListener = {}.addEventListener
})

test('document body case', t => {
  const schema = getSchemas({});
  
  const simpleTrigger = {
      type: utils.TRIGGER_STORE,
      node: node({ ":trigger": "foo@body.load|pick:a:b" })
  };
  const trigger = schema(simpleTrigger)
  t.plan(4)
  global.document.body.addEventListener = v => t.is(v,"load");
  initTrigger(trigger)
  t.is(1, trigger.reducers.length);
  t.is("foo", trigger.reducers[0].action);
  t.is("pick", trigger.reducers[0].fn);
  global.document.body.addEventListener = {}.addEventListener
})


test('multi triggers', t => {
    const schema = getSchemas({});
    const multTrigger = {
        type: utils.TRIGGER_STORE,
        node: node({ ":trigger": "ping@click|pick:val,add@change:v|pass:foo:bar,,ping,@change:a" })
    };
    const mTrigger = schema(multTrigger)
    initTrigger(mTrigger)

    t.is(2, mTrigger.reducers.length) 
    t.is("pick", mTrigger.reducers[0].fn)
    t.deepEqual(["val"], mTrigger.reducers[0].args)
    t.is("pass", mTrigger.reducers[1].fn)
    t.deepEqual(["foo","bar"], mTrigger.reducers[1].args)
})
