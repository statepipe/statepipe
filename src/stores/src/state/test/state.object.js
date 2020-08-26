import test from "ava"
import reducers from "../object"
import { merge } from "ramda"
import {unexpectedParams} from "~/test-utils/test-reducer-args"

Object
  .keys(reducers)
  .forEach(fn => {
    test(`object testUnexpectedParams ${fn}` , t => {
      unexpectedParams(t, reducers[fn])
    })
  })


test('state.object/ pick' , t => {
  const payload = {value:true,a:{b:true},c:"string",d:[1]}
  const state = {}
  t.deepEqual({value:true},reducers.pick()({payload, state}))
  t.deepEqual({a:{b:true}},reducers.pick("a")({payload, state}))
  t.deepEqual({a:{b:true}},reducers.pick("a.b")({payload, state}))
  t.deepEqual({a:{b:true},c:"string"},reducers.pick("a.b","c")({payload, state}))
  t.deepEqual({a:{b:true},c:"string"},reducers.pick("a.b","c","j")({payload, state}))
})

test('state.object/ pickAll' , t => {
  const payload = {value:true,a:{b:true},c:"string",d:[1]}
  const state = {}
  t.deepEqual(payload,reducers.pickAll()({payload, state}))
  t.deepEqual(payload,reducers.pickAll("a")({payload, state}))
  t.deepEqual(payload,reducers.pickAll(null)({payload, state}))
})

test('state.object/ not', t => {
  const state = {a:{b:2},value:true,c:2,d:0,e:"2",f:{g:false}}
  const payload = {a:2,value:1,c:1,d:"1",e:true,f:{g:false}}
  t.deepEqual(merge(state,{value:false}), reducers.not()({payload, state}))
  t.deepEqual(merge(state,{value:false}), reducers.not("e")({payload, state}))
  t.deepEqual(merge(state,{f:false}), reducers.not("e","f")({payload, state}))
  t.deepEqual(merge(state,{a:{b:true}}), reducers.not("f.g","a.b")({payload, state}))
  t.deepEqual(state, reducers.not("error","f.g")({payload, state}))
})

test('state.object/ set', t => {
  const state = {a:{b:2},value:true,c:2,d:0,e:"2",f:{g:false}}
  const payload = {a:2,value:1,c:1,d:"1",e:true,f:{g:false}}
  t.deepEqual(merge(state,{value:1}), reducers.set()({payload, state}))
  t.deepEqual(merge(state,{value:false}), reducers.set("f.g")({payload, state}))
  t.deepEqual(merge(state,{a:{b:false}}), reducers.set("f.g","a.b")({payload, state}))
  t.deepEqual(state, reducers.set("error","a.b")({payload, state}))
})

test('state.object/ set: $action payload + state', t => {
  const payload = { value: 'true'};
  const state = { value: 'true'};
  t.deepEqual(merge(payload,{value:"ping"}),
    reducers.set("$action")({payload, state, action:"ping"}))
  t.deepEqual(merge(payload,{a:{b:"ping"}}),
    reducers.set("$action","a.b")({payload, state, action:"ping"}))
})
