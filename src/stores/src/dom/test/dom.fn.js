import test from "ava";
import dom from "../index";
import mockNode from "~/test-utils/mock-node"
import { merge } from "ramda";

test('fnRun/ context args: event, node, wrapper' , t => {
  const state = {a:true}
  const tester = {blur:t.pass,a:{b:t.pass},foo:"bar"}
  const event = tester
  const node = mockNode(tester)
  const wrapper = mockNode(tester)
  
  t.plan(12)
  t.deepEqual(state, dom.fnRun("event","blur")({state, event}))
  t.deepEqual(state, dom.fnRun("event","a.b")({state, event}))
  t.deepEqual(state, dom.fnRun("event","blur","a.b")({state, event}))
  t.deepEqual(state, dom.fnRun("event","foo")({state, event}))
  t.deepEqual(state, dom.fnRun("self","a.b")({state, node}))
  t.deepEqual(state, dom.fnRun("wrapper","a.b")({state, wrapper}))
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
  t.deepEqual(state, dom.fnRun("doc","a.b")({state}))
  t.deepEqual(state, dom.fnRun("doc","documentElement.a.b")({state}))
  t.deepEqual(state, dom.fnRun("docElm","a.b")({state}))
  t.deepEqual(state, dom.fnRun("body","a.b")({state}))
  t.deepEqual(state, dom.fnRun("win","a.b")({state}))
  t.deepEqual(state, dom.fnRun("history","a.b")({state}))

  delete global.document;
  delete global.window;
  delete global.history;
})

test('fnGet/ context args: event, node, wrapper', t => {
  const state = {a:true}
  const tester = {blur:()=>({pass:true}),a:{b:()=>("pass")},foo:"bar"}
  const event = tester
  const node = mockNode(tester)
  const wrapper = mockNode(tester)
  
  t.deepEqual(merge(state,{value:{pass:true}}), dom.fnGet("event","blur")({state, event}))
  t.deepEqual(merge(state,{loren:{foo:{pass:true}}}), dom.fnGet("event","blur","loren.foo")({state, event}))
  t.deepEqual(merge(state,{value:"pass"}), dom.fnGet("event","a.b")({state, event}))
  t.deepEqual(merge(state,{value:"pass"}), dom.fnGet("self","a.b")({state, node}))
  t.deepEqual(merge(state,{value:"pass"}), dom.fnGet("wrapper","a.b")({state, wrapper}))
})

test('fnGet/ globals: doc, docElm, body, win, history', t => {
  const state = {a:true}
  const tester = {blur:()=>({pass:true}),a:{b:()=>("pass")},foo:"bar"}
  global.document = mockNode(tester)
  global.document.documentElement = mockNode(tester)
  global.document.body = mockNode(tester)
  global.window = mockNode(tester)
  global.history = mockNode(tester)

  t.deepEqual(merge(state,{value:"pass"}), dom.fnGet("doc","a.b")({state}))
  t.deepEqual(merge(state,{value:"pass"}), dom.fnGet("doc","documentElement.a.b")({state}))
  t.deepEqual(merge(state,{value:"pass"}), dom.fnGet("docElm","a.b")({state}))
  t.deepEqual(merge(state,{value:"pass"}), dom.fnGet("body","a.b")({state}))
  t.deepEqual(merge(state,{value:"pass"}), dom.fnGet("win","a.b")({state}))
  t.deepEqual(merge(state,{value:"pass"}), dom.fnGet("history","a.b")({state}))

  delete global.document;
  delete global.window;
  delete global.history;
})
