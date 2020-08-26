import {merge} from "ramda"
import test from "ava"
import reducers from "../math"

test('add/subtract/divide/multiply/max/min/modulo: payload + state' , t => {
  const payload = {value: 11, a:{b:5}}
  const state = {value:7, c:{d:2}, e:"12.3", d:true}

  t.deepEqual(merge(state,{c:{d:7}}), reducers.add("a.b","c.d")({payload,state}))
  t.deepEqual(merge(state,{c:{d:3}}), reducers.subtract("a.b","c.d")({payload,state}))
  t.deepEqual(merge(state,{c:{d:2.5}}), reducers.divide("a.b","c.d")({payload,state}))
  t.deepEqual(merge(state,{c:{d:10}}), reducers.multiply("a.b","c.d")({payload,state}))
  t.deepEqual(merge(state,{c:{d:5}}), reducers.max("a.b","c.d")({payload,state}))
  t.deepEqual(state, reducers.min("a.b","c.d")({payload,state}))
  t.deepEqual(merge(state,{c:{d:1}}), reducers.modulo("a.b","c.d")({payload,state}))
})

test('add/subtract/divide/multiply/max/min/modulo: ignore payload' , t => {
  const payload = {error:true}
  const state = {value:7, a:{b:5}, c:{d:2}, e:"12.3", d:true}

  t.deepEqual(merge(state,{c:{d:7}}), reducers.add("-","a.b","c.d")({payload,state}))
  t.deepEqual(merge(state,{c:{d:3}}), reducers.subtract("-","a.b","c.d")({payload,state}))
  t.deepEqual(merge(state,{c:{d:2.5}}), reducers.divide("-","a.b","c.d")({payload,state}))
  t.deepEqual(merge(state,{c:{d:10}}), reducers.multiply("-","a.b","c.d")({payload,state}))
  t.deepEqual(merge(state,{c:{d:5}}), reducers.max("-","a.b","c.d")({payload,state}))
  t.deepEqual(state, reducers.min("-","a.b","c.d")({payload,state}))
  t.deepEqual(merge(state,{c:{d:1}}), reducers.modulo("-","a.b","c.d")({payload,state}))
})

test('dec/inc/negate: payload + state' , t => {
  const payload = {value:7, a:{b:5}, c:{d:2}, e:"12.3", d:true}
  const state = {}
  t.deepEqual(merge(state,{c:{d:4}}), reducers.dec("a.b","c.d")({payload,state}))
  t.deepEqual(merge(state,{c:{d:6}}), reducers.inc("a.b", "c.d")({payload,state}))
  t.deepEqual(merge(state,{c:{d:-5}}), reducers.negate("a.b", "c.d")({payload,state}))
})

test('dec/inc/negate: ignore payload' , t => {
  const payload = {error:true}
  const state = {value:7, a:{b:5}, c:{d:2}, e:"12.3", d:true}
  t.deepEqual(merge(state,{a:{b:4}}), reducers.dec("-","a.b")({payload,state}))
  t.deepEqual(merge(state,{a:{b:6}}), reducers.inc("-","a.b")({payload,state}))
  t.deepEqual(merge(state,{a:{b:-5}}), reducers.negate("-","a.b")({payload,state}))
})
