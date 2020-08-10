import test from "ava";
import dom from "../index";
import mockNode from "~/test-utils/mock-node"

test('attrSet/ context args: node, ctx' , t => {
  const tester = {"a": "pass", "value": "true", b:{c:"done"}};
  const state = {value:"default","a":{"b":"inner"}};
  const node = mockNode()
  const ctx = mockNode();
  //set default
  dom.attrSet("self")(state, null, node)
  t.deepEqual("default", node.getAttribute("value"))
  dom.attrSet("self","loren","a.b")(state, null, node)
  t.deepEqual("inner", node.getAttribute("loren"))
  dom.attrSet("ctx","loren","a.b")(state, null, null, ctx)
  t.deepEqual("inner", ctx.getAttribute("loren"))
})

test('attrSet/ globals: doc, docElm, body' , t => {
  const state = {value:"default","a":{"b":"inner"}};
  global.document = mockNode()
  global.document.documentElement = mockNode()
  global.document.body = mockNode()
  global.history = mockNode()
  
  dom.attrSet("doc","attrSet","a.b")(state)
  t.is(global.document.getAttribute("attrSet"), "inner")
  
  dom.attrSet("docElm","attrSet","a.b")(state)
  t.is(global.document.documentElement.getAttribute("attrSet"), "inner")
  
  dom.attrSet("body","attrSet","a.b")(state)
  t.is(global.document.body.getAttribute("attrSet"), "inner")
  
  delete global.document
})

test('attrRm/ context args: node, ctx' , t => {
  const state = {};
  const node = mockNode()
  const ctx = mockNode();

  node.setAttribute("value","foo");
  dom.attrRm("self")(state, null, node)
  t.is(undefined, node.getAttribute("value"))

  node.setAttribute("customName","foo");
  dom.attrRm("self","customName")(state, null, node)
  t.is(undefined, node.getAttribute("customName"))

  ctx.setAttribute("default","foo");
  dom.attrRm("ctx")(state, null, null, ctx);
  t.is(undefined, ctx.getAttribute("value"));
})

test('attrRm/ globals: doc, docElm, body' , t => {
  const state = {};
  global.document = mockNode({attrRm:true})
  global.document.documentElement = mockNode({attrRm:true})
  global.document.body = mockNode({attrRm:true})
  
  dom.attrRm("doc","attrRm")(state, null, null);
  t.is(undefined, global.document.getAttribute("attrRm"));

  dom.attrRm("docElm","attrRm")(state, null, null);
  t.is(undefined, global.document.documentElement.getAttribute("attrRm"));

  delete global.document
  delete global.history
})

test('attrTogg/ context args: node, ctx' , t => {
  const state = {a:{b:"inner"}};
  const node = mockNode()
  const ctx = mockNode();

  node.setAttribute("customName","foo");
  dom.attrTogg("self","customName","a.b")(state, null, node)
  t.is("inner", node.getAttribute("customName"))
  dom.attrTogg("self","customName","a.b")(state, null, node)
  t.is(undefined, node.getAttribute("customName"))

  ctx.setAttribute("customName","foo");
  dom.attrTogg("self","customName","a.b")(state, null, ctx)
  t.is("inner", ctx.getAttribute("customName"))
  dom.attrTogg("self","customName","a.b")(state, null, ctx)
  t.is(undefined, ctx.getAttribute("customName"))
})

test('attrTogg/ globals: doc, docElm, body' , t => {
  const state = {a:{b:"inner"}}
  global.document = mockNode({customName:true})
  global.document.documentElement = mockNode({customName:true})
  global.document.body = mockNode({customName:true})
  
  global.document.setAttribute("customName","foo");
  dom.attrTogg("doc","customName","a.b")(state)
  t.is("inner", global.document.getAttribute("customName"))
  dom.attrTogg("doc","customName","a.b")(state)
  t.is(undefined, global.document.getAttribute("customName"))

  global.document.documentElement.setAttribute("customName","foo");
  dom.attrTogg("docElm","customName","a.b")(state)
  t.is("inner", global.document.documentElement.getAttribute("customName"))
  dom.attrTogg("docElm","customName","a.b")(state)
  t.is(undefined, global.document.documentElement.getAttribute("customName"))

  global.document.body.setAttribute("customName","foo");
  dom.attrTogg("body","customName","a.b")(state)
  t.is("inner", global.document.body.getAttribute("customName"))
  dom.attrTogg("body","customName","a.b")(state)
  t.is(undefined, global.document.body.getAttribute("customName"))

  delete global.document
})

test('attrPick/ context args: node, ctx' , t => {
  const state = {};
  const node = mockNode()
  const ctx = mockNode();

  node.setAttribute("value","fv");
  node.setAttribute("a","fa");
  node.setAttribute("b","fb");
  t.deepEqual({value:"fv"},dom.attrPick("self")(state, null, node))
  t.deepEqual({"a":"fa","b":"fb"},dom.attrPick("self","a","b")(state, null, node))

  ctx.setAttribute("value","fv");
  ctx.setAttribute("a","fa");
  ctx.setAttribute("b","fb");
  t.deepEqual({value:"fv"},dom.attrPick("ctx")(state, null, null, ctx))
  t.deepEqual({"a":"fa","b":"fb"},dom.attrPick("ctx","a","b")(state, null, null, ctx))
})

test('attrPick/ globals: doc, docElm, body' , t => {
  const state = {};
  global.document = mockNode({customName:true})
  global.document.documentElement = mockNode({customName:true})
  global.document.body = mockNode({customName:true})

  global.document.setAttribute("value","fv");
  global.document.setAttribute("a","fa");
  global.document.setAttribute("b","fb");
  t.deepEqual({value:"fv"},dom.attrPick("doc")(state))
  t.deepEqual({"a":"fa","b":"fb"},dom.attrPick("doc","a","b")(state))

  global.document.documentElement.setAttribute("value","fv");
  global.document.documentElement.setAttribute("a","fa");
  global.document.documentElement.setAttribute("b","fb");
  t.deepEqual({value:"fv"},dom.attrPick("docElm")(state))
  t.deepEqual({"a":"fa","b":"fb"},dom.attrPick("docElm","a","b")(state))

  global.document.body.setAttribute("value","fv");
  global.document.body.setAttribute("a","fa");
  global.document.body.setAttribute("b","fb");
  t.deepEqual({value:"fv"},dom.attrPick("body")(state))
  t.deepEqual({"a":"fa","b":"fb"},dom.attrPick("body","a","b")(state))

  delete global.document
})
