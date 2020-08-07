import test from "ava";
import dom from "../dom";
import mockNode from "~/test-utils/mock-node"

test('nodePick' , t => {
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

test('nodeFn' , t => {
  t.plan(4)
  dom.nodeFn("blur","focus")({},{blur:t.pass,focus:t.pass})
  t.deepEqual({},dom.nodeFn("blur","focus")({},{}))
  t.deepEqual(null,dom.nodeFn("blur","focus")(null,{blur:t.fail,focus:t.fail}))
})

test('nodeProp' , t => {
  let ele = mockNode({})
  const st = {value:"foo",a:{b:"inner"}}
  t.deepEqual(st, dom.nodeProp()(st,ele))
  t.deepEqual(st, dom.nodeProp("newprop")(st,ele))
  t.is(ele.newprop, "foo")
  t.deepEqual(st, dom.nodeProp("newprop","a.b")(st,ele))
  t.is(ele.newprop, "inner")
})
