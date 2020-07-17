import test from "ava"
import reducers from "../list"
import {merge} from "ramda"

test('pipe:take/ payload + state' , t => {
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

test('pipe:take/ ignore payload' , t => {
  const payload  = {error:true}
  const state  = {"value": [1,2,3,4,5],a:{b:[10,9,8]},c:false}
  t.deepEqual(state,  reducers.take("-")(payload,state))
  t.deepEqual(merge(state,{value:[1,2]}),  reducers.take("-",2)(payload,state))
  t.deepEqual(merge(state,{value:[10,9]}), reducers.take("-",2,"a.b")(payload,state))
  t.deepEqual(merge(state,{c:{d:[10,9]}}), reducers.take("-",2,"a.b","c.d")(payload,state))
})

test('pipe:takeLast/ payload + state' , t => {
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

test('pipe:takeLast/ ignore payload' , t => {
  const payload  = {error:true}
  const state  = {"value": [1,2,3,4,5],a:{b:[10,9,8]},c:false}
  t.deepEqual(state,  reducers.takeLast("-")(payload,state))
  t.deepEqual(merge(state,{value:[4,5]}),  reducers.takeLast("-",2)(payload,state))
  t.deepEqual(merge(state,{value:[9,8]}), reducers.takeLast("-",2,"a.b")(payload,state))
  t.deepEqual(merge(state,{c:{d:[9,8]}}), reducers.takeLast("-",2,"a.b","c.d")(payload,state))
})

test('pipe:drop/ payload + state' , t => {
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

test('pipe:drop/ ignore payload' , t => {
  const payload  = {error:true}
  const state  = {"value": [1,2,3,4,5],a:{b:[10,9,8]},c:false}
  t.deepEqual(state,  reducers.drop("-")(payload,state))
  t.deepEqual(merge(state,{value:[3,4,5]}),  reducers.drop("-",2)(payload,state))
  t.deepEqual(merge(state,{value:[8]}), reducers.drop("-",2,"a.b")(payload,state))
  t.deepEqual(merge(state,{c:{d:[8]}}), reducers.drop("-",2,"a.b","c.d")(payload,state))
})

test('pipe:dropLast/ payload + state' , t => {
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

test('pipe:dropLast/ ignore payload' , t => {
  const payload  = {error:true}
  const state  = {"value": [1,2,3,4,5],a:{b:[10,9,8]},c:false}
  t.deepEqual(state, reducers.dropLast("-")(payload,state))
  t.deepEqual(merge(state,{value:[1,2,3]}), reducers.dropLast("-",2)(payload,state))
  t.deepEqual(merge(state,{value:[10]}),     reducers.dropLast("-",2,"a.b")(payload,state))
  t.deepEqual(merge(state,{c:{d:[10]}}),     reducers.dropLast("-",2,"a.b","c.d")(payload,state))
})

test('pipe:append/ payload + state' , t => {
  const payload  = {"value": 1,a:{b:2},c:"123",d:true}
  const state  = {value:["a","b","c"],b:{c:["d"]},d:"D",e:1}

  t.deepEqual(merge(state,{value:["a","b","c",1]}),  reducers.append()(payload,state))
  t.deepEqual(merge(state,{value:["a","b","c",2]}),  reducers.append("a.b")(payload,state))
  t.deepEqual(merge(state,{b:{c:["d",2]}}),  reducers.append("a.b","b.c")(payload,state))
  t.deepEqual(merge(state,{d:["D","123"]}),  reducers.append("c","d")(payload,state))
  t.deepEqual(merge(state,{e:["D","123"]}),  reducers.append("c","d","e")(payload,state))
  t.deepEqual(state,  reducers.append("c","e")(payload,state))
})

test('pipe:append/ ignore payload' , t => {
  const payload  = {error:true}
  const state  = {value:["a"],b:{c:["d"]},d:"D",e:1}

  t.deepEqual(merge(state,{value:["a",["a"]]}),  reducers.append("-")(payload,state))
  t.deepEqual(merge(state,{value:["a",["d"]]}),  reducers.append("-","b.c")(payload,state))
  t.deepEqual(merge(state,{b:{c:["d","D"]}}),  reducers.append("-","d","b.c")(payload,state))
  t.deepEqual(merge(state,{a:["d","D"]}),  reducers.append("-","d","b.c","a")(payload,state))
})

test('pipe:prepend/ payload + state' , t => {
  const payload  = {"value": 1,a:{b:2},c:"123",d:true}
  const state  = {value:["a","b","c"],b:{c:["d"]},d:"D",e:1}

  t.deepEqual(merge(state,{value:[1,"a","b","c"]}),  reducers.prepend()(payload,state))
  t.deepEqual(merge(state,{value:[2,"a","b","c"]}),  reducers.prepend("a.b")(payload,state))
  t.deepEqual(merge(state,{b:{c:[2,"d"]}}),  reducers.prepend("a.b","b.c")(payload,state))
  t.deepEqual(merge(state,{d:["123","D"]}),  reducers.prepend("c","d")(payload,state))
  t.deepEqual(merge(state,{e:["123","D"]}),  reducers.prepend("c","d","e")(payload,state))
  t.deepEqual(state,  reducers.prepend("c","e")(payload,state))
})

test('pipe:prepend/ ignore payload' , t => {
  const payload  = {error:true}
  const state  = {value:["a"],b:{c:["d"]},d:"D",e:1}

  t.deepEqual(merge(state,{value:[["a"],"a"]}),  reducers.prepend("-")(payload,state))
  t.deepEqual(merge(state,{value:[["d"], "a"]}),  reducers.prepend("-","b.c")(payload,state))
  t.deepEqual(merge(state,{b:{c:["D","d"]}}),  reducers.prepend("-","d","b.c")(payload,state))
  t.deepEqual(merge(state,{a:["D","d"]}),  reducers.prepend("-","d","b.c","a")(payload,state))
})

test('pipe:flatten/ payload + state' , t => {
  const payload  = {"value":["pA",["pB"]],b:{c:[1,[2]]},d:"10"}
  const state  = {value:true,b:{c:"C"},d:"D",e:1}

  t.deepEqual(merge(state,{value:["pA","pB"]}),  reducers.flatten()(payload,state))
  t.deepEqual(merge(state,{value:[1,2]}),  reducers.flatten("b.c")(payload,state))
  t.deepEqual(merge(state,{value:["1","0"]}),  reducers.flatten("d")(payload,state))
  t.deepEqual(merge(state,{d:[1,2]}),  reducers.flatten("b.c","d")(payload,state))
})

test('pipe:flatten/ ignore payload' , t => {
  const payload = {error:true}
  const state  = {"value":["pA",["pB"]],b:{c:[1,[2]]},d:"10"}
  
  t.deepEqual(merge(state,{value:["pA","pB"]}),  reducers.flatten("-")(payload,state))
  t.deepEqual(merge(state,{b:{c:[1,2]}}),  reducers.flatten("-","b.c")(payload,state))
  t.deepEqual(merge(state,{e:[1,2]}),  reducers.flatten("-","b.c","e")(payload,state))
})

test('pipe:reverse/ payload + state' , t => {
  const payload  = {"value":["pA","pB"],b:{c:[1,2]},d:"10"}
  const state  = {value:true,b:{c:"C"},d:"D",e:1}

  t.deepEqual(merge(state,{value:["pB","pA"]}),  reducers.reverse()(payload,state))
  t.deepEqual(merge(state,{value:[2,1]}),  reducers.reverse("b.c")(payload,state))
  t.deepEqual(merge(state,{value:"01"}),  reducers.reverse("d")(payload,state))
  t.deepEqual(merge(state,{d:[2,1]}),  reducers.reverse("b.c","d")(payload,state))
})

test('pipe:reverse/ ignore payload' , t => {
  const payload = {error:true}
  const state  = {"value":["pA","pB"],b:{c:[1,2]},d:"10"}
  
  t.deepEqual(merge(state,{value:["pB","pA"]}),  reducers.reverse("-")(payload,state))
  t.deepEqual(merge(state,{b:{c:[2,1]}}),  reducers.reverse("-","b.c")(payload,state))
  t.deepEqual(merge(state,{d:"01"}),  reducers.reverse("-","d")(payload,state))
  t.deepEqual(merge(state,{e:[2,1]}),  reducers.reverse("-","b.c","e")(payload,state))
})

test('pipe:concat/ payload + state' , t => {
  const payload  = {"value": "1",a:{b:"2"},c:3,d:["d"]}
  const state  = {value: "value",b:{c:"d"},e:[1]}
  t.deepEqual(merge(state,{value:"value1"}),  reducers.concat()(payload,state))
  t.deepEqual(merge(state,{value:"value2"}),  reducers.concat("a.b")(payload,state))
  t.deepEqual(merge(state,{b:{c:"d2"}}),  reducers.concat("a.b","b.c")(payload,state))
  t.deepEqual(merge(state,{e:[1,"d"]}),  reducers.concat("d","e")(payload,state))
  t.deepEqual(merge(state,{}),  reducers.concat("d","value")(payload,state))
})

test('pipe:concat/ ignore payload' , t => {
  const state  = {"value": "1",a:{b:"2"},c:3,d:["d"],e:["e"]}
  const payload  = {error:true}
  t.deepEqual(merge(state,{value:"11"}),  reducers.concat("-")(payload,state))
  t.deepEqual(merge(state,{value:"12"}),  reducers.concat("-","a.b")(payload,state))
  t.deepEqual(merge(state,{e:["e","d"]}),  reducers.concat("-","d","e")(payload,state))
  t.deepEqual(merge(state,{}),  reducers.concat("-","d","value")(payload,state))
})

test('pipe:filter/ payload + state' , t => {
  const payload = {value:"a",a:{b:"b"},c:1,d:true}
  const state = {value:["a","b","c",1,2,3,true,false],a:{b:[1,"b",true]}}
  t.deepEqual(merge(state,{value:["a"]}),  reducers.filter()(payload,state))
  t.deepEqual(merge(state,{value:["b"]}),  reducers.filter("a.b")(payload,state))
  t.deepEqual(merge(state,{a:{b:["b"]}}),  reducers.filter("a.b","a.b")(payload,state))
  t.deepEqual(merge(state,{c:["b"]}),  reducers.filter("a.b","a.b","c")(payload,state))
  t.deepEqual(merge(state,{}),  reducers.filter("aaa","a.b","c")(payload,state))
  t.deepEqual(merge(state,{}),  reducers.filter("a.b","aa","c")(payload,state))
})

test('pipe:filter/ ignore payload' , t => {
  const payload = {error:true}
  const state = {value:["a","b","c",1,2,3,true,false],a:{b:"b"},c:{d:["b","b","c"]}}
  t.deepEqual(merge(state,{value:[]}),  reducers.filter("-")(payload,state))
  t.deepEqual(merge(state,{value:["b"]}),  reducers.filter("-","a.b")(payload,state))
  t.deepEqual(merge(state,{c:{d:["b","b"]}}),  reducers.filter("-","a.b","c.d")(payload,state))
  t.deepEqual(merge(state,{j:["b","b"]}),  reducers.filter("-","a.b","c.d","j")(payload,state))
})

test('pipe:filterNot/ payload + state' , t => {
  const payload = {value:"a",a:{b:"b"},c:1,d:true}
  const state = {value:["a","b","c",1,2,3,true,false],a:{b:[1,"b",true]}}
  t.deepEqual(merge(state,{value:["b","c",1,2,3,true,false]}),  reducers.filterNot()(payload,state))
  t.deepEqual(merge(state,{value:["a","c",1,2,3,true,false]}),  reducers.filterNot("a.b")(payload,state))
  t.deepEqual(merge(state,{a:{b:[1,true]}}),  reducers.filterNot("a.b","a.b")(payload,state))
  t.deepEqual(merge(state,{c:[1,true]}),  reducers.filterNot("a.b","a.b","c")(payload,state))
  t.deepEqual(merge(state,{}),  reducers.filterNot("j","k.l","c")(payload,state))
})

test('pipe:filterNot/ ignore payload' , t => {
  const payload = {error:true}
  const state = {value:["a","b","c",1,2,3,true,false],a:{b:"b"},c:{d:["b","b","c"]}}
  t.deepEqual(merge(state,{}),  reducers.filterNot("-")(payload,state))
  t.deepEqual(merge(state,{value:["a","c",1,2,3,true,false]}),  reducers.filterNot("-","a.b")(payload,state))
  t.deepEqual(merge(state,{c:{d:["c"]}}),  reducers.filterNot("-","a.b","c.d")(payload,state))
  t.deepEqual(merge(state,{j:["c"]}),  reducers.filterNot("-","a.b","c.d","j")(payload,state))
})

test('pipe:sort/ payload + state' , t => {
  const payload = {value:["b",'c',0,"a"],a:{b:[1,9,2]},d:"sab"}
  const state = {value:true}
  t.deepEqual(merge(state,{value:[0,"a","b","c"]}),  reducers.sort()(payload,state))
  t.deepEqual(merge(state,{value:[1,2,9]}),  reducers.sort("a.b")(payload,state))
  t.deepEqual(merge(state,{a:{b:[1,2,9]}}),  reducers.sort("a.b","a.b")(payload,state))
  t.deepEqual(merge(state,{}),  reducers.sort("d")(payload,state))
})

test('pipe:sort/ ignore payload' , t => {
  const state = {value:["b",'c',0,"a"],a:{b:[1,9,2]},d:"sab"}
  const payload = {error:true}
  t.deepEqual(merge(state,{value:[0,"a","b","c"]}),  reducers.sort("-")(payload,state))
  t.deepEqual(merge(state,{a:{b:[1,2,9]}}),  reducers.sort("-","a.b")(payload,state))
  t.deepEqual(merge(state,{f:[1,2,9]}),  reducers.sort("-","a.b","f")(payload,state))
  t.deepEqual(merge(state,{}),  reducers.sort("-","d")(payload,state))
})
