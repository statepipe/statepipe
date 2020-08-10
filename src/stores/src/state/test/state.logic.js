import test from "ava"
import pipes from "../logic"
import node from "~/test-utils/mock-node";

global.document = node();
global.document.body = node();

test('pipe/ unexpectd args', t=> {
  Object
    .keys(pipes)
    .forEach(fn => {
      t.falsy(pipes[fn]()())
      t.falsy(pipes[fn]()({}))
      t.falsy(pipes[fn]()({value:1}))
    })
})

test('gt' , t => {
  t.deepEqual({value:1}, pipes.gt()({value:10},{value:1}))
  t.deepEqual({b:1}, pipes.gt("a","b")({a:10},{b:1}))
  t.deepEqual({c:{d:1}}, pipes.gt("a.b","c.d")({a:{b:10}},{c:{d:1}}))
})

test('gte' , t => {
  t.deepEqual(null, pipes.gte("a.b","c.d")({a:{b:10}},{c:{d:101}}))
  t.deepEqual({c:{d:10}}, pipes.gte("a.b","c.d")({a:{b:10}},{c:{d:10}}))
})

test('lt' , t => {
  t.is(null, pipes.lt("a.b","c.d")({a:{b:10}},{c:{d:1}}))
  t.deepEqual({c:{d:1}}, pipes.lt("a.b","c.d")({a:{b:-10}},{c:{d:1}}))
})

test('lte' , t => {
  t.is(null, pipes.lte("a.b","c.d")({a:{b:10}},{c:{d:1}}))
  t.deepEqual({c:{d:1}}, pipes.lte("a.b","c.d")({a:{b:-10}},{c:{d:1}}))
})

test('includes' , t => {
  t.deepEqual({c:{d:"abc"}}, pipes.includes("a.b","c.d")({a:{b:"a"}},{c:{d:"abc"}}))
  t.deepEqual({c:{d:[10,1,2,3]}}, pipes.includes("a.b","c.d")({a:{b:10}},{c:{d:[10,1,2,3]}}))
})

test('notIncludes' , t => {
  t.is(null, pipes.notIncludes("a.b","c.d")({a:{b:"a"}},{c:{d:"abc"}}))
  t.is(null, pipes.notIncludes("a.b","c.d")({a:{b:10}},{c:{d:[10,1,2,3]}}))
  t.deepEqual({c:{d:"a"}}, pipes.notIncludes("a.b","c.d")({a:{b:10}},{c:{d:"a"}}))
})

test('equals' , t => {
  t.is(null, pipes.equals("a.b","c.d")({a:{b:10}},{c:{d:1}}))
  t.deepEqual({c:{d:10}}, pipes.equals("a.b","c.d")({a:{b:10}},{c:{d:10}}))
})

test('notEquals' , t => {
  t.is(null, pipes.notEquals("a.b","c.d")({a:{b:10}},{c:{d:10}}))
  t.deepEqual({c:{d:10}}, pipes.notEquals("a.b","c.d")({a:{b:1}},{c:{d:10}}))
})

test('truthy' , t => {
  const a = {a:2,value:1,c:{f:true},d:"0",e:false}
  const state = {a:{b:2},value:3,c:2,d:0,e:"2",f:{g:false}}
  t.deepEqual(state, pipes.truthy()(a,state))
  t.deepEqual(null, pipes.truthy("e")(a,state))
  t.deepEqual(null, pipes.truthy("d")(a,state))
  t.deepEqual(state, pipes.truthy("c.f")(a,state))
})

test('falsy' , t => {
  const a = {a:2,value:1,c:{f:true},d:"0",e:false}
  const state = {a:{b:2},value:3,c:2,d:0,e:"2",f:{g:false}}
  t.deepEqual(null, pipes.falsy()(a,state))
  t.deepEqual(state, pipes.falsy("e")(a,state))
  t.deepEqual(state, pipes.falsy("d")(a,state))
  t.deepEqual(null, pipes.falsy("c.f")(a,state))
})

test('odd' , t => {
  const st = {v:true}
  t.deepEqual(st, pipes.odd()({value:1},st))
  t.deepEqual(st, pipes.odd("a.b")({a:{b:1}},st))
  t.deepEqual(null, pipes.odd()({value:0},st))
})

test('even' , t => {
  const st = {v:true}
  t.deepEqual(st, pipes.even()({value:2},st))
  t.deepEqual(st, pipes.even("a.b")({a:{b:2}},st))
  t.deepEqual(null, pipes.even("a.b")({a:{b:1}},st))
})

test('positive' , t => {
  const st = {v:true}
  t.deepEqual(st, pipes.positive()({value:0},st))
  t.deepEqual(st, pipes.positive("a.b")({a:{b:1}},st))
  t.deepEqual(null, pipes.positive("a.b")({a:{b:-1}},st))
})

test('negative' , t => {
  const st = {v:true}
  t.deepEqual(st, pipes.negative()({value:-1},st))
  t.deepEqual(st, pipes.negative("a.b")({a:{b:-1}},st))
  t.deepEqual(null, pipes.negative("a.b")({a:{b:0}},st))
})

test('from/action' , t => {
  const state = {v:true}
  const payload = {error:true}
  const action = "ping"
  const self  = node();
  const origin = node();
  t.deepEqual(state, pipes.from()(payload,state,action,self,origin))
  t.deepEqual(state, pipes.from(action)(payload,state,action,self,origin))
  t.deepEqual(state, pipes.from("*")(payload,state,action,self,origin))
  t.deepEqual(null, pipes.from("pong")(payload,state,action,self,origin))
})

test('from/node' , t => {
  const state = {v:true}
  const payload = {error:true}
  const action = "ping"
  const self  = node();
  const origin = node();
  t.deepEqual(state, pipes.from("*","$self")(payload,state,action,self,self))
  t.deepEqual(null, pipes.from("*","$self")(payload,state,action,self,origin))
  t.deepEqual(null, pipes.from("*","$others")(payload,state,action,self,self))
  t.deepEqual(state, pipes.from("*","$others")(payload,state,action,self,origin))
  t.deepEqual(state, pipes.from("*","*")(payload,state,action,self,origin))
  global.document.body.setQueryResult([origin])
  t.deepEqual(state, pipes.from("*","button.-red")(payload,state,action,self,origin))
  global.document.body.setQueryResult([])
  t.deepEqual(null, pipes.from("*","button.-red")(payload,state,action,self,origin))
})

test('from/ctx' , t => {
  const state = {v:true}
  const payload = {error:true}
  const action = "ping"
  const self  = node();
  self.statepipe = "foo"
  const origin = node();
  
  origin.statepipe = "foo"
  t.deepEqual(state, pipes.from("*","*","$self")(payload,state,action,self,origin))
  origin.statepipe = "bar"
  t.deepEqual(null, pipes.from("*","*","$self")(payload,state,action,self,origin))

  t.deepEqual(state, pipes.from("*","*","$others")(payload,state,action,self,origin))
  origin.statepipe = "foo"
  t.deepEqual(null, pipes.from("*","*","$others")(payload,state,action,self,origin))

  t.deepEqual(null, pipes.from("*","*","loren")(payload,state,action,self,origin))
  origin.statepipe = "loren"
  t.deepEqual(state, pipes.from("*","*","loren")(payload,state,action,self,origin))
})
