import test from "ava"
import store from "../render"
import node from "~/test-utils/mock-node"

global.document = node({})

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

test('appendChild and prependChild' , t => {
  
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

  store.classAdd("foo.fooo")(state, testNode)
  t.deepEqual(false, testNode.classList.contains("fooo"))
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

  store.classRm("foo.undefined")(state, testNode)
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
