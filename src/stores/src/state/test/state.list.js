import test from "ava"
import reducers from "../list"
import {merge} from "ramda"
import {unexpectedParams} from "~/test-utils/test-reducer-args"

Object
  .keys(reducers)
  .forEach(fn => {
    test(`list testUnexpectedParams ${fn}` , t => {
      unexpectedParams(t, reducers[fn])
    })
  })

test('take' , t => {
  const payload  = {"value": [1,2,3,4,5],a:{b:[10,9,8]},c:"123",d:true}
  const state  = {a:1}
  t.deepEqual(state,                       reducers.take()(payload,state))
  t.deepEqual(merge(state,{value:[1,2]}),  reducers.take(2)(payload,state))
  t.deepEqual(merge(state,{value:[1,2]}),  reducers.take("2")(payload,state))
  t.deepEqual(merge(state,{value:[1,2]}),  reducers.take("2.2")(payload,state))
  t.deepEqual(merge(state,{value:[10,9]}), reducers.take(2,"a.b")(payload,state))
  t.deepEqual(merge(state,{value:"12"}),   reducers.take(2,"c")(payload,state))
  t.deepEqual(state,                       reducers.take(2,"d")(payload,state))
  t.deepEqual(merge(state,{c:{d:[10,9]}}), reducers.take(2,"a.b","c.d")(payload,state))
})

test('takeLast' , t => {
  const payload  = {"value": [1,2,3,4,5],a:{b:[10,9,8]},c:"123",d:true}
  const state  = {a:1}

  t.deepEqual(state,  reducers.takeLast()(payload,state))
  t.deepEqual(merge(state,{value:[4,5]}),  reducers.takeLast(2)(payload,state))
  t.deepEqual(merge(state,{value:[4,5]}),  reducers.takeLast("2")(payload,state))
  t.deepEqual(merge(state,{value:[4,5]}),  reducers.takeLast("2.2")(payload,state))
  t.deepEqual(merge(state,{value:[9,8]}), reducers.takeLast(2,"a.b")(payload,state))
  t.deepEqual(merge(state,{value:"23"}),   reducers.takeLast(2,"c")(payload,state))
  t.deepEqual(state,                       reducers.takeLast(2,"d")(payload,state))
  t.deepEqual(merge(state,{c:{d:[9,8]}}), reducers.takeLast(2,"a.b","c.d")(payload,state))
})

test('drop' , t => {
  const payload  = {"value": [1,2,3,4,5],a:{b:[10,9,8]},c:"123",d:true}
  const state  = {a:1}

  t.deepEqual(state,  reducers.drop()(payload,state))
  t.deepEqual(merge(state,{value:[3,4,5]}),  reducers.drop(2)(payload,state))
  t.deepEqual(merge(state,{value:[3,4,5]}),  reducers.drop("2")(payload,state))
  t.deepEqual(merge(state,{value:[3,4,5]}),  reducers.drop("2.2")(payload,state))
  t.deepEqual(merge(state,{value:[8]}), reducers.drop(2,"a.b")(payload,state))
  t.deepEqual(merge(state,{value:"3"}),   reducers.drop(2,"c")(payload,state))
  t.deepEqual(state,                       reducers.drop(2,"d")(payload,state))
  t.deepEqual(merge(state,{c:{d:[8]}}), reducers.drop(2,"a.b","c.d")(payload,state))
})

test('dropLast' , t => {
  const payload  = {"value": [1,2,3,4,5],a:{b:[10,9,8]},c:"123",d:true}
  const state  = {a:1}

  t.deepEqual(state,  reducers.dropLast()(payload,state))
  t.deepEqual(merge(state,{value:[1,2,3]}),  reducers.dropLast(2)(payload,state))
  t.deepEqual(merge(state,{value:[1,2,3]}),  reducers.dropLast("2")(payload,state))
  t.deepEqual(merge(state,{value:[1,2,3]}),  reducers.dropLast("2.2")(payload,state))
  t.deepEqual(merge(state,{value:[10]}), reducers.dropLast(2,"a.b")(payload,state))
  t.deepEqual(merge(state,{value:"1"}),   reducers.dropLast(2,"c")(payload,state))
  t.deepEqual(state,                       reducers.dropLast(2,"d")(payload,state))
  t.deepEqual(merge(state,{c:{d:[10]}}), reducers.dropLast(2,"a.b","c.d")(payload,state))
})

test('append' , t => {
  const payload  = {"value": 1,a:{b:2},c:"123",d:true}
  const state  = {value:["a","b","c"],b:{c:["d"]},d:"D",e:1}

  t.deepEqual(merge(state,{value:["a","b","c",1]}),  reducers.append()(payload,state))
  t.deepEqual(merge(state,{value:["a","b","c",2]}),  reducers.append("a.b")(payload,state))
  t.deepEqual(merge(state,{b:{c:["d",2]}}),  reducers.append("a.b","b.c")(payload,state))
  t.deepEqual(merge(state,{d:["D","123"]}),  reducers.append("c","d")(payload,state))
  t.deepEqual(merge(state,{e:["D","123"]}),  reducers.append("c","d","e")(payload,state))
  t.deepEqual(state,  reducers.append("c","e")(payload,state))
})

