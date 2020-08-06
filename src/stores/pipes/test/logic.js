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

test('pipe:gt/ payload + state' , t => {
  t.deepEqual({value:1}, pipes.gt()({value:10},{value:1}))
  t.deepEqual({b:1}, pipes.gt("a","b")({a:10},{b:1}))
  t.deepEqual({c:{d:1}}, pipes.gt("a.b","c.d")({a:{b:10}},{c:{d:1}}))
})

test('pipe:gt/ ignore payload' , t => {
  const payload = {error:true}
  let state = {value:0,a:1,b:{c:2}}
  t.deepEqual(state, pipes.gt("-","a")(payload,state))
  t.deepEqual(state, pipes.gt("-","b.c","a")(payload,state))
  t.is(null, pipes.gt("-")(payload,state))
  t.is(null, pipes.gt("-","b.c","e")(payload,state))
})

test('pipe:gte/ payload + state' , t => {
  t.deepEqual(null, pipes.gte("a.b","c.d")({a:{b:10}},{c:{d:101}}))
  t.deepEqual({c:{d:10}}, pipes.gte("a.b","c.d")({a:{b:10}},{c:{d:10}}))
})

test('pipe:gte/ ignore payload' , t => {
  const payload = {error:true}
  let state = {value:0,a:0,b:{c:2}}
  t.deepEqual(state, pipes.gte("-")(payload,state))
  t.deepEqual(state, pipes.gte("-","a")(payload,state))
  t.deepEqual(state, pipes.gte("-","b.c","a")(payload,state))
  t.deepEqual(null, pipes.gte("-","b.c","d")(payload,state))
})

test('pipe:lt/ payload + state' , t => {
  t.is(null, pipes.lt("a.b","c.d")({a:{b:10}},{c:{d:1}}))
  t.deepEqual({c:{d:1}}, pipes.lt("a.b","c.d")({a:{b:-10}},{c:{d:1}}))
})

test('pipe:lt/ ignore payload' , t => {
  const payload = {error:true}
  let state = {value:0,a:-1,b:{c:-2}}
  t.deepEqual(null, pipes.lt("-")(payload,state))
  t.deepEqual(state, pipes.lt("-","a")(payload,state))
  t.deepEqual(state, pipes.lt("-","b.c","a")(payload,state))
  t.deepEqual(null, pipes.lt("-","b.c","d")(payload,state))
})

test('pipe:lte/ payload + state' , t => {
  t.is(null, pipes.lte("a.b","c.d")({a:{b:10}},{c:{d:1}}))
  t.deepEqual({c:{d:1}}, pipes.lte("a.b","c.d")({a:{b:-10}},{c:{d:1}}))
})

test('pipe:lte/ ignore payload' , t => {
  const payload = {error:true}
  let state = {value:-1,a:-1,b:{c:-2}}
  t.deepEqual(state, pipes.lte("-")(payload,state))
  t.deepEqual(state, pipes.lte("-","a")(payload,state))
  t.deepEqual(state, pipes.lte("-","b.c","a")(payload,state))
  t.deepEqual(null, pipes.lte("-","b.c","d")(payload,state))
})

test('pipe:includes/ payload + state' , t => {
  t.deepEqual({c:{d:"abc"}}, pipes.includes("a.b","c.d")({a:{b:"a"}},{c:{d:"abc"}}))
  t.deepEqual({c:{d:[10,1,2,3]}}, pipes.includes("a.b","c.d")({a:{b:10}},{c:{d:[10,1,2,3]}}))
})

test('pipe:includes/ ignore payload' , t => {
  const payload = {error :true}
  const state = {a:{b:"a"},c:{d:"casa"}}
  t.deepEqual(state, pipes.includes("-","a.b","c.d")(payload,state))
})

test('pipe:notIncludes/ payload + state' , t => {
  t.is(null, pipes.notIncludes("a.b","c.d")({a:{b:"a"}},{c:{d:"abc"}}))
  t.is(null, pipes.notIncludes("a.b","c.d")({a:{b:10}},{c:{d:[10,1,2,3]}}))
  t.deepEqual({c:{d:"a"}}, pipes.notIncludes("a.b","c.d")({a:{b:10}},{c:{d:"a"}}))
})

test('pipe:notIncludes/ ignore payload' , t => {
  const payload = {error :true}
  const state = {a:{b:"a"},c:{d:"casa"},e:"b"}
  t.is(null, pipes.notIncludes("-","a.b","c.d")(payload,state))
  t.deepEqual(state, pipes.notIncludes("-","a.b","e")(payload, state))
})

test('pipe:equals/ payload + state' , t => {
  t.is(null, pipes.equals("a.b","c.d")({a:{b:10}},{c:{d:1}}))
  t.deepEqual({c:{d:10}}, pipes.equals("a.b","c.d")({a:{b:10}},{c:{d:10}}))
})

test('pipe:equals/ ignore payload' , t => {
  const payload = {error :true}
  const state = {a:{b:"a"},c:{d:"a"}}
  t.deepEqual(state, pipes.equals("-","a.b","c.d")(payload,state))
})

