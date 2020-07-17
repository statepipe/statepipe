import test from "ava"
import store from "../render"
import node from "~/test-utils/mock-node"

//global.$statepipeLog =  true
global.document = node({})

const defaultObject = {
  value: 10,
  foo: {bar: "loren"}
}
const empty = {}


test('prop' , t => {
  let ele = node({})
  const st = {value:"foo",a:{b:"inner"}}
  t.deepEqual(st, store.prop()(st,ele))
  t.deepEqual(st, store.prop("newprop")(st,ele))
  t.is(ele.newprop, "foo")
  t.deepEqual(st, store.prop("newprop","a.b")(st,ele))
  t.is(ele.newprop, "inner")
  t.deepEqual(st, store.prop("newprop","a.c")(st,ele))
  t.is(ele.newprop, "inner")
})

test('template' , t => {

  let ele = node({})
  ele.innerHTML = "empty"
  
  store.template("#list")
  ({foo:{bar:"statepipe"}}, ele)
  t.deepEqual("empty", ele.innerHTML)

  const tpl = node({})
  tpl.innerHTML = "${state.foo.bar}"
  global.document.setQueryResult([tpl])

  store.template("#list")
    ({foo:{bar:"statepipe"}}, ele)
  t.deepEqual("statepipe", ele.innerHTML)
  global.document.setQueryResult([])
})

test('appendChild,prependChild' , t => {
  
  global.document.setQueryResult([])
  
  let ele = node({})
  ele.appendChild = t.fail
  ele.prepend = t.fail

  store.appendChild()({foo:{bar:"statepipe"}}, ele)
  store.prependChild()({foo:{bar:"statepipe"}}, ele)
  
  store.appendChild("#missing-template")({foo:{bar:"statepipe"}}, ele)
  store.prependChild("#missing-template")({foo:{bar:"statepipe"}}, ele)
  
  const tpl = node({})
  tpl.innerHTML = "${state.foo.bar}"
  global.document.setQueryResult([tpl])
  
  t.plan(2)
   
  ele.appendChild = t.pass
  ele.prepend = t.pass

  store.appendChild("#foo")({foo:{bar:"statepipe"}}, ele)
  store.prependChild("#foo")({foo:{bar:"statepipe"}}, ele)
  global.document.setQueryResult([])
})

test('text' , t => {

  let ele = node()
  ele.textContent = "empty"
  
  store.text()({value:"first-value"},ele)
  t.deepEqual("first-value", ele.textContent)

  store.text("foo.bar")({foo:{bar:"foo.bar-value"}},ele)
  t.deepEqual("foo.bar-value", ele.textContent)

  store.text("unkown")({value:1},ele)
  t.deepEqual("foo.bar-value", ele.textContent)

  ele.textContent = "empty"
  store.text()({value:"inner-template:${state.foo.bar}",foo:{bar:"hi"}},ele)
  t.deepEqual("inner-template:hi", ele.textContent)

  ele.textContent = "empty"
  store.text()({value:"inner-template:${state.unkown.bar}",foo:{bar:"hi"}},ele)
  t.deepEqual("empty", ele.textContent)
})


test('attrSet' , t => {
  let n = node()
  store.attrSet("foo")({"value":1},n)
  t.is("1",n.getAttribute("foo"))

  n = node()
  store.attrSet("foo","a.b")({"a":{b:1}},n)
  t.is("1",n.getAttribute("foo"))

  n = node()
  store.attrSet("foo","a.c")({"a":{b:1}},n)
  t.is(undefined,n.getAttribute("foo"))

  n = node()
  store.attrSet("foo","a")({"a":"a=${state.value}",value:"loren"},n)
  t.is("a=loren",n.getAttribute("foo"))
})

test('attrRm' , t => {
  let n = node()
  n.setAttribute("foo","bar")
  store.attrRm("foo")({"value":1},n)
  t.is(null,n.getAttribute("foo"))
})

test('attrToggle' , t => {
  let n = node()
  n.setAttribute("foo","bar")
  store.attrToggle("foo")({"value":"bar"},n)
  t.is(null,n.getAttribute("foo"))
  store.attrToggle("foo")({"value":"bar"},n)
  t.is("bar",n.getAttribute("foo"))
})

test('classAdd' , t => {
  const state = {
    value: "open",
    foo: {bar: "close"}
  }

  const testNode = node()
  testNode.classList.add("foo")
  
  store.classAdd()(state, testNode)
  t.deepEqual(true, testNode.classList.contains("open"))

  store.classAdd("foo.bar")(state, testNode)
  t.deepEqual(true, testNode.classList.contains("close"))
})

test('classRm' , t => {
  const state = {
    value: "open",
    foo: {bar: "close"}
  }
  const testNode = node()
  testNode.classList.add(state.value)
  testNode.classList.add(state.foo.bar)
  
  store.classRm()(state, testNode)
  t.deepEqual(false, testNode.classList.contains("open"))

  store.classRm("foo.bar")(state, testNode)
  t.deepEqual(false, testNode.classList.contains("close"))
})

test('classToggle' , t => {
  const state = {
    value: "open",
    foo: {bar: "close"}
  }
  const testNode = node()
  testNode.classList.add(state.value)
  testNode.classList.add(state.foo.bar)
  
  store.classToggle()(state, testNode)
  t.deepEqual(false, testNode.classList.contains("open"))

  store.classToggle()(state, testNode)
  t.deepEqual(true, testNode.classList.contains("open"))

  store.classToggle("foo.bar")(state, testNode)
  t.deepEqual(false, testNode.classList.contains("close"))

  store.classToggle("foo.bar")(state, testNode)
  t.deepEqual(true, testNode.classList.contains("close"))
})
