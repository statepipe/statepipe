import {merge} from "ramda"
import test from "ava"
import reducers from "../math"
import {unexpectedParams} from "~/test-utils/test-reducer-args"

Object
  .keys(reducers)
  .forEach(fn => {
    test(`math testUnexpectedParams ${fn}` , t => {
      unexpectedParams(t, reducers[fn])
    })
  })

test('add' , t => {
  const state = {value:7, a:{b:2}, c:"12.3", d:true}
  const payload = {value: 11, a:{b:5}}

  t.deepEqual(merge(state,{value:18}), reducers.add()(payload,state))
  t.deepEqual(merge(state,{value:12}), reducers.add("a.b")(payload,state))
  t.deepEqual(merge(state,{a:{b:7}}), reducers.add("a.b","a.b")(payload,state))
  t.deepEqual(merge(state,{result:7}), reducers.add("a.b","a.b","result")(payload,state))
  t.deepEqual(merge(state,{c:17.3}), reducers.add("a.b","c")(payload,state))
  t.deepEqual(merge(state,{d:17.3}), reducers.add("a.b","c","d")(payload,state))
  t.deepEqual(state, reducers.add("a.b","d")(payload,state))
})

test('subtract' , t => {
  const state = {value:7, a:{b:2}, c:"12.5", d:true}
  const payload = {value: 11, a:{b:5}}

  t.deepEqual(merge(state,{value:4}), reducers.subtract()(payload,state))
  t.deepEqual(merge(state,{value:-2}), reducers.subtract("a.b")(payload,state))
  t.deepEqual(merge(state,{a:{b:3}}), reducers.subtract("a.b","a.b")(payload,state))
  t.deepEqual(merge(state,{result:3}), reducers.subtract("a.b","a.b","result")(payload,state))
  t.deepEqual(merge(state,{c:-7.5}), reducers.subtract("a.b","c")(payload,state))
  t.deepEqual(merge(state,{d:-7.5}), reducers.subtract("a.b","c","d")(payload,state))
  t.deepEqual(state, reducers.subtract("a.b","d")(payload,state))
})

test('multiply' , t => {
  const state = {value:7, a:{b:2}, c:"12.5", d:true}
  const payload = {value: 11, a:{b:5}}

  t.deepEqual(merge(state,{value:77}), reducers.multiply()(payload,state))
  t.deepEqual(merge(state,{value:35}), reducers.multiply("a.b")(payload,state))
  t.deepEqual(merge(state,{a:{b:10}}), reducers.multiply("a.b","a.b")(payload,state))
  t.deepEqual(merge(state,{result:10}), reducers.multiply("a.b","a.b","result")(payload,state))
  t.deepEqual(merge(state,{c:62.5}), reducers.multiply("a.b","c")(payload,state))
  t.deepEqual(merge(state,{d:62.5}), reducers.multiply("a.b","c","d")(payload,state))
  t.deepEqual(state, reducers.multiply("a.b","d")(payload,state))
})

test('divide', t => {
  const state = {value:4, a:{b:2}, c:"2.5", d:true}
  const payload = {value: 12, a:{b:20}}

  t.deepEqual(merge(state,{value:3}), reducers.divide()(payload,state))
  t.deepEqual(merge(state,{value:5}), reducers.divide("a.b")(payload,state))
  t.deepEqual(merge(state,{a:{b:10}}), reducers.divide("a.b","a.b")(payload,state))
  t.deepEqual(merge(state,{result:10}), reducers.divide("a.b","a.b","result")(payload,state))
  t.deepEqual(merge(state,{c:8}), reducers.divide("a.b","c")(payload,state))
  t.deepEqual(merge(state,{d:8}), reducers.divide("a.b","c","d")(payload,state))
  t.deepEqual(state, reducers.divide("a.b","d")(payload,state))
})