test('prepend' , t => {
  const payload  = {"value": 1,a:{b:2},c:"123",d:true}
  const state  = {value:["a","b","c"],b:{c:["d"]},d:"D",e:1}

  t.deepEqual(merge(state,{value:[1,"a","b","c"]}),  reducers.prepend()(payload,state))
  t.deepEqual(merge(state,{value:[2,"a","b","c"]}),  reducers.prepend("a.b")(payload,state))
  t.deepEqual(merge(state,{b:{c:[2,"d"]}}),  reducers.prepend("a.b","b.c")(payload,state))
  t.deepEqual(merge(state,{d:["123","D"]}),  reducers.prepend("c","d")(payload,state))
  t.deepEqual(merge(state,{e:["123","D"]}),  reducers.prepend("c","d","e")(payload,state))
  t.deepEqual(state,  reducers.prepend("c","e")(payload,state))
})

test('flatten' , t => {
  const payload  = {"value":["pA",["pB"]],b:{c:[1,[2]]},d:"10"}
  const state  = {value:true,b:{c:"C"},d:"D",e:1}

  t.deepEqual(merge(state,{value:["pA","pB"]}),  reducers.flatten()(payload,state))
  t.deepEqual(merge(state,{value:[1,2]}),  reducers.flatten("b.c")(payload,state))
  t.deepEqual(merge(state,{value:["1","0"]}),  reducers.flatten("d")(payload,state))
  t.deepEqual(merge(state,{d:[1,2]}),  reducers.flatten("b.c","d")(payload,state))
})

test('reverse' , t => {
  const payload  = {"value":["pA","pB"],b:{c:[1,2]},d:"10"}
  const state  = {value:true,b:{c:"C"},d:"D",e:1}

  t.deepEqual(merge(state,{value:["pB","pA"]}),  reducers.reverse()(payload,state))
  t.deepEqual(merge(state,{value:[2,1]}),  reducers.reverse("b.c")(payload,state))
  t.deepEqual(merge(state,{value:"01"}),  reducers.reverse("d")(payload,state))
  t.deepEqual(merge(state,{d:[2,1]}),  reducers.reverse("b.c","d")(payload,state))
})

test('concat' , t => {
  const payload  = {"value": "1",a:{b:"2"},c:3,d:["d"]}
  const state  = {value: "value",b:{c:"d"},e:[1]}
  t.deepEqual(merge(state,{value:"value1"}),  reducers.concat()(payload,state))
  t.deepEqual(merge(state,{value:"value2"}),  reducers.concat("a.b")(payload,state))
  t.deepEqual(merge(state,{b:{c:"d2"}}),  reducers.concat("a.b","b.c")(payload,state))
  t.deepEqual(merge(state,{e:[1,"d"]}),  reducers.concat("d","e")(payload,state))
  t.deepEqual(merge(state,{}),  reducers.concat("d","value")(payload,state))
})

test('filter' , t => {
  const payload = {value:"a",a:{b:"b"},c:1,d:true}
  const state = {value:["a","b","c",1,2,3,true,false],a:{b:[1,"b",true]}}
  t.deepEqual(merge(state,{value:["a"]}),  reducers.filter()(payload,state))
  t.deepEqual(merge(state,{value:["b"]}),  reducers.filter("a.b")(payload,state))
  t.deepEqual(merge(state,{a:{b:["b"]}}),  reducers.filter("a.b","a.b")(payload,state))
  t.deepEqual(merge(state,{c:["b"]}),  reducers.filter("a.b","a.b","c")(payload,state))
  t.deepEqual(merge(state,{}),  reducers.filter("aaa","a.b","c")(payload,state))
  t.deepEqual(merge(state,{}),  reducers.filter("a.b","aa","c")(payload,state))
})

test('filterNot' , t => {
  const payload = {value:"a",a:{b:"b"},c:1,d:true}
  const state = {value:["a","b","c",1,2,3,true,false],a:{b:[1,"b",true]}}
  t.deepEqual(merge(state,{value:["b","c",1,2,3,true,false]}),  reducers.filterNot()(payload,state))
  t.deepEqual(merge(state,{value:["a","c",1,2,3,true,false]}),  reducers.filterNot("a.b")(payload,state))
  t.deepEqual(merge(state,{a:{b:[1,true]}}),  reducers.filterNot("a.b","a.b")(payload,state))
  t.deepEqual(merge(state,{c:[1,true]}),  reducers.filterNot("a.b","a.b","c")(payload,state))
  t.deepEqual(merge(state,{}),  reducers.filterNot("j","k.l","c")(payload,state))
})

test('sort' , t => {
  const payload = {value:["b",'c',0,"a"],a:{b:[1,9,2]},d:"sab"}
  const state = {value:true}
  t.deepEqual(merge(state,{value:[0,"a","b","c"]}),  reducers.sort()(payload,state))
  t.deepEqual(merge(state,{value:[1,2,9]}),  reducers.sort("a.b")(payload,state))
  t.deepEqual(merge(state,{c:{d:[1,2,9]}}),  reducers.sort("a.b","c.d")(payload,state))
  t.deepEqual(merge(state,{}),  reducers.sort("d")(payload,state))
})
