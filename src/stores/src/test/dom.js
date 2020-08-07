import test from "ava";
import dom from "../dom";
import mockNode from "~/test-utils/mock-node"
import { merge } from "ramda";


test('propPick/ context args: event, node, ctx' , t => {
  const state = {a:true}
  const tester = {blur:"pass",a:{b:"ok"}}
  const event = tester
  const node = mockNode(tester)
  const ctx = mockNode(tester)
  
  t.deepEqual(merge(state,{blur:tester.blur}), dom.propPick("event","blur")(state, event))
  t.deepEqual(merge(state,{a:{b:"ok"}}), dom.propPick("event","a.b")(state, event))
  t.deepEqual(merge(state,tester), dom.propPick("event","blur","a.b")(state, event))
  t.deepEqual(state, dom.propPick("event","foo")(state, event))
  t.deepEqual(merge(state,tester), dom.propPick("self","blur","a.b")(state, null, node))
  t.deepEqual(merge(state,tester), dom.propPick("ctx","a.b","blur")(state, null, null, ctx))
})

test('propPick/ globals: doc, docElm, body, win, history' , t => {
  const state = {a:true}
  const tester = { a:{b:"pass"}}
  global.document = mockNode(tester)
  global.document.documentElement = mockNode(tester)
  global.document.body = mockNode(tester)
  global.window = mockNode(tester)
  global.history = mockNode(tester)

  t.deepEqual(merge(state, tester), dom.propPick("doc","a.b")(state))
  t.deepEqual(merge(state, tester), dom.propPick("docElm","a.b")(state))
  t.deepEqual(merge(state, tester), dom.propPick("body","a.b")(state))
  t.deepEqual(merge(state, tester), dom.propPick("win","a.b")(state))
  t.deepEqual(merge(state, tester), dom.propPick("history","a.b")(state))

  delete global.document;
  delete global.window;
  delete global.history;
})

test('propSet/ context args: event, node, ctx' , t => {
  const state = {value:"propSet",a:{b:true}}
  const tester = {value:"pass",a:{b:"ok"}}
  const event = tester
  const node = mockNode(tester)
  const ctx = mockNode(tester)

  dom.propSet("event")(state, event)
  t.deepEqual(state.value, event.value)
  dom.propSet("event","a.b")(state, event)
  t.deepEqual(state.value, event.a.b)
  dom.propSet("event","a.b","a.b")(state, event)
  t.deepEqual(state.a.b, event.a.b)
  dom.propSet("self","a.b","a.b")(state, null, node)
  t.deepEqual(state.a.b, node.a.b)
  dom.propSet("ctx","a.b","a.b")(state, null, null, ctx)
  t.deepEqual(state.a.b, ctx.a.b)
})

test('propSet/ globals: doc, docElm, body, win, history' , t => {
  const state = {a:{b:true}}
  const tester = {value:false}
  
  global.document = mockNode(tester)
  global.document.documentElement = mockNode(tester)
  global.document.body = mockNode(tester)
  global.window = mockNode(tester)
  global.history = mockNode(tester)

  dom.propSet("doc","a.b","a.b")(state)
  t.deepEqual(state.a.b, global.document.a.b)
  dom.propSet("docElm","a.b","a.b")(state)
  t.deepEqual(state.a.b, global.document.documentElement.a.b)
  dom.propSet("body","a.b","a.b")(state)
  t.deepEqual(state.a.b, global.document.body.a.b)
  dom.propSet("win","a.b","a.b")(state)
  t.deepEqual(state.a.b, global.window.a.b)
  dom.propSet("history","a.b","a.b")(state)
  t.deepEqual(state.a.b, global.history.a.b)

  delete global.document;
  delete global.window;
  delete global.history;
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
  t.deepEqual(state, dom.fnRun("self","a.b")(state, null, node))
  t.deepEqual(state, dom.fnRun("ctx","a.b")(state, null, null, ctx))
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

test('fnGet/ context args: event, node, ctx', t => {
  const state = {a:true}
  const tester = {blur:()=>({pass:true}),a:{b:()=>("pass")},foo:"bar"}
  const event = tester
  const node = mockNode(tester)
  const ctx = mockNode(tester)
  
  t.deepEqual(merge(state,{value:{pass:true}}), dom.fnGet("event","blur")(state, event))
  t.deepEqual(merge(state,{loren:{foo:{pass:true}}}), dom.fnGet("event","blur","loren.foo")(state, event))
  t.deepEqual(merge(state,{value:"pass"}), dom.fnGet("event","a.b")(state, event))
  t.deepEqual(merge(state,{value:"pass"}), dom.fnGet("self","a.b")(state, null, node))
  t.deepEqual(merge(state,{value:"pass"}), dom.fnGet("ctx","a.b")(state, null, null, ctx))
})

test('fnGet/ globals: doc, docElm, body, win, history', t => {
  const state = {a:true}
  const tester = {blur:()=>({pass:true}),a:{b:()=>("pass")},foo:"bar"}
  global.document = mockNode(tester)
  global.document.documentElement = mockNode(tester)
  global.document.body = mockNode(tester)
  global.window = mockNode(tester)
  global.history = mockNode(tester)

  t.deepEqual(merge(state,{value:"pass"}), dom.fnGet("doc","a.b")(state))
  t.deepEqual(merge(state,{value:"pass"}), dom.fnGet("doc","documentElement.a.b")(state))
  t.deepEqual(merge(state,{value:"pass"}), dom.fnGet("docElm","a.b")(state))
  t.deepEqual(merge(state,{value:"pass"}), dom.fnGet("body","a.b")(state))
  t.deepEqual(merge(state,{value:"pass"}), dom.fnGet("win","a.b")(state))
  t.deepEqual(merge(state,{value:"pass"}), dom.fnGet("history","a.b")(state))

  delete global.document;
  delete global.window;
  delete global.history;
})
