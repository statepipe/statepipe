import test from "ava";
import event from "../event";

test('event:eventPick' , t => {
  const ele = {clientTop:12, a:{b:"foo"}}
  t.deepEqual(
    {value:1,clientTop:12,a:{b:"foo"}}, 
    event.eventPick("clientTop","a.b")({value:1},ele))

  t.deepEqual(
    {value:1,clientTop:12,a:{b:"foo"}}, 
    event.eventPick("clientTop","a.b","c")({value:1},ele))

  t.deepEqual(
    {value:1,clientTop:12,a:{b:"foo"}}, 
    event.eventPick("clientTop","a.b","c")({value:1},ele))
})

test('event:eventFn' , t => {
  t.plan(4)
  event.eventFn("blur","focus")({},{blur:t.pass,focus:t.pass})
    t.deepEqual({},event.eventFn("blur","focus")({},{}))
    t.deepEqual(null,event.eventFn("blur","focus")(null,{blur:t.fail,focus:t.fail}))
  })
  