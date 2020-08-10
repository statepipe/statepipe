
import test from "ava"
import reducers from "../object"
import {merge} from "ramda"

test('pick/pickAll/set/not: payload + state' , t => {
  const payload = {a:{b:"foo"},e:"bar",n:false}
  const state = {c:{d:"loren"},value:false}
  t.deepEqual(merge(state,{a:{b:"foo"},"e":"bar"}),reducers.pick("a.b","e")(payload, state))
  t.deepEqual(merge(state,payload),reducers.pickAll()(payload, state))
  t.deepEqual(merge(state,{c:{d:"foo"}}), reducers.set("a.b","c.d")(payload, state))
  t.deepEqual(merge(state,{c:{d:true}}), reducers.not("n","c.d")(payload, state))
})

test('pick/ ignore payload' , t => {
  const payload = {error:true}
  const state = {a:{b:"foo"},e:"bar",n:false}
  t.deepEqual({a:{b:"foo"},"e":"bar"}, reducers.pick("-","a.b","e")(payload, state))
  t.deepEqual(state, reducers.pickAll("-",)(payload, state))
  t.deepEqual(merge(state,{c:{d:"foo"}}), reducers.set("-","a.b","c.d")(payload, state))
  t.deepEqual(merge(state,{c:{d:true}}), reducers.not("-","n","c.d")(payload, state))
})
