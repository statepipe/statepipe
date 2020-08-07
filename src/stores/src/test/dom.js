import test from "ava";
import dom from "../dom";
import mockNode from "~/test-utils/mock-node"

test.skip('nodePick' , t => {
  const ele = {clientTop:12, a:{b:"foo"}}
  t.deepEqual(
    {value:1,clientTop:12,a:{b:"foo"}}, 
    dom.nodePick("clientTop","a.b")({value:1},ele))

  t.deepEqual(
    {value:1,clientTop:12,a:{b:"foo"}}, 
    dom.nodePick("clientTop","a.b","c")({value:1},ele))

  t.deepEqual(
    {value:1,clientTop:12,a:{b:"foo"}}, 
    dom.nodePick("clientTop","a.b","c")({value:1},ele))
})

test('fnRun/ missing args' , t => {
  t.is(undefined,dom.fnRun()());
  t.is(undefined,dom.fnRun("a","b")())
  t.deepEqual({pass:true},dom.fnRun("a","b")({pass:true}))
})

test('fnRun/ context args: event, node, ctx' , t => {
  const state = {a:true}
  const tester = {blur:t.pass,a:{b:t.pass},foo:"bar"}
  const event = tester
  const node = mockNode(tester)
  const ctx = mockNode(tester)
  
  t.plan(12)
  t.deepEqual(state, dom.fnRun("event","blur")(state, event))
  t.deepEqual(state, dom.fnRun("event","a.b")(state, event))
  t.deepEqual(state, dom.fnRun("event","blur","a.b")(state, event))
  t.deepEqual(state, dom.fnRun("event","foo")(state, event))
  t.deepEqual(state, dom.fnRun("self","a.b")(state, event, node))
  t.deepEqual(state, dom.fnRun("ctx","a.b")(state, event, node, ctx))
})

test('fnRun/ globals: doc, docElm, body, win, history' , t => {
  const state = {a:true}
  const tester = { a:{b:t.pass}}
  global.document = mockNode(tester)
  global.document.documentElement = mockNode(tester)
  global.document.body = mockNode(tester)
  global.window = mockNode(tester)
  global.history = mockNode(tester)

  t.plan(12)
  t.deepEqual(state, dom.fnRun("doc","a.b")(state))
  t.deepEqual(state, dom.fnRun("doc","documentElement.a.b")(state))
  t.deepEqual(state, dom.fnRun("docElm","a.b")(state))
  t.deepEqual(state, dom.fnRun("body","a.b")(state))
  t.deepEqual(state, dom.fnRun("win","a.b")(state))
  t.deepEqual(state, dom.fnRun("history","a.b")(state))

  delete global.document;
  delete global.window;
  delete global.history;
})

test.skip('nodeProp' , t => {
  let ele = mockNode({})
  const st = {value:"foo",a:{b:"inner"}}
  t.deepEqual(st, dom.nodeProp()(st,ele))
  t.deepEqual(st, dom.nodeProp("newprop")(st,ele))
  t.is(ele.newprop, "foo")
  t.deepEqual(st, dom.nodeProp("newprop","a.b")(st,ele))
  t.is(ele.newprop, "inner")
})
