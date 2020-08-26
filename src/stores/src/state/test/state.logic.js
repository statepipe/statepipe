import test from "ava"
import reducers from "../logic"
import node from "~/test-utils/mock-node";

Object
  .keys(reducers)
  .forEach(fn => {
    test(`state.logic/ testUnexpectedParams ${fn}` , t => {
      const rdcr = reducers[fn];
      t.is("function", typeof rdcr());
      t.is("function", typeof rdcr("value"));
      t.is("function", typeof rdcr(null));
      t.is("function", typeof rdcr(1));
      t.is("function", typeof rdcr(function(){}));
      t.falsy(rdcr()({}))
    })
  })


global.document = node();
global.document.body = node();

test('state.logic/ gt' , t => {
  t.deepEqual({value:1}, reducers.gt()({payload:{value:10},state:{value:1}}))
  t.deepEqual({b:1}, reducers.gt("a","b")({payload:{a:10},state:{b:1}}))
  t.deepEqual({c:{d:1}}, reducers.gt("a.b","c.d")({payload:{a:{b:10}},state:{c:{d:1}}}))
})

test('state.logic/ gte' , t => {
  t.deepEqual(null, reducers.gte("a.b","c.d")({payload:{a:{b:10}},state:{c:{d:101}}}))
  t.deepEqual({c:{d:10}}, reducers.gte("a.b","c.d")({payload:{a:{b:10}},state:{c:{d:10}}}))
})

test('state.logic/ lt' , t => {
  t.is(null, reducers.lt("a.b","c.d")({payload:{a:{b:10}},state:{c:{d:1}}}))
  t.deepEqual({c:{d:1}}, reducers.lt("a.b","c.d")({payload:{a:{b:-10}},state:{c:{d:1}}}))
})

test('state.logic/ lte' , t => {
  t.is(null, reducers.lte("a.b","c.d")({payload:{a:{b:10}},state:{c:{d:1}}}))
  t.deepEqual({c:{d:1}}, reducers.lte("a.b","c.d")({payload:{a:{b:-10}},state:{c:{d:1}}}))
})

test('state.logic/ includes' , t => {
  t.deepEqual({c:{d:"abc"}}, reducers.includes("a.b","c.d")({payload:{a:{b:"a"}},state:{c:{d:"abc"}}}))
  t.deepEqual({c:{d:[10,1,2,3]}}, reducers.includes("a.b","c.d")({payload:{a:{b:10}},state:{c:{d:[10,1,2,3]}}}))
})

test('state.logic/ notIncludes' , t => {
  t.is(null, reducers.notIncludes("a.b","c.d")({payload:{a:{b:"a"}},state:{c:{d:"abc"}}}))
  t.is(null, reducers.notIncludes("a.b","c.d")({payload:{a:{b:10}},state:{c:{d:[10,1,2,3]}}}))
  t.deepEqual({c:{d:"a"}}, reducers.notIncludes("a.b","c.d")({payload:{a:{b:10}},state:{c:{d:"a"}}}))
})

test('state.logic/ equals' , t => {
  t.is(null, reducers.equals("a.b","c.d")({payload:{a:{b:10}},state:{c:{d:1}}}))
  t.deepEqual({c:{d:10}}, reducers.equals("a.b","c.d")({payload:{a:{b:10}},state:{c:{d:10}}}))
})

test('state.logic/ notEquals' , t => {
  t.is(null, reducers.notEquals("a.b","c.d")({payload:{a:{b:10}},state:{c:{d:10}}}))
  t.deepEqual({c:{d:10}}, reducers.notEquals("a.b","c.d")({payload:{a:{b:1}},state:{c:{d:10}}}))
})

test('state.logic/ truthy' , t => {
  const payload = {a:2,value:1,c:{f:true},d:"0",e:false}
  const state = {a:{b:2},value:3,c:2,d:0,e:"2",f:{g:false}}
  t.deepEqual(state, reducers.truthy()({payload,state}))
  t.deepEqual(null, reducers.truthy("e")({payload,state}))
  t.deepEqual(null, reducers.truthy("d")({payload,state}))
  t.deepEqual(state, reducers.truthy("c.f")({payload,state}))
})

test('state.logic/ falsy' , t => {
  const payload = {a:2,value:1,c:{f:true},d:"0",e:false}
  const state = {a:{b:2},value:3,c:2,d:0,e:"2",f:{g:false}}
  t.deepEqual(null, reducers.falsy()({payload,state}))
  t.deepEqual(state, reducers.falsy("e")({payload,state}))
  t.deepEqual(state, reducers.falsy("d")({payload,state}))
  t.deepEqual(null, reducers.falsy("c.f")({payload,state}))
})

test('state.logic/ odd' , t => {
  const st = {v:true}
  t.deepEqual(st, reducers.odd()({payload:{value:1},state:st}))
  t.deepEqual(st, reducers.odd("a.b")({payload:{a:{b:1}},state:st}))
  t.deepEqual(null, reducers.odd()({payload:{value:0},state:st}))
})

test('state.logic/ even' , t => {
  const state = {v:true};
  t.deepEqual(state, reducers.even()({payload:{value:2},state}))
  t.deepEqual(state, reducers.even("a.b")({payload:{a:{b:2}},state}))
  t.deepEqual(null, reducers.even("a.b")({payload:{a:{b:1}},state}))
})

test('state.logic/ positive' , t => {
  const state = {v:true}
  t.deepEqual(state, reducers.positive()({payload:{value:0},state}))
  t.deepEqual(state, reducers.positive("a.b")({payload:{a:{b:1}},state}))
  t.deepEqual(null, reducers.positive("a.b")({payload:{a:{b:-1}},state}))
})

test('state.logic/ negative' , t => {
  const state = {v:true}
  t.deepEqual(state, reducers.negative()({payload:{value:-1},state}))
  t.deepEqual(state, reducers.negative("a.b")({payload:{a:{b:-1}},state}))
  t.deepEqual(null, reducers.negative("a.b")({payload:{a:{b:0}},state}))
})

test.skip('state.logic/ from/action' , t => {
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

test.skip('state.logic/ from/node' , t => {
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

test('state.logic/ from/ctx' , t => {
  const state = {v:true}
  const self  = node();
  const action = "foo"
  self.statepipe = "foo"
  const origin = node();
  
  origin.statepipe = "foo"
  t.deepEqual(state, reducers.from("*","*","$self")({state,node:self,origin,action}))
  origin.statepipe = "bar"
  t.deepEqual(null, reducers.from("*","*","$self")({state,node:self,origin,action}))

  t.deepEqual(state, reducers.from("*","*","$others")({state,node:self,origin,action}))
  origin.statepipe = "foo"
  t.deepEqual(null, reducers.from("*","*","$others")({state,node:self,origin,action}))

  t.deepEqual(null, reducers.from("*","*","loren")({state,node:self,origin,action}))
  origin.statepipe = "loren"
  t.deepEqual(state, reducers.from("*","*","loren")({state,node:self,origin,action}))
})
