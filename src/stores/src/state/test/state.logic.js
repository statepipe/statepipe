import test from "ava"
import reducers from "../logic"
import node from "~/test-utils/mock-node";

Object
  .keys(reducers)
  .forEach(fn => {
    test.skip(`logic testUnexpectedParams ${fn}` , t => {
      const rdcr = reducers[fn];
      t.is("function", typeof rdcr());
      t.is("function", typeof rdcr("value"));
      t.is("function", typeof rdcr(null));
      t.is("function", typeof rdcr(1));
      t.is("function", typeof rdcr(function(){}));

      t.falsy(rdcr()(null))
      t.falsy(rdcr()(undefined))
      t.falsy(rdcr()("1"))
      t.falsy(rdcr()(true))
      t.falsy(rdcr()(function(){}))
      t.falsy(rdcr()({}))
    })
  })


global.document = node();
global.document.body = node();

test('pipe/ unexpectd args', t=> {
  Object
    .keys(reducers)
    .forEach(fn => {
      t.falsy(reducers[fn]()())
      t.falsy(reducers[fn]()({}))
      t.falsy(reducers[fn]()({value:1}))
    })
})

test('gt' , t => {
  t.deepEqual({value:1}, reducers.gt()({value:10},{value:1}))
  t.deepEqual({b:1}, reducers.gt("a","b")({a:10},{b:1}))
  t.deepEqual({c:{d:1}}, reducers.gt("a.b","c.d")({a:{b:10}},{c:{d:1}}))
})

test('gte' , t => {
  t.deepEqual(null, reducers.gte("a.b","c.d")({a:{b:10}},{c:{d:101}}))
  t.deepEqual({c:{d:10}}, reducers.gte("a.b","c.d")({a:{b:10}},{c:{d:10}}))
})

test('lt' , t => {
  t.is(null, reducers.lt("a.b","c.d")({a:{b:10}},{c:{d:1}}))
  t.deepEqual({c:{d:1}}, reducers.lt("a.b","c.d")({a:{b:-10}},{c:{d:1}}))
})

test('lte' , t => {
  t.is(null, reducers.lte("a.b","c.d")({a:{b:10}},{c:{d:1}}))
  t.deepEqual({c:{d:1}}, reducers.lte("a.b","c.d")({a:{b:-10}},{c:{d:1}}))
})

test('includes' , t => {
  t.deepEqual({c:{d:"abc"}}, reducers.includes("a.b","c.d")({a:{b:"a"}},{c:{d:"abc"}}))
  t.deepEqual({c:{d:[10,1,2,3]}}, reducers.includes("a.b","c.d")({a:{b:10}},{c:{d:[10,1,2,3]}}))
})

test('notIncludes' , t => {
  t.is(null, reducers.notIncludes("a.b","c.d")({a:{b:"a"}},{c:{d:"abc"}}))
  t.is(null, reducers.notIncludes("a.b","c.d")({a:{b:10}},{c:{d:[10,1,2,3]}}))
  t.deepEqual({c:{d:"a"}}, reducers.notIncludes("a.b","c.d")({a:{b:10}},{c:{d:"a"}}))
})

test('equals' , t => {
  t.is(null, reducers.equals("a.b","c.d")({a:{b:10}},{c:{d:1}}))
  t.deepEqual({c:{d:10}}, reducers.equals("a.b","c.d")({a:{b:10}},{c:{d:10}}))
})

test('notEquals' , t => {
  t.is(null, reducers.notEquals("a.b","c.d")({a:{b:10}},{c:{d:10}}))
  t.deepEqual({c:{d:10}}, reducers.notEquals("a.b","c.d")({a:{b:1}},{c:{d:10}}))
})

test('truthy' , t => {
  const a = {a:2,value:1,c:{f:true},d:"0",e:false}
  const state = {a:{b:2},value:3,c:2,d:0,e:"2",f:{g:false}}
  t.deepEqual(state, reducers.truthy()(a,state))
  t.deepEqual(null, reducers.truthy("e")(a,state))
  t.deepEqual(null, reducers.truthy("d")(a,state))
  t.deepEqual(state, reducers.truthy("c.f")(a,state))
})

