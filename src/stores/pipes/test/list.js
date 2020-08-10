import test from "ava"
import reducers from "../list"
import {merge} from "ramda"

test('take/takeLast/drop/dropLast/append/prepend/concat/filter/filterNot: payload + state' , t => {
  const payload  = {a:{b:[10,9,8,7,6,5]},e:{f:"inner"}}
  const state  = {a:1,c:{d:["a","b"]},e:["outter","inner"]}
  t.deepEqual(merge(state,{c:{d:[10,9]}}), reducers.take(2,"a.b","c.d")(payload,state))
  t.deepEqual(merge(state,{c:{d:[6,5]}}), reducers.takeLast(2,"a.b","c.d")(payload,state))
  t.deepEqual(merge(state,{c:{d:[8,7,6,5]}}), reducers.drop(2,"a.b","c.d")(payload,state))
  t.deepEqual(merge(state,{c:{d:[10,9,8,7]}}), reducers.dropLast(2,"a.b","c.d")(payload,state))
  t.deepEqual(merge(state,{c:{d:["a","b","inner"]}}), reducers.append("e.f","c.d")(payload,state))
  t.deepEqual(merge(state,{c:{d:["inner","a","b"]}}), reducers.prepend("e.f","c.d")(payload,state))
  t.deepEqual(merge(state,{c:{d:["a","b",10,9,8,7,6,5]}}), reducers.concat("a.b","c.d")(payload,state))
  t.deepEqual(merge(state,{e:["inner"]}), reducers.filter("e.f","e")(payload,state))
  t.deepEqual(merge(state,{e:["outter"]}), reducers.filterNot("e.f","e")(payload,state))
})

test('take/takeLast/drop/dropLast/append/prepend/concat/filter/filterNot: ignore payload' , t => {
  const payload  = {error:true}
  const state  = {a:{b:[10,9,8,7,6,5]},c:{d:["a","b"]},e:["outter","inner"],w:"inner"}
  t.deepEqual(merge(state,{c:{d:[10,9]}}), reducers.take("-", 2,"a.b","c.d")(payload,state))
  t.deepEqual(merge(state,{c:{d:[6,5]}}), reducers.takeLast("-", 2,"a.b","c.d")(payload,state))
  t.deepEqual(merge(state,{c:{d:[8,7,6,5]}}), reducers.drop("-", 2,"a.b","c.d")(payload,state))
  t.deepEqual(merge(state,{c:{d:[10,9,8,7]}}), reducers.dropLast("-", 2,"a.b","c.d")(payload,state))
  t.deepEqual(merge(state,{c:{d:["a","b",state.a.b]}}), reducers.append("-", "a.b","c.d")(payload,state))
  t.deepEqual(merge(state,{c:{d:[state.a.b,"a","b"]}}), reducers.prepend("-", "a.b","c.d")(payload,state))
  t.deepEqual(merge(state,{c:{d:["a","b",...state.a.b]}}), reducers.concat("-", "a.b","c.d")(payload,state))
  t.deepEqual(merge(state,{e:["inner"]}), reducers.filter("-", "w","e")(payload,state))
  t.deepEqual(merge(state,{e:["outter"]}), reducers.filterNot("-", "w","e")(payload,state))
})

test('reverse/sort/flatten: payload + state' , t => {
  const payload  = {a:{b:[1,9,5]},n:[1,2,[3]]}
  const state  = {a:1}
  t.deepEqual(merge(state,{c:{d:[5,9,1]}}), reducers.reverse("a.b","c.d")(payload,state))
  t.deepEqual(merge(state,{c:{d:[1,5,9]}}), reducers.sort("a.b","c.d")(payload,state))
  t.deepEqual(merge(state,{c:{d:[1,2,3]}}), reducers.flatten("n","c.d")(payload,state))
})

test('reverse/sort/flatten: ignore payload' , t => {
  const payload  = {error:true}
  const state  = {a:{b:[1,9,5]},n:[1,2,[3]]}
  t.deepEqual(merge(state,{c:{d:[5,9,1]}}), reducers.reverse("-","a.b","c.d")(payload,state))
  t.deepEqual(merge(state,{c:{d:[1,5,9]}}), reducers.sort("-","a.b","c.d")(payload,state))
  t.deepEqual(merge(state,{c:{d:[1,2,3]}}), reducers.flatten("-","n","c.d")(payload,state))
})