test('pipe:notEquals/ payload + state' , t => {
  t.is(null, pipes.notEquals("a.b","c.d")({a:{b:10}},{c:{d:10}}))
  t.deepEqual({c:{d:10}}, pipes.notEquals("a.b","c.d")({a:{b:1}},{c:{d:10}}))
})

test('pipe:notEquals/ ignore payload' , t => {
  const payload = {error :true}
  const state = {a:{b:"a"},c:{d:"b"}}
  t.deepEqual(state, pipes.notEquals("-","a.b","c.d")(payload,state))
})

test('pipe:truthy/ payload + state' , t => {
  const a = {a:2,value:1,c:{f:true},d:"0",e:false}
  const state = {a:{b:2},value:3,c:2,d:0,e:"2",f:{g:false}}
  t.deepEqual(state, pipes.truthy()(a,state))
  t.deepEqual(null, pipes.truthy("e")(a,state))
  t.deepEqual(null, pipes.truthy("d")(a,state))
  t.deepEqual(state, pipes.truthy("c.f")(a,state))
})

test('pipe:truthy/ ignore payload' , t => {
  const payload = {error :true}
  const state = {a:{b:true},c:{d:"1"},e:false}
  t.deepEqual(state, pipes.truthy("-","a.b")(payload,state))
  t.deepEqual(state, pipes.truthy("-","c.d")(payload,state))
  t.deepEqual(null, pipes.truthy("-","e")(payload,state))
})

test('pipe:falsy/ payload + state' , t => {
  const a = {a:2,value:1,c:{f:true},d:"0",e:false}
  const state = {a:{b:2},value:3,c:2,d:0,e:"2",f:{g:false}}
  t.deepEqual(null, pipes.falsy()(a,state))
  t.deepEqual(state, pipes.falsy("e")(a,state))
  t.deepEqual(state, pipes.falsy("d")(a,state))
  t.deepEqual(null, pipes.falsy("c.f")(a,state))
})

test('pipe:falsy/ ignore payload' , t => {
  const payload = {error :true}
  const state = {a:{b:false},c:{d:0},e:true}
  t.deepEqual(state, pipes.falsy("-","a.b")(payload,state))
  t.deepEqual(state, pipes.falsy("-","c.d")(payload,state))
  t.deepEqual(null, pipes.falsy("-","e")(payload,state))
})

test('pipe:odd/ payload + state' , t => {
  const st = {value:true}
  t.deepEqual(st, pipes.odd()({value:1},st))
  t.deepEqual(st, pipes.odd("a.b")({a:{b:1}},st))
  t.deepEqual(null, pipes.odd()({value:0},st))
})

test('pipe:odd/ ignore payload' , t => {
  const payload = {error :true}
  const state = {a:{b:1},value:1}
  t.deepEqual(state, pipes.odd("-")(payload,state))
  t.deepEqual(state, pipes.odd("-","a.b")(payload,state))
})

test('pipe:even/ payload + state' , t => {
  const st = {value:true}
  t.deepEqual(st, pipes.even()({value:2},st))
  t.deepEqual(st, pipes.even("a.b")({a:{b:2}},st))
  t.deepEqual(null, pipes.even("a.b")({a:{b:1}},st))
})

test('pipe:even/ ignore payload' , t => {
  const payload = {error :true}
  const state = {a:{b:2},value:2}
  t.deepEqual(state, pipes.even("-")(payload,state))
  t.deepEqual(state, pipes.even("-","a.b")(payload,state))
})

test('pipe:positive/ payload + state' , t => {
  const st = {value:true}
  t.deepEqual(st, pipes.positive()({value:0},st))
  t.deepEqual(st, pipes.positive("a.b")({a:{b:1}},st))
  t.deepEqual(null, pipes.positive("a.b")({a:{b:-1}},st))
})

test('pipe:positive/ ignore payload' , t => {
  const payload = {error :true}
  const state = {a:{b:2},value:2}
  t.deepEqual(state, pipes.positive("-")(payload,state))
  t.deepEqual(state, pipes.positive("-","a.b")(payload,state))
})

test('pipe:negative/ payload + state' , t => {
  const st = {value:true}
  t.deepEqual(st, pipes.negative()({value:-1},st))
  t.deepEqual(st, pipes.negative("a.b")({a:{b:-1}},st))
  t.deepEqual(null, pipes.negative("a.b")({a:{b:0}},st))
})

test('pipe:negative/ ignore payload' , t => {
  const payload = {error :true}
  const state = {a:{b:-2},value:-2}
  t.deepEqual(state, pipes.negative("-")(payload,state))
  t.deepEqual(state, pipes.negative("-","a.b")(payload,state))
})

test('pipe:from action/ payload + state' , t => {
  const state = {value:true}
  const payload = {error:true}
  const action = "ping"
  const self  = node();
  const origin = node();
  t.deepEqual(state, pipes.from()(payload,state,action,self,origin))
  t.deepEqual(state, pipes.from(action)(payload,state,action,self,origin))
  t.deepEqual(state, pipes.from("*")(payload,state,action,self,origin))
  t.deepEqual(null, pipes.from("pong")(payload,state,action,self,origin))
})

test('pipe:from node/ payload + state' , t => {
  const state = {value:true}
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

test('pipe:from ctx/ payload + state' , t => {
  const state = {value:true}
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