test('falsy' , t => {
  const a = {a:2,value:1,c:{f:true},d:"0",e:false}
  const state = {a:{b:2},value:3,c:2,d:0,e:"2",f:{g:false}}
  t.deepEqual(null, reducers.falsy()(a,state))
  t.deepEqual(state, reducers.falsy("e")(a,state))
  t.deepEqual(state, reducers.falsy("d")(a,state))
  t.deepEqual(null, reducers.falsy("c.f")(a,state))
})

test('odd' , t => {
  const st = {v:true}
  t.deepEqual(st, reducers.odd()({value:1},st))
  t.deepEqual(st, reducers.odd("a.b")({a:{b:1}},st))
  t.deepEqual(null, reducers.odd()({value:0},st))
})

test('even' , t => {
  const st = {v:true}
  t.deepEqual(st, reducers.even()({value:2},st))
  t.deepEqual(st, reducers.even("a.b")({a:{b:2}},st))
  t.deepEqual(null, reducers.even("a.b")({a:{b:1}},st))
})

test('positive' , t => {
  const st = {v:true}
  t.deepEqual(st, reducers.positive()({value:0},st))
  t.deepEqual(st, reducers.positive("a.b")({a:{b:1}},st))
  t.deepEqual(null, reducers.positive("a.b")({a:{b:-1}},st))
})

test('negative' , t => {
  const st = {v:true}
  t.deepEqual(st, reducers.negative()({value:-1},st))
  t.deepEqual(st, reducers.negative("a.b")({a:{b:-1}},st))
  t.deepEqual(null, reducers.negative("a.b")({a:{b:0}},st))
})

test('from/action' , t => {
  const state = {v:true}
  const payload = {error:true}
  const action = "ping"
  const self  = node();
  const origin = node();
  t.deepEqual(state, reducers.from()(payload,state,action,self,origin))
  t.deepEqual(state, reducers.from(action)(payload,state,action,self,origin))
  t.deepEqual(state, reducers.from("*")(payload,state,action,self,origin))
  t.deepEqual(null, reducers.from("pong")(payload,state,action,self,origin))
})

test('from/node' , t => {
  const state = {v:true}
  const payload = {error:true}
  const action = "ping"
  const self  = node();
  const origin = node();
  t.deepEqual(state, reducers.from("*","$self")(payload,state,action,self,self))
  t.deepEqual(null, reducers.from("*","$self")(payload,state,action,self,origin))
  t.deepEqual(null, reducers.from("*","$others")(payload,state,action,self,self))
  t.deepEqual(state, reducers.from("*","$others")(payload,state,action,self,origin))
  t.deepEqual(state, reducers.from("*","*")(payload,state,action,self,origin))
  global.document.body.setQueryResult([origin])
  t.deepEqual(state, reducers.from("*","button.-red")(payload,state,action,self,origin))
  global.document.body.setQueryResult([])
  t.deepEqual(null, reducers.from("*","button.-red")(payload,state,action,self,origin))
})

test('from/ctx' , t => {
  const state = {v:true}
  const payload = {error:true}
  const action = "ping"
  const self  = node();
  self.statepipe = "foo"
  const origin = node();
  
  origin.statepipe = "foo"
  t.deepEqual(state, reducers.from("*","*","$self")(payload,state,action,self,origin))
  origin.statepipe = "bar"
  t.deepEqual(null, reducers.from("*","*","$self")(payload,state,action,self,origin))

  t.deepEqual(state, reducers.from("*","*","$others")(payload,state,action,self,origin))
  origin.statepipe = "foo"
  t.deepEqual(null, reducers.from("*","*","$others")(payload,state,action,self,origin))

  t.deepEqual(null, reducers.from("*","*","loren")(payload,state,action,self,origin))
  origin.statepipe = "loren"
  t.deepEqual(state, reducers.from("*","*","loren")(payload,state,action,self,origin))
})
