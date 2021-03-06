import test from "ava";
import node from "../node";

test('nodePick' , t => {
  const ele = {clientTop:12, a:{b:"foo"}}
  t.deepEqual(
    {value:1,clientTop:12,a:{b:"foo"}}, 
    node.nodePick("clientTop","a.b")({value:1},ele))

  t.deepEqual(
    {value:1,clientTop:12,a:{b:"foo"}}, 
    node.nodePick("clientTop","a.b","c")({value:1},ele))

  t.deepEqual(
    {value:1,clientTop:12,a:{b:"foo"}}, 
    node.nodePick("clientTop","a.b","c")({value:1},ele))
})

test('nodeFn' , t => {
  t.plan(4)
  node.nodeFn("blur","focus")({},{blur:t.pass,focus:t.pass})
  t.deepEqual({},node.nodeFn("blur","focus")({},{}))
  t.deepEqual(null,node.nodeFn("blur","focus")(null,{blur:t.fail,focus:t.fail}))
})