test('min' , t => {
  const state = {value:4, a:{b:2}, c:"2.5", d:true}
  const payload = {value: 12, a:{b:20}}

  t.deepEqual(merge(state,{value:4}), reducers.min()(payload,state))
  t.deepEqual(merge(state,{value:4}), reducers.min("a.b")(payload,state))
  t.deepEqual(merge(state,{a:{b:2}}), reducers.min("a.b","a.b")(payload,state))
  t.deepEqual(merge(state,{result:2}), reducers.min("a.b","a.b","result")(payload,state))
  t.deepEqual(merge(state,{c:2.5}), reducers.min("a.b","c")(payload,state))
  t.deepEqual(merge(state,{d:2.5}), reducers.min("a.b","c","d")(payload,state))
  t.deepEqual(merge(state,{d:20}), reducers.min("a.b","d")(payload,state))
})

test('max' , t => {
  const state = {value:4, a:{b:2}, c:"2.5", d:true}
  const payload = {value: 12, a:{b:20}}

  t.deepEqual(merge(state,{value:12}), reducers.max()(payload,state))
  t.deepEqual(merge(state,{value:20}), reducers.max("a.b")(payload,state))
  t.deepEqual(merge(state,{a:{b:20}}), reducers.max("a.b","a.b")(payload,state))
  t.deepEqual(merge(state,{result:20}), reducers.max("a.b","a.b","result")(payload,state))
  t.deepEqual(merge(state,{c:20}), reducers.max("a.b","c")(payload,state))
  t.deepEqual(merge(state,{d:20}), reducers.max("a.b","c","d")(payload,state))
  t.deepEqual(merge(state,{d:20}), reducers.max("a.b","d")(payload,state))
})

test('inc' , t => {
  const state = {value:7}
  const payload = {value: 11, a:{b:5},c:"11.2"}

  t.deepEqual(merge(state,{value:12}),reducers.inc()(payload, state));
  t.deepEqual(merge(state,{value:6}),reducers.inc("a.b")(payload, state));
  t.deepEqual(merge(state,{value:12.2}),reducers.inc("c")(payload, state));
  t.deepEqual(merge(state,{j:6}),reducers.inc("a.b","j")(payload, state));
  t.deepEqual(state,reducers.inc("n","j")(payload, state));
})

test('dec' , t => {
  const state = {value:7}
  const payload = {value: 11, a:{b:5},c:"11.2"}

  t.deepEqual(merge(state,{value:10}),reducers.dec()(payload, state));
  t.deepEqual(merge(state,{value:4}),reducers.dec("a.b")(payload, state));
  t.deepEqual(merge(state,{value:10.2}),reducers.dec("c")(payload, state));
  t.deepEqual(merge(state,{j:4}),reducers.dec("a.b","j")(payload, state));
  t.deepEqual(state,reducers.dec("n","j")(payload, state));
})

test('negate' , t => {
  const state = {value:4, a:{b:2}, c:"2.5", d:true}
  const payload = {value: 12, a:{b:"20"},c:true}

  t.deepEqual(merge(state,{value:-12}), reducers.negate()(payload,state))
  t.deepEqual(merge(state,{value:-20}), reducers.negate("a.b")(payload,state))
  t.deepEqual(merge(state,{a:{b:-20}}), reducers.negate("a.b","a.b")(payload,state))
  t.deepEqual(state, reducers.negate("c")(payload,state))
})

test('modulo' , t => {
  const state = {value:4, a:{b:2}, c:"2.5", d:true}
  const payload = {value: 12, a:{b:44}}

  t.deepEqual(merge(state,{value:0}), reducers.modulo()(payload,state))
  t.deepEqual(merge(state,{value:0}), reducers.modulo("a.b")(payload,state))
  t.deepEqual(merge(state,{a:{b:0}}), reducers.modulo("a.b","a.b")(payload,state))
  t.deepEqual(merge(state,{result:0}), reducers.modulo("a.b","a.b","result")(payload,state))
  t.deepEqual(merge(state,{c:1.5}), reducers.modulo("a.b","c")(payload,state))
  t.deepEqual(merge(state,{d:1.5}), reducers.modulo("a.b","c","d")(payload,state))
  t.deepEqual(state, reducers.modulo("a.b","d")(payload,state))
})
