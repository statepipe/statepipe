import test from "ava"
import pipes from "../logic"
import node from "~/test-utils/mock-node";

global.document = node();
global.document.body = node();

test('gt/gte/lt/lte/equals/notEquals/includes/notIncludes/odd/even/positive/negative: payload + state' , t => {
  const payload = {a:{b:1},c:{d:10},"foo":"fo",n:-10}
  const state = {e:{f:10},g:{h:1},"w":"loren foo ipsun"}
  t.deepEqual(state, pipes.gt("c.d","g.h")({payload,state}))
  t.deepEqual(state, pipes.gte("c.d","e.f")({payload,state}))
  t.deepEqual(state, pipes.lt("a.b","e.f")({payload,state}))
  t.deepEqual(state, pipes.lte("a.b","g.h")({payload,state}))
  t.deepEqual(state, pipes.equals("a.b","g.h")({payload,state}))
  t.deepEqual(state, pipes.notEquals("a.b","e.f")({payload,state}))
  t.deepEqual(state, pipes.includes("foo","w")({payload,state}))
  t.deepEqual(state, pipes.notIncludes("foo","e.f")({payload,state}))
  t.deepEqual(state, pipes.odd("a.b")({payload,state}))
  t.deepEqual(state, pipes.even("c.d")({payload,state}))
  t.deepEqual(state, pipes.positive("c.d")({payload,state}))
  t.deepEqual(state, pipes.negative("n")({payload,state}))
})

test('gt/gte/lt/lte/equals/notEquals/includes/notIncludes/odd/even/positive/negative: ignore payload' , t => {
  const payload = {error:true}
  const state = {a:{b:10},c:{d:1},"e":"loren foo ipsun",value:1,t:"foo",u:-1}
  t.deepEqual(state, pipes.gt("-","a.b","c.d")({payload,state}))
  t.deepEqual(state, pipes.gte("-","a.b","c.d")({payload,state}))
  t.deepEqual(state, pipes.lt("-","c.d","a.b")({payload,state}))
  t.deepEqual(state, pipes.lte("-","c.d","a.b")({payload,state}))
  t.deepEqual(state, pipes.equals("-","c.d","value")({payload,state}))
  t.deepEqual(state, pipes.notEquals("-","c.d","e")({payload,state}))
  t.deepEqual(state, pipes.includes("-","t","e")({payload,state}))
  t.deepEqual(state, pipes.notIncludes("-","foo","value")({payload,state}))
  t.deepEqual(state, pipes.odd("-","c.d")({payload,state}))
  t.deepEqual(state, pipes.even("-","a.b")({payload,state}))
  t.deepEqual(state, pipes.positive("-","a.b")({payload,state}))
  t.deepEqual(state, pipes.negative("-","u")({payload,state}))
})

test('truthy/falsy: payload + state' , t => {
  const payload = {a:{b:1},c:{d:0}}
  const state = {e:{f:10}}
  t.deepEqual(state, pipes.truthy("a.b")({payload,state}))
  t.deepEqual(state, pipes.falsy("c.d")({payload,state}))
})

test('truthy/falsy: ignore payload' , t => {
  const payload = {error:true}
  const state = {e:{f:10},g:0}
  t.deepEqual(state, pipes.truthy("-","e.f")({payload,state}))
  t.deepEqual(state, pipes.falsy("-","g")({payload,state}))
})
