
import test from "ava"
import reducers from "../object"
import { merge } from "ramda"

test('trigger:pick/ payload + state' , t => {
  const defaultObject = {value:true,a:{b:true},c:"string",d:[1]}
  t.deepEqual({value:true},reducers.pick()(defaultObject, {}))
  t.deepEqual({a:{b:true}},reducers.pick("a")(defaultObject, {}))
  t.deepEqual({a:{b:true}},reducers.pick("a.b")(defaultObject, {}))
  t.deepEqual({a:{b:true},c:"string"},reducers.pick("a.b","c")(defaultObject, {}))
  t.deepEqual({a:{b:true},c:"string"},reducers.pick("a.b","c","j")(defaultObject, {}))
})

test('trigger:pick/ ignore payload' , t => {
  const defaultObject = {value:true,a:{b:true},c:"string",d:[1]}
  t.deepEqual({value:true},reducers.pick("-")({},defaultObject))
  t.deepEqual({a:{b:true}},reducers.pick("-","a")({},defaultObject))
  t.deepEqual({a:{b:true}},reducers.pick("-","a.b")({},defaultObject))
  t.deepEqual({a:{b:true},c:"string"},reducers.pick("-","a.b","c")({},defaultObject))
  t.deepEqual({a:{b:true},c:"string"},reducers.pick("-","a.b","c","j")({},defaultObject))
})

test('trigger:pickAll/ payload + state' , t => {
  const defaultObject = {value:true,a:{b:true},c:"string",d:[1]}
  t.deepEqual(defaultObject,reducers.pickAll()(defaultObject, {}))
  t.deepEqual(defaultObject,reducers.pickAll("a")(defaultObject, {}))
  t.deepEqual(defaultObject,reducers.pickAll(null)(defaultObject, {}))
})

test('trigger:pickAll/ ignore payload' , t => {
  const defaultObject = {value:true,a:{b:true},c:"string",d:[1]}
  t.deepEqual(defaultObject,reducers.pickAll("-")({error:true},defaultObject))
  t.deepEqual(defaultObject,reducers.pickAll("-","a")({error:true},defaultObject))
  t.deepEqual(defaultObject,reducers.pickAll("-",null)({error:true},defaultObject))
})

test('trigger:not/ payload + state', t => {
  const b = {a:{b:2},value:true,c:2,d:0,e:"2",f:{g:false}}
  const a = {a:2,value:1,c:1,d:"1",e:true,f:{g:false}}
  t.deepEqual(merge(b,{value:false}), reducers.not()(a,b))
  t.deepEqual(merge(b,{value:false}), reducers.not("e")(a,b))
  t.deepEqual(merge(b,{f:false}), reducers.not("e","f")(a,b))
  t.deepEqual(merge(b,{a:{b:true}}), reducers.not("f.g","a.b")(a,b))
  t.deepEqual(b, reducers.not("error","f.g")(a,b))
})

test('trigger:not/ ignore payload', t => {
  const b = {a:{b:2},value:true,c:2,d:0,e:"2",f:{g:false}}
  const a = {error:true}
  t.deepEqual(merge(b,{value:false}), reducers.not("-")(a,b))
  t.deepEqual(merge(b,{e:false}), reducers.not("-","e")(a,b))
  t.deepEqual(merge(b,{f:false}), reducers.not("-","e","f")(a,b))
  t.deepEqual(merge(b,{a:{b:true}}), reducers.not("-","f.g","a.b")(a,b))
  t.deepEqual(b, reducers.not("-","error","f.g")(a,b))
})

test('trigger:set/ payload + state', t => {
  const b = {a:{b:2},value:true,c:2,d:0,e:"2",f:{g:false}}
  const a = {a:2,value:1,c:1,d:"1",e:true,f:{g:false}}
  t.deepEqual(merge(b,{value:1}), reducers.set()(a,b))
  t.deepEqual(merge(b,{value:false}), reducers.set("f.g")(a,b))
  t.deepEqual(merge(b,{a:{b:false}}), reducers.set("f.g","a.b")(a,b))
  t.deepEqual(b, reducers.set("error","a.b")(a,b))
})

test('trigger:set/ only state', t => {
  const b = {a:{b:2},value:true,c:2,d:0,e:"2",f:{g:10}}
  const a = {error:true}
  t.deepEqual(merge(b,{value:true}), reducers.set("-")(a,b))
  t.deepEqual(merge(b,{value:10}), reducers.set("-","f.g")(a,b))
  t.deepEqual(merge(b,{a:{b:10}}), reducers.set("-","f.g","a.b")(a,b))
  t.deepEqual(b, reducers.set("-","error","a.b")(a,b))
})

test('trigger:set/ $action payload + state', t => {
  const a = { value: 'true'};
  t.deepEqual(merge(a,{value:"ping"}),
    reducers.set("$action")(a, a, "ping"))
  t.deepEqual(merge(a,{a:{b:"ping"}}),
    reducers.set("$action","a.b")(a, a, "ping"))
})
