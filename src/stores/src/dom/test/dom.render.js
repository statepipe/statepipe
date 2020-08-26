import test from "ava"
import store from "../render"
import mockNode from "~/test-utils/mock-node"

global.document = mockNode({})

test('dom.render/ template' , t => {

  let node = mockNode({})
  node.innerHTML = "empty"
  
  store.template("#list")
  ({state:{foo:{bar:"statepipe"}}, node})
  t.deepEqual("empty", node.innerHTML)

  const tpl = mockNode({})
  tpl.innerHTML = "${state.foo.bar}"
  global.document.setQueryResult([tpl])

  store.template("#list")
    ({state:{foo:{bar:"statepipe"}}, node})
  t.deepEqual("statepipe", node.innerHTML)
  global.document.setQueryResult([])
})

test('dom.render/ appendChild and prependChild' , t => {
  
  global.document.setQueryResult([])
  
  let node = mockNode({})
  node.appendChild = t.fail
  node.prepend = t.fail

  store.appendChild()({state:{foo:{bar:"statepipe"}}, node})
  store.prependChild()({state:{foo:{bar:"statepipe"}}, node})
  
  store.appendChild("#missing-template")({state:{foo:{bar:"statepipe"}}, node})
  store.prependChild("#missing-template")({state:{foo:{bar:"statepipe"}}, node})
  
  const tpl = mockNode({})
  tpl.innerHTML = "${state.foo.bar}"
  global.document.setQueryResult([tpl])
  
  t.plan(2)
   
  node.appendChild = t.pass
  node.prepend = t.pass

  store.appendChild("#foo")({state:{foo:{bar:"statepipe"}}, node})
  store.prependChild("#foo")({state:{foo:{bar:"statepipe"}}, node})
  global.document.setQueryResult([])
})

test('dom.render/ text' , t => {

  let node = mockNode()
  node.textContent = "empty"
  
  store.text()({state:{value:"first-value"},node})
  t.deepEqual("first-value", node.textContent)

  store.text("foo.bar")({state:{foo:{bar:"foo.bar-value"}},node})
  t.deepEqual("foo.bar-value", node.textContent)

  store.text("unkown")({state:{value:1},node})
  t.deepEqual("foo.bar-value", node.textContent)

  node.textContent = "empty"
  store.text()({state:{value:"inner-template:${state.foo.bar}",foo:{bar:"hi"}},node})
  t.deepEqual("inner-template:hi", node.textContent)

  node.textContent = "empty"
  store.text()({state:{value:"inner-template:${state.unkown.bar}",foo:{bar:"hi"}},node})
  t.deepEqual("empty", node.textContent)
})


test('dom.render/ classAdd' , t => {
  const state = {
    value: "open",
    foo: {bar: "close"}
  }

  const node = mockNode()
  node.classList.add("foo")
  
  store.classAdd()({state, node})
  t.deepEqual(true, node.classList.contains("open"))

  store.classAdd("foo.bar")({state, node})
  t.deepEqual(true, node.classList.contains("close"))

  store.classAdd("foo.fooo")({state, node})
  t.deepEqual(false, node.classList.contains("fooo"))
})

test('dom.render/ classRm' , t => {
  const state = {
    value: "open",
    foo: {bar: "close"}
  }
  const node = mockNode()
  node.classList.add(state.value)
  node.classList.add(state.foo.bar)
  
  store.classRm()({state, node})
  t.deepEqual(false, node.classList.contains("open"))

  store.classRm("foo.bar")({state, node})
  t.deepEqual(false, node.classList.contains("close"))

  store.classRm("foo.undefined")({state, node})
  t.deepEqual(false, node.classList.contains("close"))
})

test('dom.render/ classToggle' , t => {
  const state = {
    value: "open",
    foo: {bar: "close"}
  }
  const node = mockNode()
  node.classList.add(state.value)
  node.classList.add(state.foo.bar)
  
  store.classToggle()({state, node})
  t.deepEqual(false, node.classList.contains("open"))

  store.classToggle()({state, node})
  t.deepEqual(true, node.classList.contains("open"))

  store.classToggle("foo.bar")({state, node})
  t.deepEqual(false, node.classList.contains("close"))

  store.classToggle("foo.bar")({state, node})
  t.deepEqual(true, node.classList.contains("close"))
})
